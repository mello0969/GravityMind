/**
 * Sistema de Anotações, Store
 * ----------------------------------------------------------------
 * CRUD completo + autosave + histórico simples + recuperação de conteúdo,
 * tudo em localStorage como camada local-first e sincronizado com a conta
 * autenticada quando o banco está disponível.
 *
 * HISTÓRICO SIMPLES / RECUPERAÇÃO DE CONTEÚDO:
 * Antes de cada autosave sobrescrever o conteúdo de uma nota, guardamos a
 * versão anterior em uma pilha por nota (máx. 10 versões). Isso permite
 * desfazer uma edição ruim ou recuperar um parágrafo apagado por engano,
 * sem precisar de um sistema de versionamento completo.
 */

import { emitProgressUpdated, storageKey } from "@/lib/brand";
import type { HistoricoEdicao, Nota } from "./types";

const NOTAS_KEY = () => storageKey("notas");
const HISTORICO_KEY = () => storageKey("notas-historico");
const MAX_VERSOES_POR_NOTA = 10;

function gerarId(): string {
  return `nota-${crypto.randomUUID()}`;
}

function notaValida(valor: unknown): valor is Nota {
  if (!valor || typeof valor !== "object") return false;
  const nota = valor as Partial<Nota>;
  return (
    typeof nota.id === "string" &&
    nota.id.length <= 96 &&
    (nota.conversaId === undefined ||
      (typeof nota.conversaId === "string" &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(nota.conversaId))) &&
    typeof nota.titulo === "string" &&
    nota.titulo.length <= 160 &&
    typeof nota.conteudo === "string" &&
    nota.conteudo.length <= 40_000 &&
    ["geral", "lei-1", "lei-2", "lei-3"].includes(nota.assunto ?? "") &&
    typeof nota.criadaEm === "string" &&
    !Number.isNaN(Date.parse(nota.criadaEm)) &&
    typeof nota.atualizadaEm === "string" &&
    !Number.isNaN(Date.parse(nota.atualizadaEm))
  );
}

function ler<T>(key: string, padrao: T): T {
  if (typeof window === "undefined") return padrao;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : padrao;
  } catch {
    return padrao;
  }
}

function salvar<T>(key: string, valor: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(valor));
  emitProgressUpdated();
}

// ───────────────────────── CRUD ─────────────────────────

export function listarNotas(): Nota[] {
  const bruto = ler<unknown>(NOTAS_KEY(), []);
  const notas = Array.isArray(bruto) ? bruto.filter(notaValida) : [];
  return notas.sort((a, b) => b.atualizadaEm.localeCompare(a.atualizadaEm));
}

export function criarNota(assunto: Nota["assunto"] = "geral"): Nota {
  const agora = new Date().toISOString();
  const nova: Nota = {
    id: gerarId(),
    titulo: "Nova anotação",
    conteudo: "",
    assunto,
    criadaEm: agora,
    atualizadaEm: agora,
  };
  const notas = listarNotas();
  notas.push(nova);
  salvar(NOTAS_KEY(), notas);
  return nova;
}

export function guardarNota(nota: Nota) {
  if (!notaValida(nota)) throw new Error("Anotação inválida.");
  const notas = listarNotas();
  const existente = notas.find((item) => item.id === nota.id);
  if (existente && existente.atualizadaEm > nota.atualizadaEm) return;
  salvar(NOTAS_KEY(), [nota, ...notas.filter((item) => item.id !== nota.id)]);
}

export function desvincularNotasConversa(conversaId: string) {
  salvar(
    NOTAS_KEY(),
    listarNotas().map((nota) =>
      nota.conversaId === conversaId ? { ...nota, conversaId: undefined } : nota,
    ),
  );
}

