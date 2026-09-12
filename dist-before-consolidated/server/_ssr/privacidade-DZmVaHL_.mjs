import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";


import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
function PrivacyPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "ff-page", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "ff-shell max-w-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Atualizada em 10 de setembro de 2026" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 text-4xl md:text-5xl", children: "Política de privacidade" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-base leading-relaxed text-muted-foreground", children: "Esta política explica quais dados o GRAVITYMIND usa para manter contas, progresso e recursos de estudo funcionando." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LegalSection, { title: "Dados neste aparelho", children: "Preferências, respostas, progresso e rascunhos de anotações podem ficar no armazenamento local do navegador. Você pode exportar esses dados na página de preferências. Limpar os dados do navegador também remove a cópia local." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LegalSection, { title: "Dados da conta e sincronização", children: "Ao criar uma conta, armazenamos nome, e-mail, hash seguro da senha, sessões ativas, respostas, progresso e anotações sincronizadas. O banco só é acessado pelo servidor e cada consulta é vinculada ao identificador da sessão autenticada. Títulos e conteúdos de notas sincronizadas são criptografados antes de serem gravados." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LegalSection, { title: "Tutor de Física", children: "Quando você usa o Gravity, a pergunta e o contexto pedagógico necessário são enviados ao provedor do modelo para gerar a resposta. Senha e cookie de sessão não fazem parte desse envio. Evite inserir informações pessoais ou sensíveis nas perguntas." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LegalSection, { title: "Proteção contra abuso", children: "Os formulários de conta usam Cloudflare Turnstile e limitação de requisições. Esses controles podem processar endereço IP e sinais técnicos do navegador para diferenciar uso legítimo de automação abusiva." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LegalSection, { title: "Retenção e segurança", children: "Sessões expiram após 14 dias. Dados de estudo sincronizados permanecem enquanto a conta e o serviço estiverem ativos. O tráfego de produção usa HTTPS, e o banco D1 mantém criptografia em trânsito e em repouso. Nenhuma medida elimina todos os riscos, por isso coletamos apenas o necessário para o produto." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LegalSection, { title: "Contato", children: "Dúvidas sobre o projeto podem ser encaminhadas pela página de contato. O GRAVITYMIND é um projeto educacional ligado à Escola Técnica Estadual Monteiro Lobato, em Taquara, RS." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 border-t border-border pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contato", className: "ff-btn-outline", children: "Ir para contato" }) })
  ] }) });
}
function LegalSection({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-10 border-t border-border pt-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "reading-copy mt-3 text-base leading-relaxed text-muted-foreground", children })
  ] });
}
export {
  PrivacyPage as component
};
