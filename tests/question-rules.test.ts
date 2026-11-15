// @vitest-environment node
import { describe, expect, it } from "vitest";
import { nivelDoHistorico, selecionarAdaptativa } from "@/lib/questions/adaptive";
import { QUESTOES_CALCULO } from "@/lib/questions/bank-calculo";
import { verificarRespostaCalculo } from "@/lib/questions/calculation";
import {
  contarRevisoesPendentes,
  escolherAssuntoAdaptativo,
  proximoNivel,
} from "@/lib/questions/engine";
import type { Resposta } from "@/lib/questions/types";

describe("question rules without a browser or persistence", () => {
  const history: Resposta[] = Array.from({ length: 10 }, (_, i) => ({
    questaoId: "lei1-f-01",
    letraEscolhida: "A",
    correta: true,
    tempoSegundos: 30,
    respondidoEm: `2026-11-${String(i + 1).padStart(2, "0")}T12:00:00Z`,
  }));

  it("reconstructs difficulty at five-answer checkpoints using the supplied history", () => {
    expect(typeof window).toBe("undefined");
    expect(nivelDoHistorico("lei-1", history.slice(0, 4))).toBe("facil");
    expect(nivelDoHistorico("lei-1", history.slice(0, 5))).toBe("medio");
    expect(nivelDoHistorico("lei-1", history)).toBe("dificil");
    expect(proximoNivel("dificil", [])).toBe("dificil");
    expect(
      proximoNivel(
        "dificil",
        history.map((r) => ({ ...r, correta: false })),
      ),
    ).toBe("medio");
  });

  it("prioritizes unresolved mistakes without reading or mutating stored history", () => {
    const wrong: Resposta[] = [{ ...history[0], questaoId: "lei2-f-01", correta: false }];
    expect(contarRevisoesPendentes("lei-2", wrong)).toBe(1);
    expect(escolherAssuntoAdaptativo(wrong)).toBe("lei-2");
    const next = selecionarAdaptativa({
      assunto: "misto",
      tipo: "multipla",
      excluirIds: [],
      historico: wrong,
    });
    expect(next.questao?.id).toBe("lei2-f-01");
    expect(wrong[0].corrigida).toBeUndefined();
    expect(contarRevisoesPendentes("lei-2", [{ ...wrong[0], corrigida: true }])).toBe(0);
  });

  it("checks numeric tolerance and feedback without writing a response", () => {
    const question = QUESTOES_CALCULO[0];
    const before = structuredClone(question);
    expect(verificarRespostaCalculo(question, question.valorCorreto)).toEqual({ correta: true });
    expect(verificarRespostaCalculo(question, Number.NaN).correta).toBe(false);
    expect(
      verificarRespostaCalculo(
        question,
        question.valorCorreto + Math.max(1, Math.abs(question.valorCorreto)),
      ),
    ).toMatchObject({ correta: false, diagnostico: expect.any(String) });
    expect(question).toEqual(before);
  });
});
