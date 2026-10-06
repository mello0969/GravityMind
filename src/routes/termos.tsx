import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/termos")({
  head: () => ({ meta: [{ title: "Termos de uso | GRAVITYMIND" }] }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <main className="ff-page">
      <article className="ff-shell max-w-3xl">
        <p className="ff-kicker">Atualizados em 10 de setembro de 2026</p>
        <h1 className="mt-3 text-4xl ">Termos de uso</h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          Ao usar o GRAVITYMIND, você concorda com as condições abaixo. O texto foi escrito para ser
          direto e compreensível para estudantes.
        </p>

        <TermsSection title="Finalidade educacional">
          O GRAVITYMIND oferece material de apoio para estudar Física. Questões, explicações e o
          tutor não substituem aulas, avaliações, orientação de professores ou fontes oficiais.
        </TermsSection>

        <TermsSection title="Conta e acesso">
          Você deve informar dados verdadeiros, proteger sua senha e não compartilhar a sessão. Não
          tente acessar registros de outras pessoas, contornar limites, automatizar cadastros ou
          prejudicar o funcionamento do serviço.
        </TermsSection>

        <TermsSection title="Conteúdo do estudante">
          Você continua responsável pelo que escreve em anotações, no quadro e no tutor. Não envie
          dados pessoais desnecessários, conteúdo ilegal ou material que viole direitos de
          terceiros.
        </TermsSection>

        <TermsSection title="Tutor automatizado">
          Respostas do Gravity podem conter erros. Confira cálculos e conceitos com o material da
          disciplina e com seu professor antes de usar uma resposta em atividade ou prova.
        </TermsSection>

        <TermsSection title="Disponibilidade e mudanças">
          O projeto pode receber correções, alterações de conteúdo ou períodos de indisponibilidade.
          Mudanças relevantes nestes termos serão registradas nesta página com uma nova data.
        </TermsSection>

        <div className="mt-12 flex flex-wrap gap-3 border-t border-border pt-6">
          <Link to="/privacidade" className="ff-btn-outline">
            Ver privacidade
          </Link>
          <Link to="/" className="ff-btn-primary">
            Voltar ao início
          </Link>
        </div>
      </article>
    </main>
  );
}

function TermsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 border-t border-border pt-6">
      <h2 className="text-xl">{title}</h2>
      <p className="reading-copy mt-3 text-base leading-relaxed text-muted-foreground">
        {children}
      </p>
    </section>
  );
}
