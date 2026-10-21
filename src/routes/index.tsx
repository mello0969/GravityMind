import { createFileRoute } from "@tanstack/react-router";

import { HomePage } from "@/features/home/home-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GRAVITYMIND | Física no seu ritmo" },
      {
        name: "description",
        content:
          "Seu espaço para aprender Física. Aulas, prática adaptativa, revisão e ferramentas gratuitas para organizar os estudos.",
      },
    ],
  }),
  component: HomePage,
});
