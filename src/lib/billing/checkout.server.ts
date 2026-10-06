import { createServerFn } from "@tanstack/react-start";
import { setResponseHeaders } from "@tanstack/react-start/server";
import { z } from "zod";
import { obterUsuarioAtual } from "@/lib/auth/session.server";
import { serverEnv } from "@/lib/security/env.server";
import { aplicarRateLimit } from "@/lib/security/rate-limit";

const checkoutSchema = z
  .object({
    plan: z.literal("plus"),
    acceptedRecurringCharge: z.literal(true),
  })
  .strict();

type CheckoutResult = {
  url?: string;
  error?: string;
  configurationRequired?: boolean;
};

function safeAppOrigin(value: string | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    const localHttp =
      url.protocol === "http:" && (url.hostname === "localhost" || url.hostname === "127.0.0.1");
    if (url.protocol !== "https:" && !localHttp) return null;
    return url.origin;
  } catch {
    return null;
  }
}

export const createPlusCheckoutServerFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => checkoutSchema.parse(input))
  .handler(async (): Promise<CheckoutResult> => {
    setResponseHeaders(
      new Headers({
        "cache-control": "private, no-store, max-age=0",
        vary: "Cookie",
      }),
    );

    try {
      const user = await obterUsuarioAtual();
      if (!user) return { error: "Entre na sua conta antes de continuar." };
      await aplicarRateLimit("billing:checkout", 5, 15 * 60_000, user.id);

      const secretKey = serverEnv("STRIPE_SECRET_KEY");
      const priceId = serverEnv("STRIPE_PLUS_PRICE_ID");
      const appOrigin = safeAppOrigin(serverEnv("APP_ORIGIN"));
      if (!secretKey || !priceId || !appOrigin) {
        return {
          error: "O checkout ainda não foi configurado neste ambiente.",
          configurationRequired: true,
        };
      }

      const body = new URLSearchParams({
        mode: "subscription",
        "line_items[0][price]": priceId,
        "line_items[0][quantity]": "1",
        customer_email: user.email,
        client_reference_id: user.id,
        "metadata[user_id]": user.id,
        "subscription_data[metadata][user_id]": user.id,
        billing_address_collection: "required",
        success_url: `${appOrigin}/plus?checkout=success`,
        cancel_url: `${appOrigin}/plus?checkout=canceled`,
      });

      const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          authorization: `Bearer ${secretKey}`,
          "content-type": "application/x-www-form-urlencoded",
        },
        body,
        signal: AbortSignal.timeout(15_000),
      });
      const payload = (await response.json()) as {
        url?: string;
        error?: { message?: string };
      };
      if (!response.ok || !payload.url) {
        console.error("Falha ao criar Checkout Session", response.status);
        return { error: "Não foi possível abrir o checkout agora." };
      }
      const checkoutUrl = new URL(payload.url);
      if (checkoutUrl.protocol !== "https:" || checkoutUrl.hostname !== "checkout.stripe.com") {
        return { error: "O provedor não retornou um endereço de checkout válido." };
      }
      return { url: checkoutUrl.href.slice(0, 2_048) };
    } catch (error) {
      console.error("Falha no checkout Plus", error);
      return { error: "Não foi possível abrir o checkout agora." };
    }
  });
