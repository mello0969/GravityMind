import { QUESTOES } from "./bank";
import { QUESTOES_CALCULO } from "./bank-calculo";
import type { Assunto, Dificuldade, Questao, Resposta } from "./types";

const ASSUNTOS: Assunto[] = ["lei-1", "lei-2", "lei-3"];

type DesempenhoAssunto = {
  assunto: Assunto;
  totalRespostas: number;
  acertos: number;
  taxaAcerto: number;
  tempoMedioSegundos: number;
};

export function assuntoDaQuestao(questaoId: string): Assunto | null {
  const questao = [...QUESTOES, ...QUESTOES_CALCULO].find((item) => item.id === questaoId);
  return questao?.assunto ?? null;
}

function obterQuestoesPorAssunto(assunto: Assunto, dificuldade?: Dificuldade): Questao[] {
  return QUESTOES.filter(
    (questao) =>
      questao.assunto === assunto &&
      (dificuldade === undefined || questao.dificuldade === dificuldade),
  );
}

function ultimaRespostaPorQuestao(historico: Resposta[]) {
  const mapa = new Map<string, Resposta>();
  for (const resposta of historico) mapa.set(resposta.questaoId, resposta);
  return mapa;
}

function pontuarQuestao(questao: Questao, historico: Resposta[], agora: number): number {
  const respostasQuestao = historico.filter((resposta) => resposta.questaoId === questao.id);
  if (respostasQuestao.length === 0) return 120;

  const ultima = respostasQuestao.at(-1);
  if (!ultima) return 120;
  const diasDesdeResposta = Math.max(
    0,
    Math.floor((agora - Date.parse(ultima.respondidoEm)) / 86_400_000),
  );
  let pontos = Math.min(45, diasDesdeResposta * 5);

  if (!ultima.correta && !ultima.corrigida) pontos += 150;
  if (ultima.corrigida) pontos += Math.min(35, diasDesdeResposta * 7);
  if (ultima.correta) pontos -= 20;
  if (ultima.confianca === "baixa") pontos += 20;
  if (ultima.confianca === "alta" && !ultima.correta) pontos += 15;

  const questoesMesmoSubassunto = new Set(
    QUESTOES.filter((item) => item.subassunto === questao.subassunto).map((item) => item.id),
  );
  const respostasSubassunto = historico.filter((resposta) =>
    questoesMesmoSubassunto.has(resposta.questaoId),
  );
  if (respostasSubassunto.length >= 2) {
    const taxa =
      respostasSubassunto.filter((resposta) => resposta.correta || resposta.corrigida).length /
      respostasSubassunto.length;
    pontos += Math.round((1 - taxa) * 40);
  }

  return pontos;
}

export function escolherProximaQuestao(
  assunto: Assunto | "misto",
  dificuldade: Dificuldade,
  excluirIds: string[] = [],
  historico: Resposta[] = [],
): Questao | null {
  const assuntoEfetivo = assunto === "misto" ? escolherAssuntoAdaptativo(historico) : assunto;
  const doNivel = obterQuestoesPorAssunto(assuntoEfetivo, dificuldade);
  const todasDoAssunto = obterQuestoesPorAssunto(assuntoEfetivo);
  const base = doNivel.length > 0 ? doNivel : todasDoAssunto;
  const semRepetir = base.filter((questao) => !excluirIds.includes(questao.id));
  const candidatas = semRepetir.length > 0 ? semRepetir : base;
  const agora = Date.now();

  return (
    [...candidatas].sort((a, b) => {
      const diferenca = pontuarQuestao(b, historico, agora) - pontuarQuestao(a, historico, agora);
      return diferenca || a.id.localeCompare(b.id);
    })[0] ?? null
  );
}

export function escolherProximaQuestaoMecanica(
  dificuldade: Dificuldade,
  excluirIds: string[] = [],
  historico: Resposta[] = [],
): Questao | null {
  const mecanica = QUESTOES.filter(
    (questao) => questao.tags.includes("mecânica") && questao.dificuldade === dificuldade,
  );
  const todas = QUESTOES.filter((questao) => questao.tags.includes("mecânica"));
  const base = mecanica.length > 0 ? mecanica : todas;
  const semRepetir = base.filter((questao) => !excluirIds.includes(questao.id));
  const candidatas = semRepetir.length > 0 ? semRepetir : base;
  const agora = Date.now();

  return (
    [...candidatas].sort((a, b) => {
      const diferenca = pontuarQuestao(b, historico, agora) - pontuarQuestao(a, historico, agora);
      return diferenca || a.id.localeCompare(b.id);
    })[0] ?? null
  );
}

