import "@tanstack/react-start/server-only";
import { z } from "zod";
import { validStripeSignature } from "@/lib/billing/stripe-signature";
import { findSubscriber, savePlusSubscription } from "@/lib/billing/subscriptions.server";
import { serverEnv } from "@/lib/security/env.server";

const referenceSchema = z
  .union([z.string().max(255), z.object({ id: z.string().max(255).optional() })])
  .nullish();
const objectSchema = z.object({
  id: z.string().max(255).optional(),
  customer: referenceSchema,
  subscription: referenceSchema,
  status: z.string().optional(),
  current_period_end: z.number().int().nonnegative().max(253402300799).optional(),
  metadata: z.object({ user_id: z.string().max(128).optional() }).nullish(),
  client_reference_id: z.string().max(128).nullish(),
});
const eventSchema = z.object({
  type: z.string(),
  data: z.object({ object: z.unknown() }).optional(),
});
type StripeEvent = z.infer<typeof eventSchema>;
type StripeReference = z.infer<typeof referenceSchema>;

function stringId(value: StripeReference) {
  return typeof value === "string" ? value : (value?.id ?? null);
}

function subscriptionState(status?: string) {
  if (status === "active" || status === "trialing") return "active";
  if (status === "past_due" || status === "unpaid") return "past_due";
  if (status === "canceled" || status === "incomplete_expired") return "canceled";
  return "inactive";
}

async function processStripeEvent(event: StripeEvent) {
  if (
    !event.data?.object ||
    ![
      "checkout.session.completed",
      "customer.subscription.updated",
      "customer.subscription.deleted",
    ].includes(event.type)
  )
    return;
  const object = objectSchema.parse(event.data.object);
  if (event.type === "checkout.session.completed") {
    const userId = object.metadata?.user_id ?? object.client_reference_id;
    const subscriptionId = stringId(object.subscription);
    if (!userId || !subscriptionId) return;
    await savePlusSubscription(userId, {
      status: "active",
      provider_customer_id: stringId(object.customer),
      provider_subscription_id: subscriptionId,
    });
    return;
  }
  if (!object.id) return;
  const userId = object.metadata?.user_id ?? (await findSubscriber(object.id));
  if (!userId) return;
  const customerId = stringId(object.customer);
  await savePlusSubscription(userId, {
    status:
      event.type === "customer.subscription.deleted"
        ? "canceled"
        : subscriptionState(object.status),
    ...(customerId ? { provider_customer_id: customerId } : {}),
    provider_subscription_id: object.id,
    valida_ate: object.current_period_end
      ? new Date(object.current_period_end * 1000).toISOString()
      : null,
  });
}

export async function handleStripeWebhook(request: Request): Promise<Response> {
  const secret = serverEnv("STRIPE_WEBHOOK_SECRET");
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature || Number(request.headers.get("content-length") ?? 0) > 262144)
    return new Response("Invalid webhook", { status: 400 });
  const payload = await request.text();
  if (payload.length > 262144) return new Response("Payload too large", { status: 413 });
  if (!(await validStripeSignature(payload, signature, secret)))
    return new Response("Invalid signature", { status: 400 });

  let event: StripeEvent;
  try {
    event = eventSchema.parse(JSON.parse(payload));
  } catch {
    return new Response("Invalid event", { status: 400 });
  }
  try {
    await processStripeEvent(event);
    return new Response("ok", { status: 200, headers: { "cache-control": "no-store" } });
  } catch (error) {
    if (error instanceof z.ZodError) return new Response("Invalid event", { status: 400 });
    console.error("Falha ao processar webhook Stripe", error);
    return new Response("Webhook processing failed", { status: 500 });
  }
}
