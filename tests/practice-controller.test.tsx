import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCalculationQuestion } from "@/features/practice/use-calculation-question";
import { useQuestionPractice } from "@/features/practice/use-question-practice";
import { QUESTOES_CALCULO } from "@/lib/questions/bank-calculo";
import { obterHistorico } from "@/lib/questions/practice-service";

vi.mock("@/lib/auth/use-auth", () => ({ useAuth: () => ({ usuario: null }) }));
vi.mock("@/lib/settings/use-site-settings", () => ({
  useSiteSettings: () => ({ sessionMinutes: 10, motion: "reduced", breakReminders: true }),
}));
vi.mock("@/lib/profile/study-profile.server", () => ({ recordStudyActivityServerFn: vi.fn() }));

describe("practice controllers", () => {
  it("tracks the configured session duration and resets only the clock", () => {
    vi.useFakeTimers();
    try {
      const { result, unmount } = renderHook(() =>
        useQuestionPractice({ assunto: "lei-1", initialMode: "facil" }),
      );
      act(() => {
        vi.advanceTimersByTime(599_000);
      });
      expect(result.current.segundosSessao).toBe(599);
      expect(result.current.horaDaPausa).toBe(false);
      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(result.current.horaDaPausa).toBe(true);
      const question = result.current.questaoAtual;
      act(() => result.current.reiniciarTempo());
      expect(result.current.segundosSessao).toBe(0);
      expect(result.current.horaDaPausa).toBe(false);
      expect(result.current.questaoAtual).toBe(question);
      unmount();
    } finally {
      vi.useRealTimers();
    }
  });
  beforeEach(() => {
    localStorage.clear();
  });

  it("keeps the first mistake, limits hints and records the corrected result once", () => {
    const { result } = renderHook(() =>
      useQuestionPractice({ assunto: "lei-1", initialMode: "facil" }),
    );
    const question = result.current.questaoAtual;
    if (!question) throw new Error("Question was not loaded");
    const wrong = question.alternativas.find((a) => a.letra !== question.correta)?.letra;
    if (!wrong) throw new Error("Missing wrong alternative");
    act(() => result.current.useHint());
    act(() => result.current.useHint());
    act(() => result.current.useHint());
    expect(result.current.dicasUsadas).toBe(2);
    expect(result.current.dicasAtuais).toHaveLength(2);
    act(() => result.current.responder(wrong));
    expect(result.current.etapa).toBe("corrigir");
    expect(result.current.sessao.total).toBe(0);
    act(() => result.current.responder(question.correta));
    act(() => result.current.responder(question.correta));
    expect(result.current.sessao).toEqual({ acertos: 1, total: 1, creditos: 11 });
    expect(obterHistorico()).toHaveLength(2);
    expect(obterHistorico()[0].corrigida).toBe(true);
    act(() => result.current.proximaQuestao());
    expect(result.current.questaoAtual?.id).not.toBe(question.id);
    expect(result.current.etapa).toBe("responder");
    expect(result.current.dicasAtuais).toEqual([]);
    expect(result.current.dicasUsadas).toBe(2);
  });

  it("registers a numeric correction in both the history and the session callback", () => {
    const question = QUESTOES_CALCULO[0];
    const recorded = vi.fn();
    const { result } = renderHook(() => useCalculationQuestion(question, recorded));
    act(() => result.current.setInput(String(question.valorCorreto + 10000)));
    act(() => result.current.responder());
    expect(result.current.fase).toBe("corrigindo");
    expect(recorded).not.toHaveBeenCalled();
    act(() => result.current.setInput(String(question.valorCorreto).replace(".", ",")));
    act(() => result.current.responder());
    act(() => result.current.responder());
    expect(result.current.fase).toBe("resultado");
    expect(recorded).toHaveBeenCalledExactlyOnceWith(true);
    expect(obterHistorico()).toHaveLength(2);
    expect(obterHistorico()[0].corrigida).toBe(true);
  });
});
