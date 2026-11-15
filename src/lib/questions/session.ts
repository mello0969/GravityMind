import type { Dificuldade } from "./types";

export type PracticeMode = Dificuldade | "adaptativo";
export type TipoQuestao = "multipla" | "calculo";
export type Confianca = "baixa" | "media" | "alta" | "muito-alta";
export type Etapa = "responder" | "corrigir" | "resultado";
export type Letra = "A" | "B" | "C" | "D";

export function pedagogicalAnalysis({
  confidence,
  firstError,
  correct,
}: {
  confidence: Confianca;
  firstError: Letra | null;
  correct: boolean;
}) {
  if (firstError && correct) {
    return "Você revisou a primeira hipótese e recuperou o conceito na segunda tentativa. Esse tipo de correção conta mais do que acertar por acaso.";
  }
  if (!correct && (confidence === "alta" || confidence === "muito-alta")) {
    return "Sua confiança estava alta, mas o modelo mental não previu o resultado. Marque as forças no corpo analisado antes de escolher uma fórmula.";
  }
  if (correct && confidence === "baixa") {
    return "A resposta está correta, mas sua confiança ainda está baixa. Explique em uma frase por que as outras forças não mudam a resultante.";
  }
  if (!correct) {
    return "A dificuldade apareceu na leitura da interação. Refaça o diagrama de corpo livre e nomeie o corpo que recebe cada força.";
  }
  return "Resposta e confiança estão alinhadas. A próxima questão pode exigir o mesmo conceito em outra representação.";
}
