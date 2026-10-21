import { createFileRoute } from "@tanstack/react-router";

import { CalculationPage } from "@/features/calculator/calculation-page";

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
