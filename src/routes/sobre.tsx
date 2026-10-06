import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre o projeto | GRAVITYMIND" },
      {
        name: "description",
        content: "Conheça as decisões pedagógicas e técnicas do projeto GRAVITYMIND.",
      },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <main className="ff-page">
      <div className="ff-shell max-w-5xl">
        <header className="max-w-3xl border-b border-border pb-9">
          <p className="ff-kicker">Projeto educacional</p>
          <h1 className="mt-3 text-4xl ">GRAVITYMIND</h1>
          <p className="reading-copy mt-5 text-lg leading-relaxed text-muted-foreground">
            Um sistema de apoio ao estudo das Leis de Newton desenvolvido no contexto da Escola
            Técnica Estadual Monteiro Lobato, o CIMOL, em Taquara, Rio Grande do Sul.
          </p>
        </header>

        <section
          className="grid gap-10 py-12 md:grid-cols-[15rem_1fr]"
          aria-labelledby="problem-title"
        >
          <div>
            <p className="ff-kicker">Problema</p>
            <h2 id="problem-title" className="mt-2 text-2xl">
              Ler não basta
            </h2>
          </div>
          <div className="reading-copy space-y-5 text-muted-foreground">
            <p>
              Fórmulas decoradas sem contexto se perdem rápido. Por isso, o projeto combina
              explicação curta, visualização, manipulação de variáveis e recuperação ativa.
            </p>
            <p>
              O progresso depende de ações verificáveis: resolver questões, corrigir um erro e
              concluir uma checagem de compreensão.
            </p>
          </div>
        </section>

        <section className="border-y border-border py-12" aria-labelledby="decisions-title">
          <p className="ff-kicker">Decisões do produto</p>
          <h2 id="decisions-title" className="mt-2 text-2xl sm:text-3xl">
            Como o sistema foi pensado
          </h2>
          <div className="ff-divider-list mt-7 border-y border-border">
            <Decision
              title="Banco revisável"
              text="As questões ficam versionadas no projeto e cada alternativa traz uma explicação conceitual própria."
            />
            <Decision
              title="Adaptação auditável"
              text="A dificuldade muda com uma janela de respostas, enquanto a fila prioriza erros, lacunas e revisões espaçadas."
            />
            <Decision
              title="Foco configurável"
              text="Sessões de 5, 10 ou 15 minutos, pausa sugerida, cronômetro opcional e menos elementos na tela."
            />
            <Decision
              title="Segurança no servidor"
              text="Autenticação, propriedade dos registros, limites de requisição e validação acontecem antes do acesso ao banco."
            />
          </div>
        </section>

        <section className="grid gap-8 py-12 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-2xl">
            <p className="ff-kicker">Contexto escolar</p>
            <h2 className="mt-2 text-2xl sm:text-3xl">Monteiro Lobato, Taquara</h2>
            <p className="reading-copy mt-3 text-muted-foreground">
              A identificação da escola e da cidade segue os canais oficiais do CIMOL. O conteúdo do
              site é apoio educacional e continua aberto a revisão pedagógica.
            </p>
          </div>
          <a
            href="https://cimol.g12.br/"
            target="_blank"
            rel="noreferrer"
            className="ff-btn-outline"
          >
            Site oficial do CIMOL <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </section>

        <section className="border-t border-border pt-10">
          <Link to="/questoes" className="ff-btn-primary">
            Abrir uma sessão real <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>
      </div>
    </main>
  );
}

function Decision({ title, text }: { title: string; text: string }) {
  return (
    <article className="grid gap-3 py-5 sm:grid-cols-[12rem_1fr] sm:items-start">
      <h3 className="text-base">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
    </article>
  );
}
