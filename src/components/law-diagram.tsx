import type { Assunto } from "@/lib/questions/types";

export function LawDiagram({ assunto }: { assunto: Assunto }) {
  return (
    <div className="overflow-x-auto border border-border bg-card p-2 sm:p-4">
      {assunto === "lei-1" && <DiagramaLei1 />}
      {assunto === "lei-2" && <DiagramaLei2 />}
      {assunto === "lei-3" && <DiagramaLei3 />}
    </div>
  );
}

function DiagramaLei1() {
  return (
    <svg
      viewBox="0 0 720 300"
      className="min-w-[560px] w-full"
      role="img"
      aria-labelledby="lei1-diagram-title"
    >
      <title id="lei1-diagram-title">
        Comparação entre repouso e movimento uniforme quando a força resultante é nula
      </title>
      <rect width="720" height="300" rx="4" className="fill-secondary" />
      <line
        x1="360"
        y1="40"
        x2="360"
        y2="260"
        className="stroke-border-strong"
        strokeDasharray="5 5"
      />

      <text x="180" y="42" textAnchor="middle" className="fill-foreground text-[15px] font-bold">
        Repouso
      </text>
      <text x="540" y="42" textAnchor="middle" className="fill-foreground text-[15px] font-bold">
        Velocidade constante
      </text>
      <text x="180" y="68" textAnchor="middle" className="fill-muted-foreground text-[13px]">
        ΣF = 0
      </text>
      <text x="540" y="68" textAnchor="middle" className="fill-muted-foreground text-[13px]">
        ΣF = 0
      </text>

      <line x1="55" y1="210" x2="305" y2="210" className="stroke-border-strong" strokeWidth="2" />
      <rect x="145" y="160" width="70" height="50" rx="4" className="fill-primary" />
      <text
        x="180"
        y="190"
        textAnchor="middle"
        className="fill-primary-foreground text-[14px] font-bold"
      >
        m
      </text>
      <Arrow x1={180} y1={160} x2={180} y2={115} id="l1-up" />
      <Arrow x1={180} y1={210} x2={180} y2={255} id="l1-down" />
      <text x="190" y="120" className="fill-muted-foreground text-[12px]">
        N
      </text>
      <text x="190" y="250" className="fill-muted-foreground text-[12px]">
        P
      </text>

      <line x1="415" y1="210" x2="665" y2="210" className="stroke-border-strong" strokeWidth="2" />
      <rect x="475" y="160" width="70" height="50" rx="4" className="fill-primary" />
      <text
        x="510"
        y="190"
        textAnchor="middle"
        className="fill-primary-foreground text-[14px] font-bold"
      >
        m
      </text>
      <Arrow x1={555} y1={185} x2={625} y2={185} id="l1-v" color="info" />
      <text x="590" y="168" textAnchor="middle" className="fill-info text-[12px] font-bold">
        v constante
      </text>
    </svg>
  );
}

function DiagramaLei2() {
  return (
    <svg
      viewBox="0 0 720 300"
      className="min-w-[560px] w-full"
      role="img"
      aria-labelledby="lei2-diagram-title"
    >
      <title id="lei2-diagram-title">
        Mesma força aplicada em massas diferentes produz acelerações diferentes
      </title>
      <rect width="720" height="300" rx="4" className="fill-secondary" />
      <text x="360" y="42" textAnchor="middle" className="fill-primary text-[18px] font-bold">
        F = m · a
      </text>

      <text x="55" y="95" className="fill-muted-foreground text-[12px]">
        Massa m
      </text>
      <rect x="125" y="70" width="55" height="55" rx="4" className="fill-primary" />
      <text
        x="152"
        y="103"
        textAnchor="middle"
        className="fill-primary-foreground text-[13px] font-bold"
      >
        m
      </text>
      <Arrow x1={190} y1={98} x2={265} y2={98} id="l2-f1" color="warning" />
      <text x="225" y="80" textAnchor="middle" className="fill-warning text-[12px] font-bold">
        F
      </text>
      <Arrow x1={290} y1={98} x2={410} y2={98} id="l2-a1" color="success" />
      <text x="350" y="80" textAnchor="middle" className="fill-success text-[12px] font-bold">
        aceleração maior
      </text>

      <text x="55" y="220" className="fill-muted-foreground text-[12px]">
        Massa 3m
      </text>
      <rect x="110" y="180" width="85" height="70" rx="4" className="fill-accent" />
      <text
        x="152"
        y="221"
        textAnchor="middle"
        className="fill-accent-foreground text-[13px] font-bold"
      >
        3m
      </text>
      <Arrow x1={205} y1={215} x2={280} y2={215} id="l2-f2" color="warning" />
      <text x="242" y="197" textAnchor="middle" className="fill-warning text-[12px] font-bold">
        F
      </text>
      <Arrow x1={305} y1={215} x2={350} y2={215} id="l2-a2" color="info" />
      <text x="410" y="220" className="fill-info text-[12px] font-bold">
        aceleração três vezes menor
      </text>
    </svg>
  );
}

function DiagramaLei3() {
  return (
    <svg
      viewBox="0 0 720 300"
      className="min-w-[560px] w-full"
      role="img"
      aria-labelledby="lei3-diagram-title"
    >
      <title id="lei3-diagram-title">
        Par de forças com mesma intensidade em corpos diferentes
      </title>
      <rect width="720" height="300" rx="4" className="fill-secondary" />
      <text x="360" y="45" textAnchor="middle" className="fill-foreground text-[15px] font-bold">
        Um par, dois corpos
      </text>
      <text x="360" y="70" textAnchor="middle" className="fill-muted-foreground text-[12px]">
        mesma intensidade e sentidos opostos
      </text>

      <rect x="245" y="125" width="80" height="80" rx="4" className="fill-accent" />
      <text
        x="285"
        y="171"
        textAnchor="middle"
        className="fill-accent-foreground text-[15px] font-bold"
      >
        A
      </text>
      <rect x="395" y="125" width="80" height="80" rx="4" className="fill-info" />
      <text
        x="435"
        y="171"
        textAnchor="middle"
        className="fill-info-foreground text-[15px] font-bold"
      >
        B
      </text>

      <Arrow x1={325} y1={145} x2={405} y2={145} id="l3-ab" color="accent" />
      <text x="365" y="126" textAnchor="middle" className="fill-accent text-[12px] font-bold">
        FA sobre B
      </text>
      <Arrow x1={395} y1={187} x2={315} y2={187} id="l3-ba" color="info" />
      <text x="355" y="214" textAnchor="middle" className="fill-info text-[12px] font-bold">
        FB sobre A
      </text>

      <text x="360" y="260" textAnchor="middle" className="fill-foreground text-[13px] font-bold">
        |FAB| = |FBA|
      </text>
    </svg>
  );
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
  id,
  color = "muted",
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  id: string;
  color?: "muted" | "info" | "warning" | "success" | "accent";
}) {
  const strokeClass = {
    muted: "stroke-muted-foreground fill-muted-foreground",
    info: "stroke-info fill-info",
    warning: "stroke-warning fill-warning",
    success: "stroke-success fill-success",
    accent: "stroke-accent fill-accent",
  }[color];
  return (
    <>
      <defs>
        <marker id={id} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" className={strokeClass} stroke="none" />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        strokeWidth="3"
        markerEnd={`url(#${id})`}
        className={strokeClass}
      />
    </>
  );
}
