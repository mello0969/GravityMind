import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { C as CalculationCard } from "./calculation-card-CrT420jk.mjs";
import { Q as QUESTOES_CALCULO } from "./router-BiedwaEF.mjs";

import "../_libs/seroval.mjs";
import { D as Delete } from "../_libs/lucide-react.mjs";

import "./engine-calculo-D3VYcpGG.mjs";
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
function calculateBinary(left, right, operator) {
  if (operator === "+") return left + right;
  if (operator === "−") return left - right;
  if (operator === "×") return left * right;
  if (operator === "÷") return right === 0 ? Number.NaN : left / right;
  return left ** right;
}
function calculateUnary(value, operator, unit) {
  const angle = unit === "deg" ? value * Math.PI / 180 : value;
  if (operator === "sin") return Math.sin(angle);
  if (operator === "cos") return Math.cos(angle);
  if (operator === "tan") return Math.tan(angle);
  if (operator === "log") return value > 0 ? Math.log10(value) : Number.NaN;
  if (operator === "ln") return value > 0 ? Math.log(value) : Number.NaN;
  if (operator === "sqrt") return value >= 0 ? Math.sqrt(value) : Number.NaN;
  return value ** 2;
}
function formatCalculatorValue(value) {
  if (!Number.isFinite(value)) return "Erro";
  const normalized = Number.parseFloat(value.toPrecision(12));
  if (Math.abs(normalized) >= 1e12 || Math.abs(normalized) > 0 && Math.abs(normalized) < 1e-9) {
    return normalized.toExponential(7);
  }
  return String(normalized);
}
function ScientificCalculator() {
  const [display, setDisplay] = reactExports.useState("0");
  const [stored, setStored] = reactExports.useState(null);
  const [pending, setPending] = reactExports.useState(null);
  const [replaceDisplay, setReplaceDisplay] = reactExports.useState(true);
  const [memory, setMemory] = reactExports.useState(0);
  const [unit, setUnit] = reactExports.useState("deg");
  const [history, setHistory] = reactExports.useState("");
  const value = Number(display);
  function show(result) {
    setDisplay(formatCalculatorValue(result));
    setReplaceDisplay(true);
  }
  function inputDigit(digit) {
    if (display === "Erro" || replaceDisplay) {
      setDisplay(digit);
      setReplaceDisplay(false);
      return;
    }
    if (display.replace(/[.-]/g, "").length < 14) setDisplay(`${display}${digit}`);
  }
  function inputDecimal() {
    if (display === "Erro" || replaceDisplay) {
      setDisplay("0.");
      setReplaceDisplay(false);
    } else if (!display.includes(".")) {
      setDisplay(`${display}.`);
    }
  }
  function chooseBinary(operator) {
    const current = Number.isFinite(value) ? value : 0;
    const nextStored = stored !== null && pending && !replaceDisplay ? calculateBinary(stored, current, pending) : current;
    setStored(nextStored);
    setPending(operator);
    setHistory(`${formatCalculatorValue(nextStored)} ${operator}`);
    show(nextStored);
  }
  function equals() {
    if (stored === null || !pending || !Number.isFinite(value)) return;
    const result = calculateBinary(stored, value, pending);
    setHistory(`${formatCalculatorValue(stored)} ${pending} ${formatCalculatorValue(value)} =`);
    setStored(null);
    setPending(null);
    show(result);
  }
  function unary(operator) {
    if (!Number.isFinite(value)) return;
    setHistory(`${operator}(${formatCalculatorValue(value)})`);
    show(calculateUnary(value, operator, unit));
  }
  function clear() {
    setDisplay("0");
    setStored(null);
    setPending(null);
    setHistory("");
    setReplaceDisplay(true);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "border border-border-strong bg-[#0a1812]",
      "aria-label": "Calculadora científica",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border p-5 text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "inline-flex border border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "sr-only", children: "Unidade angular" }),
              ["deg", "rad"].map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setUnit(option),
                  "aria-pressed": unit === option,
                  className: `min-h-8 px-3 font-mono text-xs uppercase ${unit === option ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`,
                  children: option
                },
                option
              ))
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
              "M ",
              formatCalculatorValue(memory)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 min-h-5 font-mono text-xs text-muted-foreground", children: history }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "output",
            {
              className: "mt-1 block min-h-14 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-4xl text-foreground",
              "aria-label": "Visor da calculadora",
              children: display
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-5 gap-px bg-border p-px", children: [
          ["MC", "MR", "M+", "M−"].map((label) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            CalcButton,
            {
              label,
              onClick: () => {
                if (label === "MC") setMemory(0);
                if (label === "MR") show(memory);
                if (label === "M+" && Number.isFinite(value)) setMemory((current) => current + value);
                if (label === "M−" && Number.isFinite(value)) setMemory((current) => current - value);
              },
              subtle: true
            },
            label
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalcButton, { label: "AC", onClick: clear, subtle: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalcButton, { label: "sin", onClick: () => unary("sin"), subtle: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalcButton, { label: "cos", onClick: () => unary("cos"), subtle: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalcButton, { label: "tan", onClick: () => unary("tan"), subtle: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalcButton, { label: "log", onClick: () => unary("log"), subtle: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalcButton, { label: "ln", onClick: () => unary("ln"), subtle: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalcButton, { label: "√x", onClick: () => unary("sqrt"), subtle: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalcButton, { label: "x²", onClick: () => unary("square"), subtle: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalcButton, { label: "xʸ", onClick: () => chooseBinary("^"), subtle: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalcButton, { label: "±", onClick: () => Number.isFinite(value) && show(-value), subtle: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalcButton, { label: "%", onClick: () => Number.isFinite(value) && show(value / 100), subtle: true }),
          ["7", "8", "9"].map((digit) => /* @__PURE__ */ jsxRuntimeExports.jsx(CalcButton, { label: digit, onClick: () => inputDigit(digit) }, digit)),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalcButton, { label: "÷", onClick: () => chooseBinary("÷"), operator: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CalcButton,
            {
              label: "⌫",
              ariaLabel: "Apagar último dígito",
              onClick: () => {
                if (replaceDisplay || display === "Erro") return;
                setDisplay((current) => current.length > 1 ? current.slice(0, -1) : "0");
              },
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Delete, { className: "h-5 w-5", "aria-hidden": "true" }),
              subtle: true
            }
          ),
          ["4", "5", "6"].map((digit) => /* @__PURE__ */ jsxRuntimeExports.jsx(CalcButton, { label: digit, onClick: () => inputDigit(digit) }, digit)),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalcButton, { label: "×", onClick: () => chooseBinary("×"), operator: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalcButton, { label: "π", onClick: () => show(Math.PI), subtle: true }),
          ["1", "2", "3"].map((digit) => /* @__PURE__ */ jsxRuntimeExports.jsx(CalcButton, { label: digit, onClick: () => inputDigit(digit) }, digit)),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalcButton, { label: "−", onClick: () => chooseBinary("−"), operator: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalcButton, { label: "e", onClick: () => show(Math.E), subtle: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalcButton, { label: "0", onClick: () => inputDigit("0") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalcButton, { label: ",", onClick: inputDecimal }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalcButton, { label: "=", onClick: equals, primary: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalcButton, { label: "+", onClick: () => chooseBinary("+"), operator: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalcButton, { label: "1/x", onClick: () => show(value === 0 ? Number.NaN : 1 / value), subtle: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "border-t border-border px-5 py-3 text-xs text-muted-foreground", children: [
          "Trigonometria usa ",
          unit === "deg" ? "graus" : "radianos",
          ". A memória fica nesta sessão."
        ] })
      ]
    }
  );
}
function CalcButton({
  label,
  ariaLabel,
  onClick,
  icon,
  subtle = false,
  operator = false,
  primary = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      "aria-label": ariaLabel ?? label,
      onClick,
      className: `grid min-h-14 place-items-center text-base transition-colors ${primary ? "bg-primary font-semibold text-primary-foreground hover:bg-[var(--primary-hover)]" : operator ? "bg-[#183027] text-primary hover:bg-[#203c31]" : subtle ? "bg-[#10221a] text-[#b4c1ba] hover:bg-secondary" : "bg-[#0c1b15] text-foreground hover:bg-secondary"}`,
      children: icon ?? label
    }
  );
}
function CalculationPage() {
  const [questionIndex, setQuestionIndex] = reactExports.useState(0);
  const question = QUESTOES_CALCULO[questionIndex % QUESTOES_CALCULO.length];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "gm-reference-page py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "gm-shell", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "max-w-3xl border-b border-border pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs tracking-[0.18em] text-muted-foreground", children: "FERRAMENTA DE ESTUDO" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 text-4xl font-normal sm:text-5xl", children: "Calculadora científica" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-base text-muted-foreground", children: "Faça operações básicas, trigonometria, logaritmos e exponenciação sem sair da resolução." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid gap-8 xl:grid-cols-[31rem_minmax(0,1fr)] xl:items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScientificCalculator, {}),
      question && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "aria-labelledby": "calculation-practice-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "calculation-practice-title", className: "mb-4 text-xl font-semibold", children: "Aplicar em uma questão" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CalculationCard, { questao: question, onProxima: () => setQuestionIndex((index) => index + 1) }, question.id)
      ] })
    ] })
  ] }) });
}
export {
  CalculationPage as component
};
