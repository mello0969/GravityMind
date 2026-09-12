import { emitProgressUpdated, storageKey } from "@/lib/brand";
import { QUESTOES } from "./bank";
import { QUESTOES_CALCULO } from "./bank-calculo";
import type { Assunto, Dificuldade, Questao, Resposta } from "./types";

const STORAGE_KEY = storageKey("respostas");
const DIFICULDADE_KEY = storageKey("dificuldade-adaptativa");
const ADAPTACAO_META_KEY = storageKey("adaptacao-meta");
const MAX_HISTORICO = 2_000;
const ASSUNTOS: Assunto[] = ["lei-1", "lei-2", "lei-3"];
const DIFICULDADES: Dificuldade[] = ["facil", "medio", "dificil"];

type DesempenhoAssunto = {
  assunto: Assunto;
  totalRespostas: number;
  acertos: number;
  taxaAcerto: number;
  tempoMedioSegundos: number;
};

type MetaAdaptacao = Record<Assunto, { respostasAvaliadas: number }>;

function armazenamentoDisponivel() {
  return typeof window !== "undefined";
}

function ehResposta(valor: unknown): valor is Resposta {
  if (!valor || typeof valor !== "object") return false;
  const resposta = valor as Partial<Resposta>;
  return (
    typeof resposta.questaoId === "string" &&
    resposta.questaoId.length > 0 &&
    resposta.questaoId.length <= 80 &&
    ["A", "B", "C", "D", "CALC"].includes(resposta.letraEscolhida ?? "") &&
    typeof resposta.correta === "boolean" &&
    typeof resposta.tempoSegundos === "number" &&
    Number.isFinite(resposta.tempoSegundos) &&
    resposta.tempoSegundos >= 0 &&
    resposta.tempoSegundos <= 7_200 &&
    typeof resposta.respondidoEm === "string" &&
    !Number.isNaN(Date.parse(resposta.respondidoEm)) &&
    (resposta.confianca === undefined || ["baixa", "media", "alta"].includes(resposta.confianca)) &&
    (resposta.corrigida === undefined || typeof resposta.corrigida === "boolean")
  );
}

function lerJSON<T>(chave: string, padrao: T): T {
  if (!armazenamentoDisponivel()) return padrao;
  try {
    const valor = window.localStorage.getItem(chave);
    return valor ? (JSON.parse(valor) as T) : padrao;
  } catch {
    return padrao;
  }
}

function salvarHistorico(historico: Resposta[]) {
  if (!armazenamentoDisponivel()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(historico.slice(-MAX_HISTORICO)));
  emitProgressUpdated();
}

function assuntoDaQuestao(questaoId: string): Assunto | null {
  const questao = [...QUESTOES, ...QUESTOES_CALCULO].find((item) => item.id === questaoId);
  return questao?.assunto ?? null;
}

function nivelPadrao(): Record<Assunto, Dificuldade> {
  return { "lei-1": "facil", "lei-2": "facil", "lei-3": "facil" };
}

function lerDificuldades(): Record<Assunto, Dificuldade> {
  const salvas = lerJSON<Partial<Record<Assunto, Dificuldade>>>(DIFICULDADE_KEY, {});
  const resultado = nivelPadrao();
  for (const assunto of ASSUNTOS) {
    const dificuldadeSalva = salvas[assunto];
    if (dificuldadeSalva && DIFICULDADES.includes(dificuldadeSalva)) {
      resultado[assunto] = dificuldadeSalva;
    }
  }
  return resultado;
}

function salvarDificuldades(niveis: Record<Assunto, Dificuldade>) {
  if (!armazenamentoDisponivel()) return;
  window.localStorage.setItem(DIFICULDADE_KEY, JSON.stringify(niveis));
}

function lerMetaAdaptacao(): MetaAdaptacao {
  const padrao: MetaAdaptacao = {
    "lei-1": { respostasAvaliadas: 0 },
    "lei-2": { respostasAvaliadas: 0 },
    "lei-3": { respostasAvaliadas: 0 },
  };
  const valor = lerJSON<Partial<MetaAdaptacao>>(ADAPTACAO_META_KEY, {});
  for (const assunto of ASSUNTOS) {
    const contagem = valor[assunto]?.respostasAvaliadas;
    if (typeof contagem === "number" && Number.isInteger(contagem) && contagem >= 0) {
      padrao[assunto].respostasAvaliadas = contagem;
    }
  }
  return padrao;
}

function salvarMetaAdaptacao(meta: MetaAdaptacao) {
  if (!armazenamentoDisponivel()) return;
  window.localStorage.setItem(ADAPTACAO_META_KEY, JSON.stringify(meta));
}

