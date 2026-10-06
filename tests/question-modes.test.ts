import { describe, expect, it } from "vitest";

import { nivelDoHistorico, selecionarAdaptativa } from "@/lib/questions/adaptive";
import { QUESTOES } from "@/lib/questions/bank";
import { QUESTOES_CALCULO } from "@/lib/questions/bank-calculo";
import { escolherQuestaoFixa } from "@/lib/questions/fixed";
import type { Resposta } from "@/lib/questions/types";

const questionId = QUESTOES.find((q) => q.assunto === "lei-2")?.id ?? "";
const history = (results: boolean[]): Resposta[] =>
  results.map((correta, i) => ({
    questaoId: questionId,
    correta,
    letraEscolhida: "A",
    tempoSegundos: 30,
    respondidoEm: new Date(Date.UTC(2026, 8, 29, 10, i)).toISOString(),
  }));
describe("fixed and adaptive practice are distinct modes", () => {
  it.each(["facil", "medio", "dificil"] as const)(
    "keeps fixed %s across the pool, with no adaptive fallback",
    (level) => {
      const excluded: string[] = [];
      for (let i = 0; i < 20; i++) {
        const question = escolherQuestaoFixa(QUESTOES, "lei-2", level, excluded);
        expect(question?.dificuldade).toBe(level);
        expect(question?.assunto).toBe("lei-2");
        if (!question) throw new Error("Missing fixed-difficulty question");
        excluded.push(question.id);
      }
      expect(escolherQuestaoFixa([], "misto", level, [])).toBeNull();
      expect(escolherQuestaoFixa(QUESTOES_CALCULO, "misto", level, [])?.dificuldade).toBe(level);
    },
  );
  it("only increases adaptive difficulty at five-response checkpoints", () => {
    expect(nivelDoHistorico("lei-2", history(Array(4).fill(true)))).toBe("facil");
    expect(nivelDoHistorico("lei-2", history(Array(5).fill(true)))).toBe("medio");
    expect(nivelDoHistorico("lei-2", history(Array(10).fill(true)))).toBe("dificil");
    expect(nivelDoHistorico("lei-1", history(Array(10).fill(true)))).toBe("facil");
  });
  it("reduces the level when subsequent responses show difficulty", () => {
    const answers = history([...Array(10).fill(true), ...Array(5).fill(false)]);
    expect(nivelDoHistorico("lei-2", answers)).toBe("medio");
  });
  it("selects an appropriately difficult MC or calculation from local history", () => {
    for (const tipo of ["multipla", "calculo"] as const) {
      const result = selecionarAdaptativa({
        assunto: "lei-2",
        tipo,
        excluirIds: [],
        historico: history(Array(10).fill(true)).reverse(),
      });
      expect(result.tipo).toBe(tipo);
      expect(result.questao?.dificuldade).toBe("dificil");
      expect(result.questao?.assunto).toBe("lei-2");
    }
  });
});
