import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Lightbulb, Paperclip, Send, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { GravityChat } from "@/components/gravity-chat";
import { gerarResumoPerfilParaGravity } from "@/lib/gravity/perfil-resumo";

export const Route = createFileRoute("/tutor")({
  head: () => ({
    meta: [
      { title: "Tutor Gravity | GRAVITYMIND" },
      {
        name: "description",
        content:
          "Organize seu raciocínio de Física com perguntas guiadas, contexto e fórmulas das Leis de Newton.",
      },
    ],
  }),
  component: TutorPage,
});

const recent = [
  ["Força e aceleração em plano…", "Lei de Newton · Plano inclinado", "10:24"],
  ["Atrito estático", "Lei de Newton · Atrito", "Ontem"],
  ["Sistema de polias", "Dinâmica · Polias", "Ontem"],
  ["Conservação da energia", "Energia · Mecânica", "12/04"],
  ["Lançamento oblíquo", "Cinemática · Projéteis", "11/04"],
  ["Quantidade de movimento", "Dinâmica · Colisões", "09/04"],
] as const;

function TutorPage() {
  const [liveConversation, setLiveConversation] = useState(false);
  const context = useMemo(
    () => ({
      leiAtual: {
        numero: "2ª Lei",
        titulo: "Bloco em plano inclinado com atrito",
        enunciado:
          "Determine a aceleração de um bloco de 2,0 kg em um plano de 30° com atrito cinético 0,20.",
      },
      resumoPerfil: gerarResumoPerfilParaGravity(),
    }),
    [],
  );

  return (
    <main className="gm-reference-page grid min-h-[calc(100dvh-5.5rem)] xl:grid-cols-[17.5rem_minmax(0,1fr)_25rem]">
      <aside
        className="hidden border-r border-border p-6 xl:flex xl:flex-col"
        aria-labelledby="tutor-history-title"
      >
        <h1 id="tutor-history-title" className="text-2xl font-semibold">
          Tutor Virtual
        </h1>
        <button
          type="button"
          className="mt-5 min-h-11 border border-primary text-sm text-primary hover:bg-primary hover:text-primary-foreground"
          onClick={() => setLiveConversation(true)}
        >
          +&nbsp; Nova conversa
        </button>
        <h2 className="mt-8 text-sm font-semibold">Conversas recentes</h2>
        <div className="mt-3">
          {recent.map(([title, subtitle, time], index) => (
            <button
              type="button"
              key={title}
              onClick={() => setLiveConversation(index !== 0)}
              className={`w-full border-b border-border px-2 py-4 text-left ${index === 0 && !liveConversation ? "border-l-2 border-l-primary bg-[#173027]" : "hover:bg-secondary"}`}
            >
              <span className="flex items-start justify-between gap-2 text-xs">
                <strong className="truncate font-medium text-foreground">{title}</strong>
                <span className="shrink-0 text-muted-foreground">{time}</span>
              </span>
              <span className="mt-2 block truncate text-xs text-muted-foreground">{subtitle}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="mt-auto flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Limpar histórico
        </button>
      </aside>

      <section className="min-w-0 px-5 py-6 sm:px-7" aria-labelledby="guided-title">
        {liveConversation ? (
          <>
            <header className="border-b border-border pb-4">
              <h1 id="guided-title" className="text-3xl font-semibold">
                Nova conversa
              </h1>
              <p className="mt-1 text-base text-muted-foreground">
                Descreva sua dúvida e avance uma etapa por vez.
              </p>
            </header>
            <div className="mt-5">
              <GravityChat
                context={context}
                sugestoes={[
                  "Como decomponho o peso no plano inclinado?",
                  "Qual sentido devo escolher como positivo?",
                  "Como o atrito entra na 2ª Lei?",
                ]}
                alturaMensagens="min(66vh, 42rem)"
              />
            </div>
          </>
        ) : (
          <GuidedSolution onStart={() => setLiveConversation(true)} />
        )}
      </section>

      <ProblemData />
    </main>
  );
}

function GuidedSolution({ onStart }: { onStart: () => void }) {
  return (
    <>
      <header className="border-b border-border pb-3">
        <h1 id="guided-title" className="text-3xl font-semibold">
          Raciocínio guiado
        </h1>
        <p className="mt-1 text-lg text-[#c9d2cd]">Vamos resolver juntos, passo a passo.</p>
      </header>

      <div className="mt-4 space-y-5 text-sm leading-relaxed text-[#d2dbd6]">
        <ReasoningStep number="1" title="O que você já tentou?">
          <p>Conte o que você já pensou ou escreveu. Assim, posso continuar a partir daí.</p>
          <div className="mt-2 flex items-center justify-between border border-border bg-[#0b1a14] px-3 py-2">
            <span>
              Acho que a força resultante é m g sen(θ), então a = g sen(θ).
              <br />
              Não tenho certeza sobre o papel do atrito.
            </span>
            <button
              type="button"
              onClick={onStart}
              className="shrink-0 text-xs text-muted-foreground hover:text-foreground"
            >
              Editar
            </button>
          </div>
        </ReasoningStep>

        <ReasoningStep number="2" title="Análise e plano">
          <p>
            Ótimo começo. Você identificou corretamente a componente do peso ao longo do plano.
            Agora vamos incluir o atrito e aplicar a 2ª Lei de Newton na direção do movimento.
          </p>
          <strong className="mt-2 block text-foreground">Hipóteses e modelo</strong>
          <ul className="mt-1 grid gap-0.5 pl-5 marker:text-primary">
            <li>Bloco de massa m em um plano inclinado de ângulo θ.</li>
            <li>Atrito cinético com coeficiente μₖ.</li>
            <li>Eixo x ao longo do plano, positivo para baixo.</li>
            <li>Movimento com aceleração constante.</li>
          </ul>
        </ReasoningStep>

        <ReasoningStep number="3" title="Equações e cálculo">
          <p>Decompondo as forças na direção do plano:</p>
          <div className="mt-2 grid gap-2 font-[Georgia,serif] text-lg italic sm:grid-cols-2">
            <span>F∥ = m g sen(θ)</span>
            <span className="text-sm not-italic text-muted-foreground">componente do peso</span>
            <span>fₐₜ = μₖ m g cos(θ)</span>
            <span className="text-sm not-italic text-muted-foreground">força de atrito</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
            <span className="font-[Georgia,serif] text-xl italic">
              m g sen(θ) − μₖ m g cos(θ) = m a
            </span>
            <span className="border border-primary px-6 py-3 font-[Georgia,serif] text-xl italic text-primary">
              a = g (sen(θ) − μₖ cos(θ))
            </span>
          </div>
        </ReasoningStep>

        <ReasoningStep number="4" title="Próximo passo" icon>
          <p>
            Agora que obtivemos a expressão para a aceleração, podemos analisar condições
            específicas ou verificar quando o bloco não desliza.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "Calcular um caso numérico",
              "Quando o bloco não desliza?",
              "Variar o ângulo θ",
              "Outro cenário",
            ].map((label) => (
              <button
                type="button"
                key={label}
                onClick={onStart}
                className="flex min-h-9 items-center gap-2 border border-border-strong px-3 text-xs text-primary hover:bg-secondary"
              >
                {label} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            ))}
          </div>
        </ReasoningStep>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="mt-5 flex min-h-14 w-full items-center border border-border bg-[#0b1a14] text-left"
      >
        <span className="grid h-14 w-14 place-items-center border-r border-border text-muted-foreground">
          <Paperclip className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="flex-1 px-4 text-sm text-muted-foreground">Enviar pergunta</span>
        <span className="flex h-14 items-center gap-3 bg-primary px-6 font-semibold text-primary-foreground">
          <Send className="h-5 w-5" aria-hidden="true" /> Enviar pergunta
        </span>
      </button>
      <p className="mt-2 text-xs text-muted-foreground">
        As respostas podem conter erros. Confira unidades e hipóteses.
      </p>
    </>
  );
}

function ReasoningStep({
  number,
  title,
  icon = false,
  children,
}: {
  number: string;
  title: string;
  icon?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
        {number}
      </span>
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          {icon && <Lightbulb className="h-5 w-5" aria-hidden="true" />}
          {title}
        </h2>
        <div className="mt-0.5">{children}</div>
      </div>
    </section>
  );
}

function ProblemData() {
  return (
    <aside
      className="hidden border-l border-border px-6 py-6 xl:block"
      aria-labelledby="problem-title"
    >
      <h2 id="problem-title" className="border-b border-border pb-3 text-2xl font-semibold">
        Dados do problema
      </h2>
      <h3 className="mt-5 font-semibold">Bloco em plano inclinado com atrito</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#d2dbd6]">
        Um bloco de massa <span className="font-[Georgia,serif] italic">m = 2,0 kg</span> desliza
        para baixo em um plano inclinado de{" "}
        <span className="font-[Georgia,serif] italic">θ = 30°</span>, com coeficiente de atrito
        cinético <span className="font-[Georgia,serif] italic">μₖ = 0,20</span>. Determine a
        aceleração do bloco.
      </p>
      <InclinedPlaneDiagram />

      <h3 className="mt-5 border-b border-border pb-3 font-semibold">Dados</h3>
      <dl className="divide-y divide-border text-sm">
        <DataRow label="Massa do bloco" value="m = 2,0 kg" />
        <DataRow label="Ângulo do plano" value="θ = 30°" />
        <DataRow label="Coeficiente de atrito cinético" value="μₖ = 0,20" />
        <DataRow label="Gravidade (Terra)" value="g = 9,8 m/s²" />
      </dl>

      <h3 className="mt-6 border-b border-border pb-3 font-semibold">Perguntas</h3>
      <ol className="mt-3 grid gap-3 text-sm">
        <li>① &nbsp;Determine a aceleração do bloco.</li>
        <li>② &nbsp;Qual seria a aceleração se μₖ = 0?</li>
        <li>③ &nbsp;Para qual valor de θ o bloco não desliza?</li>
      </ol>
    </aside>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <dt>{label}</dt>
      <dd className="font-[Georgia,serif] text-base italic">{value}</dd>
    </div>
  );
}

function InclinedPlaneDiagram() {
  return (
    <svg
      viewBox="0 0 330 155"
      className="mt-5 w-full border border-border bg-[#0b1a14]"
      aria-label="Diagrama de um bloco descendo um plano inclinado"
    >
      <g fill="none" stroke="#a8bbb2" strokeWidth="1.4">
        <path d="M25 128h208L25 38v90Z" />
        <path d="M28 126h205" strokeDasharray="4 4" />
        <path d="M122 126a36 36 0 0 1 7-22" />
        <path d="m238 55 34 22m-34-22 5 10m-5-10 11 1" stroke="#9de7cb" />
        <path d="m286 108 25-8m-25 8 6-24" stroke="#9de7cb" />
      </g>
      <rect x="72" y="42" width="46" height="39" fill="#8ddabf" transform="rotate(23 95 62)" />
      <text x="89" y="65" fill="#0a1812" fontFamily="Georgia" fontStyle="italic">
        m
      </text>
      <text x="126" y="116" fill="#c7d2cc" fontFamily="Georgia" fontStyle="italic">
        θ
      </text>
      <text x="284" y="76" fill="#c7d2cc" fontFamily="Georgia" fontStyle="italic">
        y
      </text>
      <text x="313" y="102" fill="#c7d2cc" fontFamily="Georgia" fontStyle="italic">
        x
      </text>
    </svg>
  );
}
