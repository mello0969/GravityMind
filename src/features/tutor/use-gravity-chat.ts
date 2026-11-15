import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth/use-auth";
import { localAccountId } from "@/lib/brand";
import { enviarMensagemGravity, type GravityContext } from "@/lib/gravity/client";
import { type TutorEntry, unwrapTutor } from "@/lib/gravity/conversations";
import { saveTutorNote } from "@/lib/gravity/conversations.server";
import { guardarNota } from "@/lib/notes/store";

type ChatEntry = TutorEntry;

export type GravityChatProps = {
  context?: GravityContext;
  sugestoes?: string[];
  alturaMensagens?: string;
  conversationId?: string;
  initialMessages?: ChatEntry[];
  onPersist?: (messages: ChatEntry[]) => Promise<void>;
  onBusyChange?: (busy: boolean) => void;
  onUnsavedChange?: (unsaved: boolean) => void;
  onReload?: () => void;
};

export function useGravityChat({
  context,
  conversationId,
  initialMessages = [],
  onPersist,
  onBusyChange,
  onUnsavedChange,
}: GravityChatProps) {
  const { usuario, carregando: carregandoAuth } = useAuth();
  const [mensagens, setMensagens] = useState<ChatEntry[]>(initialMessages);
  const [input, setInput] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [unsaved, setUnsaved] = useState<ChatEntry[] | null>(null);
  const [notePending, setNotePending] = useState<string | null>(null);
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollSignal = mensagens.at(-1)?.id ?? (carregando ? "loading" : "empty");

  useEffect(() => {
    onUnsavedChange?.(!!unsaved);
    return () => onUnsavedChange?.(false);
  }, [unsaved, onUnsavedChange]);

  useEffect(() => {
    if (scrollSignal === "empty") return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: document.documentElement.dataset.motion === "reduced" ? "auto" : "smooth",
    });
  }, [scrollSignal]);

  async function enviar(texto: string) {
    const textoLimpo = texto.trim().slice(0, 1_500);
    if (!textoLimpo || carregando || !usuario || unsaved) return;
    if (mensagens.length >= 78) {
      setErro("Esta conversa chegou ao limite. Abra uma nova conversa no Tutor para continuar.");
      return;
    }
    const novoHistorico: ChatEntry[] = [
      ...mensagens,
      { id: crypto.randomUUID(), role: "user", content: textoLimpo },
    ];
    setMensagens(novoHistorico);
    setInput("");
    setErro(null);
    setCarregando(true);
    onBusyChange?.(true);
    try {
      if (onPersist) {
        setUnsaved(novoHistorico);
        await onPersist(novoHistorico);
        setUnsaved(null);
      }
      const historicoDaApi = novoHistorico
        .slice(-11)
        .map(({ role, content }) => ({ role, content: content.slice(0, 1500) }));
      const resposta = await enviarMensagemGravity(historicoDaApi, context);
      const completas: ChatEntry[] = [
        ...novoHistorico,
        { id: crypto.randomUUID(), role: "assistant", content: resposta },
      ];
      setMensagens(completas);
      if (onPersist) {
        setUnsaved(completas);
        await onPersist(completas);
        setUnsaved(null);
      }
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível consultar o tutor agora.");
    } finally {
      setCarregando(false);
      onBusyChange?.(false);
    }
  }

  async function retrySave() {
    if (!unsaved || !onPersist) return;
    setCarregando(true);
    onBusyChange?.(true);
    try {
      await onPersist(unsaved);
      setUnsaved(null);
      setErro(null);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Falha ao salvar. Tente novamente.");
    } finally {
      setCarregando(false);
      onBusyChange?.(false);
    }
  }

  async function saveNote(message: ChatEntry, index: number) {
    if (!usuario || notePending) return;
    setNotePending(message.id);
    try {
      const pergunta =
        mensagens
          .slice(0, index)
          .reverse()
          .find((item) => item.role === "user")?.content ?? "";
      const nota = unwrapTutor(
        await saveTutorNote({
          data: { conversaId: conversationId, pergunta, resposta: message.content },
        }),
      );
      // An account switch must never copy a previous account's answer into local notes.
      if (localAccountId() !== usuario.id) return;
      guardarNota(nota);
      setSavedNotes((current) => ({ ...current, [message.id]: nota.id }));
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível salvar a anotação.");
    } finally {
      setNotePending(null);
    }
  }

  return {
    usuario,
    carregandoAuth,
    mensagens,
    setMensagens,
    input,
    setInput,
    carregando,
    erro,
    setErro,
    resetOpen,
    setResetOpen,
    unsaved,
    notePending,
    savedNotes,
    scrollRef,
    enviar,
    retrySave,
    saveNote,
  };
}
