import { QUESTOES } from "./bank";
import { QUESTOES_CALCULO } from "./bank-calculo";
import {
  escolherAssuntoAdaptativo,
  escolherProximaQuestao,
  escolherProximaQuestaoMecanica,
} from "./engine";
import { escolherProximaQuestaoCalculo } from "./engine-calculo";
import type { Assunto, Dificuldade, QuestionScope, Resposta } from "./types";

export function nivelDoHistorico(assunto: Assunto, historico: Resposta[]): Dificuldade {
  const ids = new Set(
    [...QUESTOES, ...QUESTOES_CALCULO].filter((q) => q.assunto === assunto).map((q) => q.id),
  );
  const respostas = historico.filter((r) => ids.has(r.questaoId));
  let nivel: Dificuldade = "facil";
  // Recompute the level at five-response checkpoints from the student's local history.
  for (let end = 5; end <= respostas.length; end += 5) {
    const janela = respostas.slice(Math.max(0, end - 8), end);
    const taxa = janela.filter((r) => r.correta).length / janela.length;
    const tempo = janela.reduce((sum, r) => sum + r.tempoSegundos, 0) / janela.length;
    if (nivel === "facil" && taxa >= 0.8 && tempo <= 120) nivel = "medio";
    else if (nivel === "medio" && taxa >= 0.75 && tempo <= 150) nivel = "dificil";
    else if (nivel === "medio" && taxa < 0.45) nivel = "facil";
    else if (nivel === "dificil" && taxa < 0.5) nivel = "medio";
  }
  return nivel;
}

export function selecionarAdaptativa(input: {
  assunto: QuestionScope;
  tipo: "multipla" | "calculo";
  excluirIds: string[];
  historico: Resposta[];
}) {
  const historico = [...input.historico].sort(
    (a, b) => Date.parse(a.respondidoEm) - Date.parse(b.respondidoEm),
  );
  const assunto =
    input.assunto === "misto" || input.assunto === "mecanica"
      ? escolherAssuntoAdaptativo(historico)
      : input.assunto;
  const nivel = nivelDoHistorico(assunto, historico);
  if (input.tipo === "calculo")
    return {
      tipo: "calculo" as const,
      questao: escolherProximaQuestaoCalculo(assunto, nivel, input.excluirIds),
    };
  return {
    tipo: "multipla" as const,
    questao:
      input.assunto === "mecanica"
        ? escolherProximaQuestaoMecanica(nivel, input.excluirIds, historico)
        : escolherProximaQuestao(assunto, nivel, input.excluirIds, historico),
  };
}
