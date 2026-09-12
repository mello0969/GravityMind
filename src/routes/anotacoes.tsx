import { createFileRoute } from "@tanstack/react-router";
import { NotesPanel } from "@/components/notes-panel";

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
        <header className="max-w-3xl border-b border-border pb-7">
          <p className="ff-kicker">Arquivo pessoal</p>
          <h1 className="mt-3 text-3xl sm:text-4xl">Anotações de Física</h1>
          <p className="reading-copy mt-3 text-muted-foreground">
            Organize ideias por lei, pesquise termos e recupere versões anteriores. O salvamento
            acontece neste aparelho e, quando autenticado, é sincronizado com sua conta.
          </p>
        </header>
        <div className="mt-8">
          <NotesPanel />
        </div>
      </div>
    </main>
  );
}
