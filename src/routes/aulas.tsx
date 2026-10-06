import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeading } from "@/components/page-heading";
import { StudyTrail } from "@/components/study-trail";
export const Route = createFileRoute("/aulas")({
  head: () => ({ meta: [{ title: "Trilha de Mecânica | GRAVITYMIND" }] }),
  component: LessonsPage,
});
function LessonsPage() {
  return (
    <main className="gm-shell py-10">
      <PageHeading
        title="Mecânica, desde o começo."
        description="As três leis que conectam força e movimento."
      >
        <Link to="/dashboard" className="ff-btn-outline">
          Meu progresso
        </Link>
      </PageHeading>
      <div className="gm-lessons-layout">
        <section aria-label="Aulas da trilha">
          <div className="gm-course-intro">
            <span>
              <strong>3 aulas</strong> em sequência
            </span>
            <span>
              <strong>35 minutos</strong> estimados
            </span>
            <span>Do conceito à aplicação</span>
          </div>
          <StudyTrail />
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-border py-6">
            <div>
              <h2 className="text-xl font-semibold">Desafio da trilha</h2>
              <p className="mt-2 text-muted-foreground">
                Combine as três leis em uma sessão de Mecânica.
              </p>
            </div>
            <Link to="/questoes" search={{ assunto: "mecanica" }} className="ff-btn-primary">
              Iniciar desafio
            </Link>
          </div>
        </section>
        <aside className="gm-lessons-aside">
          <div
            className="gm-course-formula"
            role="img"
            aria-label="Força igual a massa vezes aceleração"
          >
            F = m · a
          </div>
          <h2 className="text-xl font-semibold">Seu ciclo de estudo</h2>
          <ol className="mt-5 list-decimal space-y-5 pl-5 text-sm leading-relaxed">
            <li>
              <strong>Formule uma hipótese.</strong>
              <br />O que você espera que aconteça?
            </li>
            <li>
              <strong>Teste no laboratório.</strong>
              <br />
              Altere uma variável e observe.
            </li>
            <li>
              <strong>Explique com suas palavras.</strong>
              <br />
              Use a lei para justificar o resultado.
            </li>
            <li>
              <strong>Retome depois.</strong>
              <br />
              Reveja conceitos e erros em outra sessão.
            </li>
          </ol>
          <Link
            to="/flashcards"
            className="mt-6 inline-block text-sm text-primary underline underline-offset-4"
          >
            Abrir revisão
          </Link>
        </aside>
      </div>
    </main>
  );
}
