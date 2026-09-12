import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as ArrowRight } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";


import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
function SobrePage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "ff-page", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ff-shell max-w-5xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "max-w-3xl border-b border-border pb-9", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Projeto educacional" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 text-4xl sm:text-5xl", children: "GRAVITYMIND" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "reading-copy mt-5 text-lg leading-relaxed text-muted-foreground", children: "Um sistema de apoio ao estudo das Leis de Newton desenvolvido no contexto da Escola Técnica Estadual Monteiro Lobato, o CIMOL, em Taquara, Rio Grande do Sul." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid gap-10 py-12 md:grid-cols-[15rem_1fr]", "aria-labelledby": "problem-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Problema" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "problem-title", className: "mt-2 text-2xl", children: "Ler não basta" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-copy space-y-5 text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Fórmulas decoradas sem contexto se perdem rápido. Por isso, o projeto combina explicação curta, visualização, manipulação de variáveis e recuperação ativa." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "O progresso depende de ações verificáveis: resolver questões, corrigir um erro e concluir uma checagem de compreensão." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "border-y border-border py-12", "aria-labelledby": "decisions-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Decisões do produto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "decisions-title", className: "mt-2 text-2xl sm:text-3xl", children: "Como o sistema foi pensado" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ff-divider-list mt-7 border-y border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Decision, { title: "Banco revisável", text: "As questões ficam versionadas no projeto e cada alternativa traz uma explicação conceitual própria." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Decision, { title: "Adaptação auditável", text: "A dificuldade muda com uma janela de respostas, enquanto a fila prioriza erros, lacunas e revisões espaçadas." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Decision, { title: "Foco configurável", text: "Sessões de 5, 10 ou 15 minutos, pausa sugerida, cronômetro opcional e menos elementos na tela." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Decision, { title: "Segurança no servidor", text: "Autenticação, propriedade dos registros, limites de requisição e validação acontecem antes do acesso ao banco." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid gap-8 py-12 md:grid-cols-[1fr_auto] md:items-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Contexto escolar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-2xl sm:text-3xl", children: "Monteiro Lobato, Taquara" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "reading-copy mt-3 text-muted-foreground", children: "A identificação da escola e da cidade segue os canais oficiais do CIMOL. O conteúdo do site é apoio educacional e continua aberto a revisão pedagógica." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "https://cimol.g12.br/", target: "_blank", rel: "noreferrer", className: "ff-btn-outline", children: [
        "Site oficial do CIMOL ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4", "aria-hidden": "true" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-t border-border pt-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/questoes", className: "ff-btn-primary", children: [
      "Abrir uma sessão real ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4", "aria-hidden": "true" })
    ] }) })
  ] }) });
}
function Decision({
  title,
  text
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "grid gap-3 py-5 sm:grid-cols-[12rem_1fr] sm:items-start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed text-muted-foreground", children: text })
  ] });
}
export {
  SobrePage as component
};
