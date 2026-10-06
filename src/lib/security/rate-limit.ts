import "@tanstack/react-start/server-only";

import { getRequest } from "@tanstack/react-start/server";
import { getDatabase } from "@/lib/db/supabase.server";

export class RateLimitError extends Error {
  constructor(public readonly retryAfterSeconds: number) {
    super("Muitas tentativas. Aguarde um pouco antes de tentar novamente.");
  }
}

function bytesParaHex(bytes: ArrayBuffer) {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sha256(value: string) {
  return bytesParaHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

function identificarCliente() {
  const request = getRequest();
  return request.headers.get("cf-connecting-ip") ?? "ambiente-local";
}

export async function aplicarRateLimit(
  escopo: string,
  limite: number,
  janelaMs: number,
  identidadeExtra = "",
  porIdentidade = false,
) {
  const agora = Date.now();
  const janelaInicioMs = Math.floor(agora / janelaMs) * janelaMs;
  const janelaInicio = new Date(janelaInicioMs).toISOString();
  const expiraEm = new Date(janelaInicioMs + janelaMs).toISOString();
  const chaveHash = await sha256(
    `${escopo}:${porIdentidade ? identidadeExtra : `${identificarCliente()}:${identidadeExtra}`}`,
  );
  const { data: count } = await getDatabase()
    .rpc("gm_rate_limit", {
      p_key: chaveHash,
      p_window: janelaInicio,
      p_expires: expiraEm,
    })
    .throwOnError();

  if ((count ?? limite + 1) > limite) {
    throw new RateLimitError(Math.max(1, Math.ceil((janelaInicioMs + janelaMs - agora) / 1_000)));
  }
}
