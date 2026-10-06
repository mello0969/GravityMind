// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  cookies: new Map<string, string>(),
  setCookie: vi.fn(),
  deleteCookie: vi.fn(),
  setResponseHeaders: vi.fn(),
  bot: vi.fn(),
}));

vi.mock("@tanstack/react-start/server-only", () => ({}));
vi.mock("@tanstack/react-start/server", () => ({
  getCookie: (name: string) => state.cookies.get(name),
  setCookie: state.setCookie,
  deleteCookie: state.deleteCookie,
  setResponseHeaders: state.setResponseHeaders,
  getRequest: () => new Request("http://localhost:4173/"),
}));
vi.mock("@/lib/security/bot", () => ({ validarTurnstile: state.bot }));
vi.mock("@/lib/security/env.server", () => ({
  serverEnv: (name: string) =>
    ({
      SUPABASE_URL: "https://test.supabase.co",
      SUPABASE_SECRET_KEY: "sb_secret_fixture",
      DATA_ENCRYPTION_KEY: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
    })[name],
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

import { gerarHashSenha, gerarHashTokenSessao, verificarSenha } from "@/lib/auth/hash";
import {
  cadastrarUsuario,
  entrarUsuario,
  obterUsuarioAtual,
  sairUsuario,
} from "@/lib/auth/session.server";
import { criptografarTexto, descriptografarTexto } from "@/lib/security/crypto";
import { aplicarRateLimit, RateLimitError } from "@/lib/security/rate-limit";
import { baixarDaNuvemServerFn, enviarParaNuvemServerFn } from "@/lib/sync/server-fn";

const user = {
  id: "17d8525b-a721-4de6-aa45-b67bc092b29e",
  nome: "Teste",
  email: "qa@example.test",
};
const token = "1".repeat(64);
type Call = { url: URL; method: string; body: Record<string, unknown> };
let calls: Call[] = [];
let reply: (call: Call) => unknown;
let rateCount = 1;

beforeEach(() => {
  state.cookies.clear();
  vi.clearAllMocks();
  state.bot.mockResolvedValue(true);
  calls = [];
  rateCount = 1;
  reply = () => [];
  state.deleteCookie.mockImplementation((name: string) => state.cookies.delete(name));
  state.setCookie.mockImplementation((name: string, value: string) =>
    state.cookies.set(name, value),
  );
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = new URL(input instanceof Request ? input.url : input.toString());
      const call = {
        url,
        method: init?.method ?? "GET",
        body: init?.body ? JSON.parse(String(init.body)) : {},
      };
      calls.push(call);
      let data = reply(call);
      if (url.pathname.endsWith("/rpc/gm_rate_limit")) data = rateCount;
      if (url.pathname.endsWith("/sessoes") && call.method === "GET") {
        data = state.cookies.size ? [{ users: user }] : [];
      }
      if (call.method === "DELETE" || (call.method === "POST" && !url.pathname.includes("/rpc/"))) {
        return new Response(null, { status: 201 });
      }
      return new Response(JSON.stringify(data), {
        headers: { "content-type": "application/json" },
      });
    }),
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

const form = () => ({
  nome: "Teste",
  email: user.email,
  senha: "Senha de teste 2026!",
  website: "",
  turnstileToken: "test-token",
  formularioIniciadoEm: Date.now() - 2000,
});
const empty = () => ({
  notas: [],
  respostasQuestoes: [],
  respostasCalculo: [],
  progressoLicoes: [],
  dificuldadeAdaptativa: [],
  quizResultados: [],
});

describe("Supabase server boundary", () => {
  it("hashes passwords and persists only the session digest with production cookie flags", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const result = await cadastrarUsuario(form());
    expect(result.usuario).toMatchObject({ nome: "Teste", email: user.email });
    expect(Object.keys(result.usuario ?? {}).sort()).toEqual(["email", "id", "nome"]);
    const inserted = calls.find(
      (call) => call.url.pathname.endsWith("/users") && call.method === "POST",
    );
    expect(inserted).toBeDefined();
    const hash = String(inserted?.body.senha_hash);
    const salt = String(inserted?.body.senha_salt);
    expect(await verificarSenha(form().senha, hash, salt)).toBe(true);
    expect(JSON.stringify(inserted?.body)).not.toContain(form().senha);
    const cookie = state.cookies.get("__Host-gm_session");
    expect(cookie).toHaveLength(64);
    expect(state.setCookie).toHaveBeenCalledWith(
      "__Host-gm_session",
      cookie,
      expect.objectContaining({ httpOnly: true, secure: true, sameSite: "strict", path: "/" }),
    );
    const session = calls.find((call) => call.url.pathname.endsWith("/rpc/gm_create_session"));
    expect(session?.body.p_token).toBe(await gerarHashTokenSessao(cookie ?? ""));
    expect(session?.body.p_token).not.toBe(cookie);
  });

  it("keeps login compatible with existing PBKDF2 hashes and revokes the digest on logout", async () => {
    const password = await gerarHashSenha(form().senha);
    reply = (call) =>
      call.url.pathname.endsWith("/users")
        ? [{ ...user, senha_hash: password.hash, senha_salt: password.salt }]
        : [];
    expect((await entrarUsuario(form())).usuario).toEqual(user);
    const sessionToken = state.cookies.get("gm_session") ?? "";
    expect(await obterUsuarioAtual()).toEqual(user);
    const read = calls.find((call) => call.url.pathname.endsWith("/sessoes"));
    expect(read?.url.searchParams.get("token")).toBe(
      `eq.${await gerarHashTokenSessao(sessionToken)}`,
    );
    expect(read?.url.searchParams.get("expira_em")).toMatch(/^gt\./);
    await sairUsuario();
    const deleted = calls.find((call) => call.method === "DELETE");
    expect(deleted?.url.searchParams.get("token")).toBe(
      `eq.${await gerarHashTokenSessao(sessionToken)}`,
    );
    expect(state.cookies.has("gm_session")).toBe(false);
  });

  it("denies nonexistent users and invalid cookie tokens without creating a session", async () => {
    expect((await entrarUsuario(form())).erro).toBe("E-mail ou senha incorretos.");
    expect(calls.some((call) => call.url.pathname.endsWith("/rpc/gm_create_session"))).toBe(false);
    state.cookies.set("gm_session", "invalid");
    expect(await obterUsuarioAtual()).toBeNull();
    expect(state.cookies.has("gm_session")).toBe(false);
  });

  it("fails closed for bot protection and throttles before creating users", async () => {
    state.bot.mockResolvedValue(false);
    expect((await cadastrarUsuario(form())).usuario).toBeUndefined();
    expect(calls.some((call) => call.url.pathname.endsWith("/users"))).toBe(false);
    rateCount = 11;
    await expect(aplicarRateLimit("auth:test", 10, 60000)).rejects.toBeInstanceOf(RateLimitError);
    const result = await cadastrarUsuario(form());
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it("refuses a stale account payload and rejects ownership mass assignment", async () => {
    state.cookies.set("gm_session", token);
    const result = await enviarParaNuvemServerFn({
      data: {
        ...empty(),
        expectedUserId: "00000000-0000-4000-8000-000000000001",
      },
    });
    expect(result.ok).toBe(false);
    expect(calls.some((call) => call.url.pathname.endsWith("/rpc/gm_sync"))).toBe(false);
    await expect(
      enviarParaNuvemServerFn({
        data: {
          ...empty(),
          user_id: "other",
        } as never,
      }),
    ).rejects.toThrow();
  });

  it("uses the verified owner, encrypts note fields and never sends browser-provided ownership", async () => {
    state.cookies.set("gm_session", token);
    const now = new Date().toISOString();
    expect(
      await enviarParaNuvemServerFn({
        data: {
          ...empty(),
          expectedUserId: user.id,
          notas: [
            {
              id: "private-note",
              titulo: "Meu estudo",
              conteudo: "Meu texto privado",
              assunto: "geral",
              criadaEm: now,
              atualizadaEm: now,
            },
          ],
        },
      }),
    ).toEqual({ ok: true });
    const rpc = calls.find((call) => call.url.pathname.endsWith("/rpc/gm_sync"));
    expect(rpc?.body.p_user_id).toBe(user.id);
    expect(JSON.stringify(rpc?.body)).not.toContain("Meu texto privado");
    expect(JSON.stringify(rpc?.body)).toContain("enc:v2:");
    const data = rpc?.body.p_data as { notas: { conteudo: string }[] };
    expect(
      await descriptografarTexto(data.notas[0].conteudo, `${user.id}:private-note:conteudo`),
    ).toBe("Meu texto privado");
    await expect(
      descriptografarTexto(data.notas[0].conteudo, "other:private-note:conteudo"),
    ).rejects.toThrow();
  });

  it("scopes every download and normalizes Postgres timestamps to stable local event keys", async () => {
    state.cookies.set("gm_session", token);
    const encrypted = await criptografarTexto("Privado", `${user.id}:note:titulo`);
    const encryptedBody = await criptografarTexto("Texto", `${user.id}:note:conteudo`);
    reply = (call) => {
      if (call.url.pathname.endsWith("/notas"))
        return [
          {
            id: "note",
            titulo: encrypted,
            conteudo: encryptedBody,
            assunto: "geral",
            criada_em: "2026-09-26T10:00:00+00:00",
            atualizada_em: "2026-09-26T10:00:00+00:00",
          },
        ];
      return [];
    };
    const result = await baixarDaNuvemServerFn();
    expect("erro" in result).toBe(false);
    if ("erro" in result) throw Error(result.erro);
    expect(result.expectedUserId).toBe(user.id);
    expect(result.notas[0].titulo).toBe("Privado");
    expect(result.notas[0].criadaEm).toBe("2026-09-26T10:00:00.000Z");
    const reads = calls.filter(
      (call) => call.method === "GET" && !call.url.pathname.endsWith("/sessoes"),
    );
    expect(reads).toHaveLength(6);
    for (const read of reads) {
      expect(read.url.searchParams.get("user_id")).toBe(`eq.${user.id}`);
      expect(read.url.searchParams.get("limit")).toBeTruthy();
      expect(read.url.searchParams.get("select")).not.toBe("*");
    }
  });
});
