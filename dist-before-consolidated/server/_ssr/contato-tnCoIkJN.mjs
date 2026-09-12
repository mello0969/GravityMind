import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { i as MapPin, j as ExternalLink } from "../_libs/lucide-react.mjs";

function ContatoPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "ff-page", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ff-shell max-w-4xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "max-w-2xl border-b border-border pb-9", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Contato" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 text-4xl sm:text-5xl", children: "Fale com o projeto pelo CIMOL" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "reading-copy mt-5 text-muted-foreground", children: "Para não simular um canal de atendimento que ainda não existe, esta página direciona aos meios oficiais da escola responsável pelo contexto do projeto." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid gap-8 py-10 md:grid-cols-[13rem_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 text-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "mt-0.5 h-5 w-5", "aria-hidden": "true" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-bold uppercase", children: "Taquara, RS" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl", children: "Escola Técnica Estadual Monteiro Lobato" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "reading-copy mt-3 max-w-xl text-muted-foreground", children: "Consulte endereço, telefone, e-mail e horários diretamente no site oficial. Assim, as informações permanecem atualizadas e verificáveis." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "https://cimol.g12.br/", target: "_blank", rel: "noreferrer", className: "ff-btn-primary mt-6", children: [
          "Abrir site oficial ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-4 w-4", "aria-hidden": "true" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "border-t border-border pt-9", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl", children: "Sobre conteúdo e privacidade" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "reading-copy mt-3 max-w-2xl text-sm text-muted-foreground", children: "O tutor não deve receber senhas, documentos ou outros dados pessoais. Para entender o tratamento de informações no site, consulte a Política de Privacidade no rodapé." })
    ] })
  ] }) });
}
export {
  ContatoPage as component
};
