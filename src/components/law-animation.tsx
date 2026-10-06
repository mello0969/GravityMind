import { Pause, Play, RotateCcw, SlidersHorizontal } from "lucide-react";
import { type RefObject, useCallback, useEffect, useRef, useState } from "react";

type AssuntoAnimacao = "lei-1" | "lei-2" | "lei-3";

/**
 * Animações interativas (canvas), não decorativas.
 *
 * Diferente da versão anterior (que só tinha play/pause com valores fixos),
 * aqui o aluno manipula as variáveis físicas reais via sliders, e a
 * simulação recalcula o movimento em tempo real com as fórmulas corretas:
 *
 * - Lei 1: o aluno ajusta a INTENSIDADE DO IMPULSO. Um impulso maior
 *   produz uma velocidade final maior (o bloco continua com essa
 *   velocidade indefinidamente, ilustrando inércia do movimento).
 * - Lei 2: o aluno ajusta FORÇA e MASSA de um bloco único e vê a
 *   aceleração recalculada ao vivo via a = F/m, com o bloco acelerando
 *   de acordo. Um segundo bloco de referência (massa e força fixas)
 *   fica ao lado para comparação visual direta.
 * - Lei 3: o aluno ajusta a MASSA de cada um dos dois blocos. A força de
 *   interação é sempre igual em ambos (3ª Lei), o que muda, e é visível,
 *   é a aceleração resultante em cada um (a = F/m), diferente por causa
 *   da massa, não da força.
 *
 * Cada simulação é cinemática simples (sem motor de física completo),
 * mas os NÚMEROS exibidos (F, m, a) são sempre consistentes com as
 * fórmulas reais, não são apenas ilustrativos.
 */
export function LawAnimation({ assunto }: { assunto: AssuntoAnimacao }) {
  if (assunto === "lei-1") return <AnimacaoLei1 />;
  if (assunto === "lei-2") return <AnimacaoLei2 />;
  return <AnimacaoLei3 />;
}

// ───────────────────────── Shell comum ─────────────────────────

function Shell({
  children,
  controles,
  legenda,
  tocando,
  onToggle,
  onReiniciar,
}: {
  children: React.ReactNode;
  controles: React.ReactNode;
  legenda: string;
  tocando: boolean;
  onToggle: () => void;
  onReiniciar: () => void;
}) {
  return (
    <div className="border border-border bg-card p-3 sm:p-5">
      {children}

      <div className="mt-3 flex items-center justify-center gap-2">
        <button type="button" onClick={onToggle} className="ff-btn-primary">
          {tocando ? (
            <Pause className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Play className="h-4 w-4" aria-hidden="true" />
          )}
          {tocando ? "Pausar" : "Reproduzir"}
        </button>
        <button type="button" onClick={onReiniciar} className="ff-btn-outline">
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reiniciar
        </button>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <div className="mb-3 flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" /> Ajuste as variáveis
        </div>
        {controles}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{legenda}</p>
    </div>
  );
}

function Slider({
  label,
  valor,
  min,
  max,
  step,
  unidade,
  onChange,
}: {
  label: string;
  valor: number;
  min: number;
  max: number;
  step: number;
  unidade: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1.5 flex items-center justify-between text-xs font-bold">
        <span className="text-foreground">{label}</span>
        <span className="text-primary">
          {valor} {unidade}
        </span>
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={valor}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="ff-slider w-full"
        style={{ accentColor: "var(--primary)" }}
      />
    </div>
  );
}

