import { createFileRoute } from "@tanstack/react-router";

import { ConfiguracoesPage } from "@/features/settings/settings-page";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Preferências | GRAVITYMIND" },
      {
        name: "description",
        content: "Ajustes de aparência, leitura, movimento e apoio ao foco.",
      },
    ],
  }),
  component: ConfiguracoesPage,
});
