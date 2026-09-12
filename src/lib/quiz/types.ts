/**
 * Quiz Rápido de Verificação de Conteúdo
 * ----------------------------------------------------------------
 * Cada formato de conteúdo (texto, resumo, visual, vídeo, animação)
 * tem um mini-quiz de 3 perguntas. O aluno só avança o progresso
 * quando acerta pelo menos MINIMO_ACERTOS das perguntas.
 *
 * As perguntas são propositalmente simples, o objetivo não é testar
 * profundidade (isso é papel do sistema de questões), mas confirmar
 * que o aluno de fato leu/assistiu o conteúdo antes de marcar como
 * concluído. Perguntas longas ou difíceis aqui seriam contra-produtivas.
 */

import type { Assunto } from "@/lib/questions/types";

export type FormatoQuiz = "texto" | "resumo" | "visual" | "video";

export const MINIMO_ACERTOS = 2; // de 3

type PerguntaQuiz = {
  id: string;
  pergunta: string;
  opcoes: [string, string, string]; // sempre 3 opções
  correta: 0 | 1 | 2; // índice da opção correta
  explicacao: string; // exibida após responder (certo ou errado)
};

export type QuizFormato = {
  assunto: Assunto;
  formato: FormatoQuiz;
  perguntas: [PerguntaQuiz, PerguntaQuiz, PerguntaQuiz]; // exatamente 3
};

export type RespostaQuiz = {
  perguntaId: string;
  indiceEscolhido: number;
  correta: boolean;
};
