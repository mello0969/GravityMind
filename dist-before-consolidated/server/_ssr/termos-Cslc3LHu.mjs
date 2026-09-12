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
function TermsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "ff-page", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "ff-shell max-w-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Atualizados em 10 de setembro de 2026" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 text-4xl md:text-5xl", children: "Termos de uso" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-base leading-relaxed text-muted-foreground", children: "Ao usar o GRAVITYMIND, você concorda com as condições abaixo. O texto foi escrito para ser direto e compreensível para estudantes." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TermsSection, { title: "Finalidade educacional", children: "O GRAVITYMIND oferece material de apoio para estudar Física. Questões, explicações e o tutor não substituem aulas, avaliações, orientação de professores ou fontes oficiais." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TermsSection, { title: "Conta e acesso", children: "Você deve informar dados verdadeiros, proteger sua senha e não compartilhar a sessão. Não tente acessar registros de outras pessoas, contornar limites, automatizar cadastros ou prejudicar o funcionamento do serviço." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TermsSection, { title: "Conteúdo do estudante", children: "Você continua responsável pelo que escreve em anotações, no quadro e no tutor. Não envie dados pessoais desnecessários, conteúdo ilegal ou material que viole direitos de terceiros." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TermsSection, { title: "Tutor automatizado", children: "Respostas do Gravity podem conter erros. Confira cálculos e conceitos com o material da disciplina e com seu professor antes de usar uma resposta em atividade ou prova." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TermsSection, { title: "Disponibilidade e mudanças", children: "O projeto pode receber correções, alterações de conteúdo ou períodos de indisponibilidade. Mudanças relevantes nestes termos serão registradas nesta página com uma nova data." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 flex flex-wrap gap-3 border-t border-border pt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/privacidade", className: "ff-btn-outline", children: "Ver privacidade" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "ff-btn-primary", children: "Voltar ao início" })
    ] })
  ] }) });
}
function TermsSection({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-10 border-t border-border pt-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "reading-copy mt-3 text-base leading-relaxed text-muted-foreground", children })
  ] });
}
export {
  TermsPage as component
};
