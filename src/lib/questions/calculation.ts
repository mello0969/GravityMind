import { QUESTOES_CALCULO } from "./bank-calculo";
import type { Assunto, Dificuldade, QuestaoCalculo } from "./types";

function obterQuestoesCalculoPorAssunto(
  assunto: Assunto,
  dificuldade?: Dificuldade,
): QuestaoCalculo[] {
  return QUESTOES_CALCULO.filter(
    (q) => q.assunto === assunto && (dificuldade ? q.dificuldade === dificuldade : true),
  );
}

export function escolherProximaQuestaoCalculo(
  assunto: Assunto,
  dificuldade: Dificuldade,
  excluirIds: string[] = [],
): QuestaoCalculo | null {
  const candidatas = obterQuestoesCalculoPorAssunto(assunto, dificuldade).filter(
    (q) => !excluirIds.includes(q.id),
  );
  const pool =
    candidatas.length > 0 ? candidatas : obterQuestoesCalculoPorAssunto(assunto, dificuldade);
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ───────────────────────── Verificação de resposta ─────────────────────────

export type ResultadoVerificacao = {
  correta: boolean;
  /** Se correta: undefined. Se errada: diagnóstico da faixa de erro, ou mensagem genérica. */
  diagnostico?: string;
};

export function verificarRespostaCalculo(
  questao: QuestaoCalculo,
  valorDigitado: number,
): ResultadoVerificacao {
  const tolerancia = questao.toleranciaPercent ?? 2;
  const margemAbsoluta = Math.abs(questao.valorCorreto) * (tolerancia / 100);
  const correta = Math.abs(valorDigitado - questao.valorCorreto) <= margemAbsoluta;

  if (correta) return { correta: true };

  // Procura um diagnóstico específico para o valor digitado
  const faixaEncontrada = questao.faixasErro.find(
    (f) => valorDigitado >= f.min && valorDigitado <= f.max,
  );

  return {
    correta: false,
    diagnostico:
      faixaEncontrada?.diagnostico ??
      "O valor ainda não fecha com os dados. Confira a operação usada para isolar a incógnita e a unidade final.",
  };
}
