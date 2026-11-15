import { Link } from "@tanstack/react-router";
import { AlertCircle, NotebookPen, RotateCcw, Send } from "lucide-react";
import type { ReactNode } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { type GravityChatProps, useGravityChat } from "@/features/tutor/use-gravity-chat";
import { useAuth } from "@/lib/auth/use-auth";

const SUGESTOES_PADRAO = [
  "Por que a inércia depende da massa?",
  "Dê um exemplo cotidiano da 3ª Lei",
  "Ajude a interpretar F = m · a",
];

function TutorMessage({ content }: { content: string }) {
  const parts: ReactNode[] = [];
  let cursor = 0;
  // Only bold is supported; all other content stays escaped React text, never HTML.
  for (const match of content.matchAll(/\*\*([^*\n]+)\*\*/g)) {
    parts.push(content.slice(cursor, match.index));
    parts.push(
      <strong key={match.index} className="font-semibold">
        {match[1]}
      </strong>,
    );
    cursor = match.index + match[0].length;
  }
  return (
    <>
      {parts}
      {content.slice(cursor)}
    </>
  );
}

export function GravityChat(props: GravityChatProps) {
  const { usuario } = useAuth();
  return (
    <GravityChatSession
      key={`${usuario?.id ?? "guest"}:${props.conversationId ?? "local"}`}
      {...props}
    />
  );
}

function GravityChatSession({
  context,
  sugestoes = SUGESTOES_PADRAO,
  alturaMensagens = "360px",
  conversationId,
  initialMessages = [],
  onPersist,
  onBusyChange,
  onUnsavedChange,
  onReload,
}: GravityChatProps) {
  const {
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
  } = useGravityChat({
    context,
    conversationId,
    initialMessages,
    onPersist,
    onBusyChange,
    onUnsavedChange,
  });

  if (carregandoAuth) {
    return (
      <div role="status" aria-label="Carregando Tutor" className="space-y-4 py-16">
        <div className="ff-skeleton h-7 w-2/3" />
        <div className="ff-skeleton h-4 w-full" />
        <div className="ff-skeleton h-4 w-4/5" />
      </div>
    );
  }
  if (!usuario) {
    return (
      <section className="gm-tutor-signin">
        <h2>Suas dúvidas têm espaço aqui.</h2>
        <p>
          Entre na sua conta gratuita para conversar com o Tutor. O acesso tem limites de uso e
          depende da disponibilidade do serviço.
        </p>
        <Link to="/login" className="ff-btn-primary">
          Entrar para conversar
        </Link>
        <Link to="/cadastro" className="gm-text-link">
          Criar conta gratuita
        </Link>
      </section>
    );
  }

  return (
    <div className="flex flex-col">
      <div
        ref={scrollRef}
        role="log"
        aria-label="Mensagens da conversa"
        aria-live="polite"
        className="space-y-3 overflow-y-auto"
        style={{ height: alturaMensagens }}
      >
        {mensagens.length === 0 && (
          <div className="gm-chat-empty flex h-full flex-col justify-center">
            <span className="gm-chat-emblem mx-auto" aria-hidden="true">
              G
            </span>
            <p className="text-xl font-semibold">Qual é sua dúvida?</p>
            <div className="mt-4 grid gap-2">
              {sugestoes.map((sugestao) => (
                <button
                  type="button"
                  key={sugestao}
                  onClick={() => void enviar(sugestao)}
                  className="min-h-11 border border-border px-4 py-3 text-left text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  {sugestao}
                </button>
              ))}
            </div>
          </div>
        )}

        {mensagens.map((mensagem, index) => (
          <div
            key={mensagem.id}
            className={
              mensagem.role === "user" ? "flex flex-col items-end" : "flex flex-col items-start"
            }
          >
            <div
              className={`gm-chat-message max-w-[88%] whitespace-pre-wrap break-words border px-3 py-2.5 text-sm leading-relaxed ${
                mensagem.role === "user"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-secondary text-foreground"
              }`}
            >
              {mensagem.role === "assistant" ? (
                <TutorMessage content={mensagem.content} />
              ) : (
                mensagem.content
              )}
            </div>
            {mensagem.role === "assistant" &&
              (savedNotes[mensagem.id] ? (
                <Link
                  to="/anotacoes"
                  search={{ nota: savedNotes[mensagem.id] }}
                  className="gm-save-note"
                >
                  <NotebookPen size={16} aria-hidden="true" /> Abrir anotação
                </Link>
              ) : (
                <button
                  type="button"
                  className="gm-save-note"
                  disabled={!!notePending || carregando}
                  onClick={() => void saveNote(mensagem, index)}
                >
                  <NotebookPen size={16} aria-hidden="true" />
                  {notePending === mensagem.id ? "Salvando..." : "Salvar em Anotações"}
                </button>
              ))}
          </div>
        ))}

        {carregando && (
          <div
            className="max-w-[70%] border border-border bg-secondary p-3"
            role="status"
            aria-label="Tutor respondendo"
          >
            <div className="ff-skeleton h-3 w-4/5" />
            <div className="ff-skeleton mt-2 h-3 w-3/5" />
          </div>
        )}

        {erro && (
          <div
            role="alert"
            className="flex items-start gap-2 border border-destructive px-3 py-2.5 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {erro}
            {unsaved && (
              <button
                type="button"
                className="underline"
                disabled={carregando}
                onClick={() => void retrySave()}
              >
                Tentar salvar
              </button>
            )}
            {unsaved && onReload && (
              <button type="button" className="underline" disabled={carregando} onClick={onReload}>
                Reabrir conversa
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
        {mensagens.length > 0 && !conversationId && (
          <button
            type="button"
            onClick={() => setResetOpen(true)}
            title="Reiniciar conversa"
            disabled={carregando}
            aria-label="Reiniciar conversa"
            className="grid h-10 w-10 shrink-0 place-items-center border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
        <input
          aria-label="Sua pergunta de Física"
          value={input}
          onChange={(evento) => setInput(evento.target.value.slice(0, 1_500))}
          onKeyDown={(evento) => {
            if (evento.key === "Enter" && !evento.shiftKey) {
              evento.preventDefault();
              void enviar(input);
            }
          }}
          maxLength={1_500}
          placeholder="Pergunte sobre Física"
          disabled={carregando || !!unsaved}
          className="ff-input flex-1"
        />
        <button
          type="button"
          onClick={() => void enviar(input)}
          disabled={carregando || !!unsaved || !input.trim()}
          className="grid h-11 w-11 shrink-0 place-items-center bg-primary text-primary-foreground disabled:opacity-40"
          aria-label="Enviar pergunta"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <ConfirmDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Limpar esta conversa?"
        description="As mensagens deste painel serão removidas. Para guardar conversas, use a página Tutor."
        confirmLabel="Limpar conversa"
        destructive
        onConfirm={() => {
          setMensagens([]);
          setErro(null);
          setResetOpen(false);
        }}
      />
    </div>
  );
}
