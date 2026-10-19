import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useBlocker, useNavigate } from "@tanstack/react-router";
import { Folder, MessagesSquare, NotebookPen, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { GravityChat } from "@/components/gravity-chat";
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

export function TutorWorkspace({
  userId,
  conversationId,
}: {
  userId: string;
  conversationId?: string;
}) {
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
  return (
    <div className="gm-conversations">
      <aside
        className="gm-conversation-library"
        aria-label="Suas conversas"
        data-open={libraryOpen}
      >
        <button
          type="button"
          className="ff-btn-primary w-full"
          disabled={disabled}
          onClick={() => void create()}
        >
          <Plus size={18} aria-hidden="true" />
          Nova conversa
        </button>
        <button
          type="button"
          className="gm-mobile-conversations ff-btn-outline"
          aria-expanded={libraryOpen}
          aria-controls="tutor-library"
          onClick={() => setLibraryOpen((open) => !open)}
        >
          <MessagesSquare size={18} aria-hidden="true" />
          Conversas
        </button>
        <div id="tutor-library" className="gm-library-content">
          <div className="ff-input-wrap mt-4">
            <Search aria-hidden="true" />
            <input
              type="search"
              aria-label="Buscar conversas"
              placeholder="Buscar conversas"
              maxLength={100}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ff-input"
            />
          </div>
          <label className="mt-3 block text-xs text-muted-foreground" htmlFor="conversation-folder">
            Assunto
          </label>
          <select
            id="conversation-folder"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="ff-input mt-1 w-full"
          >
            <option value="*">Todos os assuntos</option>
            <option value="">Sem assunto</option>
            {folders.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <div className="gm-conversation-list">
            {library.isPending ? (
              <div
                className="ff-skeleton mt-4 h-20"
                aria-label="Carregando conversas"
                role="status"
              />
            ) : (
              visible.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  aria-current={item.id === selectedId ? "true" : undefined}
                  disabled={disabled}
                  className="gm-conversation-item"
                  onClick={() => {
                    setLibraryOpen(false);
                    void navigate({ to: "/tutor", search: { conversa: item.id } });
                  }}
                >
                  <span>{item.titulo}</span>
                  {item.pasta && (
                    <small>
                      <Folder size={13} aria-hidden="true" />
                      {item.pasta}
                    </small>
                  )}
                </button>
              ))
            )}
            {!library.isPending && !library.isError && !visible.length && (
              <p className="py-6 text-sm text-muted-foreground">
                {search || folder !== "*"
                  ? "Nenhuma conversa encontrada."
                  : "Suas conversas aparecerão aqui."}
              </p>
            )}
          </div>
        </div>
        <Link to="/anotacoes" search={{}} className="gm-notes-link">
          <NotebookPen size={18} aria-hidden="true" />
          Minhas anotações
        </Link>
      </aside>
      <section className="gm-conversation-main" aria-label="Conversa com o Tutor">
        {(error || library.isError || conversation.isError) && (
          <div role="alert" className="mb-4 border border-destructive p-3 text-sm text-destructive">
            {error || conversation.error?.message || library.error?.message}
            {!error && (
              <button
                type="button"
                className="ml-3 underline"
                onClick={() => {
                  void library.refetch();
                  if (selectedId) void conversation.refetch();
                }}
              >
                Tentar novamente
              </button>
            )}
          </div>
        )}
        {selectedId && conversation.isPending ? (
          <div role="status" aria-label="Carregando conversa" className="space-y-5 py-16">
            <div className="ff-skeleton h-6 w-3/4" />
            <div className="ff-skeleton h-28" />
          </div>
        ) : conversation.data ? (
          <>
            <div className="gm-conversation-heading">
              <h2>{conversation.data.titulo}</h2>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  title="Renomear e organizar"
                  aria-label="Renomear e organizar"
                  className="gm-icon-button"
                  disabled={disabled}
                  onClick={() => {
                    setTitle(conversation.data.titulo);
                    setEditFolder(conversation.data.pasta);
                    setError("");
                    setDialog("edit");
                  }}
                >
                  <Pencil size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  title="Excluir conversa"
                  aria-label="Excluir conversa"
                  className="gm-icon-button text-destructive"
                  disabled={disabled}
                  onClick={() => {
                    setError("");
                    setDialog("delete");
                  }}
                >
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
            <GravityChat
              key={`${conversation.data.id}:${session}`}
              conversationId={conversation.data.id}
              initialMessages={conversation.data.mensagens}
              alturaMensagens="var(--tutor-chat-height, min(56dvh, 36rem))"
              onPersist={persist}
              onBusyChange={setBusy}
              onUnsavedChange={setDirty}
              onReload={() => {
                setError("");
                setDialog("reload");
              }}
            />
          </>
        ) : (
          !conversation.isError &&
          !library.isPending && (
            <div className="gm-conversation-start">
              <h2>Qual é sua dúvida?</h2>
              <button
                type="button"
                className="ff-btn-primary"
                disabled={disabled}
                onClick={() => void create()}
              >
                <Plus size={18} aria-hidden="true" />
                Nova conversa
              </button>
            </div>
          )
        )}
        <p className="gm-chat-disclosure">
          O Tutor pode errar. Não envie dados pessoais. <Link to="/privacidade">Privacidade</Link>
        </p>
      </section>
      <ConfirmDialog
        open={dialog !== null}
        onOpenChange={(open) => {
          if (!open) setDialog(null);
        }}
        title={
          dialog === "reload"
            ? "Reabrir conversa?"
            : dialog === "delete"
              ? "Excluir conversa?"
              : "Organizar conversa"
        }
        description={
          dialog === "reload"
            ? "Vamos carregar a última versão salva. Mensagens que não foram salvas neste painel serão descartadas."
            : dialog === "delete"
              ? "A conversa será excluída. As anotações que você salvou serão mantidas."
              : ""
        }
        confirmLabel={
          dialog === "reload"
            ? "Reabrir conversa"
            : dialog === "delete"
              ? "Excluir conversa"
              : "Salvar"
        }
        destructive={dialog === "delete"}
        busy={working}
        confirmDisabled={dialog === "edit" && !title.trim()}
        onConfirm={() => {
          if (dialog !== "edit" || title.trim()) void confirm();
        }}
      >
        {dialog === "edit" && (
          <div className="space-y-4">
            <label className="block text-sm font-medium">
              Nome
              <input
                autoComplete="off"
                className="ff-input mt-2 w-full"
                value={title}
                maxLength={100}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label className="block text-sm font-medium">
              Assunto
              <input
                autoComplete="off"
                className="ff-input mt-2 w-full"
                placeholder="Ex.: Revisão da prova"
                list="tutor-folders"
                value={editFolder}
                maxLength={60}
                onChange={(e) => setEditFolder(e.target.value)}
              />
            </label>
            <datalist id="tutor-folders">
              {folders.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </div>
        )}
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </ConfirmDialog>
      <ConfirmDialog
        open={blocker.status === "blocked"}
        onOpenChange={(open) => {
          if (!open) blocker.reset?.();
        }}
        title="Sair sem salvar?"
        description="Algumas mensagens ainda não foram salvas. Você pode ficar e tentar salvar novamente."
        confirmLabel="Sair sem salvar"
        destructive
        onConfirm={() => blocker.proceed?.()}
      />
    </div>
  );
}
