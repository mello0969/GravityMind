import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { z as marcarRespostaCorrigida } from "./router-BiedwaEF.mjs";
import { r as registrarRespostaCalculo } from "./engine-calculo-D3VYcpGG.mjs";
import { A as ArrowRight, g as ChevronUp, C as ChevronDown } from "../_libs/lucide-react.mjs";
function CalculationCard({
  questao,
  onProxima,
  onRegistrado
}) {
  const [input, setInput] = reactExports.useState("");
  const [fase, setFase] = reactExports.useState("respondendo");
  const [resultado, setResultado] = reactExports.useState(null);
  const [mostrarPassos, setMostrarPassos] = reactExports.useState(false);
  const inicioRef = reactExports.useRef(Date.now());
  const valorDigitado = Number.parseFloat(input.replace(",", "."));
  const valorValido = Number.isFinite(valorDigitado) && Math.abs(valorDigitado) <= 1e9;
  function responder() {
    if (!valorValido || fase === "resultado") return;
    const tempo = Math.max(1, Math.round((Date.now() - inicioRef.current) / 1e3));
    const verificacao = registrarRespostaCalculo(questao, valorDigitado, tempo);
    if (fase === "respondendo" && !verificacao.correta) {
      setResultado(verificacao);
      setFase("corrigindo");
      setInput("");
      return;
    }
    if (fase === "corrigindo" && verificacao.correta) marcarRespostaCorrigida(questao.id);
    setResultado(verificacao);
    setFase("resultado");
    onRegistrado?.(verificacao.correta);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("article", { className: "ff-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-[minmax(0,1fr)_13rem]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 sm:p-7 lg:p-9", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Cálculo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "/" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: questao.subassunto })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "reading-copy mt-5 text-xl leading-snug sm:text-2xl", children: questao.enunciado }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dl", { className: "mt-5 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2", children: questao.dados.map((dado) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex justify-between gap-4 bg-card px-3 py-2 text-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "font-mono font-bold text-primary", children: dado.simbolo }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: dado.valor })
          ]
        },
        dado.simbolo
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 border-l-2 border-primary pl-4 font-mono text-lg font-bold text-primary", children: questao.formula }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-7", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: `calculo-${questao.id}`, className: "mb-2 block text-sm font-bold", children: [
          "Sua resposta em ",
          questao.unidade
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 sm:flex-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: `calculo-${questao.id}`,
              type: "text",
              inputMode: "decimal",
              value: input,
              onChange: (evento) => setInput(evento.target.value.slice(0, 32)),
              onKeyDown: (evento) => {
                if (evento.key === "Enter") responder();
              },
              disabled: fase === "resultado",
              placeholder: "Exemplo: 9,8",
              className: "ff-input max-w-xs font-mono text-lg"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: responder,
              disabled: !valorValido || fase === "resultado",
              className: "ff-btn-primary",
              children: [
                fase === "corrigindo" ? "Verificar correção" : "Verificar",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4", "aria-hidden": "true" })
              ]
            }
          )
        ] })
      ] }),
      fase === "corrigindo" && resultado && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 border-l-2 border-warning bg-warning/8 px-4 py-3", role: "status", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold", children: "Revise a montagem e tente novamente" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "reading-copy mt-1 text-sm leading-relaxed text-muted-foreground", children: resultado.diagnostico })
      ] }),
      fase === "resultado" && resultado && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 border-t border-border pt-5", "aria-live": "polite", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: resultado.correta ? "Resultado correto" : "Resultado para revisão" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-lg font-bold", children: [
          questao.valorCorreto,
          " ",
          questao.unidade
        ] }),
        !resultado.correta && resultado.diagnostico && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "reading-copy mt-2 text-sm text-muted-foreground", children: resultado.diagnostico }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setMostrarPassos((aberto) => !aberto),
            className: "mt-5 flex min-h-11 w-full items-center justify-between border-y border-border py-2 text-left text-sm font-bold",
            children: [
              "Resolução passo a passo",
              mostrarPassos ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
            ]
          }
        ),
        mostrarPassos && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ff-divider-list border-b border-border", children: [
          questao.passos.map((passo, indice) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[4.5rem_1fr] gap-3 py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs font-bold text-muted-foreground", children: [
              "Passo ",
              indice + 1
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: passo.descricao }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 font-mono text-sm font-bold text-primary", children: passo.calculo })
            ] })
          ] }, passo.descricao)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "reading-copy py-4 text-sm leading-relaxed text-muted-foreground", children: questao.explicacaoFinal })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: onProxima, className: "ff-btn-primary mt-6", children: [
          "Próxima questão ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4", "aria-hidden": "true" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "focus-optional border-t border-border bg-secondary/45 p-5 md:border-l md:border-t-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Estratégia" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "mt-4 space-y-3 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "1. Liste os dados." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "2. Isole a incógnita." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "3. Confira unidade e sinal." })
      ] })
    ] })
  ] }) });
}
export {
  CalculationCard as C
};
