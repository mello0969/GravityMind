import { GravityChat } from "@/components/gravity-chat";
import { PageHeading } from "@/components/page-heading";
import { TutorWorkspace } from "@/components/tutor-workspace";
import { useAuth } from "@/lib/auth/use-auth";

export function TutorPage({ conversa }: { conversa?: string }) {
  const { usuario, carregando } = useAuth();
  return (
    <main className="gm-shell gm-tutor-page py-8">
      <PageHeading title="Tutor de Física" />
      {carregando ? (
        <div className="ff-skeleton h-80" role="status" aria-label="Carregando Tutor" />
      ) : usuario ? (
        <TutorWorkspace key={usuario.id} userId={usuario.id} conversationId={conversa} />
      ) : (
        <GravityChat />
      )}
    </main>
  );
}
