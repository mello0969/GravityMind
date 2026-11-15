import { useState } from "react";
import {
  atualizarNota,
  buscarNotas,
  criarNota,
  excluirNota,
  listarNotas,
  obterHistoricoDaNota,
  restaurarVersao,
} from "@/lib/notes/store";
import type { Nota } from "@/lib/notes/types";
import { useAutosave } from "@/lib/notes/use-autosave";
import type { Assunto } from "@/lib/questions/types";
export type FiltroAssunto = Assunto | "geral" | "todas";

export function useNotes(assuntoInicial?: Assunto, notaInicialId?: string) {
  const [notas, setNotas] = useState(() => listarNotas());
  const [selecionadaId, setSelecionadaId] = useState<string | null>(
    notas.find((item) => item.id === notaInicialId)?.id ?? notas[0]?.id ?? null,
  );
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<FiltroAssunto>(assuntoInicial ?? "todas");
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  // `notas` mantém o componente sincronizado com o armazenamento após cada operação.
  const notasFiltradas = buscarNotas(busca, filtro === "todas" ? undefined : filtro);
  const notaSelecionada = notas.find((nota) => nota.id === selecionadaId) ?? null;

  function recarregar() {
    setNotas(listarNotas());
  }

  function criar() {
    const nova = criarNota(filtro === "todas" ? "geral" : filtro);
    recarregar();
    setSelecionadaId(nova.id);
    setMostrarHistorico(false);
  }

  function excluir(id: string) {
    excluirNota(id);
    const restantes = listarNotas();
    setNotas(restantes);
    if (selecionadaId === id) setSelecionadaId(restantes[0]?.id ?? null);
  }

  return {
    notasFiltradas,
    notaSelecionada,
    selecionadaId,
    setSelecionadaId,
    busca,
    setBusca,
    filtro,
    setFiltro,
    mostrarHistorico,
    setMostrarHistorico,
    recarregar,
    criar,
    excluir,
  };
}

export function useNoteEditor(nota: Nota, onAtualizar: () => void) {
  const [titulo, setTitulo] = useState(nota.titulo);
  const [conteudo, setConteudo] = useState(nota.conteudo);
  const [assunto, setAssunto] = useState<Nota["assunto"]>(nota.assunto);
  const status = useAutosave({ titulo, conteudo, assunto }, (dados) => {
    atualizarNota(nota.id, dados);
    onAtualizar();
  });

  return { titulo, setTitulo, conteudo, setConteudo, assunto, setAssunto, status };
}

export function useNoteHistory(notaId: string, onRestaurado: () => void) {
  return {
    versoes: obterHistoricoDaNota(notaId),
    restaurar(conteudo: string) {
      restaurarVersao(notaId, conteudo);
      onRestaurado();
    },
  };
}
