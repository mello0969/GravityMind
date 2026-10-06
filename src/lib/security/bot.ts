import "@tanstack/react-start/server-only";

import { getRequest } from "@tanstack/react-start/server";
import { serverEnv } from "./env.server";

const TURNSTILE_TEST_SECRET = "1x0000000000000000000000000000000AA";

function ambienteLocal() {
  const hostname = new URL(getRequest().url).hostname;
  return (
    process.env.NODE_ENV !== "production" && (hostname === "localhost" || hostname === "127.0.0.1")
  );
}

export async function validarTurnstile(token: string, action: "login" | "cadastro") {
  const local = ambienteLocal();
  const secret = local ? TURNSTILE_TEST_SECRET : serverEnv("TURNSTILE_SECRET_KEY");
  const origin = serverEnv("APP_ORIGIN");
  if (!local && (!origin || secret === TURNSTILE_TEST_SECRET)) return false;
  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY ausente em produção.");
    return false;
  }

  const request = getRequest();
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/json" },
    signal: AbortSignal.timeout(5_000),
    body: JSON.stringify({
      secret,
      response: token,
      remoteip: request.headers.get("cf-connecting-ip") ?? undefined,
      idempotency_key: crypto.randomUUID(),
    }),
  });

  if (!response.ok) return false;
  const result = (await response.json()) as {
    success?: boolean;
    action?: string;
    hostname?: string;
  };
  if (!result.success) return false;
  if (!local && result.action !== action) return false;

  if (!local && (!origin || result.hostname !== new URL(origin).hostname)) return false;
  return true;
}
