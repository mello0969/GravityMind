import { beforeEach, describe, expect, it, vi } from "vitest";
import { QUESTOES } from "@/lib/questions/bank";
import { QUESTOES_CALCULO } from "@/lib/questions/bank-calculo";
import {
  atualizarDificuldadeAdaptativa,
  calcularDesempenhoPorAssunto,
  contarRevisoesPendentes,
  escolherAssuntoAdaptativo,
  escolherProximaQuestao,
  escolherProximaQuestaoMecanica,
  identificarPontosFortesEFracos,
  limparHistorico,
  marcarRespostaCorrigida,
  obterDicasQuestao,
  obterDificuldadeAtual,
  obterHistorico,
  registrarResposta,
} from "@/lib/questions/engine";
import {
  escolherProximaQuestaoCalculo,
  obterHistoricoCalculo,
  registrarRespostaCalculo,
} from "@/lib/questions/engine-calculo";

function responder({
  questaoId = "lei1-f-01",
  correta,
  tempoSegundos = 30,
  corrigida,
}: {
  questaoId?: string;
  correta: boolean;
  tempoSegundos?: number;
  corrigida?: boolean;
}) {
  registrarResposta({
    questaoId,
    letraEscolhida: correta ? "A" : "B",
    correta,
    tempoSegundos,
    respondidoEm: new Date().toISOString(),
    confianca: correta ? "media" : "alta",
    corrigida,
  });
}

function responderLote(
  quantidade: number,
  correta: boolean,
  tempoSegundos: number,
  questaoId = "lei1-f-01",
) {
  for (let index = 0; index < quantidade; index += 1) {
    responder({ questaoId, correta, tempoSegundos });
  }
}

