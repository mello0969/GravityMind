import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { l as listarNotas, b as buscarNotas, c as criarNota, o as obterHistoricoDaNota, r as restaurarVersao, A as ASSUNTO_LABEL, e as excluirNota, a as atualizarNota } from "./router-BiedwaEF.mjs";

import "../_libs/seroval.mjs";
import { c as Search, P as Plus, F as FileText, X, R as RotateCcw, H as History, T as Trash2 } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "../_libs/motion.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/unenv.mjs";


import "./server-DwUI_Cux.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




import "./schemas-Dga4YmnR.mjs";
import "../_libs/zod.mjs";
function useAutosave(value, onSave, delayMs = 800) {
  const [status, setStatus] = reactExports.useState("ocioso");
  const timeoutRef = reactExports.useRef(null);
  const statusTimeoutRef = reactExports.useRef(null);
  const primeiraRenderRef = reactExports.useRef(true);
  const valorSerializado = JSON.stringify(value);
  const ultimoValorRef = reactExports.useRef(valorSerializado);
  const valueRef = reactExports.useRef(value);
  const onSaveRef = reactExports.useRef(onSave);
  valueRef.current = value;
  onSaveRef.current = onSave;
  reactExports.useEffect(() => {
    if (primeiraRenderRef.current) {
      primeiraRenderRef.current = false;
      ultimoValorRef.current = valorSerializado;
      return;
    }
    if (valorSerializado === ultimoValorRef.current) return;
    ultimoValorRef.current = valorSerializado;
    setStatus("digitando");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setStatus("salvando");
      onSaveRef.current(valueRef.current);
      statusTimeoutRef.current = setTimeout(() => setStatus("salvo"), 250);
    }, delayMs);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    };
  }, [delayMs, valorSerializado]);
  return status;
}
const FILTROS = [
  { id: "todas", label: "Todas" },
  { id: "geral", label: "Geral" },
  { id: "lei-1", label: "1ª Lei" },
  { id: "lei-2", label: "2ª Lei" },
  { id: "lei-3", label: "3ª Lei" }
];
function formatarData(iso) {
  const data = new Date(iso);
  return `${data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}, ${data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
}
function NotesPanel({ assuntoInicial } = {}) {
  const [notas, setNotas] = reactExports.useState(() => listarNotas());
  const [selecionadaId, setSelecionadaId] = reactExports.useState(notas[0]?.id ?? null);
  const [busca, setBusca] = reactExports.useState("");
  const [filtro, setFiltro] = reactExports.useState(assuntoInicial ?? "todas");
  const [mostrarHistorico, setMostrarHistorico] = reactExports.useState(false);
  const notasFiltradas = buscarNotas(busca, filtro === "todas" ? void 0 : filtro);
  const notaSelecionada = notas.find((nota) => nota.id === selecionadaId) ?? null;
  function recarregar() {
    setNotas(listarNotas());
  }
  function criar() {
    const nova = criarNota(filtro === "todas" ? "geral" : filtro);
    recarregar();
    setSelecionadaId(nova.id);
    setMostrarHistorico(false);
  }
  function excluir(id) {
    excluirNota(id);
    const restantes = listarNotas();
    setNotas(restantes);
    if (selecionadaId === id) setSelecionadaId(restantes[0]?.id ?? null);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid min-h-[36rem] overflow-hidden border border-border bg-card md:grid-cols-[18rem_minmax(0,1fr)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "border-b border-border p-4 md:border-b-0 md:border-r", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ff-input-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { "aria-hidden": "true" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "search",
            value: busca,
            onChange: (evento) => setBusca(evento.target.value.slice(0, 120)),
            maxLength: 120,
            placeholder: "Buscar anotações",
            className: "ff-input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "mt-3 flex flex-wrap gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "sr-only", children: "Filtrar anotações" }),
        FILTROS.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setFiltro(item.id),
            "aria-pressed": filtro === item.id,
            className: `min-h-9 border px-2.5 text-xs font-semibold ${filtro === item.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`,
            children: item.label
          },
          item.id
        ))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: criar, className: "ff-btn-primary mt-4 w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4", "aria-hidden": "true" }),
        " Nova anotação"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 max-h-[23rem] overflow-y-auto border-y border-border md:max-h-[28rem]", children: [
        notasFiltradas.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-2 py-7 text-center text-sm text-muted-foreground", children: "Nenhuma anotação neste recorte." }),
        notasFiltradas.map((nota) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              setSelecionadaId(nota.id);
              setMostrarHistorico(false);
            },
            className: `block w-full border-b border-border px-2 py-3 text-left last:border-b-0 ${selecionadaId === nota.id ? "bg-secondary" : "hover:bg-secondary/55"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "block truncate text-sm", children: nota.titulo || "Sem título" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 block truncate text-xs text-muted-foreground", children: nota.conteudo || "Nota vazia" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 block text-[11px] text-muted-foreground", children: formatarData(nota.atualizadaEm) })
            ]
          },
          nota.id
        ))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "min-w-0 p-4 sm:p-6", children: notaSelecionada ? mostrarHistorico ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      HistoricoNota,
      {
        nota: notaSelecionada,
        onFechar: () => setMostrarHistorico(false),
        onRestaurado: () => {
          recarregar();
          setMostrarHistorico(false);
        }
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      EditorNota,
      {
        nota: notaSelecionada,
        onAtualizar: recarregar,
        onExcluir: () => excluir(notaSelecionada.id),
        onAbrirHistorico: () => setMostrarHistorico(true)
      },
      notaSelecionada.id
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-[24rem] flex-col items-center justify-center text-center text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-8 w-8", "aria-hidden": "true" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm font-semibold", children: "Crie uma anotação para começar." })
    ] }) })
  ] });
}
function EditorNota({
  nota,
  onAtualizar,
  onExcluir,
  onAbrirHistorico
}) {
  const [titulo, setTitulo] = reactExports.useState(nota.titulo);
  const [conteudo, setConteudo] = reactExports.useState(nota.conteudo);
  const [assunto, setAssunto] = reactExports.useState(nota.assunto);
  const status = useAutosave({ titulo, conteudo, assunto }, (dados) => {
    atualizarNota(nota.id, dados);
    onAtualizar();
  });
  const statusLabel = {
    ocioso: "",
    digitando: "Alterações locais",
    salvando: "Salvando",
    salvo: "Salvo automaticamente"
  }[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full min-h-[31rem] flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 border-b border-border pb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          value: titulo,
          onChange: (evento) => setTitulo(evento.target.value.slice(0, 160)),
          maxLength: 160,
          placeholder: "Título da anotação",
          className: "min-w-0 flex-1 border-0 bg-transparent text-xl font-bold text-foreground outline-none"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { label: "Ver histórico", icon: History, onClick: onAbrirHistorico }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { label: "Excluir anotação", icon: Trash2, onClick: onExcluir, destructive: true })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap gap-1", children: ["geral", "lei-1", "lei-2", "lei-3"].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setAssunto(item),
        "aria-pressed": assunto === item,
        className: `min-h-8 border px-2 text-xs font-semibold ${assunto === item ? "border-primary text-primary" : "border-border text-muted-foreground"}`,
        children: item === "geral" ? "Geral" : ASSUNTO_LABEL[item]
      },
      item
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        value: conteudo,
        onChange: (evento) => setConteudo(evento.target.value.slice(0, 4e4)),
        maxLength: 4e4,
        placeholder: "Registre o raciocínio, uma dúvida ou um exemplo",
        className: "mt-4 min-h-[22rem] flex-1 resize-y border border-border bg-background p-4 leading-relaxed text-foreground outline-none focus:border-primary"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "mt-3 flex justify-between gap-3 text-xs text-muted-foreground",
        "aria-live": "polite",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: statusLabel }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            conteudo.length.toLocaleString("pt-BR"),
            " / 40.000"
          ] })
        ]
      }
    )
  ] });
}
function HistoricoNota({
  nota,
  onFechar,
  onRestaurado
}) {
  const versoes = obterHistoricoDaNota(nota.id);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 border-b border-border pb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Histórico" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-xl", children: nota.titulo })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { label: "Fechar histórico", icon: X, onClick: onFechar })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ff-divider-list mt-4 border-y border-border", children: [
      versoes.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-7 text-sm text-muted-foreground", children: "Ainda não há versões anteriores." }),
      versoes.map((versao) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("time", { className: "text-xs text-muted-foreground", children: formatarData(versao.salvoEm) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                restaurarVersao(nota.id, versao.conteudoAnterior);
                onRestaurado();
              },
              className: "inline-flex min-h-9 items-center gap-2 text-xs font-bold text-primary",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4", "aria-hidden": "true" }),
                " Restaurar"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground", children: versao.conteudoAnterior })
      ] }, versao.salvoEm))
    ] })
  ] });
}
function IconButton({
  label,
  icon: Icon,
  onClick,
  destructive = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick,
      title: label,
      "aria-label": label,
      className: `grid h-9 w-9 place-items-center ${destructive ? "text-destructive hover:bg-destructive/8" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4", "aria-hidden": "true" })
    }
  );
}
function AnotacoesPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "ff-page", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ff-shell max-w-5xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "max-w-3xl border-b border-border pb-7", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Arquivo pessoal" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 text-3xl sm:text-4xl", children: "Anotações de Física" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "reading-copy mt-3 text-muted-foreground", children: "Organize ideias por lei, pesquise termos e recupere versões anteriores. O salvamento acontece neste aparelho e, quando autenticado, é sincronizado com sua conta." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(NotesPanel, {}) })
  ] }) });
}
export {
  AnotacoesPage as component
};
