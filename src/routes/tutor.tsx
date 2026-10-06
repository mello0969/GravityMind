import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { GravityChat } from "@/components/gravity-chat";
import { PageHeading } from "@/components/page-heading";
import { useAuth } from "@/lib/auth/use-auth";

export const Route = createFileRoute("/tutor")({
  head: () => ({ meta: [{ title: "Tutor de Física | GRAVITYMIND" }] }),
  component: TutorPage,
});

function TutorPage() {
  const [conversation, setConversation] = useState(0);
  const { usuario } = useAuth();
  return (
    <main className="gm-shell py-10">
      <PageHeading title="Tutor de Física" description="Seu raciocínio é o ponto de partida." />
      {!usuario ? (
        <GravityChat />
      ) : (
        <div className="gm-tutor-layout">
          <aside className="gm-tutor-nav">
            <h2>Raciocínio guiado</h2>
            <button
              type="button"
              className="ff-btn-outline"
              onClick={() => {
                if (
                  window.confirm(
                    "Iniciar uma nova conversa? As mensagens desta sessão serão descartadas.",
                  )
                )
                  setConversation((value) => value + 1);
              }}
            >
              <Plus size={16} aria-hidden="true" />
              Nova conversa
            </button>
            <p>A conversa fica apenas nesta sessão. Não envie dados pessoais ou senhas.</p>
            <Link to="/anotacoes" className="gm-text-link">
              Minhas anotações
            </Link>
          </aside>
          <section className="gm-tutor-chat" aria-label="Conversa com o Tutor">
            <GravityChat
              key={`${usuario?.id}-${conversation}`}
              alturaMensagens="min(56dvh, 34rem)"
            />
            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
              O Tutor usa IA e pode errar. Confira unidades, hipóteses e resultados. Mensagens são
              enviadas à Groq quando o serviço está configurado.
            </p>
          </section>
          <aside className="gm-tutor-guide">
            <h2>Organize a pergunta</h2>
            <ol>
              <li>Qual corpo você está analisando?</li>
              <li>Quais forças atuam sobre ele?</li>
              <li>O que você tentou e onde travou?</li>
            </ol>
            <h2 className="mt-8">Continue explorando</h2>
            <Link to="/lei-1">Inércia e equilíbrio</Link>
            <Link to="/lei-2">Força e aceleração</Link>
            <Link to="/lei-3">Ação e reação</Link>
            <Link to="/privacidade">Privacidade da conversa</Link>
          </aside>
        </div>
      )}
    </main>
  );
}
