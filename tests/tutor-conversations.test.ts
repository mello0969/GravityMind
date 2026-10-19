// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ user: vi.fn(), headers: vi.fn(), rate: vi.fn() }));
vi.mock("@tanstack/react-start/server-only", () => ({}));
vi.mock("@/lib/auth/session.server", () => ({ exigirUsuarioAutenticado: state.user }));
vi.mock("@/lib/security/rate-limit", () => ({
  aplicarRateLimit: state.rate,
  RateLimitError: class extends Error {},
}));
vi.mock("@tanstack/react-start/server", () => ({ setResponseHeaders: state.headers }));
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
        return async (input: { data: unknown }) => fn({ data: validate(input.data) });
      },
    };
    return builder;
  },
}));

import { saveConversationSchema } from "@/lib/gravity/conversations";
import {
  createTutorConversation,
  deleteTutorConversation,
  listTutorConversations,
  readTutorConversation,
  saveTutorConversation,
  saveTutorNote,
} from "@/lib/gravity/conversations.server";
import { criptografarTexto, descriptografarTexto } from "@/lib/security/crypto";

const userId = "17d8525b-a721-4de6-aa45-b67bc092b29e";
const id = "29d8525b-a721-4de6-aa45-b67bc092b29e";
type Call = { url: URL; method: string; body: Record<string, unknown> };
let calls: Call[];
let reply: (call: Call) => unknown;
beforeEach(() => {
  vi.clearAllMocks();
  calls = [];
  state.user.mockResolvedValue(userId);
  reply = () => null;
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const call: Call = {
        url: new URL(input.toString()),
        method: init?.method ?? "GET",
        body: init?.body ? JSON.parse(String(init.body)) : {},
      };
      calls.push(call);
      return new Response(
        call.method === "HEAD" || call.method === "DELETE" ? null : JSON.stringify(reply(call)),
        { status: 200, headers: { "content-type": "application/json", "content-range": "0-0/0" } },
      );
    }),
  );
});
afterEach(() => vi.unstubAllGlobals());
const input = () => ({
  id,
  titulo: "Inércia",
  pasta: "Prova",
  versao: 3,
  mensagens: [{ id: crypto.randomUUID(), role: "user" as const, content: "O que é inércia?" }],
});
describe("Private tutor conversations", () => {
  it("rejects unauthenticated access before querying the database", async () => {
    state.user.mockRejectedValue(new Error("internal authentication detail"));
    expect(await listTutorConversations({ data: {} })).toHaveProperty("error");
    expect(fetch).not.toHaveBeenCalled();
  });
  it("rejects mass assignment and oversized content", () => {
    expect(saveConversationSchema.safeParse({ ...input(), user_id: "another-user" }).success).toBe(
      false,
    );
    expect(
      saveConversationSchema.safeParse({
        ...input(),
        mensagens: [{ id, role: "assistant", content: "x".repeat(1501) }],
      }).success,
    ).toBe(false);
  });
  it("lists only owner-scoped metadata, with no message payload", async () => {
    reply = () => [];
    expect(await listTutorConversations({ data: {} })).toEqual({ value: [] });
    expect(calls[0].url.searchParams.get("user_id")).toBe(`eq.${userId}`);
    expect(calls[0].url.searchParams.get("select")).not.toContain("mensagens");
    expect(state.headers.mock.calls[0][0].get("cache-control")).toContain("no-store");
  });
  it("encrypts content and checks ownership and optimistic version on updates", async () => {
    const data = input();
    reply = (call) => ({ id, ...call.body, atualizada_em: new Date().toISOString() });
    const result = await saveTutorConversation({ data });
    expect(result.value?.versao).toBe(4);
    expect(result.value?.mensagens).toEqual(data.mensagens);
    const call = calls[0];
    expect(call.url.searchParams.get("user_id")).toBe(`eq.${userId}`);
    expect(call.url.searchParams.get("id")).toBe(`eq.${id}`);
    expect(call.url.searchParams.get("versao")).toBe("eq.3");
    expect(call.body).not.toHaveProperty("user_id");
    expect(String(call.body.mensagens)).toMatch(/^enc:v2:/);
    expect(
      await descriptografarTexto(String(call.body.mensagens), `${userId}:${id}:mensagens`),
    ).toBe(JSON.stringify(data.mensagens));
    expect(await descriptografarTexto(String(call.body.titulo), `${userId}:${id}:titulo`)).toBe(
      "Inércia",
    );
  });
  it("does not overwrite a conversation changed elsewhere", async () => {
    expect(await saveTutorConversation({ data: input() })).toMatchObject({
      error: expect.stringContaining("outra aba"),
    });
  });
  it("decrypts only an owner-selected conversation and rejects missing records", async () => {
    expect(await readTutorConversation({ data: { id } })).toMatchObject({
      error: "Conversa não encontrada.",
    });
    const messages = input().mensagens;
    const row = {
      id,
      titulo: await criptografarTexto("Título", `${userId}:${id}:titulo`),
      pasta: await criptografarTexto("", `${userId}:${id}:pasta`),
      mensagens: await criptografarTexto(JSON.stringify(messages), `${userId}:${id}:mensagens`),
      versao: 0,
      atualizada_em: new Date().toISOString(),
    };
    reply = () => row;
    expect((await readTutorConversation({ data: { id } })).value).toMatchObject({
      titulo: "Título",
      mensagens: messages,
    });
  });
  it("creates a server-owned encrypted conversation", async () => {
    reply = (call) => ({ ...call.body, versao: 0, atualizada_em: new Date().toISOString() });
    expect((await createTutorConversation({ data: {} })).value).toMatchObject({
      titulo: "Nova conversa",
      mensagens: [],
    });
    expect(calls[1].body.user_id).toBe(userId);
    expect(calls[1].body.mensagens).toMatch(/^enc:v2:/);
  });
  it("refuses to attach notes to another account's conversation", async () => {
    expect(
      await saveTutorNote({
        data: { conversaId: id, pergunta: "Inércia?", resposta: "Um conceito." },
      }),
    ).toHaveProperty("error");
    expect(calls).toHaveLength(1);
    expect(calls[0].url.searchParams.get("user_id")).toBe(`eq.${userId}`);
  });
  it("exports an encrypted note with a conversation backlink", async () => {
    reply = () => ({ id });
    const result = await saveTutorNote({
      data: { conversaId: id, pergunta: "Inércia?", resposta: "Um conceito." },
    });
    expect(result.value).toMatchObject({ conversaId: id, conteudo: "Inércia?\n\nUm conceito." });
    expect(calls[1].body).toMatchObject({ user_id: userId, tutor_conversa_id: id });
    expect(calls[1].body.conteudo).toMatch(/^enc:v2:/);
  });
  it("scopes deletions to the authenticated owner", async () => {
    await deleteTutorConversation({ data: { id } });
    expect(calls[0].method).toBe("DELETE");
    expect(calls[0].url.searchParams.get("user_id")).toBe(`eq.${userId}`);
  });
});
