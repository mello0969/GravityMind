import process from "node:process";
import { c as createServerRpc, o as obterUsuarioAtual, a as aplicarRateLimit } from "./session.server-DL0xVT0X.mjs";
import { c as createServerFn, s as setResponseHeaders } from "./server-DwUI_Cux.mjs";

import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, l as literalType } from "../_libs/zod.mjs";
import "./schemas-Dga4YmnR.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/unenv.mjs";


import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";





import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";

import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
const checkoutSchema = objectType({
  plan: literalType("plus"),
  acceptedRecurringCharge: literalType(true)
}).strict();
function safeAppOrigin(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    const localHttp = url.protocol === "http:" && (url.hostname === "localhost" || url.hostname === "127.0.0.1");
    if (url.protocol !== "https:" && !localHttp) return null;
    return url.origin;
  } catch {
    return null;
  }
}
const createPlusCheckoutServerFn_createServerFn_handler = createServerRpc({
  id: "83ca8cb5f515b9a8c3b32187ffcff14c02859c244b212c07f5757b7f904a54c9",
  name: "createPlusCheckoutServerFn",
  filename: "src/lib/billing/checkout.server.ts"
}, (opts) => createPlusCheckoutServerFn.__executeServer(opts));
const createPlusCheckoutServerFn = createServerFn({
  method: "POST"
}).validator((input) => checkoutSchema.parse(input)).handler(createPlusCheckoutServerFn_createServerFn_handler, async () => {
  setResponseHeaders(new Headers({
    "cache-control": "private, no-store, max-age=0",
    vary: "Cookie"
  }));
  try {
    const user = await obterUsuarioAtual();
    if (!user) return {
      error: "Entre na sua conta antes de continuar."
    };
    await aplicarRateLimit("billing:checkout", 5, 15 * 6e4, user.id);
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_PLUS_PRICE_ID;
    const appOrigin = safeAppOrigin(process.env.APP_ORIGIN ?? process.env.PUBLIC_APP_ORIGIN);
    if (!secretKey || !priceId || !appOrigin) {
      return {
        error: "O checkout ainda não foi configurado neste ambiente.",
        configurationRequired: true
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
      cancel_url: `${appOrigin}/plus?checkout=canceled`
    });
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        authorization: `Bearer ${secretKey}`,
        "content-type": "application/x-www-form-urlencoded"
      },
      body,
      signal: AbortSignal.timeout(15e3)
    });
    const payload = await response.json();
    if (!response.ok || !payload.url) {
      console.error("Falha ao criar Checkout Session", response.status);
      return {
        error: "Não foi possível abrir o checkout agora."
      };
    }
    return {
      url: payload.url.slice(0, 2048)
    };
  } catch (error) {
    console.error("Falha no checkout Plus", error);
    return {
      error: "Não foi possível abrir o checkout agora."
    };
  }
});
export {
  createPlusCheckoutServerFn_createServerFn_handler
};
