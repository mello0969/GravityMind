/**
 * Sistema de Questões, Tipos
 * ----------------------------------------------------------------
 * Banco próprio (estático, em TypeScript) escolhido como estratégia
 * inicial. Ver `bank.ts` para a justificativa completa de design.
 */

export type Dificuldade = "facil" | "medio" | "dificil";

export type Assunto = "lei-1" | "lei-2" | "lei-3";
export type QuestionScope = Assunto | "mecanica" | "misto";

export const ASSUNTO_LABEL: Record<Assunto, string> = {
  "lei-1": "1ª Lei de Newton",
  "lei-2": "2ª Lei de Newton",
  "lei-3": "3ª Lei de Newton",
};

/** Uma alternativa de múltipla escolha, com sua própria explicação. */
type Alternativa = {
  /** "A", "B", "C" ou "D" */
  letra: "A" | "B" | "C" | "D";
  texto: string;
  /**
   * Explicação mostrada SEMPRE após a resposta, esteja ela certa ou errada.
   * Para a correta: conceito + fórmula + raciocínio.
   * Para as incorretas: qual erro conceitual foi cometido e que confusão o
   * gerou, para que o aluno aprenda mesmo quando erra.
   */
  explicacao: string;
};

export type Questao = {
  id: string;
  assunto: Assunto;
  subassunto: string;
  dificuldade: Dificuldade;
  tags: string[];
  enunciado: string;
  /** Fórmula relevante, se houver (renderizada com destaque na UI) */
  formula?: string;
  alternativas: Alternativa[];
  /** Letra da alternativa correta */
  correta: "A" | "B" | "C" | "D";
  /** Duas pistas graduais que orientam sem entregar o gabarito. */
  dicas?: readonly [string, string];
};

/** Um registro individual de resposta do aluno, usado para o histórico. */
export type Resposta = {
  questaoId: string;
  letraEscolhida: "A" | "B" | "C" | "D" | "CALC";
  correta: boolean;
  tempoSegundos: number;
  respondidoEm: string; // ISO date
  confianca?: "baixa" | "media" | "alta";
  corrigida?: boolean;
};

// ───────────────────────── Questões de Cálculo ─────────────────────────

/**
 * Faixa de diagnóstico: se o valor digitado pelo aluno cair dentro de
 * `min` e `max` (inclusive), a mensagem de diagnóstico correspondente é
 * exibida, indicando onde exatamente o raciocínio falhou.
 */
type FaixaErro = {
  min: number;
  max: number;
  /** Ex: "Você esqueceu de subtrair a força de atrito da força aplicada." */
  diagnostico: string;
};

export type QuestaoCalculo = {
  id: string;
  assunto: Assunto;
  subassunto: string;
  dificuldade: Dificuldade;
  tags: string[];
  enunciado: string;
  /** Dados do problema exibidos em destaque (ex: m = 5 kg, F = 20 N) */
  dados: { simbolo: string; valor: string }[];
  formula: string;
  /** Passos de resolução que o aluno deve seguir (exibidos após revelar) */
  passos: { descricao: string; calculo: string }[];
  /** Valor numérico correto */
  valorCorreto: number;
  /** Unidade de medida da resposta (ex: "m/s²", "N", "kg") */
  unidade: string;
  /** Tolerância percentual aceitável (padrão: 2%) */
  toleranciaPercent?: number;
  /** Explicação completa da solução, exibida após a resposta */
  explicacaoFinal: string;
  /** Faixas de diagnóstico para erros comuns */
  faixasErro: FaixaErro[];
};