function useLoop(tocando: boolean, duracao: number, onTick: (t: number) => void) {
  const frameRef = useRef<number>(0);
  useEffect(() => {
    if (!tocando) return;
    let ultimo = performance.now();
    let acumulado = 0;
    function passo(agora: number) {
      const dt = (agora - ultimo) / 1000;
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

function prepareCanvas(canvas: HTMLCanvasElement) {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.round(w * ratio);
  const height = Math.round(h * ratio);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  const ctx = canvas.getContext("2d");
  ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { ctx, w, h };
}

function useCanvasResize(ref: RefObject<HTMLCanvasElement | null>, draw: (t: number) => void) {
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => draw(0));
    observer.observe(canvas);
    draw(0);
    return () => observer.disconnect();
  }, [draw, ref]);
}

function desenharBloco(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cor: string,
  label: string,
  tamanho = 46,
) {
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

function desenharSeta(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  comprimento: number,
  cor: string,
) {
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

function desenharGrade(ctx: CanvasRenderingContext2D, w: number, h: number) {
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

function rotuloCanvas(ctx: CanvasRenderingContext2D, texto: string) {
  ctx.fillStyle = "#c4d5ce";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(texto, 20, 24, ctx.canvas.clientWidth - 40);
}

// ───────────────────────── Lei 1, Inércia ─────────────────────────

function AnimacaoLei1() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tocando, setTocando] = useState(false);
  const [impulso, setImpulso] = useState(30); // "força" do impulso, em unidades arbitrárias
  const DURACAO = 4;
  const T_IMPULSO = 1.2;

  const velocidade = impulso * 3.2; // px/s resultante, proporcional ao impulso

  const desenhar = useCallback(
    (t: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { ctx, w, h } = prepareCanvas(canvas);
      if (!ctx) return;
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
        t < T_IMPULSO
          ? "Repouso, sem força resultante"
          : `Velocidade constante ≈ ${(velocidade / 32).toFixed(1)} m/s (sem força)`,
      );

      if (mostrarForca) desenharSeta(ctx, x - 50, y, 30, "#D09A4C");
      desenharBloco(ctx, Math.min(x, w - 50), y, "#4B7869", "m");
    },
    [velocidade],
  );

  useLoop(tocando, DURACAO, desenhar);
  useCanvasResize(canvasRef, desenhar);

  return (
    <Shell
      tocando={tocando}
      onToggle={() => setTocando((v) => !v)}
      onReiniciar={() => {
        setTocando(false);
        desenhar(0);
      }}
      legenda="Aumente o impulso e veja: o bloco sai com mais velocidade e a mantém constante enquanto nenhuma força o freia. Isso é inércia do movimento."
      controles={
        <Slider
          label="Intensidade do impulso"
          valor={impulso}
          min={10}
          max={60}
          step={5}
          unidade="N·s"
          onChange={setImpulso}
        />
      }
    >
      <canvas
        ref={canvasRef}
        width={680}
        height={260}
        role="img"
        aria-label="Simulação de forças e movimento"
        className="block min-h-52 w-full border border-[#52635D] bg-[#1C2B26]"
        style={{ aspectRatio: "680 / 260" }}
      />
    </Shell>
  );
}

// ───────────────────────── Lei 2, F = m·a ─────────────────────────

function AnimacaoLei2() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tocando, setTocando] = useState(false);
  const [forca, setForca] = useState(20); // N
  const [massa, setMassa] = useState(2); // kg
  const DURACAO = 3;

  const FORCA_REF = 20;
  const MASSA_REF = 4;
  const A_REF = FORCA_REF / MASSA_REF;

  const aceleracao = forca / massa;

  const desenhar = useCallback(
    (t: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { ctx, w, h } = prepareCanvas(canvas);
      if (!ctx) return;
      desenharGrade(ctx, w, h);

      const inicioX = 90;
      const yVariavel = h * 0.32;
      const yRef = h * 0.72;
      const escala = 9;

      const xVariavel = Math.min(inicioX + 0.5 * aceleracao * escala * t * t, w - 50);
      const xRef = Math.min(inicioX + 0.5 * A_REF * escala * t * t, w - 50);

      rotuloCanvas(
        ctx,
        `a = F/m = ${forca}/${massa} = ${aceleracao.toFixed(1)} m/s²  (bloco de cima)`,
      );

      if (xVariavel < w - 55) desenharSeta(ctx, xVariavel - 45, yVariavel, 25, "#82B89F");
      desenharBloco(ctx, xVariavel, yVariavel, "#4B7869", `${massa}kg`);

      if (xRef < w - 55) desenharSeta(ctx, xRef - 45, yRef, 25, "#D09A4C");
      desenharBloco(ctx, xRef, yRef, "#6B7280", `${MASSA_REF}kg (ref)`, 52);
    },
    [A_REF, aceleracao, forca, massa],
  );

  useLoop(tocando, DURACAO, desenhar);
  useCanvasResize(canvasRef, desenhar);

  return (
    <Shell
      tocando={tocando}
      onToggle={() => setTocando((v) => !v)}
      onReiniciar={() => {
        setTocando(false);
        desenhar(0);
      }}
      legenda={`Bloco de cima: você controla F e m. O bloco cinza é a referência fixa, com F=${FORCA_REF}N, m=${MASSA_REF}kg e a=${A_REF.toFixed(1)}m/s². Compare as acelerações.`}
      controles={
        <>
          <Slider
            label="Força aplicada (F)"
            valor={forca}
            min={5}
            max={40}
            step={1}
            unidade="N"
            onChange={setForca}
          />
          <Slider
            label="Massa do bloco (m)"
            valor={massa}
            min={1}
            max={10}
            step={0.5}
            unidade="kg"
            onChange={setMassa}
          />
        </>
      }
    >
      <canvas
        ref={canvasRef}
        width={680}
        height={260}
        role="img"
        aria-label="Simulação de forças e movimento"
        className="block min-h-52 w-full border border-[#52635D] bg-[#1C2B26]"
        style={{ aspectRatio: "680 / 260" }}
      />
    </Shell>
  );
}

