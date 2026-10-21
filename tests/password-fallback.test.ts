// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-start/server-only", () => ({}));
vi.mock("@/lib/security/env.server", () => ({
  serverEnv: (name: string) =>
    ({ SUPABASE_URL: "https://example.supabase.co", SUPABASE_SECRET_KEY: "sb_secret_test" })[name],
}));

import { gerarHashSenha, verificarSenha } from "@/lib/auth/password.server";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
describe("Workers password fallback", () => {
  it("retains existing hashes and uses authenticated fallback only for the Workers cap", async () => {
    const original = await gerarHashSenha("test-password");
    vi.spyOn(crypto.subtle, "deriveBits").mockRejectedValue(
      new Error(
        "Pbkdf2 failed: iteration counts above 100000 are not supported (requested 600000).",
      ),
    );
    const fetcher = vi.fn().mockResolvedValue(Response.json({ valid: true }));
    vi.stubGlobal("fetch", fetcher);
    expect(await verificarSenha("test-password", original.hash, original.salt)).toBe(true);
    const [url, init] = fetcher.mock.calls[0];
    expect(String(url)).toBe("https://example.supabase.co/functions/v1/gm-password");
    expect(init.headers.apikey).toBe("sb_secret_test");
    expect(JSON.parse(init.body)).toMatchObject({
      operation: "verify",
      hash: original.hash,
      salt: original.salt,
    });
  });
  it("fails closed on service errors and malformed responses", async () => {
    vi.spyOn(crypto.subtle, "deriveBits").mockRejectedValue(
      new Error("Pbkdf2 failed: iteration counts above 100000 are not supported"),
    );
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(Response.json({ hash: "invalid", salt: "invalid" }));
    vi.stubGlobal("fetch", fetcher);
    await expect(gerarHashSenha("test-password")).rejects.toThrow("Password service unavailable");
    await expect(gerarHashSenha("test-password")).rejects.toThrow(
      "Invalid password service response",
    );
  });
  it("does not mask unrelated crypto failures", async () => {
    vi.spyOn(crypto.subtle, "deriveBits").mockRejectedValue(new Error("unexpected crypto error"));
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    await expect(gerarHashSenha("test-password")).rejects.toThrow("unexpected crypto error");
    expect(fetcher).not.toHaveBeenCalled();
  });
});
