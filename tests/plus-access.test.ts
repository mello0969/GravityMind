// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  from: vi.fn(),
  select: vi.fn(),
  eq: vi.fn(),
  single: vi.fn(),
  read: vi.fn(),
  rate: vi.fn(),
  tutor: vi.fn(),
  headers: vi.fn(),
  env: vi.fn(),
}));
vi.mock("@tanstack/react-start/server-only", () => ({}));
vi.mock("@/lib/auth/session.server", () => ({ exigirUsuarioAutenticado: mocks.auth }));
vi.mock("@/lib/db/supabase.server", () => ({ getDatabase: () => ({ from: mocks.from }) }));
vi.mock("@tanstack/react-start/server", () => ({ setResponseHeaders: mocks.headers }));
vi.mock("@/lib/security/env.server", () => ({ serverEnv: mocks.env }));
vi.mock("@/lib/gravity/groq.server", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/gravity/groq.server")>()),
  requestTutor: mocks.tutor,
}));
vi.mock("@/lib/security/rate-limit", () => ({
  aplicarRateLimit: mocks.rate,
  RateLimitError: class extends Error {},
}));
vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => {
    let validate = (data: unknown): unknown => data;
    const builder = {
      validator(fn: typeof validate) {
        validate = fn;
        return builder;
      },
      handler(fn: (input: { data: unknown }) => unknown) {
        return async (input?: { data: unknown }) => fn({ data: validate(input?.data) });
      },
    };
    return builder;
  },
}));

import { exigirAssinaturaPlus, PlusAccessError } from "@/lib/billing/entitlements.server";
import { TutorRateLimitError } from "@/lib/gravity/groq.server";
import { gravityServerFn } from "@/lib/gravity/server-fn";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.auth.mockResolvedValue("verified-owner");
  mocks.env.mockImplementation((name: string) =>
    name === "GROQ_API_KEY" ? "test-fixture" : undefined,
  );
  const query = {
    select: mocks.select,
    eq: mocks.eq,
    maybeSingle: mocks.single,
    throwOnError: mocks.read,
  };
  mocks.from.mockReturnValue(query);
  mocks.select.mockReturnValue(query);
  mocks.eq.mockReturnValue(query);
  mocks.single.mockReturnValue(query);
  mocks.read.mockResolvedValue({ data: null });
  mocks.rate.mockResolvedValue(undefined);
  mocks.tutor.mockResolvedValue("Qual corpo você está analisando?");
});
const tutorInput = () => ({
  historico: [{ role: "user" as const, content: "Como calcular a força?" }],
});

describe("Plus authorization enforced at the server boundary", () => {
  it("rejects guests before querying subscriptions", async () => {
    mocks.auth.mockRejectedValue(new Error("Unauthorized"));
    await expect(exigirAssinaturaPlus()).rejects.toThrow();
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("filters by the authenticated owner, Plus and active status", async () => {
    await expect(exigirAssinaturaPlus()).rejects.toBeInstanceOf(PlusAccessError);
    expect(mocks.from).toHaveBeenCalledWith("assinaturas");
    expect(mocks.select).toHaveBeenCalledWith("valida_ate");
    expect(mocks.eq.mock.calls).toEqual([
      ["user_id", "verified-owner"],
      ["plano", "plus"],
      ["status", "active"],
    ]);
  });
  it.each([new Date(Date.now() - 1000).toISOString(), "invalid"])(
    "denies expired or invalid expiry: %s",
    async (valida_ate) => {
      mocks.read.mockResolvedValue({ data: { valida_ate } });
      await expect(exigirAssinaturaPlus()).rejects.toBeInstanceOf(PlusAccessError);
    },
  );
  it.each([null, new Date(Date.now() + 86400000).toISOString()])(
    "allows an active subscription: %s",
    async (valida_ate) => {
      mocks.read.mockResolvedValue({ data: { valida_ate } });
      await expect(exigirAssinaturaPlus()).resolves.toBe("verified-owner");
    },
  );
  it("fails closed when the database is unavailable", async () => {
    mocks.read.mockRejectedValue(new Error("Database unavailable"));
    await expect(exigirAssinaturaPlus()).rejects.toThrow();
    expect(mocks.tutor).not.toHaveBeenCalled();
  });
});

describe("free Tutor still enforces authentication and usage limits", () => {
  it("rejects guests before contacting the AI provider", async () => {
    mocks.auth.mockRejectedValue(new Error("Unauthorized"));
    const tutor = await gravityServerFn({ data: tutorInput() });
    expect(tutor.erro).toBeTruthy();
    expect(mocks.tutor).not.toHaveBeenCalled();
    expect(mocks.rate).not.toHaveBeenCalled();
  });
  it("serves an authenticated Essencial account without a subscription lookup", async () => {
    expect(await gravityServerFn({ data: tutorInput() })).toHaveProperty("texto");
    expect(mocks.from).not.toHaveBeenCalled();
    expect(mocks.tutor).toHaveBeenCalledOnce();
    expect(mocks.tutor).toHaveBeenCalledWith(expect.objectContaining({ apiKey: "test-fixture" }));
    expect(mocks.env.mock.calls.map(([name]) => name)).toEqual(["GROQ_API_KEY", "GROQ_MODEL"]);
    expect(mocks.rate).toHaveBeenCalledWith("gravity:account", 20, 600000, "verified-owner", true);
    expect(mocks.rate).toHaveBeenCalledWith("gravity:daily", 80, 86400000, "verified-owner", true);
    expect(mocks.rate).toHaveBeenCalledWith("gravity:site", 300, 86400000, "all", true);
    for (const [headers] of mocks.headers.mock.calls) {
      expect(headers.get("cache-control")).toContain("no-store");
      expect(headers.get("vary")).toBe("Cookie");
    }
  });
  it("does not fall back to the paid provider when the Groq key is missing", async () => {
    mocks.env.mockImplementation((name: string) =>
      name === "OPENAI_API_KEY" ? "old-paid-key" : undefined,
    );
    expect(await gravityServerFn({ data: tutorInput() })).toHaveProperty("erro");
    expect(mocks.env).toHaveBeenCalledWith("GROQ_API_KEY");
    expect(mocks.env).not.toHaveBeenCalledWith("OPENAI_API_KEY");
    expect(mocks.tutor).not.toHaveBeenCalled();
    expect(mocks.rate).not.toHaveBeenCalled();
  });
  it("returns a safe free-tier limit message with the provider retry interval", async () => {
    mocks.tutor.mockRejectedValueOnce(new TutorRateLimitError(30));
    expect(await gravityServerFn({ data: tutorInput() })).toEqual({
      erro: "O limite de uso do Tutor foi atingido. Tente novamente mais tarde.",
      retryAfter: 30,
    });
  });
  it("blocks the provider when a usage limit fails", async () => {
    mocks.rate.mockRejectedValue(new Error("Limit exceeded"));
    expect(await gravityServerFn({ data: tutorInput() })).toHaveProperty("erro");
    expect(mocks.tutor).not.toHaveBeenCalled();
  });
  it("rejects plan or owner mass assignment before authorization", async () => {
    for (const extra of [{ plan: "plus" }, { userId: "other" }])
      await expect(
        gravityServerFn({ data: { ...tutorInput(), ...extra } as never }),
      ).rejects.toThrow();
    expect(mocks.auth).not.toHaveBeenCalled();
  });
});
