import { gerarHashSenha, verificarSenha } from "../../../src/lib/auth/hash.ts";

// Server-to-server only: the gateway's legacy JWT check cannot validate sb_secret keys.
// Authenticate against the project's injected secret keys before parsing any password.
Deno.serve(async (request: Request) => {
  const reply = (data: unknown, status = 200) => Response.json(data, {
    status, headers: { "cache-control": "no-store" },
  });
  if (request.method !== "POST") return reply({ error: "Method not allowed" }, 405);
  try {
    const supplied = request.headers.get("apikey") ?? "";
    const keys = Object.values(JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}"));
    if (!supplied.startsWith("sb_secret_") || !keys.includes(supplied)) {
      return reply({ error: "Unauthorized" }, 401);
    }
    const text = await request.text();
    if (text.length > 4096) return reply({ error: "Invalid input" }, 400);
    const body = JSON.parse(text);
    if (typeof body.password !== "string" || !body.password.length || body.password.length > 128) {
      return reply({ error: "Invalid input" }, 400);
    }
    if (body.operation === "hash") return reply(await gerarHashSenha(body.password));
    if (body.operation === "verify" && typeof body.hash === "string" && typeof body.salt === "string") {
      return reply({ valid: await verificarSenha(body.password, body.hash, body.salt) });
    }
    return reply({ error: "Invalid input" }, 400);
  } catch {
    return reply({ error: "Password operation failed" }, 500);
  }
});
