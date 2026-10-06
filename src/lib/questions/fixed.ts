import type { Assunto, Dificuldade, QuestionScope } from "./types";

export function escolherQuestaoFixa<
  T extends { id: string; assunto: Assunto; dificuldade: Dificuldade },
>(banco: T[], assunto: QuestionScope, dificuldade: Dificuldade, excluirIds: string[]): T | null {
  const pool = banco.filter(
    (questao) =>
      questao.dificuldade === dificuldade &&
      (assunto === "misto" || assunto === "mecanica" || questao.assunto === assunto),
  );
  return pool.find((questao) => !excluirIds.includes(questao.id)) ?? pool[0] ?? null;
}
