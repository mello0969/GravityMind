/**
 * Sistema de Anotações, Tipos
 * ----------------------------------------------------------------
 * Assim como o histórico de questões, as notas vivem hoje no
 * localStorage (sem backend). A interface foi pensada para que
 * trocar por uma API depois seja só trocar `store.ts`.
 */

import type { Assunto } from "@/lib/questions/types";

export type Nota = {
  id: string;
  conversaId?: string;
  titulo: string;
  conteudo: string;
  /** Assunto ao qual a nota está vinculada, ou "geral" se não for específica de uma Lei */
  assunto: Assunto | "geral";
  criadaEm: string; // ISO date
  atualizadaEm: string; // ISO date
};

export type HistoricoEdicao = {
  notaId: string;
  conteudoAnterior: string;
  salvoEm: string; // ISO date
};
