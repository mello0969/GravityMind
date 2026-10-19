import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { GravityChat } from "@/components/gravity-chat";
import { PageHeading } from "@/components/page-heading";
import { TutorWorkspace } from "@/components/tutor-workspace";
import { useAuth } from "@/lib/auth/use-auth";

export const Route = createFileRoute("/tutor")({
  head: () => ({ meta: [{ title: "Tutor de Física | GRAVITYMIND" }] }),
  validateSearch: (input: Record<string, unknown>): { conversa?: string } => ({
    conversa: z.string().uuid().catch("").parse(input.conversa) || undefined,
  }),
  component: TutorPage,
});

function TutorPage() {
  const { usuario, carregando } = useAuth();
  const { conversa } = Route.useSearch();
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
