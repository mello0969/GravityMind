import "@tanstack/react-start/server-only";
import { serverEnv } from "@/lib/security/env.server";
import { gerarHashSenha as gerarLocal, verificarSenha as verificarLocal } from "./hash";

async function comFallback<T>(local: () => Promise<T>, input: Record<string, string>): Promise<T> {
  try {
    return await local();
  } catch (error) {
    // Workers caps Web Crypto PBKDF2 at 100k. Preserve the existing 600k hashes.
    if (!(error instanceof Error) || !/Pbkdf2 failed: iteration counts above/.test(error.message)) {
      throw error;
    }
    const url = serverEnv("SUPABASE_URL");
    const key = serverEnv("SUPABASE_SECRET_KEY");
    if (!url || !key) throw new Error("Password service unavailable");
    const response = await fetch(new URL("/functions/v1/gm-password", url), {
      method: "POST",
      headers: { "content-type": "application/json", apikey: key },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error("Password service unavailable");
    const result = await response.json();
    if (input.operation === "verify" && typeof result.valid === "boolean") return result.valid as T;
    if (
      input.operation === "hash" &&
      /^pbkdf2-v1\$600000\$[a-f0-9]{128}$/.test(result.hash) &&
      /^[a-f0-9]{32}$/.test(result.salt)
    )
      return { hash: result.hash, salt: result.salt } as T;
    throw new Error("Invalid password service response");
  }
}

export function gerarHashSenha(senha: string) {
  return comFallback(() => gerarLocal(senha), { operation: "hash", password: senha });
}

export function verificarSenha(senha: string, hash: string, salt: string) {
  return comFallback(() => verificarLocal(senha, hash, salt), {
    operation: "verify",
    password: senha,
    hash,
    salt,
  });
}
