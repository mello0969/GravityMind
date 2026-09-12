import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalculationCard } from "@/components/calculation-card";
import { ScientificCalculator } from "@/components/scientific-calculator";
import { QUESTOES_CALCULO } from "@/lib/questions/bank-calculo";

export const Route = createFileRoute("/calculo")({
  head: () => ({
    meta: [
      { title: "Cálculo | GRAVITYMIND" },
      {
        name: "description",
        content: "Calculadora científica e questões numéricas aplicadas às Leis de Newton.",
      },
    ],
  }),
  component: CalculationPage,
});

function CalculationPage() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const question = QUESTOES_CALCULO[questionIndex % QUESTOES_CALCULO.length];

  return (
    <main className="gm-reference-page py-10">
      <div className="gm-shell">
        <header className="max-w-3xl border-b border-border pb-6">
          <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground">
            FERRAMENTA DE ESTUDO
          </p>
          <h1 className="mt-3 text-4xl font-normal sm:text-5xl">Calculadora científica</h1>
          <p className="mt-3 text-base text-muted-foreground">
            Faça operações básicas, trigonometria, logaritmos e exponenciação sem sair da resolução.
          </p>
        </header>

        <div className="mt-8 grid gap-8 xl:grid-cols-[31rem_minmax(0,1fr)] xl:items-start">
          <ScientificCalculator />
          {question && (
            <section aria-labelledby="calculation-practice-title">
              <h2 id="calculation-practice-title" className="mb-4 text-xl font-semibold">
                Aplicar em uma questão
              </h2>
              <CalculationCard
                key={question.id}
                questao={question}
                onProxima={() => setQuestionIndex((index) => index + 1)}
              />
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
