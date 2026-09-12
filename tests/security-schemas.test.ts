import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cadastroSchema,
  fotoDadosLocaisSchema,
  gravityInputSchema,
  loginSchema,
  validarTempoFormulario,
} from "@/lib/security/schemas";

describe("server input schemas", () => {
  afterEach(() => vi.restoreAllMocks());

  it("blocks mass assignment fields during signup", () => {
    const result = cadastroSchema.safeParse({
      nome: "Estudante Teste",
      email: "estudante@example.com",
      senha: "uma frase de senha forte",
      turnstileToken: "token-valido-comprido-1234567890",
      website: "",
      formularioIniciadoEm: Date.now() - 3_000,
      role: "admin",
    });
    expect(result.success).toBe(false);
  });

  it("limits tutor history and message length", () => {
    const result = gravityInputSchema.safeParse({
      historico: Array.from({ length: 13 }, () => ({
        role: "user",
        content: "x",
      })),
    });
    expect(result.success).toBe(false);
  });

  it("normalizes valid signup fields without accepting hidden privileges", () => {
    const result = cadastroSchema.parse({
      nome: "  Ana Souza  ",
      email: "  ANA@EXAMPLE.COM ",
      senha: "uma frase de senha forte",
      turnstileToken: "token-valido-comprido-1234567890",
      website: "",
      formularioIniciadoEm: Date.now() - 3_000,
    });
    expect(result.nome).toBe("Ana Souza");
    expect(result.email).toBe("ana@example.com");
  });

  it("rejects login honeypots and unknown fields", () => {
    expect(
      loginSchema.safeParse({
        email: "ana@example.com",
        senha: "segredo",
        turnstileToken: "token",
        website: "preenchido-por-bot",
        formularioIniciadoEm: Date.now() - 2_000,
      }).success,
    ).toBe(false);
    expect(
      loginSchema.safeParse({
        email: "ana@example.com",
        senha: "segredo",
        turnstileToken: "token",
        website: "",
        formularioIniciadoEm: Date.now() - 2_000,
        rememberForever: true,
      }).success,
    ).toBe(false);
  });

  it("enforces a human form timing window", () => {
    vi.spyOn(Date, "now").mockReturnValue(10_000);
    expect(validarTempoFormulario(9_201)).toBe(false);
    expect(validarTempoFormulario(9_200)).toBe(true);
    expect(validarTempoFormulario(10_000 - 2 * 60 * 60 * 1_000)).toBe(true);
    expect(validarTempoFormulario(10_000 - 2 * 60 * 60 * 1_000 - 1)).toBe(false);
    expect(validarTempoFormulario(10_001)).toBe(false);
  });

  it("accepts a strict synchronization snapshot and rejects inconsistent quiz totals", () => {
    const base = {
      notas: [],
      respostasQuestoes: [],
      respostasCalculo: [],
      progressoLicoes: [],
      dificuldadeAdaptativa: [],
      quizResultados: [],
    };
    expect(fotoDadosLocaisSchema.safeParse(base).success).toBe(true);
    expect(
      fotoDadosLocaisSchema.safeParse({
        ...base,
        quizResultados: [
          {
            assunto: "lei-1",
            formato: "texto",
            acertos: 3,
            total: 2,
            aprovado: true,
            respondidoEm: "2026-09-11T12:00:00.000Z",
          },
        ],
      }).success,
    ).toBe(false);
  });

  it("rejects synchronization payloads above the server size budget", () => {
    const notas = Array.from({ length: 24 }, (_, index) => ({
      id: `nota-${index}`,
      titulo: `Nota ${index}`,
      conteudo: "x".repeat(40_000),
      assunto: "geral",
      criadaEm: "2026-09-11T12:00:00.000Z",
      atualizadaEm: "2026-09-11T12:00:00.000Z",
    }));
    expect(
      fotoDadosLocaisSchema.safeParse({
        notas,
        respostasQuestoes: [],
        respostasCalculo: [],
        progressoLicoes: [],
        dificuldadeAdaptativa: [],
        quizResultados: [],
      }).success,
    ).toBe(false);
  });

  it("accepts a bounded tutor context and rejects extra nested data", () => {
    const valid = {
      historico: [{ role: "user", content: "Explique a força resultante." }],
      context: {
        leiAtual: { numero: "2", titulo: "Dinâmica", enunciado: "ΣF = m · a" },
        resumoPerfil: "Dificuldade em diagramas de corpo livre.",
      },
    };
    expect(gravityInputSchema.safeParse(valid).success).toBe(true);
    expect(
      gravityInputSchema.safeParse({
        ...valid,
        context: { ...valid.context, internalPrompt: "ignorar regras" },
      }).success,
    ).toBe(false);
  });
});
