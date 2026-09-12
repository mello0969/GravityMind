import { createFileRoute } from "@tanstack/react-router";
import { getD1 } from "@/lib/db/context";

type StripeObject = {
  id?: string;
  customer?: string | { id?: string };
  subscription?: string | { id?: string };
  status?: string;
  current_period_end?: number;
  metadata?: { user_id?: string };
  client_reference_id?: string;
};

type StripeEvent = {
  id?: string;
  type?: string;
  data?: { object?: StripeObject };
};

function hex(bytes: ArrayBuffer) {
  return [...new Uint8Array(bytes)].map((value) => value.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

async function validStripeSignature(payload: string, signatureHeader: string, secret: string) {
  const parts = signatureHeader.split(",");
  const timestamp = parts.find((part) => part.startsWith("t="))?.slice(2);
  const signatures = parts.filter((part) => part.startsWith("v1=")).map((part) => part.slice(3));
  if (!timestamp || signatures.length === 0 || !/^\d{10,13}$/.test(timestamp)) {
    return false;
  }
  if (Math.abs(Date.now() / 1_000 - Number(timestamp)) > 300) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = hex(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${payload}`)),
  );
  return signatures.some((signature) => constantTimeEqual(digest, signature));
}

function stringId(value: StripeObject["customer"] | StripeObject["subscription"]) {
  if (typeof value === "string") return value;
  return value?.id ?? null;
}

function subscriptionState(status?: string) {
  if (status === "active" || status === "trialing") return "active";
  if (status === "past_due" || status === "unpaid") return "past_due";
  if (status === "canceled" || status === "incomplete_expired") return "canceled";
  return "inactive";
}

async function processEvent(event: StripeEvent) {
  const object = event.data?.object;
  if (!object || !event.type) return;
  const db = getD1();

  if (event.type === "checkout.session.completed") {
    const userId = object.metadata?.user_id ?? object.client_reference_id;
    const subscriptionId = stringId(object.subscription);
    if (!userId || !subscriptionId) return;
    await db
      .prepare(
        `INSERT INTO assinaturas
         (user_id, plano, status, provider_customer_id, provider_subscription_id, atualizado_em)
         VALUES (?, 'plus', 'active', ?, ?, datetime('now'))
         ON CONFLICT(user_id) DO UPDATE SET
           plano = 'plus', status = 'active',
           provider_customer_id = excluded.provider_customer_id,
           provider_subscription_id = excluded.provider_subscription_id,
           atualizado_em = datetime('now')`,
      )
      .bind(userId, stringId(object.customer), subscriptionId)
      .run();
    return;
  }

  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscriptionId = object.id;
    if (!subscriptionId) return;
    let userId = object.metadata?.user_id ?? null;
    if (!userId) {
      const existing = await db
        .prepare(
          `SELECT user_id FROM assinaturas
           WHERE provider_subscription_id = ? LIMIT 1`,
        )
        .bind(subscriptionId)
        .first<{ user_id: string }>();
      userId = existing?.user_id ?? null;
    }
    if (!userId) return;
    const status =
      event.type === "customer.subscription.deleted"
        ? "canceled"
        : subscriptionState(object.status);
    const validUntil = object.current_period_end
      ? new Date(object.current_period_end * 1_000).toISOString()
      : null;
    await db
      .prepare(
        `INSERT INTO assinaturas
         (user_id, plano, status, provider_customer_id, provider_subscription_id, valida_ate, atualizado_em)
         VALUES (?, 'plus', ?, ?, ?, ?, datetime('now'))
         ON CONFLICT(user_id) DO UPDATE SET
           plano = 'plus', status = excluded.status,
           provider_customer_id = COALESCE(excluded.provider_customer_id, assinaturas.provider_customer_id),
           provider_subscription_id = excluded.provider_subscription_id,
           valida_ate = excluded.valida_ate,
           atualizado_em = datetime('now')`,
      )
      .bind(userId, status, stringId(object.customer), subscriptionId, validUntil)
      .run();
  }
}

export const Route = createFileRoute("/api/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.STRIPE_WEBHOOK_SECRET;
        const signature = request.headers.get("stripe-signature");
        const contentLength = Number(request.headers.get("content-length") ?? 0);
        if (!secret || !signature || contentLength > 262_144) {
          return new Response("Invalid webhook", { status: 400 });
        }
        const payload = await request.text();
        if (payload.length > 262_144) {
          return new Response("Payload too large", { status: 413 });
        }
        if (!(await validStripeSignature(payload, signature, secret))) {
          return new Response("Invalid signature", { status: 400 });
        }
        try {
          const event = JSON.parse(payload) as StripeEvent;
          await processEvent(event);
          return new Response("ok", {
            status: 200,
            headers: { "cache-control": "no-store" },
          });
        } catch (error) {
          console.error("Falha ao processar webhook Stripe", error);
          return new Response("Webhook processing failed", { status: 500 });
        }
      },
    },
  },
});
