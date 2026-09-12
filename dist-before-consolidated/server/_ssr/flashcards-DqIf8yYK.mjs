import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { m as motion } from "../_libs/motion.mjs";
import { u as useSiteSettings, s as storageKey } from "./router-BiedwaEF.mjs";
import { u as useStudyProfile } from "./use-study-profile-uZPxI3Vs.mjs";

import "../_libs/seroval.mjs";
import { k as ChevronLeft, l as ChevronRight, m as Square, n as LockKeyhole, R as RotateCcw, A as ArrowRight } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/unenv.mjs";


import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./server-DwUI_Cux.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




import "./schemas-Dga4YmnR.mjs";
import "../_libs/zod.mjs";
import "./study-profile.server-BL4XQx6e.mjs";
const FLASHCARD_DECKS = [
  {
    id: "fundamentos",
    name: "Fundamentos de Mecânica",
    description: "Vetores, forças e as três Leis de Newton",
    plusOnly: false,
    cards: [
      {
        id: "fc-inercia",
        topic: "1ª Lei",
        prompt: "Por que o passageiro se inclina para a frente quando o ônibus freia?",
        answer: "Por inércia, o corpo do passageiro tende a manter a velocidade que tinha antes da freada, enquanto o ônibus reduz sua velocidade.",
        formula: "ΣF = 0  →  velocidade constante"
      },
      {
        id: "fc-resultante",
        topic: "Vetores",
        prompt: "Por que duas forças de 5 N nem sempre produzem uma resultante de 10 N?",
        answer: "Porque força é vetorial. A soma depende também da direção e do sentido: forças opostas podem se cancelar e forças perpendiculares formam uma diagonal."
      },
      {
        id: "fc-segunda-lei",
        topic: "2ª Lei",
        prompt: "Se a força resultante dobra e a massa não muda, o que acontece com a aceleração?",
        answer: "A aceleração dobra. Para massa constante, força resultante e aceleração são diretamente proporcionais.",
        formula: "a = ΣF / m"
      },
      {
        id: "fc-normal",
        topic: "Contato",
        prompt: "A força normal é sempre igual ao peso?",
        answer: "Não. Ela é uma força de contato e assume o valor exigido pela dinâmica perpendicular à superfície. Em um elevador acelerado, por exemplo, pode superar ou ficar abaixo do peso."
      },
      {
        id: "fc-atrito",
        topic: "Atrito",
        prompt: "Como o atrito estático se comporta antes de um objeto deslizar?",
        answer: "Ele se ajusta à tendência de deslizamento até um valor máximo. Não atua sempre com seu módulo máximo.",
        formula: "Fat,est ≤ μe · N"
      },
      {
        id: "fc-terceira-lei",
        topic: "3ª Lei",
        prompt: "Por que forças de ação e reação não se cancelam?",
        answer: "Porque atuam em corpos diferentes. Para calcular a resultante, somamos apenas as forças que agem sobre o mesmo corpo."
      },
      {
        id: "fc-curva",
        topic: "Movimento",
        prompt: "Um carro pode acelerar mesmo com o velocímetro constante?",
        answer: "Sim. Em uma curva, a direção do vetor velocidade muda. Essa variação já caracteriza aceleração."
      },
      {
        id: "fc-newton",
        topic: "Unidades",
        prompt: "O que significa dizer que uma força tem módulo de 1 newton?",
        answer: "Significa que ela pode produzir aceleração de 1 m/s² em uma massa de 1 kg, quando é a força resultante.",
        formula: "1 N = 1 kg · m/s²"
      },
      {
        id: "fc-impulso",
        topic: "Impulso",
        prompt: "Por que aumentar o tempo de uma colisão pode reduzir a força média?",
        answer: "Para a mesma variação de quantidade de movimento, distribuir o impulso por mais tempo reduz a força média.",
        formula: "I = Fmédia · Δt = Δp"
      },
      {
        id: "fc-peso-massa",
        topic: "Gravitação",
        prompt: "Qual é a diferença entre massa e peso?",
        answer: "Massa mede a inércia do corpo. Peso é a força gravitacional exercida sobre essa massa e depende do campo gravitacional local.",
        formula: "P = m · g"
      },
      {
        id: "fc-energia",
        topic: "Energia",
        prompt: "O que acontece com a energia potencial gravitacional durante uma queda sem resistência do ar?",
        answer: "Ela se transforma em energia cinética, enquanto a energia mecânica total permanece constante.",
        formula: "mgh + mv²/2 = constante"
      },
      {
        id: "fc-curva-forca",
        topic: "Movimento circular",
        prompt: "Para onde aponta a força resultante em uma curva uniforme?",
        answer: "Ela aponta para o centro da trajetória e muda continuamente a direção da velocidade.",
        formula: "Fc = m · v²/r"
      }
    ]
  },
  {
    id: "desafios",
    name: "Desafios integrados",
    description: "Sistemas, referenciais e peso aparente",
    plusOnly: true,
    cards: [
      {
        id: "fc-plus-elevador",
        topic: "Peso aparente",
        prompt: "Qual equação organiza as forças sobre uma pessoa em um elevador que acelera para cima?",
        answer: "Escolhendo para cima como positivo, a normal supera o peso e a diferença produz a aceleração.",
        formula: "N − mg = ma"
      },
      {
        id: "fc-plus-blocos",
        topic: "Sistemas",
        prompt: "Qual é a primeira decisão ao resolver dois blocos em contato?",
        answer: "Tratar os blocos como um sistema para achar a aceleração comum. Depois, isolar um deles para encontrar a força de contato."
      },
      {
        id: "fc-plus-referencial",
        topic: "Referenciais",
        prompt: "Quando um referencial deixa de ser inercial?",
        answer: "Quando ele acelera ou gira em relação a um referencial inercial. Nesse caso, forças de inércia podem ser introduzidas para descrever o movimento dentro dele."
      },
      {
        id: "fc-plus-plano",
        topic: "Plano inclinado",
        prompt: "Qual componente do peso acelera um bloco ao longo de um plano inclinado sem atrito?",
        answer: "A componente paralela ao plano. A componente perpendicular é equilibrada pela normal.",
        formula: "P∥ = mg · sen θ"
      },
      {
        id: "fc-plus-foguete",
        topic: "Propulsão",
        prompt: "Por que um foguete não precisa empurrar o ar para acelerar?",
        answer: "Ele empurra os próprios gases para trás e recebe deles uma força para frente. O par de interação existe mesmo no vácuo."
      }
    ]
  }
];
function FlashcardsPage() {
  const settings = useSiteSettings();
  const {
    profile
  } = useStudyProfile();
  const [deckId, setDeckId] = reactExports.useState("fundamentos");
  const [index, setIndex] = reactExports.useState(0);
  const [revealed, setRevealed] = reactExports.useState(false);
  const [autoAdvance, setAutoAdvance] = reactExports.useState(true);
  const [ratings, setRatings] = reactExports.useState({});
  const [phase, setPhase] = reactExports.useState("study");
  const timerRef = reactExports.useRef(null);
  const deck = FLASHCARD_DECKS.find((item) => item.id === deckId) ?? FLASHCARD_DECKS[0];
  const card = deck.cards[index];
  const reducedMotion = settings.motion === "reduced";
  reactExports.useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, []);
  reactExports.useEffect(() => {
    function handleKeyboard(event) {
      if (phase !== "study") return;
      if (event.key === "ArrowLeft") goTo(index - 1);
      if (event.key === "ArrowRight") goTo(index + 1);
      if (event.key === " ") {
        event.preventDefault();
        setRevealed(true);
      }
      if (!revealed) return;
      if (event.key === "1") rate("review");
      if (event.key === "2") rate("almost");
      if (event.key === "3") rate("mastered");
    }
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  });
  function finish(nextRatings = ratings) {
    setRatings(nextRatings);
    setPhase("results");
    const historyKey = storageKey("flashcard-sessions");
    const previous = JSON.parse(window.localStorage.getItem(historyKey) ?? "[]");
    const summary = {
      deckId,
      finishedAt: (/* @__PURE__ */ new Date()).toISOString(),
      total: Object.keys(nextRatings).length,
      mastered: Object.values(nextRatings).filter((value) => value === "mastered").length
    };
    window.localStorage.setItem(historyKey, JSON.stringify([...previous.slice(-29), summary]));
  }
  function goTo(nextIndex) {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setIndex((nextIndex + deck.cards.length) % deck.cards.length);
    setRevealed(false);
  }
  function rate(rating) {
    if (!card) return;
    const nextRatings = {
      ...ratings,
      [card.id]: rating
    };
    setRatings(nextRatings);
    if (!autoAdvance) return;
    timerRef.current = window.setTimeout(() => {
      if (index >= deck.cards.length - 1) {
        finish(nextRatings);
        return;
      }
      goTo(index + 1);
    }, reducedMotion ? 0 : 260);
  }
  function reset() {
    setIndex(0);
    setRevealed(false);
    setRatings({});
    setPhase("study");
  }
  function selectDeck(nextId) {
    const next = FLASHCARD_DECKS.find((item) => item.id === nextId);
    if (!next || next.plusOnly && profile?.plan !== "plus") return;
    setDeckId(nextId);
    reset();
  }
  const results = reactExports.useMemo(() => {
    const values = Object.values(ratings);
    return {
      total: values.length,
      review: values.filter((value) => value === "review").length,
      almost: values.filter((value) => value === "almost").length,
      mastered: values.filter((value) => value === "mastered").length
    };
  }, [ratings]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "gm-reference-page py-12 sm:py-14", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "gm-shell", children: phase === "study" && card ? /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "aria-label": "Deck em andamento", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-[62rem] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-normal sm:text-5xl", children: "Flash Cards" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6 text-base text-[#d7dfda]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Cartão ",
          index + 1,
          " de ",
          deck.cards.length
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ff-progress-track w-52", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ff-progress-fill", style: {
          width: `${(index + 1) / deck.cards.length * 100}%`
        } }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-9 grid items-center gap-5 lg:grid-cols-[4.25rem_minmax(0,62rem)_4.25rem] lg:justify-center lg:gap-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => goTo(index - 1), className: "hidden h-16 w-16 place-items-center border border-border-strong text-foreground hover:bg-secondary lg:grid", "aria-label": "Cartão anterior", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-8 w-8", strokeWidth: 1.5, "aria-hidden": "true" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "[perspective:1400px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.article, { animate: {
        rotateY: revealed ? 180 : 0
      }, transition: {
        duration: reducedMotion ? 0 : 0.46,
        ease: [0.16, 1, 0.3, 1]
      }, className: "relative h-[34.25rem] border border-border-strong bg-[#0a1812] [transform-style:preserve-3d]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-between p-8 text-center [backface-visibility:hidden] sm:p-14", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "reading-copy max-w-3xl text-3xl font-normal leading-snug sm:text-[2.35rem]", children: card.prompt }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(BusDiagram, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[0.65rem] tracking-[0.16em] text-muted-foreground", children: card.topic })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col justify-between p-8 [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-14", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs tracking-[0.18em] text-primary", children: "RESPOSTA" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "reading-copy text-2xl leading-relaxed sm:text-3xl", children: card.answer }),
            card.formula && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-7 border-t border-border pt-5 font-[Georgia,serif] text-2xl italic text-primary", children: card.formula })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "grid grid-cols-3 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "sr-only", children: "Como foi lembrar?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(RatingButton, { label: "Rever", onClick: () => rate("review") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(RatingButton, { label: "Quase", onClick: () => rate("almost") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(RatingButton, { label: "Dominei", onClick: () => rate("mastered"), primary: true })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => goTo(index + 1), className: "hidden h-16 w-16 place-items-center border border-border-strong text-foreground hover:bg-secondary lg:grid", "aria-label": "Próximo cartão", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-8 w-8", strokeWidth: 1.5, "aria-hidden": "true" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto mt-10 grid max-w-[62rem] gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ff-btn-primary min-h-16 text-lg", onClick: () => setRevealed(true), children: "Revelar resposta" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "ff-btn-outline min-h-16 text-lg", onClick: () => finish(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "h-4 w-4", "aria-hidden": "true" }),
        "Terminar"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", role: "switch", "aria-checked": autoAdvance, onClick: () => setAutoAdvance((value) => !value), className: "flex min-h-16 items-center gap-5 border-l border-border px-6 text-sm text-[#d8e0db]", children: [
        "Avanço automático",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `relative h-7 w-14 rounded-full ${autoAdvance ? "bg-primary" : "bg-secondary"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute top-1 h-5 w-5 rounded-full bg-[#eef3ef] transition-transform ${autoAdvance ? "translate-x-8" : "translate-x-1"}` }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto mt-32 flex max-w-[62rem] flex-wrap items-end justify-between gap-4 border-t border-border pt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "grid gap-2 text-xs text-muted-foreground", htmlFor: "deck-select", children: [
        "Deck",
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { id: "deck-select", className: "ff-input min-w-72", value: deckId, onChange: (event) => selectDeck(event.target.value), children: FLASHCARD_DECKS.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: item.id, disabled: item.plusOnly && profile?.plan !== "plus", children: [
          item.name,
          item.plusOnly ? " · Plus" : ""
        ] }, item.id)) })
      ] }),
      profile?.plan !== "plus" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/plus", className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LockKeyhole, { className: "h-4 w-4", "aria-hidden": "true" }),
        "Desafios integrados no Plus"
      ] })
    ] })
  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-3xl py-16", "aria-labelledby": "results-title", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Sessão encerrada" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { id: "results-title", className: "mt-3 text-4xl font-normal", children: "Resultado do deck" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "reading-copy mt-3 text-muted-foreground", children: "Use a lista de revisão para escolher o próximo formato de estudo." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-8 grid grid-cols-2 border-y border-border sm:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ResultMetric, { label: "Respondidos", value: results.total }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ResultMetric, { label: "Rever", value: results.review }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ResultMetric, { label: "Quase", value: results.almost }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ResultMetric, { label: "Dominados", value: results.mastered })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "ff-btn-primary", onClick: reset, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4", "aria-hidden": "true" }),
        "Refazer deck"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/questoes", className: "ff-btn-outline", children: [
        "Aplicar em questões",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4", "aria-hidden": "true" })
      ] })
    ] })
  ] }) }) });
}
function BusDiagram() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 720 300", className: "h-auto w-full max-w-[55rem] text-[#d8e2dd]", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2.2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M112 235h508M178 204h349c18 0 30-12 30-30v-70l-24-54c-6-14-19-22-35-22H235c-31 0-57 25-57 56v120Z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M198 51h300l22 78H198V51Zm92 0v78m189-78v78M405 51v153" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M535 130h22m-379 74h379m-30-73v73" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "258", cy: "204", r: "34" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "258", cy: "204", r: "17" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "486", cy: "204", r: "34" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "486", cy: "204", r: "17" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "356", cy: "79", r: "13" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M352 94c-16 14-21 32-18 51l8 38m16-76 17 21 22 5m-48 48h28l8 23m-50-72-8 34" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "447", cy: "79", r: "13" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "m440 94-17 31 18 20h30m-31-26 31 13 17 22m-67-10 1 35h35l8 25" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M291 78h42m-42 12h42m-31-25 10 7-10 7", strokeDasharray: "6 7" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M112 204h35m-45-20h45m-34-20h34", opacity: "0.68" })
  ] }) });
}
function RatingButton({
  label,
  onClick,
  primary = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick, className: primary ? "ff-btn-primary min-w-0 px-2" : "ff-btn-outline min-w-0 px-2", children: label });
}
function ResultMetric({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-r border-border p-4 last:border-r-0 sm:border-b-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "mt-2 text-2xl font-semibold", children: value })
  ] });
}
export {
  FlashcardsPage as component
};
