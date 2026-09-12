import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { m as motion } from "../_libs/motion.mjs";
import { C as CalculationCard } from "./calculation-card-CrT420jk.mjs";
import { D as Dialog, a as DialogPortal, b as DialogOverlay, c as DialogContent, d as DialogClose, e as DialogTitle, f as DialogDescription } from "../_libs/radix-ui__react-dialog.mjs";
import { W as Whiteboard } from "./whiteboard-C4Bt4Yil.mjs";
import { E as Route$4, u as useSiteSettings, f as contarRevisoesPendentes, A as ASSUNTO_LABEL, d as useAuth, v as calcularDesempenhoPorAssunto, F as limparHistorico, q as obterDificuldadeAtual, w as escolherProximaQuestaoMecanica, x as escolherProximaQuestao, t as emitProgressUpdated, y as registrarResposta, z as marcarRespostaCorrigida, B as obterDicasQuestao, C as escolherAssuntoAdaptativo, D as atualizarDificuldadeAdaptativa } from "./router-BiedwaEF.mjs";
import { r as recordStudyActivityServerFn } from "./study-profile.server-BL4XQx6e.mjs";
import { e as escolherProximaQuestaoCalculo } from "./engine-calculo-D3VYcpGG.mjs";

import "../_libs/seroval.mjs";
import { X, u as Focus, O as ListChecks, Q as Calculator, V as Clock3, A as ArrowRight, W as Lightbulb, w as PenLine, g as ChevronUp, C as ChevronDown, R as RotateCcw, Y as Trophy } from "../_libs/lucide-react.mjs";
import { A as AnimatePresence } from "../_libs/framer-motion.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/tslib.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-slider.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./server-DwUI_Cux.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/unenv.mjs";


import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




