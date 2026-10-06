import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacidade")({
  head: () => ({ meta: [{ title: "Política de privacidade | GRAVITYMIND" }] }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="ff-page">
      <article className="ff-shell max-w-3xl">
        <p className="ff-kicker">Atualizada em 6 de outubro de 2026</p>
        <h1 className="mt-3 text-4xl ">Política de privacidade</h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          Esta política explica quais dados o GRAVITYMIND usa para manter contas, progresso e
          recursos de estudo funcionando.
        </p>

        <LegalSection title="Dados neste aparelho">
          Preferências, respostas, progresso e rascunhos de anotações podem ficar no armazenamento
          local do navegador. Você pode exportar esses dados na página de preferências. Limpar os
          dados do navegador também remove a cópia local.
        </LegalSection>

        <LegalSection title="Dados da conta e sincronização">
          Ao criar uma conta, armazenamos nome, e-mail, hash seguro da senha, sessões ativas,
          respostas, progresso e anotações sincronizadas. O banco só é acessado pelo servidor e cada
          consulta é vinculada ao identificador da sessão autenticada. Títulos e conteúdos de notas
          sincronizadas são criptografados antes de serem gravados.
        </LegalSection>

        <LegalSection title="Tutor de Física">
          Quando você usa o Gravity, a pergunta e o contexto pedagógico necessário são enviados ao
          serviço de API da Groq para gerar a resposta, com o armazenamento de respostas desativado
          na requisição (store: false). Isso não elimina os registros de segurança que o provedor
          pode manter conforme sua política. Senha e cookie de sessão não fazem parte desse envio. A
          conversa não é gravada no banco do GRAVITYMIND. Evite inserir informações pessoais ou
          sensíveis.
        </LegalSection>

        <LegalSection title="Proteção contra abuso">
          Os formulários de conta usam Cloudflare Turnstile e limitação de requisições. Esses
          controles podem processar endereço IP e sinais técnicos do navegador para diferenciar uso
          legítimo de automação abusiva.
        </LegalSection>

        <LegalSection title="Retenção e segurança">
          Sessões expiram após 14 dias. Dados de estudo sincronizados permanecem enquanto a conta e
          o serviço estiverem ativos. O tráfego de produção usa HTTPS, e as notas sincronizadas são
          criptografadas antes do envio ao Supabase. Nenhuma medida elimina todos os riscos, por
          isso coletamos apenas o necessário para o produto.
        </LegalSection>

        <LegalSection title="Contato">
          Dúvidas sobre o projeto podem ser encaminhadas pela página de contato. O GRAVITYMIND é um
          projeto educacional ligado à Escola Técnica Estadual Monteiro Lobato, em Taquara, RS.
        </LegalSection>

        <div className="mt-12 border-t border-border pt-6">
          <Link to="/contato" className="ff-btn-outline">
            Ir para contato
          </Link>
        </div>
      </article>
    </main>
  );
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 border-t border-border pt-6">
      <h2 className="text-xl">{title}</h2>
      <p className="reading-copy mt-3 text-base leading-relaxed text-muted-foreground">
        {children}
      </p>
    </section>
  );
}
