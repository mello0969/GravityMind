import { createFileRoute } from "@tanstack/react-router";
import { NotesPanel } from "@/components/notes-panel";
import { PageHeading } from "@/components/page-heading";
import { useAuth } from "@/lib/auth/use-auth";

export const Route = createFileRoute("/anotacoes")({
  validateSearch: (input: Record<string, unknown>): { nota?: string } => ({
    nota:
      typeof input.nota === "string" && /^nota-[a-f0-9-]{36}$/.test(input.nota)
        ? input.nota
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Minhas anotações | GRAVITYMIND" },
      {
        name: "description",
        content: "Crie e organize anotações pessoais de Física com salvamento automático.",
      },
    ],
  }),
  component: AnotacoesPage,
});

function AnotacoesPage() {
  const { nota } = Route.useSearch();
  const { usuario, carregando } = useAuth();
  return (
    <main className="ff-page">
      <div className="ff-shell max-w-5xl">
        <PageHeading title="Anotações de Física" />
        <div className="mt-8">
          {carregando ? (
            <div className="ff-skeleton h-80" role="status" aria-label="Carregando anotações" />
          ) : (
            <NotesPanel key={`${usuario?.id ?? "guest"}:${nota ?? "all"}`} notaInicialId={nota} />
          )}
        </div>
      </div>
    </main>
  );
}
