import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { P as PROGRESS_EVENT, f as contarRevisoesPendentes, m as montarPerfilAprendizagem, g as formatarDuracao, A as ASSUNTO_LABEL } from "./router-BiedwaEF.mjs";
import { u as useStudyProfile, l as listarMarcosReais, c as calcularRecompensas } from "./use-study-profile-uZPxI3Vs.mjs";

import "../_libs/seroval.mjs";
import { A as ArrowRight } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
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
import "./study-profile.server-BL4XQx6e.mjs";
function DashboardPage() {
  const [dados, setDados] = reactExports.useState(null);
  const {
    profile: studyProfile
  } = useStudyProfile();
  reactExports.useEffect(() => {
    const atualizar = () => {
      setDados({
        perfil: montarPerfilAprendizagem(),
        recompensas: calcularRecompensas(),
        marcos: listarMarcosReais(),
        revisoes: contarRevisoesPendentes(),
        studyProfile: studyProfile ?? {
          dailyGoal: 5,
          currentStreakDays: 0,
          correctStreak: 0,
          bestCorrectStreak: 0,
          totalXp: 0,
          todayAnswers: 0,
          todayCorrect: 0,
          plan: "free"
        }
      });
    };
    atualizar();
    window.addEventListener(PROGRESS_EVENT, atualizar);
    return () => window.removeEventListener(PROGRESS_EVENT, atualizar);
  }, [studyProfile]);
  if (!dados) return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardSkeleton, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardContent, { ...dados });
}
function DashboardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "ff-page", "aria-label": "Carregando painel", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ff-shell", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ff-skeleton h-4 w-28" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ff-skeleton mt-4 h-11 w-full max-w-lg" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-9 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-4", children: [0, 1, 2, 3].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-24 bg-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ff-skeleton h-3 w-20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ff-skeleton mt-4 h-7 w-14" })
    ] }, item)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ff-skeleton mt-10 h-72 w-full" })
  ] }) });
}
function DashboardContent({
  perfil,
  recompensas,
  marcos,
  revisoes,
  studyProfile
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "ff-page", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ff-shell", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "grid gap-6 border-b border-border pb-8 md:grid-cols-[1fr_auto] md:items-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Seu estudo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 text-3xl sm:text-4xl", children: "O próximo passo está definido" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "reading-copy mt-3 text-muted-foreground", children: perfil.recomendacao.motivo })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RecommendationLink, { perfil })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid gap-px overflow-hidden border-x border-b border-border bg-border sm:grid-cols-2 lg:grid-cols-4", "aria-label": "Resumo", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { label: "Meta de hoje", value: `${studyProfile.todayAnswers}/${studyProfile.dailyGoal}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { label: "Ofensiva diária", value: `${studyProfile.currentStreakDays} dia${studyProfile.currentStreakDays === 1 ? "" : "s"}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { label: "Sequência de acertos", value: String(studyProfile.correctStreak) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { label: "XP acumulado", value: String(studyProfile.totalXp) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 grid gap-12 xl:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.55fr)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "aria-labelledby": "leis-title", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Trilha" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "leis-title", className: "mt-2 text-2xl sm:text-3xl", children: "Leis de Newton" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-muted-foreground", children: [
              perfil.progressoGeralLicoes,
              "% concluído"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 border-y border-border", children: ["lei-1", "lei-2", "lei-3"].map((assunto, indice) => {
            const licao = perfil.licoes.find((item) => item.assunto === assunto);
            const desempenho = perfil.desempenho.find((item) => item.assunto === assunto);
            if (!licao || !desempenho) return null;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(LessonProgressRow, { assunto, numero: `${indice + 1}ª`, percentual: licao.percentual, taxaAcerto: desempenho.taxaAcerto, tentativas: desempenho.totalRespostas }, assunto);
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "aria-labelledby": "activity-title", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Últimos sete dias" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "activity-title", className: "mt-2 text-2xl sm:text-3xl", children: "Atividade registrada" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
              perfil.totalRespostas,
              " respostas, ",
              revisoes,
              " revisões pendentes e",
              " ",
              formatarDuracao(perfil.tempoTotalSegundos),
              " em questões."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid h-52 grid-cols-7 items-end gap-2 border-b border-border pb-7 sm:gap-4", children: perfil.atividade7Dias.map((dia) => {
            const maior = Math.max(1, ...perfil.atividade7Dias.map((item) => item.respostas));
            const altura = dia.respostas === 0 ? 3 : Math.max(16, dia.respostas / maior * 100);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col justify-end text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-2 text-xs font-semibold text-muted-foreground", children: dia.respostas || "" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-full max-w-10 bg-primary", style: {
                height: `${altura}%`
              }, title: `${dia.respostas} respostas, ${dia.acertos} acertos` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-2 text-[11px] font-semibold text-muted-foreground", children: dia.label })
            ] }, dia.data);
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "aria-labelledby": "milestones-title", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Marcos verificáveis" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "milestones-title", className: "mt-2 text-2xl sm:text-3xl", children: "O que já aconteceu" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ff-divider-list mt-5 border-y border-border", children: marcos.map((marco) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 py-4 sm:grid-cols-[1fr_1fr_auto] sm:items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-sm", children: marco.titulo }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: marco.criterio }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-bold ${marco.concluido ? "text-success" : "text-muted-foreground"}`, children: marco.concluido ? "Concluído" : "Pendente" })
          ] }, marco.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-10 xl:border-l xl:border-border xl:pl-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "aria-labelledby": "credits-title", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Recompensa transparente" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { id: "credits-title", className: "mt-2 text-2xl", children: [
            "Nível ",
            recompensas.nivel
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
            recompensas.creditos,
            " créditos acumulados"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ff-progress-track mt-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ff-progress-fill", style: {
            width: `${recompensas.creditosNoNivel}%`
          } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: recompensas.creditosNoNivel === 0 && recompensas.creditos > 0 ? "Novo nível alcançado" : `${recompensas.creditosParaProximoNivel} para o próximo nível` }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-6 border-y border-border py-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CreditLine, { label: "Questões praticadas", value: recompensas.detalhamento.pratica }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CreditLine, { label: "Questões acertadas", value: recompensas.detalhamento.acertos }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CreditLine, { label: "Erros corrigidos", value: recompensas.detalhamento.correcoes }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CreditLine, { label: "Partes de aula", value: recompensas.detalhamento.aulas }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CreditLine, { label: "Anotações", value: recompensas.detalhamento.anotacoes })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "focus-optional", "aria-labelledby": "tools-title", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Ferramentas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "tools-title", className: "mt-2 text-2xl", children: "Apoio à resolução" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "mt-4 border-y border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ToolLink, { to: "/questoes", label: "Prática adaptativa" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ToolLink, { to: "/quadro", label: "Quadro negro" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ToolLink, { to: "/anotacoes", label: "Anotações" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ToolLink, { to: "/configuracoes", label: "Modo foco e aparência" })
          ] })
        ] })
      ] })
    ] })
  ] }) });
}
function RecommendationLink({
  perfil
}) {
  const assunto = perfil.recomendacao.assunto;
  const aula = assunto === "lei-1" ? "/lei-1" : assunto === "lei-2" ? "/lei-2" : "/lei-3";
  const destino = perfil.recomendacao.tipo === "continuar-licao" ? aula : "/questoes";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: destino, className: "ff-btn-primary shrink-0", children: [
    perfil.recomendacao.tipo === "revisar" ? "Abrir revisão" : "Continuar estudo",
    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4", "aria-hidden": "true" })
  ] });
}
function Metric({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-24 bg-card p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-2xl font-bold text-foreground", children: value })
  ] });
}
function LessonProgressRow({
  assunto,
  numero,
  percentual,
  taxaAcerto,
  tentativas
}) {
  const destino = assunto === "lei-1" ? "/lei-1" : assunto === "lei-2" ? "/lei-2" : "/lei-3";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 border-b border-border py-5 last:border-b-0 md:grid-cols-[2.5rem_1fr_minmax(10rem,0.7fr)_auto] md:items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-bold text-muted-foreground", children: numero }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: ASSUNTO_LABEL[assunto] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: tentativas ? `${taxaAcerto}% em ${tentativas} tentativas` : "Ainda sem prática" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 flex justify-between text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Aula" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          percentual,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ff-progress-track", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ff-progress-fill", style: {
        width: `${percentual}%`
      } }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: destino, className: "ff-btn-outline", children: percentual ? "Continuar" : "Abrir" })
  ] });
}
function CreditLine({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-4 py-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("dd", { className: "font-bold", children: [
      "+",
      value
    ] })
  ] });
}
function ToolLink({
  to,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to, className: "flex items-center justify-between border-b border-border py-3 text-sm font-semibold last:border-b-0", children: [
    label,
    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 text-primary", "aria-hidden": "true" })
  ] });
}
export {
  DashboardPage as component
};