// ───────────────────────── Lei 3, Ação e Reação ─────────────────────────

function AnimacaoLei3() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tocando, setTocando] = useState(false);
  const [massaA, setMassaA] = useState(2);
  const [massaB, setMassaB] = useState(4);
  const DURACAO = 3;
  const T_EMPURRAO = 0.4;
  const FORCA_INTERACAO = 20;

  const aceleracaoA = FORCA_INTERACAO / massaA;
  const aceleracaoB = FORCA_INTERACAO / massaB;

  const desenhar = useCallback(
    (t: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { ctx, w, h } = prepareCanvas(canvas);
      if (!ctx) return;
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
        `F igual nos dois (${FORCA_INTERACAO}N). aA=${aceleracaoA.toFixed(1)} m/s² e aB=${aceleracaoB.toFixed(1)} m/s²`,
      );

      if (mostrarForcas) {
        desenharSeta(ctx, centro - 25, y, -25, "#C77962");
        desenharSeta(ctx, centro + 25, y, 25, "#6F98C3");
      }

      desenharBloco(ctx, Math.max(xA, 40), y, "#B86751", `A ${massaA}kg`, 50);
      desenharBloco(ctx, Math.min(xB, w - 40), y, "#4B78A8", `B ${massaB}kg`, 50);
    },
    [aceleracaoA, aceleracaoB, massaA, massaB],
  );

  useLoop(tocando, DURACAO, desenhar);
  useCanvasResize(canvasRef, desenhar);

  return (
    <Shell
      tocando={tocando}
      onToggle={() => setTocando((v) => !v)}
      onReiniciar={() => {
        setTocando(false);
        desenhar(0);
      }}
      legenda="A força de interação é sempre igual nos dois blocos. O que muda com a massa é a aceleração de cada um, não a força."
      controles={
        <>
          <Slider
            label="Massa do bloco A"
            valor={massaA}
            min={1}
            max={8}
            step={0.5}
            unidade="kg"
            onChange={setMassaA}
          />
          <Slider
            label="Massa do bloco B"
            valor={massaB}
            min={1}
            max={8}
            step={0.5}
            unidade="kg"
            onChange={setMassaB}
          />
        </>
      }
    >
      <canvas
        ref={canvasRef}
        width={680}
        height={260}
        role="img"
        aria-label="Simulação de forças e movimento"
        className="block min-h-52 w-full border border-[#52635D] bg-[#1C2B26]"
        style={{ aspectRatio: "680 / 260" }}
      />
    </Shell>
  );
}
