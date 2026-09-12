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

export function GravityChat({
  context,
  sugestoes = SUGESTOES_PADRAO,
  alturaMensagens = "360px",
}: {
  context?: GravityContext;
  sugestoes?: string[];
  alturaMensagens?: string;
}) {
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
    if (!textoLimpo || carregando) return;
    const novoHistorico: ChatEntry[] = [
      ...mensagens,
      { id: crypto.randomUUID(), role: "user", content: textoLimpo },
    ];
    setMensagens(novoHistorico);
    setInput("");
    setErro(null);
    setCarregando(true);
    try {
      const historicoDaApi = novoHistorico.map(({ role, content }) => ({ role, content }));
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

  if (!carregandoAuth && !usuario) {
    return (
      <div className="flex min-h-64 flex-col justify-center border-y border-border py-8">
        <p className="text-sm font-bold">O tutor usa uma sessão autenticada</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Entre para proteger o limite de uso e vincular apenas o resumo necessário do seu
          progresso.
        </p>
        <Link to="/login" className="ff-btn-primary mt-5 w-fit">
          Entrar para conversar
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div
        ref={scrollRef}
        className="space-y-3 overflow-y-auto"
        style={{ height: alturaMensagens }}
      >
        {mensagens.length === 0 && (
          <div className="flex h-full flex-col justify-center">
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
              className={`max-w-[88%] whitespace-pre-wrap border px-3 py-2.5 text-sm leading-relaxed ${
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
            className="flex items-start gap-2 border-l-2 border-destructive bg-destructive/8 px-3 py-2.5 text-xs text-destructive"
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
            aria-label="Reiniciar conversa"
            className="grid h-10 w-10 shrink-0 place-items-center border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
        <input
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