/** Atualiza título/conteúdo/assunto de uma nota e registra a versão anterior no histórico. */
export function atualizarNota(
  id: string,
  dados: Partial<Pick<Nota, "titulo" | "conteudo" | "assunto">>,
): Nota | null {
  const notas = listarNotas();
  const idx = notas.findIndex((n) => n.id === id);
  if (idx === -1) return null;

  const anterior = notas[idx];

  // Só vale a pena guardar histórico se o conteúdo de fato mudou.
  if (dados.conteudo !== undefined && dados.conteudo !== anterior.conteudo) {
    registrarVersaoAnterior(id, anterior.conteudo);
  }

  const atualizada: Nota = {
    ...anterior,
    ...(dados.titulo !== undefined
      ? { titulo: dados.titulo.trim().slice(0, 160) || "Sem título" }
      : {}),
    ...(dados.conteudo !== undefined ? { conteudo: dados.conteudo.slice(0, 40_000) } : {}),
    ...(dados.assunto && ["geral", "lei-1", "lei-2", "lei-3"].includes(dados.assunto)
      ? { assunto: dados.assunto }
      : {}),
    atualizadaEm: new Date().toISOString(),
  };
  notas[idx] = atualizada;
  salvar(NOTAS_KEY(), notas);
  return atualizada;
}

export function excluirNota(id: string) {
  const notas = listarNotas().filter((n) => n.id !== id);
  salvar(NOTAS_KEY(), notas);

  const historico = ler<HistoricoEdicao[]>(HISTORICO_KEY(), []).filter((h) => h.notaId !== id);
  salvar(HISTORICO_KEY(), historico);
}

// ───────────────────────── Busca e filtro ─────────────────────────

export function buscarNotas(termo: string, assunto?: Nota["assunto"]): Nota[] {
  const termoNormalizado = termo.trim().toLowerCase();
  return listarNotas().filter((n) => {
    const passaAssunto = assunto ? n.assunto === assunto : true;
    const passaBusca =
      termoNormalizado.length === 0 ||
      n.titulo.toLowerCase().includes(termoNormalizado) ||
      n.conteudo.toLowerCase().includes(termoNormalizado);
    return passaAssunto && passaBusca;
  });
}

// ───────────────────────── Histórico simples / recuperação ─────────────────────────

function registrarVersaoAnterior(notaId: string, conteudoAnterior: string) {
  // Não vale a pena guardar versões vazias (ex: nota recém-criada).
  if (conteudoAnterior.trim().length === 0) return;

  const historico = ler<HistoricoEdicao[]>(HISTORICO_KEY(), []);
  historico.push({
    notaId,
    conteudoAnterior,
    salvoEm: new Date().toISOString(),
  });

  // Mantém só as últimas MAX_VERSOES_POR_NOTA versões de cada nota, pra não crescer sem limite.
  const dessaNota = historico.filter((h) => h.notaId === notaId);
  if (dessaNota.length > MAX_VERSOES_POR_NOTA) {
    const excedente = dessaNota.length - MAX_VERSOES_POR_NOTA;
    const idsParaRemover = new Set(dessaNota.slice(0, excedente).map((h) => h.salvoEm));
    const filtrado = historico.filter(
      (h) => !(h.notaId === notaId && idsParaRemover.has(h.salvoEm)),
    );
    salvar(HISTORICO_KEY(), filtrado);
  } else {
    salvar(HISTORICO_KEY(), historico);
  }
}

export function obterHistoricoDaNota(notaId: string): HistoricoEdicao[] {
  return ler<HistoricoEdicao[]>(HISTORICO_KEY(), [])
    .filter((h) => h.notaId === notaId)
    .sort((a, b) => b.salvoEm.localeCompare(a.salvoEm));
}

/** Restaura uma versão anterior do conteúdo, guardando a versão atual no histórico antes de sobrescrever. */
export function restaurarVersao(notaId: string, conteudoParaRestaurar: string): Nota | null {
  return atualizarNota(notaId, { conteudo: conteudoParaRestaurar });
}
