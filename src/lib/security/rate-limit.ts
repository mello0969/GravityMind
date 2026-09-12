import "@tanstack/react-start/server-only";

import { getRequest } from "@tanstack/react-start/server";
import { getD1 } from "@/lib/db/context";

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
) {
  const agora = Date.now();
  const janelaInicioMs = Math.floor(agora / janelaMs) * janelaMs;
  const janelaInicio = new Date(janelaInicioMs).toISOString();
  const expiraEm = new Date(janelaInicioMs + janelaMs).toISOString();
  const chaveHash = await sha256(`${escopo}:${identificarCliente()}:${identidadeExtra}`);
  const db = getD1();

  const linha = await db
    .prepare(
      `INSERT INTO rate_limits (chave_hash, janela_inicio, requisicoes, expira_em)
       VALUES (?, ?, 1, ?)
       ON CONFLICT(chave_hash, janela_inicio)
       DO UPDATE SET requisicoes = requisicoes + 1
       RETURNING requisicoes`,
    )
    .bind(chaveHash, janelaInicio, expiraEm)
    .first<{ requisicoes: number }>();

  if ((linha?.requisicoes ?? limite + 1) > limite) {
    throw new RateLimitError(Math.max(1, Math.ceil((janelaInicioMs + janelaMs - agora) / 1_000)));
  }

  if (Math.random() < 0.02) {
    await db
      .prepare("DELETE FROM rate_limits WHERE datetime(expira_em) < datetime('now', '-1 day')")
      .run();
  }
}
