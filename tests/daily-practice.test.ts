import { describe, expect, it } from "vitest";
import { dailyPractice } from "@/lib/profile/daily-practice";
import type { Resposta } from "@/lib/questions/types";

describe("daily practice goal", () => {
  it("counts corrections and repeated attempts only once, including calculations", () => {
    const answer: Resposta = {
      questaoId: "lei1-f-01",
      correta: false,
      letraEscolhida: "B",
      tempoSegundos: 10,
      respondidoEm: "2026-11-16T12:00:00Z",
    };
    const history = [
      answer,
      {
        ...answer,
        correta: true,
        letraEscolhida: "A" as const,
        respondidoEm: "2026-11-16T12:01:00Z",
      },
      { ...answer, questaoId: "calc-01", letraEscolhida: "CALC" as const },
    ];
    expect(dailyPractice(history, new Date("2026-11-16T15:00:00Z"))).toEqual({
      todayAnswers: 2,
      todayCorrect: 1,
    });
  });
  it("uses the São Paulo day boundary and excludes invalid timestamps", () => {
    const answer: Resposta = {
      questaoId: "q",
      correta: true,
      letraEscolhida: "A",
      tempoSegundos: 10,
      respondidoEm: "2026-11-17T02:59:00Z",
    };
    expect(
      dailyPractice(
        [answer, { ...answer, questaoId: "invalid", respondidoEm: "invalid" }],
        new Date("2026-11-17T02:59:30Z"),
      ),
    ).toEqual({ todayAnswers: 1, todayCorrect: 1 });
    expect(dailyPractice([answer], new Date("2026-11-17T03:00:00Z"))).toEqual({
      todayAnswers: 0,
      todayCorrect: 0,
    });
  });
});