export function obterHistorico(): Resposta[] {
  const bruto = lerJSON<unknown>(STORAGE_KEY, []);
  if (!Array.isArray(bruto)) return [];
  return bruto.filter(ehResposta).slice(-MAX_HISTORICO);
}

export function registrarResposta(resposta: Resposta) {
  if (!ehResposta(resposta)) return;
  salvarHistorico([...obterHistorico(), resposta]);
}

export function marcarRespostaCorrigida(questaoId: string): boolean {
  const historico = obterHistorico();
  for (let indice = historico.length - 1; indice >= 0; indice -= 1) {
    const resposta = historico[indice];
    if (resposta.questaoId === questaoId && !resposta.correta && !resposta.corrigida) {
      historico[indice] = { ...resposta, corrigida: true };
      salvarHistorico(historico);
      return true;
    }
  }
  return false;
}

export function limparHistorico() {
  if (!armazenamentoDisponivel()) return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(DIFICULDADE_KEY);
  window.localStorage.removeItem(ADAPTACAO_META_KEY);
  emitProgressUpdated();
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
): Questao | null {
  const historico = obterHistorico();
  const assuntoEfetivo = assunto === "misto" ? escolherAssuntoAdaptativo() : assunto;
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
): Questao | null {
  const historico = obterHistorico();
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

export function contarRevisoesPendentes(assunto?: Assunto): number {
  const historico = obterHistorico().filter(
    (resposta) => !assunto || assuntoDaQuestao(resposta.questaoId) === assunto,
  );
  const ultimas = ultimaRespostaPorQuestao(historico);
  return [...ultimas.values()].filter((resposta) => !resposta.correta && !resposta.corrigida)
    .length;
}

export function escolherAssuntoAdaptativo(): Assunto {
  const historico = obterHistorico();
  const pendencias = ASSUNTOS.map((assunto) => ({
    assunto,
    pendentes: contarRevisoesPendentes(assunto),
  })).sort((a, b) => b.pendentes - a.pendentes);

  if (pendencias[0].pendentes > 0) return pendencias[0].assunto;

  const desempenho = calcularDesempenhoPorAssunto();
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

export function calcularDesempenhoPorAssunto(): DesempenhoAssunto[] {
  const historico = obterHistorico();
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

export function identificarPontosFortesEFracos() {
  const desempenho = calcularDesempenhoPorAssunto();
  return {
    desempenho,
    dominados: desempenho.filter((item) => item.totalRespostas >= 4 && item.taxaAcerto >= 75),
    precisamRevisao: desempenho.filter((item) => item.totalRespostas >= 3 && item.taxaAcerto < 60),
  };
}

export function obterDificuldadeAtual(assunto: Assunto): Dificuldade {
  return lerDificuldades()[assunto];
}

export function atualizarDificuldadeAdaptativa(assunto: Assunto): {
  mudou: boolean;
  nivelAnterior: Dificuldade;
  nivelNovo: Dificuldade;
} {
  const niveis = lerDificuldades();
  const nivelAnterior = niveis[assunto];
  const respostas = obterHistorico().filter(
    (resposta) => assuntoDaQuestao(resposta.questaoId) === assunto,
  );
  const meta = lerMetaAdaptacao();

  if (respostas.length < 5 || respostas.length - meta[assunto].respostasAvaliadas < 5) {
    return { mudou: false, nivelAnterior, nivelNovo: nivelAnterior };
  }

  const janela = respostas.slice(-8);
  const acertos = janela.filter((resposta) => resposta.correta).length;
  const taxa = acertos / janela.length;
  const tempoMedio =
    janela.reduce((total, resposta) => total + resposta.tempoSegundos, 0) / janela.length;
  let nivelNovo = nivelAnterior;

  if (nivelAnterior === "facil" && taxa >= 0.8 && tempoMedio <= 120) nivelNovo = "medio";
  if (nivelAnterior === "medio" && taxa >= 0.75 && tempoMedio <= 150) nivelNovo = "dificil";
  if (nivelAnterior === "medio" && taxa < 0.45) nivelNovo = "facil";
  if (nivelAnterior === "dificil" && taxa < 0.5) nivelNovo = "medio";

  meta[assunto].respostasAvaliadas = respostas.length;
  salvarMetaAdaptacao(meta);

  if (nivelNovo !== nivelAnterior) {
    niveis[assunto] = nivelNovo;
    salvarDificuldades(niveis);
  }

  return { mudou: nivelNovo !== nivelAnterior, nivelAnterior, nivelNovo };
}
