import { createFileRoute } from "@tanstack/react-router";

import { QuadroPage } from "@/features/whiteboard/whiteboard-page";

export const Route = createFileRoute("/quadro")({
  head: () => ({
    meta: [
      { title: "Quadro de resolução | GRAVITYMIND" },
      {
        name: "description",
        content:
          "Resolva exercícios de física desenhando livremente com lápis, formas, texto, imagens e exportação em PNG.",
      },
    ],
  }),
  component: QuadroPage,
});