describe("adaptive question engine", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("offers reviewed mechanics questions at every difficulty", () => {
    for (const difficulty of ["facil", "medio", "dificil"] as const) {
      const question = escolherProximaQuestaoMecanica(difficulty);
      expect(question?.dificuldade).toBe(difficulty);
      expect(question?.tags).toContain("mecânica");
      expect(question?.alternativas).toHaveLength(4);
    }
  });

  it("returns two progressive hints without exposing the correct letter", () => {
    const question = QUESTOES.find((item) => item.id === "mec-d-01");
    if (!question) throw new Error("Expected mechanics fixture was not found.");
    const hints = obterDicasQuestao(question);
    expect(hints).toHaveLength(2);
    expect(hints.join(" ")).not.toContain(`alternativa ${question.correta}`);
  });

  it("preserves confidence and correction signals", () => {
    registrarResposta({
      questaoId: "mec-f-01",
      letraEscolhida: "B",
      correta: false,
      tempoSegundos: 18,
      respondidoEm: "2026-09-11T12:00:00.000Z",
      confianca: "alta",
      corrigida: true,
    });
    expect(obterHistorico()).toEqual([
      expect.objectContaining({ confianca: "alta", corrigida: true }),
    ]);
  });

  it("rejects malformed history imported into local storage", () => {
    window.localStorage.setItem(
      "gravitymind:respostas",
      JSON.stringify([{ questaoId: "x", correta: "yes", tempoSegundos: -1 }]),
    );
    expect(obterHistorico()).toEqual([]);
  });

  it("prioritizes an unresolved mistake and removes it after correction", () => {
    responder({ questaoId: "lei2-f-01", correta: false });

    expect(contarRevisoesPendentes("lei-2")).toBe(1);
    expect(escolherAssuntoAdaptativo()).toBe("lei-2");
    expect(escolherProximaQuestao("lei-2", "facil")?.id).toBe("lei2-f-01");
    expect(marcarRespostaCorrigida("lei2-f-01")).toBe(true);
    expect(marcarRespostaCorrigida("lei2-f-01")).toBe(false);
    expect(contarRevisoesPendentes("lei-2")).toBe(0);
  });

  it("moves from fundamentals to challenge and regresses after persistent errors", () => {
    for (let index = 0; index < 5; index += 1) responder({ correta: true, tempoSegundos: 35 });
    expect(atualizarDificuldadeAdaptativa("lei-1")).toEqual({
      mudou: true,
      nivelAnterior: "facil",
      nivelNovo: "medio",
    });

    for (let index = 0; index < 5; index += 1) responder({ correta: true, tempoSegundos: 50 });
    expect(atualizarDificuldadeAdaptativa("lei-1").nivelNovo).toBe("dificil");
    expect(obterDificuldadeAtual("lei-1")).toBe("dificil");

    for (let index = 0; index < 5; index += 1) responder({ correta: false, tempoSegundos: 70 });
    expect(atualizarDificuldadeAdaptativa("lei-1").nivelNovo).toBe("medio");
    expect(obterDificuldadeAtual("lei-1")).toBe("medio");
  });

  it("honors the easy-level accuracy and time boundaries", () => {
    responderLote(4, true, 120);
    responderLote(1, false, 120);
    expect(atualizarDificuldadeAdaptativa("lei-1").nivelNovo).toBe("medio");

    window.localStorage.clear();
    responderLote(5, true, 121);
    expect(atualizarDificuldadeAdaptativa("lei-1")).toEqual({
      mudou: false,
      nivelAnterior: "facil",
      nivelNovo: "facil",
    });
  });

  it("promotes medium at 75 percent and keeps difficult at 50 percent", () => {
    responderLote(5, true, 30);
    atualizarDificuldadeAdaptativa("lei-1");

    responderLote(2, false, 150);
    responderLote(3, true, 150);
    expect(atualizarDificuldadeAdaptativa("lei-1").nivelNovo).toBe("dificil");

    responderLote(1, true, 40);
    responderLote(4, false, 40);
    expect(atualizarDificuldadeAdaptativa("lei-1")).toEqual({
      mudou: false,
      nivelAnterior: "dificil",
      nivelNovo: "dificil",
    });
  });

  it("regresses medium and difficult only after sustained low accuracy", () => {
    responderLote(5, true, 30);
    atualizarDificuldadeAdaptativa("lei-1");
    responderLote(5, false, 40);
    expect(atualizarDificuldadeAdaptativa("lei-1").nivelNovo).toBe("facil");

    window.localStorage.clear();
    responderLote(5, true, 30);
    atualizarDificuldadeAdaptativa("lei-1");
    responderLote(5, true, 30);
    atualizarDificuldadeAdaptativa("lei-1");
    responderLote(5, false, 40);
    expect(atualizarDificuldadeAdaptativa("lei-1").nivelNovo).toBe("medio");
  });

  it("does not reevaluate the same adaptive window and can clear all learning state", () => {
    for (let index = 0; index < 5; index += 1) responder({ correta: true });
    atualizarDificuldadeAdaptativa("lei-1");
    expect(atualizarDificuldadeAdaptativa("lei-1").mudou).toBe(false);

    limparHistorico();
    expect(obterHistorico()).toEqual([]);
    expect(obterDificuldadeAtual("lei-1")).toBe("facil");
  });

  it("aggregates accuracy and average response time by law", () => {
    responder({ questaoId: "lei3-f-01", correta: true, tempoSegundos: 20 });
    responder({ questaoId: "lei3-f-02", correta: false, tempoSegundos: 40 });

    const thirdLaw = calcularDesempenhoPorAssunto().find((item) => item.assunto === "lei-3");
    expect(thirdLaw).toMatchObject({
      totalRespostas: 2,
      acertos: 1,
      taxaAcerto: 50,
      tempoMedioSegundos: 30,
    });
  });

  it("classifies mastered and review subjects from meaningful samples", () => {
    responderLote(4, true, 20, "lei1-f-01");
    responderLote(1, true, 20, "lei2-f-01");
    responderLote(2, false, 20, "lei2-f-01");

    const result = identificarPontosFortesEFracos();
    expect(result.dominados.map((item) => item.assunto)).toEqual(["lei-1"]);
    expect(result.precisamRevisao.map((item) => item.assunto)).toEqual(["lei-2"]);
    expect(result.desempenho).toHaveLength(3);
  });

  it("cycles mechanics and calculation pools after exclusions", () => {
    const mechanicsIds = QUESTOES.filter(
      (item) => item.tags.includes("mecânica") && item.dificuldade === "facil",
    ).map((item) => item.id);
    expect(escolherProximaQuestaoMecanica("facil", mechanicsIds)).not.toBeNull();

    vi.spyOn(Math, "random").mockReturnValue(0);
    const first = escolherProximaQuestaoCalculo("lei-2", "medio");
    expect(first?.id).toBe("calc-lei2-m-01");
    expect(escolherProximaQuestaoCalculo("lei-2", "medio", ["calc-lei2-m-01"])?.id).toBe(
      "calc-lei2-m-01",
    );
  });

  it("accepts numeric tolerance and records calculation answers in both histories", () => {
    const question = QUESTOES_CALCULO.find((item) => item.id === "calc-lei1-f-01");
    if (!question) throw new Error("Expected calculation fixture was not found.");

    expect(registrarRespostaCalculo(question, 30.5, 25)).toEqual({ correta: true });
    expect(obterHistoricoCalculo()).toEqual([
      expect.objectContaining({ questaoId: question.id, valorDigitado: 30.5, correta: true }),
    ]);
    expect(obterHistorico()).toEqual([
      expect.objectContaining({ questaoId: question.id, letraEscolhida: "CALC", correta: true }),
    ]);
  });

  it("treats the numeric tolerance as inclusive and rejects the next value", () => {
    const fixture = QUESTOES_CALCULO.find((item) => item.id === "calc-lei1-f-01");
    if (!fixture) throw new Error("Expected calculation fixture was not found.");
    const question = { ...fixture, valorCorreto: 100, toleranciaPercent: 2 };

    expect(registrarRespostaCalculo(question, 98, 10)).toEqual({ correta: true });
    expect(registrarRespostaCalculo(question, 102, 10)).toEqual({ correta: true });
    expect(registrarRespostaCalculo(question, 97.99, 10).correta).toBe(false);
    expect(registrarRespostaCalculo(question, 102.01, 10).correta).toBe(false);
  });

  it("uses the default tolerance and a generic diagnosis outside mapped errors", () => {
    const fixture = QUESTOES_CALCULO.find((item) => item.id === "calc-lei1-f-01");
    if (!fixture) throw new Error("Expected calculation fixture was not found.");
    const question = { ...fixture, valorCorreto: 100, toleranciaPercent: undefined };

    expect(registrarRespostaCalculo(question, 101.99, 10)).toEqual({ correta: true });
    expect(registrarRespostaCalculo(question, 50, 10)).toEqual({
      correta: false,
      diagnostico: expect.stringContaining("isolar a incógnita"),
    });
  });

  it("matches calculation error bands at both inclusive boundaries", () => {
    const question = QUESTOES_CALCULO.find((item) => item.id === "calc-lei1-f-01");
    if (!question) throw new Error("Expected calculation fixture was not found.");

    expect(registrarRespostaCalculo(question, 15, 10).diagnostico).toContain("dividiu o peso");
    expect(registrarRespostaCalculo(question, 20, 10).diagnostico).toContain("dividiu o peso");
  });

  it("returns a specific calculation diagnosis and filters malformed imported entries", () => {
    const question = QUESTOES_CALCULO.find((item) => item.id === "calc-lei1-f-01");
    if (!question) throw new Error("Expected calculation fixture was not found.");

    expect(registrarRespostaCalculo(question, 0, 12)).toEqual({
      correta: false,
      diagnostico: expect.stringContaining("normal não é nula"),
    });

    window.localStorage.setItem(
      "gravitymind:respostas-calculo",
      JSON.stringify([{ questaoId: "x", valorDigitado: "30", correta: true }]),
    );
    expect(obterHistoricoCalculo()).toEqual([]);
  });
});
