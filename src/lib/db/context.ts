/**
 * Acesso ao D1, via getRequest() do TanStack Start
 * ----------------------------------------------------------------
 * Descoberta ao investigar o runtime do preset cloudflare-module do
 * Nitro (node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs):
 * o binding do Cloudflare (`env`) é anexado à própria Request como
 * `request.runtime.cloudflare.env` antes dela chegar em qualquer
 * handler, inclusive nas server functions do TanStack Start.
 *
 * `getRequest()` (de "@tanstack/react-start/server") devolve essa MESMA
 * Request, já com essas propriedades anexadas, então é o jeito mais
 * direto de acessar o banco de dentro de uma `createServerFn`, sem
 * precisar de AsyncLocalStorage nem de rotas de servidor separadas
 * (tentativas anteriores que não funcionaram nesta configuração).
 */
import "@tanstack/react-start/server-only";

import { getRequest } from "@tanstack/react-start/server";

export type D1Database = {
  prepare: (query: string) => D1PreparedStatement;
  batch?: (statements: D1PreparedStatement[]) => Promise<unknown[]>;
};
type D1PreparedStatement = {
  bind: (...values: unknown[]) => D1PreparedStatement;
  run: () => Promise<{ success: boolean; meta: Record<string, unknown> }>;
  all: <T = Record<string, unknown>>() => Promise<{ results: T[] }>;
  first: <T = Record<string, unknown>>() => Promise<T | null>;
};

type RequestComEnv = Request & {
  runtime?: { cloudflare?: { env?: { DB?: D1Database } } };
};

export function getD1(): D1Database {
  const request = getRequest() as RequestComEnv;
  const db = request.runtime?.cloudflare?.env?.DB;
  if (!db) {
    throw new Error(
      "Banco de dados (D1) não disponível. Confira se o binding 'DB' está configurado no wrangler.jsonc e se o deploy foi feito via `wrangler deploy` (não `vite dev`).",
    );
  }
  return db;
}