import "./schemas-Dga4YmnR.mjs";
import "../_libs/zod.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function HighScoreDialog({
  open,
  onOpenChange,
  correct,
  total,
  xp,
  reducedMotion
}) {
  const percentage = total > 0 ? Math.round(correct / total * 100) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, { className: "fixed inset-0 z-50 bg-[#0d1713]/82" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: reducedMotion ? false : { opacity: 0, y: 18, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: reducedMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] },
        className: "fixed left-1/2 top-1/2 z-50 w-[min(31rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 border border-border-strong bg-card p-6 sm:p-8",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogClose,
            {
              className: "absolute right-3 top-3 grid h-10 w-10 place-items-center text-muted-foreground hover:bg-secondary hover:text-foreground",
              "aria-label": "Fechar resultado",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4", "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-7 w-7 text-accent", "aria-hidden": "true" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "mt-5 text-3xl font-bold", children: "Sessão muito bem resolvida" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { className: "reading-copy mt-3 leading-relaxed text-muted-foreground", children: [
            "Você acertou ",
            correct,
            " de ",
            total,
            " questões e encerrou a meta com ",
            percentage,
            "% de aproveitamento."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-6 grid grid-cols-2 border-y border-border py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-r border-border pr-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-xs font-semibold text-muted-foreground", children: "Aproveitamento" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("dd", { className: "mt-1 text-2xl font-bold", children: [
                percentage,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pl-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-xs font-semibold text-muted-foreground", children: "XP da sessão" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("dd", { className: "mt-1 text-2xl font-bold text-primary", children: [
                "+",
                xp
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ff-btn-primary mt-6 w-full", children: "Continuar estudando" }) })
        ]
      }
    ) })
  ] }) });
}
const DIFICULDADE_LABEL = {
  facil: "Fundamentos",
  medio: "Aplicação",
  dificil: "Desafio"
};
const META_POR_MINUTOS = { 5: 3, 10: 5, 15: 8 };
function formatarRelogio(segundos) {
  const minutos = Math.floor(segundos / 60).toString().padStart(2, "0");
  const resto = (segundos % 60).toString().padStart(2, "0");
  return `${minutos}:${resto}`;
}
function assuntoParaProxima(selecao) {
  return selecao === "misto" || selecao === "mecanica" ? escolherAssuntoAdaptativo() : selecao;
}
function escolherQuestaoMultipla(assunto, modo, idsExcluidos) {
  const assuntoEfetivo = assuntoParaProxima(assunto);
  const dificuldade = modo === "adaptativo" ? obterDificuldadeAtual(assuntoEfetivo) : modo;
  return assunto === "mecanica" ? escolherProximaQuestaoMecanica(dificuldade, idsExcluidos) : escolherProximaQuestao(assuntoEfetivo, dificuldade, idsExcluidos);
}
function escolherQuestaoCalculo(assunto, modo, idsExcluidos) {
  const assuntoEfetivo = assuntoParaProxima(assunto);
  const dificuldade = modo === "adaptativo" ? obterDificuldadeAtual(assuntoEfetivo) : modo;
  return escolherProximaQuestaoCalculo(assuntoEfetivo, dificuldade, idsExcluidos);
}
function pedagogicalAnalysis({
  confidence,
  firstError,
  correct
}) {
  if (firstError && correct) {
    return "Você revisou a primeira hipótese e recuperou o conceito na segunda tentativa. Esse tipo de correção conta mais do que acertar por acaso.";
  }
  if (!correct && (confidence === "alta" || confidence === "muito-alta")) {
    return "Sua confiança estava alta, mas o modelo mental não previu o resultado. Marque as forças no corpo analisado antes de escolher uma fórmula.";
  }
  if (correct && confidence === "baixa") {
    return "A resposta está correta, mas sua confiança ainda está baixa. Explique em uma frase por que as outras forças não mudam a resultante.";
  }
  if (!correct) {
    return "A dificuldade apareceu na leitura da interação. Refaça o diagrama de corpo livre e nomeie o corpo que recebe cada força.";
  }
  return "Resposta e confiança estão alinhadas. A próxima questão pode exigir o mesmo conceito em outra representação.";
}
function QuestionPractice({
  assunto,
  compact = false,
  initialMode = "adaptativo",
  showToolbar = true,
  workspace = false,
  onModeChange
}) {
  const settings = useSiteSettings();
  const { usuario } = useAuth();
  const [modo, setModo] = reactExports.useState(initialMode);
  const [tipo, setTipo] = reactExports.useState("multipla");
  const [questaoAtual, setQuestaoAtual] = reactExports.useState(null);
  const [questaoCalculo, setQuestaoCalculo] = reactExports.useState(null);
  const [respondidoIds, setRespondidoIds] = reactExports.useState([]);
  const [respondidoIdsCalculo, setRespondidoIdsCalculo] = reactExports.useState([]);
  const [calcKey, setCalcKey] = reactExports.useState(0);
  const [selecionada, setSelecionada] = reactExports.useState(null);
  const [primeiroErro, setPrimeiroErro] = reactExports.useState(null);
  const [confianca, setConfianca] = reactExports.useState("media");
  const [etapa, setEtapa] = reactExports.useState("responder");
  const [dicasUsadas, setDicasUsadas] = reactExports.useState(0);
  const [dicasAtuais, setDicasAtuais] = reactExports.useState([]);
  const [quadroAberto, setQuadroAberto] = reactExports.useState(false);
  const [avisoAdaptativo, setAvisoAdaptativo] = reactExports.useState(null);
  const [sessao, setSessao] = reactExports.useState({ acertos: 0, total: 0, creditos: 0 });
  const [segundosSessao, setSegundosSessao] = reactExports.useState(0);
  const [successOpen, setSuccessOpen] = reactExports.useState(false);
  const [successShown, setSuccessShown] = reactExports.useState(false);
  const inicioQuestaoRef = reactExports.useRef(Date.now());
  const inicioSessaoRef = reactExports.useRef(Date.now());
  const metaSessao = META_POR_MINUTOS[settings.sessionMinutes];
  const duracaoMovimento = settings.motion === "reduced" ? 0 : 0.24;
  function carregarMultipla() {
    const proxima = escolherQuestaoMultipla(assunto, modo, respondidoIds);
    setQuestaoAtual(proxima);
    setSelecionada(null);
    setPrimeiroErro(null);
    setConfianca("media");
    setEtapa("responder");
    setDicasAtuais([]);
    setAvisoAdaptativo(null);
    inicioQuestaoRef.current = Date.now();
  }
  function carregarCalculo() {
    const proxima = escolherQuestaoCalculo(assunto, modo, respondidoIdsCalculo);
    setQuestaoCalculo(proxima);
    setCalcKey((valor) => valor + 1);
  }
  reactExports.useEffect(() => {
    setRespondidoIds([]);
    setRespondidoIdsCalculo([]);
    if (tipo === "multipla") {
      setQuestaoAtual(escolherQuestaoMultipla(assunto, modo, []));
      setSelecionada(null);
      setPrimeiroErro(null);
      setConfianca("media");
      setEtapa("responder");
      setDicasAtuais([]);
      setAvisoAdaptativo(null);
      inicioQuestaoRef.current = Date.now();
    } else {
      setQuestaoCalculo(escolherQuestaoCalculo(assunto, modo, []));
      setCalcKey((valor) => valor + 1);
    }
  }, [assunto, modo, tipo]);
  reactExports.useEffect(() => {
    const intervalo = window.setInterval(() => {
      setSegundosSessao(Math.floor((Date.now() - inicioSessaoRef.current) / 1e3));
    }, 1e3);
    return () => window.clearInterval(intervalo);
  }, []);
  reactExports.useEffect(() => {
    if (compact || successShown || sessao.total < metaSessao || sessao.acertos / Math.max(1, sessao.total) < 0.8) {
      return;
    }
    setSuccessShown(true);
    setSuccessOpen(true);
  }, [compact, metaSessao, sessao, successShown]);
  function concluirQuestao(acertou, corrigiu) {
    if (!questaoAtual) return;
    const resultado = atualizarDificuldadeAdaptativa(questaoAtual.assunto);
    if (modo === "adaptativo" && resultado.mudou) {
      setAvisoAdaptativo(
        resultado.nivelNovo === "dificil" ? "As próximas questões vão exigir mais integração entre conceitos." : resultado.nivelNovo === "medio" ? "A sequência avançou para questões de aplicação." : "A sequência voltou aos fundamentos para consolidar a base."
      );
    }
    setRespondidoIds((atuais) => [...atuais, questaoAtual.id]);
    setSessao((atual) => ({
      acertos: atual.acertos + (acertou ? 1 : 0),
      total: atual.total + 1,
      creditos: atual.creditos + 4 + (acertou ? 4 : 0) + (corrigiu ? 3 : 0)
    }));
    if (usuario) {
      void recordStudyActivityServerFn({
        data: {
          eventId: crypto.randomUUID(),
          correct: acertou,
          corrected: corrigiu
        }
      }).then(() => emitProgressUpdated()).catch(() => void 0);
    }
  }
  function responder(letra) {
    if (!questaoAtual || etapa === "resultado" || letra === primeiroErro) return;
    setSelecionada(letra);
    const correta = letra === questaoAtual.correta;
    const tempoSegundos = Math.max(1, Math.round((Date.now() - inicioQuestaoRef.current) / 1e3));
    registrarResposta({
      questaoId: questaoAtual.id,
      letraEscolhida: letra,
      correta,
      tempoSegundos,
      respondidoEm: (/* @__PURE__ */ new Date()).toISOString(),
      confianca: confianca === "muito-alta" ? "alta" : confianca
    });
    if (etapa === "responder" && !correta) {
      setPrimeiroErro(letra);
      setEtapa("corrigir");
      setSelecionada(null);
      return;
    }
    const corrigiu = etapa === "corrigir" && correta;
    if (corrigiu) marcarRespostaCorrigida(questaoAtual.id);
    setEtapa("resultado");
    concluirQuestao(correta, corrigiu);
  }
  function proximaQuestao() {
    carregarMultipla();
  }
  function proximaQuestaoCalculo() {
    if (questaoCalculo) {
      setRespondidoIdsCalculo((atuais) => [...atuais, questaoCalculo.id]);
    }
    carregarCalculo();
  }
  function registrarSessaoCalculo(correta) {
    setSessao((atual) => ({
      acertos: atual.acertos + (correta ? 1 : 0),
      total: atual.total + 1,
      creditos: atual.creditos + 4 + (correta ? 4 : 0)
    }));
    if (usuario) {
      void recordStudyActivityServerFn({
        data: {
          eventId: crypto.randomUUID(),
          correct: correta,
          corrected: false
        }
      }).then(() => emitProgressUpdated()).catch(() => void 0);
    }
  }
  function useHint() {
    if (!questaoAtual || dicasUsadas >= 2) return;
    const hints = obterDicasQuestao(questaoAtual);
    const nextHint = hints[dicasAtuais.length];
    if (!nextHint) return;
    setDicasAtuais((current) => [...current, nextHint]);
    setDicasUsadas((current) => current + 1);
  }
  const desempenho = reactExports.useMemo(() => {
    void sessao.total;
    const todos = calcularDesempenhoPorAssunto();
    if (assunto === "misto") {
      const total = todos.reduce((soma, item) => soma + item.totalRespostas, 0);
      const acertos = todos.reduce((soma, item) => soma + item.acertos, 0);
      return {
        totalRespostas: total,
        taxaAcerto: total ? Math.round(acertos / total * 100) : 0
      };
    }
    return todos.find((item) => item.assunto === assunto);
  }, [assunto, sessao.total]);
  const sessaoConcluida = sessao.total >= metaSessao;
  const horaDaPausa = settings.breakReminders && segundosSessao >= settings.sessionMinutes * 60;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HighScoreDialog,
      {
        open: successOpen,
        onOpenChange: setSuccessOpen,
        correct: sessao.acertos,
        total: sessao.total,
        xp: sessao.creditos,
        reducedMotion: settings.motion === "reduced"
      }
    ),
    !compact && showToolbar && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "focus-optional flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-end lg:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Formato" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "ff-tabs mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "sr-only", children: "Tipo de questão" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setTipo("multipla"),
              className: `ff-tab ${tipo === "multipla" ? "active" : ""}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ListChecks, { className: "h-4 w-4", "aria-hidden": "true" }),
                " Escolha conceitual"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setTipo("calculo"),
              className: `ff-tab ${tipo === "calculo" ? "active" : ""}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calculator, { className: "h-4 w-4", "aria-hidden": "true" }),
                " Cálculo"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Ritmo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "ff-tabs mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "sr-only", children: "Dificuldade" }),
          ["facil", "medio", "dificil", "adaptativo"].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setModo(item);
                onModeChange?.(item);
              },
              className: `ff-tab ${modo === item ? "active" : ""}`,
              children: item === "adaptativo" ? "Adaptativo" : DIFICULDADE_LABEL[item]
            },
            item
          ))
        ] })
      ] })
    ] }),
    workspace ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 border-b border-border pb-5 sm:grid-cols-[1fr_minmax(14rem,24rem)_auto] sm:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs tracking-[0.17em] text-muted-foreground", children: [
        "QUESTÃO ",
        Math.min(sessao.total + 1, metaSessao),
        " DE ",
        metaSessao
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ff-progress-track", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "ff-progress-fill",
          style: {
            width: `${Math.min(100, (sessao.total + 1) / metaSessao * 100)}%`
          }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
        Math.min(100, Math.round((sessao.total + 1) / metaSessao * 100)),
        "%"
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 border-y border-border py-3 text-sm sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Sessão" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "ml-2 text-foreground", children: [
          sessao.total,
          "/",
          metaSessao
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Acertos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "ml-2 text-foreground", children: sessao.acertos })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center sm:justify-end", children: [
        settings.showTimer && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mr-4 inline-flex items-center gap-1 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock3, { className: "h-4 w-4", "aria-hidden": "true" }),
          " ",
          formatarRelogio(segundosSessao)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Créditos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "ml-2 text-primary", children: [
          "+",
          sessao.creditos
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:col-span-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "ff-progress-track",
          role: "progressbar",
          "aria-label": `${sessao.total} de ${metaSessao} questões`,
          "aria-valuemin": 0,
          "aria-valuemax": metaSessao,
          "aria-valuenow": Math.min(sessao.total, metaSessao),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "ff-progress-fill",
              style: {
                width: `${Math.min(100, sessao.total / metaSessao * 100)}%`
              }
            }
          )
        }
      ) })
    ] }),
    (sessaoConcluida || horaDaPausa) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-l-2 border-accent bg-card px-4 py-3 text-sm", role: "status", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: sessaoConcluida ? "Meta curta concluída." : "Momento de pausa." }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: sessaoConcluida ? "Feche a sessão agora ou continue sem perder o progresso." : "Levante, descanse os olhos e volte quando estiver pronto." })
    ] }),
    tipo === "calculo" ? questaoCalculo ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      CalculationCard,
      {
        questao: questaoCalculo,
        onProxima: proximaQuestaoCalculo,
        onRegistrado: registrarSessaoCalculo
      },
      calcKey
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyPractice, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: questaoAtual ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.article,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: duracaoMovimento },
        className: workspace ? "study-focus-surface overflow-hidden" : "ff-card study-focus-surface overflow-hidden",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: workspace ? "grid" : "grid md:grid-cols-[minmax(0,1fr)_13rem]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: workspace ? "p-5" : "p-5 sm:p-7 lg:p-9", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: ASSUNTO_LABEL[questaoAtual.assunto] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "/" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: questaoAtual.subassunto }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "/" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: DIFICULDADE_LABEL[questaoAtual.dificuldade] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h2",
                {
                  className: `reading-copy mt-5 max-w-5xl leading-[1.18] ${workspace ? "font-normal text-2xl sm:text-3xl lg:text-[2.45rem]" : "text-xl sm:text-2xl"}`,
                  children: questaoAtual.enunciado
                }
              ),
              questaoAtual.formula && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: workspace ? "mt-7 text-center font-[Georgia,serif] text-4xl italic text-foreground sm:text-5xl" : "mt-4 border-l-2 border-primary pl-4 font-mono text-lg font-bold text-primary",
                  children: questaoAtual.formula
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "mt-7", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "sr-only", children: "Alternativas" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: workspace ? "grid gap-2" : "ff-divider-list border-y border-border",
                    children: questaoAtual.alternativas.map((alternativa) => {
                      const correta = alternativa.letra === questaoAtual.correta;
                      const escolhida = alternativa.letra === selecionada;
                      const erroAnterior = alternativa.letra === primeiroErro;
                      const resultadoCorreto = etapa === "resultado" && correta;
                      const resultadoErrado = etapa === "resultado" && escolhida && !correta;
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: () => setSelecionada(alternativa.letra),
                          disabled: etapa === "resultado" || erroAnterior,
                          "aria-pressed": escolhida,
                          className: `flex min-h-14 w-full items-center gap-4 text-left transition-colors ${workspace ? "border px-5 py-3" : "px-1 py-4"} ${resultadoCorreto ? "bg-success/10 text-foreground" : resultadoErrado || erroAnterior ? "bg-destructive/8 text-muted-foreground" : escolhida ? "border-primary bg-primary/8 text-foreground" : "border-border bg-transparent text-foreground hover:bg-secondary"}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: `mt-0.5 grid h-7 w-7 shrink-0 place-items-center border font-mono text-xs font-bold ${resultadoCorreto ? "border-success bg-success text-success-foreground" : resultadoErrado || erroAnterior ? "border-destructive text-destructive" : "border-border-strong"}`,
                                children: alternativa.letra
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "reading-copy flex-1 text-sm leading-relaxed sm:text-base", children: alternativa.texto })
                          ]
                        },
                        alternativa.letra
                      );
                    })
                  }
                )
              ] }),
              etapa === "responder" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex flex-wrap items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-1 text-xs font-semibold text-muted-foreground", children: "Antes de responder, sua confiança:" }),
                ["baixa", "media", "alta", "muito-alta"].map((valor) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setConfianca(valor),
                    className: `min-h-9 border px-3 text-xs font-semibold capitalize ${confianca === valor ? "border-primary bg-primary text-primary-foreground" : "border-border bg-transparent text-muted-foreground"}`,
                    children: valor === "media" ? "Média" : valor === "muito-alta" ? "Muito alta" : `${valor.charAt(0).toUpperCase()}${valor.slice(1)}`
                  },
                  valor
                ))
              ] }),
              etapa !== "resultado" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => selecionada && responder(selecionada),
                  disabled: !selecionada,
                  className: "ff-btn-primary mt-6 min-w-64",
                  children: [
                    etapa === "corrigir" ? "Verificar correção" : "Verificar resposta",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4", "aria-hidden": "true" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { initial: false, children: [
                etapa === "corrigir" && primeiroErro && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { opacity: 0, height: 0 },
                    animate: { opacity: 1, height: "auto" },
                    exit: { opacity: 0, height: 0 },
                    transition: { duration: duracaoMovimento },
                    className: "mt-6 overflow-hidden",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-l-2 border-warning bg-warning/8 px-4 py-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: "Tente mais uma vez" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "reading-copy mt-1 text-sm leading-relaxed text-muted-foreground", children: questaoAtual.alternativas.find(
                        (alternativa) => alternativa.letra === primeiroErro
                      )?.explicacao })
                    ] })
                  }
                ),
                etapa === "resultado" && selecionada && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 8 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: duracaoMovimento },
                    className: "mt-6",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: selecionada === questaoAtual.correta ? primeiroErro ? "Conceito recuperado" : "Resposta correta" : "Revisão necessária" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "reading-copy mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base", children: questaoAtual.alternativas.find(
                        (alternativa) => alternativa.letra === questaoAtual.correta
                      )?.explicacao }),
                      avisoAdaptativo && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm font-semibold text-primary", children: avisoAdaptativo }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 border-y border-border py-3", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-foreground", children: "Análise pedagógica" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "reading-copy mt-1 text-sm leading-relaxed text-muted-foreground", children: pedagogicalAnalysis({
                          confidence: confianca,
                          firstError: primeiroErro,
                          correct: selecionada === questaoAtual.correta
                        }) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: proximaQuestao,
                          className: "ff-btn-primary mt-5",
                          children: [
                            "Próxima questão ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4", "aria-hidden": "true" })
                          ]
                        }
                      )
                    ] })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "aside",
              {
                className: workspace ? "focus-optional grid gap-6 border-t border-border bg-secondary/25 p-5 sm:grid-cols-2" : "focus-optional border-t border-border bg-secondary/45 p-5 md:border-l md:border-t-0",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Apoio" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: useHint,
                      disabled: dicasUsadas >= 2 || dicasAtuais.length >= 2,
                      className: "mt-3 flex min-h-11 w-full items-center justify-between gap-2 border-b border-border py-3 text-left text-sm font-semibold text-foreground disabled:cursor-not-allowed disabled:text-muted-foreground",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "h-4 w-4", "aria-hidden": "true" }),
                          "Usar dica"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
                          Math.max(0, 2 - dicasUsadas),
                          " restantes"
                        ] })
                      ]
                    }
                  ),
                  dicasAtuais.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "mt-3 grid gap-3 text-sm leading-relaxed text-muted-foreground", children: dicasAtuais.map((hint, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "border-b border-border pb-3 last:border-b-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2 font-mono text-xs text-primary", children: index + 1 }),
                    hint
                  ] }, hint)) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setQuadroAberto((aberto) => !aberto),
                      className: "mt-2 flex w-full items-center justify-between gap-2 border-b border-border py-3 text-left text-sm font-semibold text-foreground",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { className: "h-4 w-4", "aria-hidden": "true" }),
                          " Quadro de rascunho"
                        ] }),
                        quadroAberto ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4", "aria-hidden": "true" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4", "aria-hidden": "true" })
                      ]
                    }
                  ),
                  desempenho && desempenho.totalRespostas > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-5 text-xs leading-relaxed text-muted-foreground", children: [
                    "Histórico deste recorte: ",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                      desempenho.taxaAcerto,
                      "%"
                    ] }),
                    " de acerto em ",
                    desempenho.totalRespostas,
                    " tentativas."
                  ] })
                ]
              }
            )
          ] }),
          quadroAberto && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border p-3 sm:p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Whiteboard, { compact: true }) })
        ]
      },
      questaoAtual.id
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyPractice, {}) })
  ] });
}
function EmptyPractice() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ff-card p-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Ainda não há uma questão para este recorte." }) });
}
function ResetHistoricoButton({ onReset }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: onReset,
      className: "inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4", "aria-hidden": "true" }),
        " Reiniciar histórico de questões"
      ]
    }
  );
}
const ASSUNTOS = [{
  id: "misto",
  marcador: "Todas",
  titulo: "Revisão mista",
  apoio: "Prioriza erros e conteúdos esquecidos"
}, {
  id: "mecanica",
  marcador: "M",
  titulo: "Mecânica",
  apoio: "Vetores, diagramas, atrito e sistemas"
}, {
  id: "lei-1",
  marcador: "1ª",
  titulo: ASSUNTO_LABEL["lei-1"],
  apoio: "Inércia e equilíbrio"
}, {
  id: "lei-2",
  marcador: "2ª",
  titulo: ASSUNTO_LABEL["lei-2"],
  apoio: "Força, massa e aceleração"
}, {
  id: "lei-3",
  marcador: "3ª",
  titulo: ASSUNTO_LABEL["lei-3"],
  apoio: "Pares de ação e reação"
}];
function QuestoesPage() {
  const {
    assunto = "misto",
    modo = "adaptativo"
  } = Route$4.useSearch();
  const navigate = useNavigate({
    from: Route$4.fullPath
  });
  const settings = useSiteSettings();
  const [resetKey, setResetKey] = reactExports.useState(0);
  const revisoes = contarRevisoesPendentes(assunto === "misto" || assunto === "mecanica" ? void 0 : assunto);
  function setAssunto(next) {
    void navigate({
      search: (current) => ({
        ...current,
        assunto: next
      })
    });
  }
  function setModo(next) {
    void navigate({
      search: (current) => ({
        ...current,
        modo: next
      })
    });
  }
  function reiniciar() {
    limparHistorico();
    setResetKey((valor) => valor + 1);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "gm-reference-page study-focus-shell py-8", "data-focus": settings.focusMode ? "true" : "false", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "gm-shell relative", children: [
    settings.focusMode && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "ff-btn-outline absolute right-0 top-0 z-10", onClick: () => settings.setFocusMode(false), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4", "aria-hidden": "true" }),
      "Sair do foco"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "study-focus-layout grid gap-10 lg:grid-cols-[15.75rem_minmax(0,1fr)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "focus-optional border-r border-border pr-9 lg:min-h-[calc(100dvh-9.5rem)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "practice-subject", className: "font-mono text-xs tracking-[0.17em] text-muted-foreground", children: "DISCIPLINA" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { id: "practice-subject", className: "mt-2 w-full border-0 border-b border-border bg-transparent py-3 text-base text-foreground", value: assunto, onChange: (event) => setAssunto(event.target.value), children: ASSUNTOS.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: item.id, children: item.titulo }, item.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "mt-8 border-b border-border pb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "font-mono text-xs tracking-[0.17em] text-muted-foreground", children: "DIFICULDADE" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 grid grid-cols-2 gap-2", children: [["facil", "Fácil"], ["medio", "Médio"], ["dificil", "Difícil"], ["adaptativo", "Adaptativo"]].map(([value, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setModo(value), "aria-pressed": modo === value, className: `min-h-10 border px-2 text-xs font-medium ${modo === value ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground"}`, children: label }, value)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs leading-relaxed text-muted-foreground", children: modo === "adaptativo" ? "O nível muda conforme seus acertos e correções." : "Nível fixo durante esta sessão." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border py-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs tracking-[0.17em] text-muted-foreground", children: "DICAS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-base", children: "2 dicas por sessão" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs leading-relaxed text-muted-foreground", children: "O botão aparece junto à questão para manter a dica ligada ao raciocínio atual." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border py-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs tracking-[0.17em] text-muted-foreground", children: "META DIÁRIA" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-base", children: "Meta de hoje: 0 de 5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ff-progress-track mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ff-progress-fill w-0" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-xs text-muted-foreground", children: [
            revisoes,
            " ",
            revisoes === 1 ? "revisão pendente" : "revisões pendentes"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "ff-btn-outline mt-8 w-full", onClick: () => settings.setFocusMode(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Focus, { className: "h-4 w-4", "aria-hidden": "true" }),
          "Entrar no modo foco"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "min-w-0", "aria-live": "polite", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(QuestionPractice, { assunto, initialMode: modo, showToolbar: false, workspace: true, onModeChange: (nextMode) => void navigate({
          search: (current) => ({
            ...current,
            modo: nextMode
          })
        }) }, `${assunto}-${modo}-${resetKey}`),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "focus-optional mt-5 border-t border-border pt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResetHistoricoButton, { onReset: reiniciar }) })
      ] })
    ] })
  ] }) });
}
export {
  QuestoesPage as component
};
