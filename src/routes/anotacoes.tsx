import { createFileRoute } from "@tanstack/react-router";
import { NotesPanel } from "@/components/notes-panel";
import { PageHeading } from "@/components/page-heading";

export const Route = createFileRoute("/anotacoes")({
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
  return (
    <main className="ff-page">
      <div className="ff-shell max-w-5xl">
        <PageHeading
          title="Anotações de Física"
          description="Suas ideias, dúvidas e descobertas. Um lugar para retomá-las."
        />
        <div className="mt-8">
          <NotesPanel />
        </div>
      </div>
    </main>
  );
}
