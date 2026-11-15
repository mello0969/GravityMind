import { emitProgressUpdated, storageKey } from "@/lib/brand";
import * as rules from "./engine";
import { assuntoDaQuestao } from "./engine";
import type { Assunto, Dificuldade, Resposta } from "./types";

const STORAGE_KEY = () => storageKey("respostas");
const DIFICULDADE_KEY = () => storageKey("dificuldade-adaptativa");
const ADAPTACAO_META_KEY = () => storageKey("adaptacao-meta");
const MAX_HISTORICO = 2_000;
const ASSUNTOS: Assunto[] = ["lei-1", "lei-2", "lei-3"];
const DIFICULDADES: Dificuldade[] = ["facil", "medio", "dificil"];

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
  window.localStorage.setItem(STORAGE_KEY(), JSON.stringify(historico.slice(-MAX_HISTORICO)));
  emitProgressUpdated();
}

function nivelPadrao(): Record<Assunto, Dificuldade> {
  return { "lei-1": "facil", "lei-2": "facil", "lei-3": "facil" };
}

function lerDificuldades(): Record<Assunto, Dificuldade> {
  const salvas = lerJSON<Partial<Record<Assunto, Dificuldade>>>(DIFICULDADE_KEY(), {});
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
  window.localStorage.setItem(DIFICULDADE_KEY(), JSON.stringify(niveis));
}

function lerMetaAdaptacao(): MetaAdaptacao {
  const padrao: MetaAdaptacao = {
    "lei-1": { respostasAvaliadas: 0 },
    "lei-2": { respostasAvaliadas: 0 },
    "lei-3": { respostasAvaliadas: 0 },
  };
  const valor = lerJSON<Partial<MetaAdaptacao>>(ADAPTACAO_META_KEY(), {});
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
  window.localStorage.setItem(ADAPTACAO_META_KEY(), JSON.stringify(meta));
}

export function obterHistorico(): Resposta[] {
  const bruto = lerJSON<unknown>(STORAGE_KEY(), []);
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
  window.localStorage.removeItem(STORAGE_KEY());
  window.localStorage.removeItem(DIFICULDADE_KEY());
  window.localStorage.removeItem(ADAPTACAO_META_KEY());
  emitProgressUpdated();
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

  const nivelNovo = rules.proximoNivel(nivelAnterior, respostas);

  meta[assunto].respostasAvaliadas = respostas.length;
  salvarMetaAdaptacao(meta);

  if (nivelNovo !== nivelAnterior) {
    niveis[assunto] = nivelNovo;
    salvarDificuldades(niveis);
  }

  return { mudou: nivelNovo !== nivelAnterior, nivelAnterior, nivelNovo };
}

// This application service supplies account-scoped history to the pure rules.
export { obterDicasQuestao } from "./engine";
export function escolherProximaQuestao(
  assunto: Assunto | "misto",
  dificuldade: Dificuldade,
  excluirIds: string[] = [],
  historico = obterHistorico(),
) {
  return rules.escolherProximaQuestao(assunto, dificuldade, excluirIds, historico);
}
export function escolherProximaQuestaoMecanica(
  dificuldade: Dificuldade,
  excluirIds: string[] = [],
  historico = obterHistorico(),
) {
  return rules.escolherProximaQuestaoMecanica(dificuldade, excluirIds, historico);
}
export function contarRevisoesPendentes(assunto?: Assunto, respostas = obterHistorico()) {
  return rules.contarRevisoesPendentes(assunto, respostas);
}
export function escolherAssuntoAdaptativo(historico = obterHistorico()) {
  return rules.escolherAssuntoAdaptativo(historico);
}
export function calcularDesempenhoPorAssunto(historico = obterHistorico()) {
  return rules.calcularDesempenhoPorAssunto(historico);
}
export function identificarPontosFortesEFracos() {
  return rules.identificarPontosFortesEFracos(obterHistorico());
}
