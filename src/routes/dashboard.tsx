import { createFileRoute } from "@tanstack/react-router";

import { DashboardPage } from "@/features/progress/progress-page";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Meu progresso | GRAVITYMIND" },
      {
        name: "description",
        content: "Veja seu progresso real, revisões pendentes e a próxima ação de estudo.",
      },
    ],
  }),
  component: DashboardPage,
});
