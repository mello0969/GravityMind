import { p as performance } from "../_libs/unenv.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { m as motion } from "../_libs/motion.mjs";
import { u as useSiteSettings, h as marcosConcluidos, p as percentualLicao, G as GravityChat, i as gerarResumoPerfilParaGravity, j as marcarConcluido } from "./router-BiedwaEF.mjs";
import { o as BookOpen, F as FileText, p as ScanSearch, q as Play, B as Bot, r as ArrowLeft, A as ArrowRight, R as RotateCcw, s as Pause, t as SlidersHorizontal } from "../_libs/lucide-react.mjs";
import { A as AnimatePresence } from "../_libs/framer-motion.mjs";
const MINIMO_ACERTOS = 2;
const FORMATO_LABEL = {
  texto: "aula",
  resumo: "resumo",
  visual: "diagrama",
  video: "simulação"
};
function ContentQuiz({
  quiz,
  onAprovado,
  onFechar,
  accent = "var(--primary)"
}) {
  const [indiceAtual, setIndiceAtual] = reactExports.useState(0);
  const [fase, setFase] = reactExports.useState("respondendo");
  const [respostas, setRespostas] = reactExports.useState([]);
  const [escolhida, setEscolhida] = reactExports.useState(null);
  const perguntaAtual = quiz.perguntas[indiceAtual];
  const acertos = respostas.filter((resposta) => resposta.correta).length;
  const aprovado = acertos >= MINIMO_ACERTOS;
  function escolher(indice) {
    if (fase !== "respondendo") return;
    setEscolhida(indice);
    setRespostas((atuais) => [
      ...atuais,
      {
        perguntaId: perguntaAtual.id,
        indiceEscolhido: indice,
        correta: indice === perguntaAtual.correta
      }
    ]);
    setFase("revelado");
  }
  function avancar() {
    if (indiceAtual < quiz.perguntas.length - 1) {
      setIndiceAtual((valor) => valor + 1);
      setEscolhida(null);
      setFase("respondendo");
    } else {
      setFase("concluido");
    }
  }
  function reiniciar() {
    setIndiceAtual(0);
    setEscolhida(null);
    setRespostas([]);
    setFase("respondendo");
  }
  if (fase === "concluido") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "border border-border bg-card p-5 sm:p-7", "aria-live": "polite", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Resultado da verificação" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-2 text-2xl", children: aprovado ? "Compreensão confirmada" : "Revise este formato" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-sm text-muted-foreground", children: [
        "Você acertou ",
        acertos,
        " de ",
        quiz.perguntas.length,
        ". O progresso exige pelo menos",
        " ",
        MINIMO_ACERTOS,
        " respostas corretas."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 grid gap-px border border-border bg-border sm:grid-cols-3", children: respostas.map((resposta, indice) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card px-3 py-3 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
          "Pergunta ",
          indice + 1
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: `ml-2 ${resposta.correta ? "text-success" : "text-destructive"}`, children: resposta.correta ? "Correta" : "Incorreta" })
      ] }, resposta.perguntaId)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap gap-2", children: [
        aprovado ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onAprovado, className: "ff-btn-primary", children: "Registrar progresso" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: reiniciar, className: "ff-btn-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4", "aria-hidden": "true" }),
          " Tentar novamente"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onFechar, className: "ff-btn-outline", children: "Fechar" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "border border-border bg-card p-5 sm:p-7", "aria-labelledby": "quiz-question", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 text-xs font-semibold text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Verificação do ",
        FORMATO_LABEL[quiz.formato] ?? quiz.formato
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        indiceAtual + 1,
        " de ",
        quiz.perguntas.length
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ff-progress-track mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-full",
        style: {
          width: `${(indiceAtual + (fase === "revelado" ? 1 : 0)) / quiz.perguntas.length * 100}%`,
          background: accent
        }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { id: "quiz-question", className: "reading-copy mt-6 text-lg leading-relaxed", children: perguntaAtual.pergunta }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ff-divider-list mt-5 border-y border-border", children: perguntaAtual.opcoes.map((opcao, indice) => {
      const correta = indice === perguntaAtual.correta;
      const selecionada = indice === escolhida;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => escolher(indice),
          disabled: fase === "revelado",
          className: `flex min-h-14 w-full items-start gap-3 py-3 text-left text-sm ${fase === "revelado" && correta ? "bg-success/10" : fase === "revelado" && selecionada ? "bg-destructive/8" : "hover:bg-secondary"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-6 w-6 shrink-0 place-items-center border border-border-strong font-mono text-xs font-bold", children: String.fromCharCode(65 + indice) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "reading-copy leading-relaxed", children: opcao })
          ]
        },
        opcao
      );
    }) }),
    fase === "revelado" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 border-l-2 border-primary pl-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "reading-copy text-sm leading-relaxed text-muted-foreground", children: perguntaAtual.explicacao }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: avancar, className: "ff-btn-primary mt-4", children: [
        indiceAtual < quiz.perguntas.length - 1 ? "Próxima pergunta" : "Ver resultado",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4", "aria-hidden": "true" })
      ] })
    ] })
  ] });
}
function LawAnimation({ assunto }) {
  if (assunto === "lei-1") return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimacaoLei1, {});
  if (assunto === "lei-2") return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimacaoLei2, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimacaoLei3, {});
}
function Shell({
  children,
  controles,
  legenda,
  tocando,
  onToggle,
  onReiniciar
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border bg-card p-3 sm:p-5", children: [
    children,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: onToggle, className: "ff-btn-primary", children: [
        tocando ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "h-4 w-4", "aria-hidden": "true" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4", "aria-hidden": "true" }),
        tocando ? "Pausar" : "Reproduzir"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: onReiniciar, className: "ff-btn-outline", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4", "aria-hidden": "true" }),
        " Reiniciar"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 border-t border-border pt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-1.5 text-xs font-bold text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "h-3.5 w-3.5", "aria-hidden": "true" }),
        " Ajuste as variáveis"
      ] }),
      controles
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-xs leading-relaxed text-muted-foreground", children: legenda })
  ] });
}
function Slider({
  label,
  valor,
  min,
  max,
  step,
  unidade,
  cor,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 last:mb-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5 flex items-center justify-between text-xs font-bold", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: cor }, children: [
        valor,
        " ",
        unidade
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "range",
        min,
        max,
        step,
        value: valor,
        onChange: (e) => onChange(parseFloat(e.target.value)),
        className: "ff-slider w-full",
        style: { color: "var(--primary)" }
      }
    )
  ] });
}
function useLoop(tocando, duracao, onTick) {
  const frameRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    if (!tocando) return;
    let ultimo = performance.now();
    let acumulado = 0;
    function passo(agora) {
      const dt = (agora - ultimo) / 1e3;
      ultimo = agora;
      acumulado += dt;
      if (acumulado > duracao) acumulado = 0;
      onTick(acumulado);
      frameRef.current = requestAnimationFrame(passo);
    }
    frameRef.current = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(frameRef.current);
  }, [duracao, onTick, tocando]);
}
function desenharBloco(ctx, x, y, cor, label, tamanho = 46) {
  ctx.fillStyle = cor;
  ctx.beginPath();
  ctx.roundRect(x - tamanho / 2, y - tamanho / 2, tamanho, tamanho, 4);
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.font = "bold 13px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x, y);
}
function desenharSeta(ctx, x, y, comprimento, cor) {
  if (Math.abs(comprimento) < 1) return;
  const direcao = comprimento > 0 ? 1 : -1;
  const fim = x + comprimento;
  ctx.strokeStyle = cor;
  ctx.fillStyle = cor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(fim, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(fim, y);
  ctx.lineTo(fim - 8 * direcao, y - 5);
  ctx.lineTo(fim - 8 * direcao, y + 5);
  ctx.closePath();
  ctx.fill();
}
function desenharGrade(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 34) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
}
function rotuloCanvas(ctx, texto) {
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(texto, 20, 24);
}
function AnimacaoLei1() {
  const canvasRef = reactExports.useRef(null);
  const [tocando, setTocando] = reactExports.useState(false);
  const [impulso, setImpulso] = reactExports.useState(30);
  const DURACAO = 4;
  const T_IMPULSO = 1.2;
  const velocidade = impulso * 3.2;
  const desenhar = reactExports.useCallback(
    (t) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      desenharGrade(ctx, w, h);
      const y = h / 2;
      const inicioX = 90;
      let x = inicioX;
      let mostrarForca = false;
      if (t < T_IMPULSO) {
        x = inicioX;
      } else {
        x = inicioX + velocidade * (t - T_IMPULSO);
        mostrarForca = t - T_IMPULSO < 0.3;
      }
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.beginPath();
      ctx.moveTo(20, y + 30);
      ctx.lineTo(w - 20, y + 30);
      ctx.stroke();
      rotuloCanvas(
        ctx,
        t < T_IMPULSO ? "Repouso, sem força resultante" : `Velocidade constante ≈ ${(velocidade / 32).toFixed(1)} m/s (sem força)`
      );
      if (mostrarForca) desenharSeta(ctx, x - 50, y, 30, "#D09A4C");
      desenharBloco(ctx, Math.min(x, w - 50), y, "#4B7869", "m");
    },
    [velocidade]
  );
  useLoop(tocando, DURACAO, desenhar);
  reactExports.useEffect(() => {
    desenhar(0);
  }, [desenhar]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Shell,
    {
      tocando,
      onToggle: () => setTocando((v) => !v),
      onReiniciar: () => {
        setTocando(false);
        desenhar(0);
      },
      legenda: "Aumente o impulso e veja: o bloco sai com mais velocidade e a mantém constante enquanto nenhuma força o freia. Isso é inércia do movimento.",
      controles: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Slider,
        {
          label: "Intensidade do impulso",
          valor: impulso,
          min: 10,
          max: 60,
          step: 5,
          unidade: "N·s",
          cor: "#7FB39F",
          onChange: setImpulso
        }
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "canvas",
        {
          ref: canvasRef,
          width: 680,
          height: 260,
          className: "w-full border border-[#52635D] bg-[#1C2B26]",
          style: { aspectRatio: "680 / 260" }
        }
      )
    }
  );
}
function AnimacaoLei2() {
  const canvasRef = reactExports.useRef(null);
  const [tocando, setTocando] = reactExports.useState(false);
  const [forca, setForca] = reactExports.useState(20);
  const [massa, setMassa] = reactExports.useState(2);
  const DURACAO = 3;
  const FORCA_REF = 20;
  const MASSA_REF = 4;
  const A_REF = FORCA_REF / MASSA_REF;
  const aceleracao = forca / massa;
  const desenhar = reactExports.useCallback(
    (t) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      desenharGrade(ctx, w, h);
      const inicioX = 90;
      const yVariavel = h * 0.32;
      const yRef = h * 0.72;
      const escala = 9;
      const xVariavel = Math.min(inicioX + 0.5 * aceleracao * escala * t * t, w - 50);
      const xRef = Math.min(inicioX + 0.5 * A_REF * escala * t * t, w - 50);
      rotuloCanvas(
        ctx,
        `a = F/m = ${forca}/${massa} = ${aceleracao.toFixed(1)} m/s²  (bloco de cima)`
      );
      if (xVariavel < w - 55) desenharSeta(ctx, xVariavel - 45, yVariavel, 25, "#82B89F");
      desenharBloco(ctx, xVariavel, yVariavel, "#4B7869", `${massa}kg`);
      if (xRef < w - 55) desenharSeta(ctx, xRef - 45, yRef, 25, "#D09A4C");
      desenharBloco(ctx, xRef, yRef, "#6B7280", `${MASSA_REF}kg (ref)`, 52);
    },
    [A_REF, aceleracao, forca, massa]
  );
  useLoop(tocando, DURACAO, desenhar);
  reactExports.useEffect(() => {
    desenhar(0);
  }, [desenhar]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Shell,
    {
      tocando,
      onToggle: () => setTocando((v) => !v),
      onReiniciar: () => {
        setTocando(false);
        desenhar(0);
      },
      legenda: `Bloco de cima: você controla F e m. O bloco cinza é a referência fixa, com F=${FORCA_REF}N, m=${MASSA_REF}kg e a=${A_REF.toFixed(1)}m/s². Compare as acelerações.`,
      controles: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Slider,
          {
            label: "Força aplicada (F)",
            valor: forca,
            min: 5,
            max: 40,
            step: 1,
            unidade: "N",
            cor: "#7FB39F",
            onChange: setForca
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Slider,
          {
            label: "Massa do bloco (m)",
            valor: massa,
            min: 1,
            max: 10,
            step: 0.5,
            unidade: "kg",
            cor: "#7FB39F",
            onChange: setMassa
          }
        )
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "canvas",
        {
          ref: canvasRef,
          width: 680,
          height: 260,
          className: "w-full border border-[#52635D] bg-[#1C2B26]",
          style: { aspectRatio: "680 / 260" }
        }
      )
    }
  );
}
function AnimacaoLei3() {
  const canvasRef = reactExports.useRef(null);
  const [tocando, setTocando] = reactExports.useState(false);
  const [massaA, setMassaA] = reactExports.useState(2);
  const [massaB, setMassaB] = reactExports.useState(4);
  const DURACAO = 3;
  const T_EMPURRAO = 0.4;
  const FORCA_INTERACAO = 20;
  const aceleracaoA = FORCA_INTERACAO / massaA;
  const aceleracaoB = FORCA_INTERACAO / massaB;
  const desenhar = reactExports.useCallback(
    (t) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      desenharGrade(ctx, w, h);
      const y = h / 2;
      const centro = w / 2;
      const escala = 14;
      let xA = centro - 25;
      let xB = centro + 25;
      let mostrarForcas = false;
      if (t > T_EMPURRAO) {
        const decorrido = t - T_EMPURRAO;
        xA = centro - 25 - aceleracaoA * escala * decorrido;
        xB = centro + 25 + aceleracaoB * escala * decorrido;
        mostrarForcas = decorrido < 0.3;
      }
      rotuloCanvas(
        ctx,
        `F igual nos dois (${FORCA_INTERACAO}N). aA=${aceleracaoA.toFixed(1)} m/s² e aB=${aceleracaoB.toFixed(1)} m/s²`
      );
      if (mostrarForcas) {
        desenharSeta(ctx, centro - 25, y, -25, "#C77962");
        desenharSeta(ctx, centro + 25, y, 25, "#6F98C3");
      }
      desenharBloco(ctx, Math.max(xA, 40), y, "#B86751", `A ${massaA}kg`, 50);
      desenharBloco(ctx, Math.min(xB, w - 40), y, "#4B78A8", `B ${massaB}kg`, 50);
    },
    [aceleracaoA, aceleracaoB, massaA, massaB]
  );
  useLoop(tocando, DURACAO, desenhar);
  reactExports.useEffect(() => {
    desenhar(0);
  }, [desenhar]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Shell,
    {
      tocando,
      onToggle: () => setTocando((v) => !v),
      onReiniciar: () => {
        setTocando(false);
        desenhar(0);
      },
      legenda: "A força de interação é sempre igual nos dois blocos. O que muda com a massa é a aceleração de cada um, não a força.",
      controles: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Slider,
          {
            label: "Massa do bloco A",
            valor: massaA,
            min: 1,
            max: 8,
            step: 0.5,
            unidade: "kg",
            cor: "#C77962",
            onChange: setMassaA
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Slider,
          {
            label: "Massa do bloco B",
            valor: massaB,
            min: 1,
            max: 8,
            step: 0.5,
            unidade: "kg",
            cor: "#6F98C3",
            onChange: setMassaB
          }
        )
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "canvas",
        {
          ref: canvasRef,
          width: 680,
          height: 260,
          className: "w-full border border-[#52635D] bg-[#1C2B26]",
          style: { aspectRatio: "680 / 260" }
        }
      )
    }
  );
}
function LawDiagram({ assunto }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-auto border border-border bg-card p-2 sm:p-4", children: [
    assunto === "lei-1" && /* @__PURE__ */ jsxRuntimeExports.jsx(DiagramaLei1, {}),
    assunto === "lei-2" && /* @__PURE__ */ jsxRuntimeExports.jsx(DiagramaLei2, {}),
    assunto === "lei-3" && /* @__PURE__ */ jsxRuntimeExports.jsx(DiagramaLei3, {})
  ] });
}
function DiagramaLei1() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      viewBox: "0 0 720 300",
      className: "min-w-[560px] w-full",
      role: "img",
      "aria-labelledby": "lei1-diagram-title",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("title", { id: "lei1-diagram-title", children: "Comparação entre repouso e movimento uniforme quando a força resultante é nula" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "720", height: "300", rx: "4", className: "fill-secondary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: "360",
            y1: "40",
            x2: "360",
            y2: "260",
            className: "stroke-border-strong",
            strokeDasharray: "5 5"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "180", y: "42", textAnchor: "middle", className: "fill-foreground text-[15px] font-bold", children: "Repouso" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "540", y: "42", textAnchor: "middle", className: "fill-foreground text-[15px] font-bold", children: "Velocidade constante" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "180", y: "68", textAnchor: "middle", className: "fill-muted-foreground text-[13px]", children: "ΣF = 0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "540", y: "68", textAnchor: "middle", className: "fill-muted-foreground text-[13px]", children: "ΣF = 0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "55", y1: "210", x2: "305", y2: "210", className: "stroke-border-strong", strokeWidth: "2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "145", y: "160", width: "70", height: "50", rx: "4", className: "fill-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: "180",
            y: "190",
            textAnchor: "middle",
            className: "fill-primary-foreground text-[14px] font-bold",
            children: "m"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, { x1: 180, y1: 160, x2: 180, y2: 115, id: "l1-up" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, { x1: 180, y1: 210, x2: 180, y2: 255, id: "l1-down" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "190", y: "120", className: "fill-muted-foreground text-[12px]", children: "N" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "190", y: "250", className: "fill-muted-foreground text-[12px]", children: "P" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "415", y1: "210", x2: "665", y2: "210", className: "stroke-border-strong", strokeWidth: "2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "475", y: "160", width: "70", height: "50", rx: "4", className: "fill-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: "510",
            y: "190",
            textAnchor: "middle",
            className: "fill-primary-foreground text-[14px] font-bold",
            children: "m"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, { x1: 555, y1: 185, x2: 625, y2: 185, id: "l1-v", color: "info" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "590", y: "168", textAnchor: "middle", className: "fill-info text-[12px] font-bold", children: "v constante" })
      ]
    }
  );
}
function DiagramaLei2() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      viewBox: "0 0 720 300",
      className: "min-w-[560px] w-full",
      role: "img",
      "aria-labelledby": "lei2-diagram-title",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("title", { id: "lei2-diagram-title", children: "Mesma força aplicada em massas diferentes produz acelerações diferentes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "720", height: "300", rx: "4", className: "fill-secondary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "360", y: "42", textAnchor: "middle", className: "fill-primary text-[18px] font-bold", children: "F = m · a" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "55", y: "95", className: "fill-muted-foreground text-[12px]", children: "Massa m" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "125", y: "70", width: "55", height: "55", rx: "4", className: "fill-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: "152",
            y: "103",
            textAnchor: "middle",
            className: "fill-primary-foreground text-[13px] font-bold",
            children: "m"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, { x1: 190, y1: 98, x2: 265, y2: 98, id: "l2-f1", color: "warning" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "225", y: "80", textAnchor: "middle", className: "fill-warning text-[12px] font-bold", children: "F" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, { x1: 290, y1: 98, x2: 410, y2: 98, id: "l2-a1", color: "success" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "350", y: "80", textAnchor: "middle", className: "fill-success text-[12px] font-bold", children: "aceleração maior" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "55", y: "220", className: "fill-muted-foreground text-[12px]", children: "Massa 3m" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "110", y: "180", width: "85", height: "70", rx: "4", className: "fill-accent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: "152",
            y: "221",
            textAnchor: "middle",
            className: "fill-accent-foreground text-[13px] font-bold",
            children: "3m"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, { x1: 205, y1: 215, x2: 280, y2: 215, id: "l2-f2", color: "warning" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "242", y: "197", textAnchor: "middle", className: "fill-warning text-[12px] font-bold", children: "F" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, { x1: 305, y1: 215, x2: 350, y2: 215, id: "l2-a2", color: "info" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "410", y: "220", className: "fill-info text-[12px] font-bold", children: "aceleração três vezes menor" })
      ]
    }
  );
}
function DiagramaLei3() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      viewBox: "0 0 720 300",
      className: "min-w-[560px] w-full",
      role: "img",
      "aria-labelledby": "lei3-diagram-title",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("title", { id: "lei3-diagram-title", children: "Par de forças com mesma intensidade em corpos diferentes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "720", height: "300", rx: "4", className: "fill-secondary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "360", y: "45", textAnchor: "middle", className: "fill-foreground text-[15px] font-bold", children: "Um par, dois corpos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "360", y: "70", textAnchor: "middle", className: "fill-muted-foreground text-[12px]", children: "mesma intensidade e sentidos opostos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "245", y: "125", width: "80", height: "80", rx: "4", className: "fill-accent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: "285",
            y: "171",
            textAnchor: "middle",
            className: "fill-accent-foreground text-[15px] font-bold",
            children: "A"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "395", y: "125", width: "80", height: "80", rx: "4", className: "fill-info" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: "435",
            y: "171",
            textAnchor: "middle",
            className: "fill-info-foreground text-[15px] font-bold",
            children: "B"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, { x1: 325, y1: 145, x2: 405, y2: 145, id: "l3-ab", color: "accent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "365", y: "126", textAnchor: "middle", className: "fill-accent text-[12px] font-bold", children: "FA sobre B" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, { x1: 395, y1: 187, x2: 315, y2: 187, id: "l3-ba", color: "info" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "355", y: "214", textAnchor: "middle", className: "fill-info text-[12px] font-bold", children: "FB sobre A" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "360", y: "260", textAnchor: "middle", className: "fill-foreground text-[13px] font-bold", children: "|FAB| = |FBA|" })
      ]
    }
  );
}
function Arrow({
  x1,
  y1,
  x2,
  y2,
  id,
  color = "muted"
}) {
  const strokeClass = {
    muted: "stroke-muted-foreground fill-muted-foreground",
    info: "stroke-info fill-info",
    warning: "stroke-warning fill-warning",
    success: "stroke-success fill-success",
    accent: "stroke-accent fill-accent"
  }[color];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("marker", { id, markerWidth: "8", markerHeight: "8", refX: "7", refY: "4", orient: "auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M0,0 L8,4 L0,8 Z", className: strokeClass, stroke: "none" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "line",
      {
        x1,
        y1,
        x2,
        y2,
        strokeWidth: "3",
        markerEnd: `url(#${id})`,
        className: strokeClass
      }
    )
  ] });
}
const QUIZZES = [
  // ══════════════════════════════════════════════════════
  // 1ª LEI DE NEWTON
  // ══════════════════════════════════════════════════════
  {
    assunto: "lei-1",
    formato: "texto",
    perguntas: [
      {
        id: "q-lei1-txt-1",
        pergunta: "O que a 1ª Lei de Newton afirma sobre um corpo em repouso?",
        opcoes: [
          "Ele tende a se mover espontaneamente",
          "Ele permanece em repouso a menos que uma força atue sobre ele",
          "Ele sempre acelera com o tempo"
        ],
        correta: 1,
        explicacao: "A 1ª Lei diz que corpos em repouso ficam em repouso, e corpos em movimento mantêm sua velocidade, a menos que uma força resultante não nula atue sobre eles."
      },
      {
        id: "q-lei1-txt-2",
        pergunta: "O que é inércia?",
        opcoes: [
          "A força que impede o movimento",
          "A tendência de um corpo de manter seu estado atual de movimento",
          "A aceleração máxima de um objeto"
        ],
        correta: 1,
        explicacao: "Inércia é a resistência de um corpo a qualquer mudança no seu estado de movimento. Quanto maior a massa, maior a inércia."
      },
      {
        id: "q-lei1-txt-3",
        pergunta: "Quando a força resultante sobre um corpo é zero, o que acontece?",
        opcoes: [
          "O corpo para imediatamente",
          "O corpo acelera",
          "O corpo mantém seu estado de repouso ou movimento constante"
        ],
        correta: 2,
        explicacao: "Força resultante nula significa equilíbrio: o corpo mantém exatamente o que estava fazendo, parado continua parado, em movimento retilíneo constante continua assim."
      }
    ]
  },
  {
    assunto: "lei-1",
    formato: "resumo",
    perguntas: [
      {
        id: "q-lei1-res-1",
        pergunta: "Segundo o resumo, o que faz um corpo mudar seu movimento?",
        opcoes: [
          "O peso do próprio corpo",
          "A presença de uma força resultante não nula",
          "O tempo que está em movimento"
        ],
        correta: 1,
        explicacao: "O ponto central da 1ª Lei é justamente esse: só uma força resulante diferente de zero consegue mudar o estado de movimento de um corpo."
      },
      {
        id: "q-lei1-res-2",
        pergunta: "Como a massa se relaciona com a inércia, segundo o resumo?",
        opcoes: [
          "Mais massa = menos inércia",
          "Massa e inércia não têm relação",
          "Mais massa = mais inércia"
        ],
        correta: 2,
        explicacao: "A inércia é diretamente proporcional à massa. Um caminhão cheio tem muito mais resistência a mudanças de movimento do que uma bicicleta."
      },
      {
        id: "q-lei1-res-3",
        pergunta: "No exemplo do cinto de segurança mencionado no resumo, o que explica a sensação de ser empurrado para frente numa freada?",
        opcoes: [
          "Uma força para frente gerada pelo freio",
          "A inércia do corpo tentando manter o movimento original",
          "O peso aumentando durante a freada"
        ],
        correta: 1,
        explicacao: "Não existe força para frente, o que acontece é que seu corpo tende a continuar com a velocidade que tinha antes da freada. Isso é inércia em ação."
      }
    ]
  },
  {
    assunto: "lei-1",
    formato: "visual",
    perguntas: [
      {
        id: "q-lei1-vis-1",
        pergunta: "No diagrama de equilíbrio (ΣF = 0), quais forças verticais estão representadas?",
        opcoes: ["Apenas o peso", "Peso (↓) e Força Normal (↑)", "Apenas a força normal"],
        correta: 1,
        explicacao: "No diagrama, o bloco em equilíbrio tem duas forças verticais que se cancelam: o peso puxando para baixo e a normal empurrando para cima."
      },
      {
        id: "q-lei1-vis-2",
        pergunta: "No diagrama de movimento com ΣF = 0, o que o vetor 'v' representa?",
        opcoes: [
          "A força aplicada sobre o bloco",
          "A velocidade constante do bloco",
          "A aceleração do bloco"
        ],
        correta: 1,
        explicacao: "O vetor 'v' representa a velocidade constante. Com resultante zero, não há aceleração, a velocidade se mantém idêntica."
      },
      {
        id: "q-lei1-vis-3",
        pergunta: "O que diferencia os dois cenários mostrados no diagrama?",
        opcoes: [
          "Um tem mais massa que o outro",
          "Um está em repouso (v = 0) e o outro em movimento com velocidade constante",
          "Um tem atrito e o outro não"
        ],
        correta: 1,
        explicacao: "O diagrama ilustra os dois estados que a 1ª Lei trata como equivalentes: repouso (v = 0) e movimento retilíneo uniforme (v = constante). Em ambos, ΣF = 0."
      }
    ]
  },
  {
    assunto: "lei-1",
    formato: "video",
    perguntas: [
      {
        id: "q-lei1-vid-1",
        pergunta: "Na animação da 1ª Lei, o que acontece com o bloco antes do impulso?",
        opcoes: [
          "Ele se move lentamente",
          "Ele fica em repouso",
          "Ele oscila de um lado para o outro"
        ],
        correta: 1,
        explicacao: "O bloco permanece em repouso enquanto nenhuma força horizontal atua sobre ele, isso ilustra a inércia do repouso."
      },
      {
        id: "q-lei1-vid-2",
        pergunta: "Após receber o impulso, o que acontece com o bloco na animação?",
        opcoes: [
          "Ele desacelera gradualmente até parar",
          "Ele continua com velocidade constante",
          "Ele acelera cada vez mais"
        ],
        correta: 1,
        explicacao: "Sem forças agindo (atrito zero no ambiente da animação), o bloco mantém a velocidade que recebeu do impulso indefinidamente, inércia do movimento."
      },
      {
        id: "q-lei1-vid-3",
        pergunta: "Qual é a ideia principal que a animação da 1ª Lei demonstra?",
        opcoes: [
          "Que forças sempre aceleram os objetos",
          "Que objetos mudam de estado sozinhos com o tempo",
          "Que corpos tendem a manter seu estado de movimento"
        ],
        correta: 2,
        explicacao: "A animação mostra que, sem força externa, o estado de movimento não muda, o bloco em repouso fica em repouso, e em movimento mantém a velocidade."
      }
    ]
  },
  // ══════════════════════════════════════════════════════
  // 2ª LEI DE NEWTON
  // ══════════════════════════════════════════════════════
  {
    assunto: "lei-2",
    formato: "texto",
    perguntas: [
      {
        id: "q-lei2-txt-1",
        pergunta: "O que a fórmula F = m·a relaciona?",
        opcoes: [
          "Força, velocidade e tempo",
          "Força resultante, massa e aceleração",
          "Peso, normal e atrito"
        ],
        correta: 1,
        explicacao: "F = m·a é a expressão matemática da 2ª Lei: a força resultante (F) é igual à massa (m) multiplicada pela aceleração (a) que ela produz."
      },
      {
        id: "q-lei2-txt-2",
        pergunta: "Se a massa dobrar e a força resultante permanecer igual, o que ocorre com a aceleração?",
        opcoes: ["Ela dobra", "Ela fica pela metade", "Ela não muda"],
        correta: 1,
        explicacao: "Como a = F/m, dobrar m com F constante reduz a pela metade. Massa e aceleração são inversamente proporcionais para força constante."
      },
      {
        id: "q-lei2-txt-3",
        pergunta: "Qual a unidade da força no Sistema Internacional?",
        opcoes: ["Quilograma (kg)", "Metro por segundo (m/s)", "Newton (N)"],
        correta: 2,
        explicacao: "1 Newton (N) é a força necessária para acelerar 1 kg a 1 m/s². É a unidade de força no SI, derivada diretamente de F = m·a."
      }
    ]
  },
  {
    assunto: "lei-2",
    formato: "resumo",
    perguntas: [
      {
        id: "q-lei2-res-1",
        pergunta: "Segundo o resumo, qual é o ponto central da 2ª Lei?",
        opcoes: [
          "Mais força = mais velocidade; mais massa = mais aceleração",
          "Mais força = mais aceleração; mais massa = menos aceleração (força constante)",
          "Força e aceleração são sempre iguais em valor"
        ],
        correta: 1,
        explicacao: "Esse é o coração da 2ª Lei: para uma força fixa, objetos mais pesados (maior massa) aceleram menos. Para uma massa fixa, mais força gera mais aceleração."
      },
      {
        id: "q-lei2-res-2",
        pergunta: "O que deve ser calculado antes de aplicar F = m·a quando há várias forças?",
        opcoes: [
          "A maior das forças",
          "A força de atrito isoladamente",
          "A força resultante (soma vetorial de todas as forças)"
        ],
        correta: 2,
        explicacao: "A 2ª Lei usa a FORÇA RESULTANTE, não uma força individual. É preciso somar vetorialmente todas as forças antes de calcular a aceleração."
      },
      {
        id: "q-lei2-res-3",
        pergunta: "A aceleração tem a mesma direção e sentido que:",
        opcoes: ["A velocidade do corpo", "A força resultante", "O peso do corpo"],
        correta: 1,
        explicacao: "A aceleração sempre aponta na mesma direção e sentido da força resultante, é uma consequência direta de F = m·a (a e F são vetores na mesma direção)."
      }
    ]
  },
  {
    assunto: "lei-2",
    formato: "visual",
    perguntas: [
      {
        id: "q-lei2-vis-1",
        pergunta: "No diagrama, o bloco 'leve' tem qual cor?",
        opcoes: ["Azul", "Verde", "Vermelho"],
        correta: 1,
        explicacao: "O bloco verde representa o objeto mais leve, que por isso recebe maior aceleração para a mesma força aplicada."
      },
      {
        id: "q-lei2-vis-2",
        pergunta: "O que os vetores amarelos no diagrama representam?",
        opcoes: [
          "A velocidade de cada bloco",
          "A mesma força F aplicada nos dois blocos",
          "O peso de cada bloco"
        ],
        correta: 1,
        explicacao: "Os vetores amarelos têm o mesmo tamanho em ambos os blocos para mostrar que a mesma força F é aplicada, o que muda é a aceleração resultante."
      },
      {
        id: "q-lei2-vis-3",
        pergunta: "Por que o vetor de aceleração do bloco pesado é menor no diagrama?",
        opcoes: [
          "Porque recebe uma força menor",
          "Porque tem mais massa, resultando em menor aceleração para a mesma força",
          "Porque está em repouso"
        ],
        correta: 1,
        explicacao: "Massa 3× maior com a mesma força → aceleração 3× menor (a = F/m). O diagrama ilustra visualmente essa relação inversa entre massa e aceleração."
      }
    ]
  },
  {
    assunto: "lei-2",
    formato: "video",
    perguntas: [
      {
        id: "q-lei2-vid-1",
        pergunta: "Na animação, qual bloco acelera mais rapidamente?",
        opcoes: ["O bloco pesado (marrom)", "Os dois aceleram igual", "O bloco leve (verde)"],
        correta: 2,
        explicacao: "O bloco verde (mais leve) acelera muito mais que o marrom (mais pesado) com a mesma força aplicada, exatamente o que F = m·a prevê."
      },
      {
        id: "q-lei2-vid-2",
        pergunta: "O que a animação mantém igual entre os dois blocos?",
        opcoes: ["A aceleração", "A força aplicada", "A massa"],
        correta: 1,
        explicacao: "A força aplicada é a mesma nos dois blocos (representada pelos vetores amarelos iguais). O que varia é a massa, e por isso a aceleração de cada um é diferente."
      },
      {
        id: "q-lei2-vid-3",
        pergunta: "Qual princípio a animação da 2ª Lei demonstra diretamente?",
        opcoes: [
          "Que objetos mais pesados caem mais rápido",
          "Que a aceleração depende da força e da massa (F = m·a)",
          "Que forças sempre se cancelam em pares"
        ],
        correta: 1,
        explicacao: "A animação mostra visualmente F = m·a: mesma força, massas diferentes → acelerações diferentes, inversamente proporcionais às massas."
      }
    ]
  },
  // ══════════════════════════════════════════════════════
  // 3ª LEI DE NEWTON
  // ══════════════════════════════════════════════════════
  {
    assunto: "lei-3",
    formato: "texto",
    perguntas: [
      {
        id: "q-lei3-txt-1",
        pergunta: "O que a 3ª Lei afirma sobre o par ação-reação?",
        opcoes: [
          "A reação é sempre menor que a ação",
          "Ação e reação têm mesmo módulo, mesma direção e sentidos opostos",
          "Ação e reação atuam no mesmo corpo"
        ],
        correta: 1,
        explicacao: "A 3ª Lei é precisa: as forças do par têm IGUAL módulo, MESMA direção e SENTIDOS OPOSTOS. E crucialmente, atuam em corpos diferentes."
      },
      {
        id: "q-lei3-txt-2",
        pergunta: "Por que as forças de ação e reação NÃO se cancelam?",
        opcoes: [
          "Porque têm módulos diferentes",
          "Porque atuam em corpos diferentes, não no mesmo",
          "Porque têm direções diferentes"
        ],
        correta: 1,
        explicacao: "Para duas forças se cancelarem, precisam atuar no mesmo corpo. A ação atua em B (exercida por A) e a reação atua em A (exercida por B), corpos diferentes, sem cancelamento."
      },
      {
        id: "q-lei3-txt-3",
        pergunta: "Um foguete no espaço se move porque:",
        opcoes: [
          "Empurra o ar para trás",
          "Os gases expelidos para trás geram uma reação que empurra o foguete para frente",
          "Reduz sua própria massa"
        ],
        correta: 1,
        explicacao: "Propulsão por reação: o foguete empurra gases para trás (ação), e os gases empurram o foguete para frente (reação). Funciona até no vácuo, sem ar."
      }
    ]
  },
  {
    assunto: "lei-3",
    formato: "resumo",
    perguntas: [
      {
        id: "q-lei3-res-1",
        pergunta: "Qual é o erro mais comum sobre o par ação-reação mencionado no resumo?",
        opcoes: [
          "Achar que a reação é maior que a ação",
          "Achar que o par de forças se anula",
          "Achar que só existe quando há movimento"
        ],
        correta: 1,
        explicacao: "O erro clássico é pensar que ação e reação se anulam. Não se anulam porque atuam em corpos diferentes, só forças no mesmo corpo podem se cancelar."
      },
      {
        id: "q-lei3-res-2",
        pergunta: "Segundo o resumo, o que caminhar e foguetes têm em comum?",
        opcoes: [
          "Ambos dependem do ar para funcionar",
          "Ambos são exemplos de propulsão por par ação-reação",
          "Ambos usam F = m·a diretamente"
        ],
        correta: 1,
        explicacao: "Ao caminhar, você empurra o chão para trás (ação) e o chão te empurra para frente (reação). O foguete faz o mesmo com os gases. São par ação-reação."
      },
      {
        id: "q-lei3-res-3",
        pergunta: "Toda força de ação:",
        opcoes: [
          "Gera uma reação de módulo igual e sentido oposto em outro corpo",
          "Gera uma reação apenas quando há contato físico",
          "Gera uma reação de módulo maior no corpo mais leve"
        ],
        correta: 0,
        explicacao: "Sempre, sem exceção: toda ação gera uma reação de IGUAL módulo e sentido oposto, em outro corpo. Isso vale para contato, gravidade, magnetismo, toda interação."
      }
    ]
  },
  {
    assunto: "lei-3",
    formato: "visual",
    perguntas: [
      {
        id: "q-lei3-vis-1",
        pergunta: "No diagrama, o que o vetor vermelho representa?",
        opcoes: [
          "A força de B sobre A (reação)",
          "A força de A sobre B (ação)",
          "A velocidade do bloco A"
        ],
        correta: 1,
        explicacao: "O vetor vermelho representa F(A→B), a força que A exerce sobre B, a ação. O vetor azul representa a reação de B sobre A."
      },
      {
        id: "q-lei3-vis-2",
        pergunta: "O que os tamanhos dos vetores vermelho e azul no diagrama indicam?",
        opcoes: [
          "Que a ação é maior que a reação",
          "Que ação e reação têm o mesmo módulo",
          "Que a reação é maior que a ação"
        ],
        correta: 1,
        explicacao: "Os dois vetores têm o mesmo comprimento no diagrama, representando que ação e reação têm sempre o mesmo módulo, é a 3ª Lei."
      },
      {
        id: "q-lei3-vis-3",
        pergunta: "Os vetores de ação e reação apontam em que direções no diagrama?",
        opcoes: [
          "A mesma direção e o mesmo sentido",
          "A mesma direção, mas sentidos opostos",
          "Direções completamente diferentes"
        ],
        correta: 1,
        explicacao: "Ação e reação sempre têm a mesma direção (linha de ação), mas sentidos opostos, um aponta para direita, o outro para esquerda, como no diagrama."
      }
    ]
  },
  {
    assunto: "lei-3",
    formato: "video",
    perguntas: [
      {
        id: "q-lei3-vid-1",
        pergunta: "Na animação dos patinadores, o que acontece quando eles se empurram?",
        opcoes: [
          "Só o mais leve se afasta",
          "Ambos se afastam em sentidos opostos",
          "Eles ficam parados"
        ],
        correta: 1,
        explicacao: "Ambos se afastam, cada um recebe a força de reação do outro. Isso é o par ação-reação em ação: A empurra B (ação) e B empurra A (reação)."
      },
      {
        id: "q-lei3-vid-2",
        pergunta: "Na animação, os blocos A (vermelho) e B (azul) se afastam com a mesma velocidade?",
        opcoes: [
          "Sim, sempre com a mesma velocidade",
          "Não necessariamente, depende das massas de cada um",
          "Não, o maior sempre vai mais rápido"
        ],
        correta: 1,
        explicacao: "As forças de ação e reação são iguais, mas as acelerações podem ser diferentes se as massas forem diferentes. Massa menor → aceleração maior → velocidade final maior."
      },
      {
        id: "q-lei3-vid-3",
        pergunta: "O que a animação demonstra sobre o par ação-reação?",
        opcoes: [
          "Que forças sempre ocorrem em pares em corpos diferentes",
          "Que forças maiores vencem as menores",
          "Que a ação ocorre antes da reação"
        ],
        correta: 0,
        explicacao: "A animação mostra que toda interação gera um par de forças simultâneas em corpos distintos: A exerce força sobre B e B exerce força sobre A ao mesmo tempo."
      }
    ]
  }
];
function obterQuiz(assunto, formato) {
  return QUIZZES.find((q) => q.assunto === assunto && q.formato === formato);
}
const ASSUNTO_MAP = {
  "1ª": "lei-1",
  "2ª": "lei-2",
  "3ª": "lei-3"
};
const TAB_LIST = [
  { id: "texto", label: "Aula", icon: BookOpen },
  { id: "resumo", label: "Resumo", icon: FileText },
  { id: "visual", label: "Diagrama", icon: ScanSearch },
  { id: "simulacao", label: "Simulação", icon: Play },
  { id: "tutor", label: "Tutor", icon: Bot }
];
function NewtonLesson({ lesson }) {
  const assunto = ASSUNTO_MAP[lesson.number];
  const settings = useSiteSettings();
  const [tab, setTab] = reactExports.useState("texto");
  const [concluidos, setConcluidos] = reactExports.useState(() => marcosConcluidos(assunto));
  const [percentual, setPercentual] = reactExports.useState(() => percentualLicao(assunto));
  const [quizAberto, setQuizAberto] = reactExports.useState(null);
  reactExports.useEffect(() => {
    setConcluidos(marcosConcluidos(assunto));
    setPercentual(percentualLicao(assunto));
    setTab("texto");
    setQuizAberto(null);
  }, [assunto]);
  function marcar(marco) {
    marcarConcluido(assunto, marco);
    setConcluidos(marcosConcluidos(assunto));
    setPercentual(percentualLicao(assunto));
  }
  function abrirTab(novaTab) {
    setTab(novaTab);
    setQuizAberto(null);
  }
  const duracao = settings.motion === "reduced" ? 0 : 0.22;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "ff-page", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ff-shell max-w-5xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "grid gap-7 border-b border-border pb-8 md:grid-cols-[1fr_15rem] md:items-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "ff-kicker", children: [
          lesson.number,
          " Lei de Newton"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 max-w-3xl text-4xl sm:text-5xl", children: lesson.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "reading-copy mt-4 max-w-2xl text-lg text-muted-foreground", children: lesson.subtitle })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs font-semibold text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Progresso da aula" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            percentual,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ff-progress-track mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ff-progress-fill", style: { width: `${percentual}%` } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs text-muted-foreground", children: [
          concluidos.filter(
            (item) => ["texto", "resumo", "visual", "animacao"].includes(item)
          ).length,
          " ",
          "de 4 formatos"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "ff-tabs mt-6 w-full", "aria-label": "Formatos da aula", children: TAB_LIST.map((item) => {
      const Icon = item.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => abrirTab(item.id),
          className: `ff-tab ${tab === item.id ? "active" : ""}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4", "aria-hidden": "true" }),
            " ",
            item.label
          ]
        },
        item.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.section,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
        transition: { duration: duracao },
        className: "mt-7",
        children: [
          tab === "texto" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            LessonText,
            {
              lesson,
              assunto,
              feito: concluidos.includes("texto"),
              onQuiz: setQuizAberto
            }
          ),
          tab === "resumo" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            LessonSummary,
            {
              lesson,
              assunto,
              feito: concluidos.includes("resumo"),
              onQuiz: setQuizAberto
            }
          ),
          tab === "visual" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Leitura espacial" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-2xl", children: "Forças e relações no mesmo quadro" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                VerifyButton,
                {
                  formato: "visual",
                  feito: concluidos.includes("visual"),
                  onQuiz: setQuizAberto
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(LawDiagram, { assunto })
          ] }),
          tab === "simulacao" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Teste de variáveis" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-2xl", children: "Mude um valor e observe o efeito" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                VerifyButton,
                {
                  formato: "video",
                  feito: concluidos.includes("animacao"),
                  onQuiz: setQuizAberto
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(LawAnimation, { assunto })
          ] }),
          tab === "tutor" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-[14rem_minmax(0,1fr)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "focus-optional", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Tutor contextual" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-2xl", children: "Pergunte sobre esta lei" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm leading-relaxed text-muted-foreground", children: "O tutor recebe apenas esta aula e um resumo curto do seu progresso. Confirme resultados numéricos no material da aula." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ff-card p-4 sm:p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              GravityChat,
              {
                context: {
                  leiAtual: {
                    numero: lesson.number,
                    titulo: lesson.title,
                    enunciado: lesson.statement
                  },
                  resumoPerfil: gerarResumoPerfilParaGravity()
                },
                sugestoes: [
                  `Explique a ${lesson.number} Lei com outro exemplo`,
                  "Qual é o erro conceitual mais comum?",
                  "Crie uma pergunta curta para eu testar a ideia"
                ],
                alturaMensagens: "380px"
              }
            ) })
          ] })
        ]
      },
      tab
    ) }),
    quizAberto && (() => {
      const quiz = obterQuiz(assunto, quizAberto);
      if (!quiz) return null;
      const marco = quizAberto === "texto" ? "texto" : quizAberto === "resumo" ? "resumo" : quizAberto === "visual" ? "visual" : "animacao";
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-7 border-t border-border pt-7", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ContentQuiz,
        {
          quiz,
          accent: "var(--primary)",
          onAprovado: () => {
            marcar(marco);
            setQuizAberto(null);
          },
          onFechar: () => setQuizAberto(null)
        }
      ) });
    })(),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "nav",
      {
        className: "mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6",
        "aria-label": "Navegação entre aulas",
        children: [
          lesson.prev ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: lesson.prev.to, className: "ff-btn-outline", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4", "aria-hidden": "true" }),
            " ",
            lesson.prev.label
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
          lesson.next ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: lesson.next.to, className: "ff-btn-primary", children: [
            lesson.next.label,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4", "aria-hidden": "true" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/questoes", className: "ff-btn-primary", children: [
            "Praticar as três leis ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4", "aria-hidden": "true" })
          ] })
        ]
      }
    )
  ] }) });
}
function LessonText({
  lesson,
  assunto,
  feito,
  onQuiz
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(15rem,0.65fr)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("blockquote", { className: "border-l-2 border-primary pl-5 text-xl font-semibold leading-relaxed", children: lesson.statement }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "reading-copy mt-8 space-y-5 text-muted-foreground", children: lesson.paragraphs.map((paragrafo) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: paragrafo }, paragrafo)) }),
        lesson.formula && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 border-y border-border py-8 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Equação central" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 font-mono text-4xl font-bold text-primary sm:text-5xl", children: lesson.formula })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "focus-optional border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Exemplos observáveis" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ff-divider-list mt-3 border-y border-border", children: lesson.examples.map((exemplo) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm", children: exemplo.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm leading-relaxed text-muted-foreground", children: exemplo.desc })
        ] }, exemplo.title)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(VerifyButton, { formato: "texto", feito, assunto, onQuiz }) })
  ] });
}
function LessonSummary({
  lesson,
  assunto,
  feito,
  onQuiz
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "max-w-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Leitura curta" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 border-l-2 border-accent pl-5 text-2xl leading-snug sm:text-3xl", children: lesson.summary.keyPoint }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "mt-8 border-y border-border", children: lesson.summary.bullets.map((item, indice) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "li",
      {
        className: "grid grid-cols-[2.5rem_1fr] gap-3 border-b border-border py-4 last:border-b-0",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs font-bold text-muted-foreground", children: [
            "0",
            indice + 1
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "reading-copy text-muted-foreground", children: item })
        ]
      },
      item
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(VerifyButton, { formato: "resumo", feito, assunto, onQuiz }) })
  ] });
}
function VerifyButton({
  formato,
  feito,
  onQuiz
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: () => onQuiz(formato),
      disabled: feito,
      className: feito ? "ff-btn-outline text-success" : "ff-btn-primary",
      children: feito ? "Verificação concluída" : "Verificar compreensão"
    }
  );
}
export {
  NewtonLesson as N
};
