import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useBlocker, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { localAccountId } from "@/lib/brand";
import {
  type ConversationSummary,
  type TutorConversation,
  type TutorEntry,
  unwrapTutor,
} from "@/lib/gravity/conversations";
import {
  createTutorConversation,
  deleteTutorConversation,
  listTutorConversations,
  readTutorConversation,
  saveTutorConversation,
} from "@/lib/gravity/conversations.server";
import { desvincularNotasConversa } from "@/lib/notes/store";

export function useTutorWorkspace(userId: string, conversationId?: string) {
  const client = useQueryClient();
  const navigate = useNavigate();
  const listKey = ["tutor-conversations", userId];
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [session, setSession] = useState(0);
  const blocker = useBlocker({
    shouldBlockFn: () => dirty,
    enableBeforeUnload: false,
    withResolver: true,
  });
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState("*");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [dialog, setDialog] = useState<"edit" | "delete" | "reload" | null>(null);
  const [title, setTitle] = useState("");
  const [editFolder, setEditFolder] = useState("");
  const library = useQuery({
    queryKey: listKey,
    queryFn: async () => unwrapTutor(await listTutorConversations({ data: {} })),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
  const selectedId = conversationId ?? library.data?.[0]?.id;
  const chatKey = ["tutor-conversation", userId, selectedId];
  const conversation = useQuery({
    queryKey: chatKey,
    enabled: !!selectedId,
    // Keep the displayed version stable so background refreshes cannot mask a write conflict.
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: async () => {
      if (!selectedId) throw new Error("Selecione uma conversa.");
      return unwrapTutor(await readTutorConversation({ data: { id: selectedId } }));
    },
    retry: false,
  });
  const disabled = busy || working || dirty;
  const folders = [
    ...new Set((library.data ?? []).map((item) => item.pasta).filter(Boolean)),
  ].sort();
  const visible = (library.data ?? []).filter(
    (item) =>
      (folder === "*" || item.pasta === folder) &&
      item.titulo.toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR")),
  );

  function remember(value: TutorConversation) {
    client.setQueryData(["tutor-conversation", userId, value.id], value);
    client.setQueryData<ConversationSummary[]>(listKey, (current = []) => [
      {
        id: value.id,
        titulo: value.titulo,
        pasta: value.pasta,
        versao: value.versao,
        atualizadaEm: value.atualizadaEm,
      },
      ...current.filter((item) => item.id !== value.id),
    ]);
  }
  async function run(action: () => Promise<void>) {
    setWorking(true);
    setError("");
    try {
      await action();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível concluir. Tente novamente.");
    } finally {
      setWorking(false);
    }
  }
  async function create() {
    await run(async () => {
      const value = unwrapTutor(await createTutorConversation({ data: {} }));
      remember(value);
      setFolder("*");
      setSearch("");
      await navigate({ to: "/tutor", search: { conversa: value.id } });
    });
  }
  async function persist(messages: TutorEntry[]) {
    const current = client.getQueryData<TutorConversation>(chatKey);
    if (!current) throw new Error("Reabra a conversa para continuar.");
    const titulo =
      current.titulo === "Nova conversa" && current.mensagens.length === 0
        ? (messages.find((item) => item.role === "user")?.content.slice(0, 100) ?? current.titulo)
        : current.titulo;
    remember(
      unwrapTutor(
        await saveTutorConversation({
          data: {
            id: current.id,
            versao: current.versao,
            pasta: current.pasta,
            titulo,
            mensagens: messages,
          },
        }),
      ),
    );
  }
  async function confirm() {
    await run(async () => {
      const current = client.getQueryData<TutorConversation>(chatKey);
      if (!current) throw new Error("Reabra a conversa para continuar.");
      if (dialog === "reload") {
        remember(unwrapTutor(await readTutorConversation({ data: { id: current.id } })));
        setDirty(false);
        setSession((value) => value + 1);
      } else if (dialog === "delete") {
        unwrapTutor(await deleteTutorConversation({ data: { id: current.id } }));
        if (localAccountId() === userId) desvincularNotasConversa(current.id);
        client.setQueryData<ConversationSummary[]>(listKey, (items = []) =>
          items.filter((item) => item.id !== current.id),
        );
        client.removeQueries({ queryKey: chatKey, exact: true });
        await navigate({ to: "/tutor", search: {} });
      } else {
        remember(
          unwrapTutor(
            await saveTutorConversation({
              data: {
                id: current.id,
                versao: current.versao,
                mensagens: current.mensagens,
                titulo: title.trim(),
                pasta: editFolder.trim(),
              },
            }),
          ),
        );
      }
      setDialog(null);
    });
  }
  return {
    library,
    conversation,
    selectedId,
    disabled,
    visible,
    folders,
    error,
    setError,
    search,
    setSearch,
    folder,
    setFolder,
    libraryOpen,
    setLibraryOpen,
    dialog,
    setDialog,
    title,
    setTitle,
    editFolder,
    setEditFolder,
    working,
    create,
    persist,
    confirm,
    session,
    setBusy,
    setDirty,
    blocker,
    navigate,
  };
}
