/**
 * Progresso de Lições, Tracking
 * ----------------------------------------------------------------
 * Antes, o progresso por Lei (80%/35%/0%) era um número fixo no
 * dashboard, sem relação com o que o aluno de fato fez. Este módulo
 * registra marcos reais de cada lição (leu o texto, ouviu a narração,
 * assistiu o vídeo, leu o resumo, viu o diagrama visual, viu a animação)
 * e calcula o percentual a partir disso.
 *
 * Cada Lei tem os mesmos marcos possíveis, com pesos iguais entre eles.
 * Ao adicionar "resumo", "visual" e "animacao" (múltiplos formatos de
 * conteúdo), o denominador passou de 3 para 6, quem já tinha os 3
 * marcos antigos passa a ver 50% em vez de 100%, o que é correto: agora
 * há mais formas de estudar a lição, e "completo" passou a abranger todas.
 */

import { emitProgressUpdated, storageKey } from "@/lib/brand";
import type { Assunto } from "@/lib/questions/types";

export type MarcoLicao = "texto" | "narracao" | "video" | "resumo" | "visual" | "animacao";

export const MARCOS_ATIVOS: MarcoLicao[] = ["texto", "resumo", "visual", "animacao"];
const STORAGE_KEY = () => storageKey("progresso-licoes");
const TODOS_MARCOS: MarcoLicao[] = ["texto", "narracao", "video", "resumo", "visual", "animacao"];

type EstadoProgresso = Record<Assunto, MarcoLicao[]>;

function lerEstado(): EstadoProgresso {
  const padrao: EstadoProgresso = { "lei-1": [], "lei-2": [], "lei-3": [] };
  if (typeof window === "undefined") return padrao;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY());
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return padrao;
    }
    const valores = parsed as Record<string, unknown>;
    for (const assunto of Object.keys(padrao) as Assunto[]) {
      const marcos = valores[assunto];
      if (!Array.isArray(marcos)) continue;
      padrao[assunto] = [
        ...new Set(
          marcos.filter(
            (marco): marco is MarcoLicao =>
              typeof marco === "string" && TODOS_MARCOS.includes(marco as MarcoLicao),
          ),
        ),
      ];
    }
    return padrao;
  } catch {
    return padrao;
  }
}

function salvarEstado(estado: EstadoProgresso) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY(), JSON.stringify(estado));
  emitProgressUpdated();
}

export function marcarConcluido(assunto: Assunto, marco: MarcoLicao) {
  const estado = lerEstado();
  if (!estado[assunto].includes(marco)) {
    estado[assunto] = [...estado[assunto], marco];
    salvarEstado(estado);
  }
}

export function marcosConcluidos(assunto: Assunto): MarcoLicao[] {
  return lerEstado()[assunto];
}

export function percentualLicao(assunto: Assunto): number {
  const concluidos = marcosConcluidos(assunto).filter((marco) => MARCOS_ATIVOS.includes(marco));
  return Math.round((concluidos.length / MARCOS_ATIVOS.length) * 100);
}

export function todasLicoes(): {
  assunto: Assunto;
  percentual: number;
  concluida: boolean;
}[] {
  const assuntos: Assunto[] = ["lei-1", "lei-2", "lei-3"];
  return assuntos.map((assunto) => {
    const percentual = percentualLicao(assunto);
    return { assunto, percentual, concluida: percentual === 100 };
  });
}
