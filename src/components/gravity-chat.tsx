import { Link } from "@tanstack/react-router";
import { AlertCircle, RotateCcw, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth/use-auth";
import {
  enviarMensagemGravity,
  type GravityContext,
  GravityError,
  type GravityMessage,
} from "@/lib/gravity/client";

const SUGESTOES_PADRAO = [
  "Por que a inércia depende da massa?",
  "Dê um exemplo cotidiano da 3ª Lei",
  "Ajude a interpretar F = m · a",
];

type ChatEntry = GravityMessage & { id: string };

type GravityChatProps = {
  context?: GravityContext;
  sugestoes?: string[];
  alturaMensagens?: string;
};

export function GravityChat(props: GravityChatProps) {
  const { usuario } = useAuth();
  return <GravityChatSession key={usuario?.id ?? "guest"} {...props} />;
}

function GravityChatSession({
  context,
  sugestoes = SUGESTOES_PADRAO,
  alturaMensagens = "360px",
}: GravityChatProps) {
  const { usuario, carregando: carregandoAuth } = useAuth();
  const [mensagens, setMensagens] = useState<ChatEntry[]>([]);
  const [input, setInput] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollSignal = mensagens.at(-1)?.id ?? (carregando ? "loading" : "empty");

  useEffect(() => {
    if (scrollSignal === "empty") return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: document.documentElement.dataset.motion === "reduced" ? "auto" : "smooth",
    });
  }, [scrollSignal]);

  async function enviar(texto: string) {
    const textoLimpo = texto.trim().slice(0, 1_500);
    if (!textoLimpo || carregando || !usuario) return;
    const novoHistorico: ChatEntry[] = [
      ...mensagens,
      { id: crypto.randomUUID(), role: "user", content: textoLimpo },
    ];
    setMensagens(novoHistorico);
    setInput("");
    setErro(null);
    setCarregando(true);
    try {
      const historicoDaApi = novoHistorico
        .slice(-11)
        .map(({ role, content }) => ({ role, content: content.slice(0, 1500) }));
      const resposta = await enviarMensagemGravity(historicoDaApi, context);
      setMensagens((atuais) => [
        ...atuais,
        { id: crypto.randomUUID(), role: "assistant", content: resposta },
      ]);
    } catch (error) {
      setErro(
        error instanceof GravityError ? error.message : "Não foi possível consultar o tutor agora.",
      );
    } finally {
      setCarregando(false);
    }
  }

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
            <p className="text-sm font-bold">Comece com uma dúvida específica</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Não envie senhas, documentos ou outros dados pessoais.
            </p>
            <div className="mt-4 grid gap-2">
              {sugestoes.map((sugestao) => (
                <button
                  type="button"
                  key={sugestao}
                  onClick={() => void enviar(sugestao)}
                  className="min-h-10 border border-border px-3 py-2 text-left text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  {sugestao}
                </button>
              ))}
            </div>
          </div>
        )}

        {mensagens.map((mensagem) => (
          <div
            key={mensagem.id}
            className={mensagem.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <div
              className={`gm-chat-message max-w-[88%] whitespace-pre-wrap break-words border px-3 py-2.5 text-sm leading-relaxed ${
                mensagem.role === "user"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-secondary text-foreground"
              }`}
            >
              {mensagem.content}
            </div>
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
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
        {mensagens.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setMensagens([]);
              setErro(null);
            }}
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
          disabled={carregando}
          className="ff-input flex-1"
        />
        <button
          type="button"
          onClick={() => void enviar(input)}
          disabled={carregando || !input.trim()}
          className="grid h-11 w-11 shrink-0 place-items-center bg-primary text-primary-foreground disabled:opacity-40"
          aria-label="Enviar pergunta"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