export function obterDicasQuestao(questao: Questao): readonly [string, string] {
  if (questao.dicas) return questao.dicas;
  return [
    `Comece identificando ${questao.tags.slice(0, 2).join(" e ")} na situação.`,
    questao.formula
      ? `Escreva ${questao.formula} e confira quais grandezas do enunciado entram nela.`
      : "Separe as forças por corpo e verifique se existe aceleração ou equilíbrio.",
  ];
}

export function contarRevisoesPendentes(assunto?: Assunto, respostas: Resposta[] = []): number {
  const historico = respostas.filter(
    (resposta) => !assunto || assuntoDaQuestao(resposta.questaoId) === assunto,
  );
  const ultimas = ultimaRespostaPorQuestao(historico);
  return [...ultimas.values()].filter((resposta) => !resposta.correta && !resposta.corrigida)
    .length;
}

export function escolherAssuntoAdaptativo(historico: Resposta[] = []): Assunto {
  const pendencias = ASSUNTOS.map((assunto) => ({
    assunto,
    pendentes: contarRevisoesPendentes(assunto, historico),
  })).sort((a, b) => b.pendentes - a.pendentes);

  if (pendencias[0].pendentes > 0) return pendencias[0].assunto;

  const desempenho = calcularDesempenhoPorAssunto(historico);
  const semPratica = desempenho.find((item) => item.totalRespostas === 0);
  if (semPratica) return semPratica.assunto;

  return [...desempenho].sort((a, b) => {
    if (a.taxaAcerto !== b.taxaAcerto) return a.taxaAcerto - b.taxaAcerto;
    const ultimaA = historico
      .filter((resposta) => assuntoDaQuestao(resposta.questaoId) === a.assunto)
      .at(-1)?.respondidoEm;
    const ultimaB = historico
      .filter((resposta) => assuntoDaQuestao(resposta.questaoId) === b.assunto)
      .at(-1)?.respondidoEm;
    return Date.parse(ultimaA ?? "1970-01-01") - Date.parse(ultimaB ?? "1970-01-01");
  })[0].assunto;
}

export function calcularDesempenhoPorAssunto(historico: Resposta[] = []): DesempenhoAssunto[] {
  return ASSUNTOS.map((assunto) => {
    const respostas = historico.filter(
      (resposta) => assuntoDaQuestao(resposta.questaoId) === assunto,
    );
    const acertos = respostas.filter((resposta) => resposta.correta).length;
    const totalRespostas = respostas.length;
    return {
      assunto,
      totalRespostas,
      acertos,
      taxaAcerto: totalRespostas > 0 ? Math.round((acertos / totalRespostas) * 100) : 0,
      tempoMedioSegundos:
        totalRespostas > 0
          ? Math.round(
              respostas.reduce((total, resposta) => total + resposta.tempoSegundos, 0) /
                totalRespostas,
            )
          : 0,
    };
  });
}

export function identificarPontosFortesEFracos(historico: Resposta[] = []) {
  const desempenho = calcularDesempenhoPorAssunto(historico);
  return {
    desempenho,
    dominados: desempenho.filter((item) => item.totalRespostas >= 4 && item.taxaAcerto >= 75),
    precisamRevisao: desempenho.filter((item) => item.totalRespostas >= 3 && item.taxaAcerto < 60),
  };
}

export function proximoNivel(nivelAnterior: Dificuldade, respostas: Resposta[]): Dificuldade {
  const janela = respostas.slice(-8);
  if (!janela.length) return nivelAnterior;
  const acertos = janela.filter((resposta) => resposta.correta).length;
  const taxa = acertos / janela.length;
  const tempoMedio =
    janela.reduce((total, resposta) => total + resposta.tempoSegundos, 0) / janela.length;
  let nivelNovo = nivelAnterior;

  if (nivelAnterior === "facil" && taxa >= 0.8 && tempoMedio <= 120) nivelNovo = "medio";
  if (nivelAnterior === "medio" && taxa >= 0.75 && tempoMedio <= 150) nivelNovo = "dificil";
  if (nivelAnterior === "medio" && taxa < 0.45) nivelNovo = "facil";
  if (nivelAnterior === "dificil" && taxa < 0.5) nivelNovo = "medio";

  return nivelNovo;
}
