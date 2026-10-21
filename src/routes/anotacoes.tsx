import { createFileRoute } from "@tanstack/react-router";

import { AnotacoesPage } from "@/features/notes/notes-page";

export const Route = createFileRoute("/anotacoes")({
  validateSearch: (input: Record<string, unknown>): { nota?: string } => ({
    nota:
      typeof input.nota === "string" && /^nota-[a-f0-9-]{36}$/.test(input.nota)
        ? input.nota
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Minhas anotações | GRAVITYMIND" },
      {
        name: "description",
        content: "Crie e organize anotações pessoais de Física com salvamento automático.",
      },
    ],
  }),
  component: AnotacoesPageRoute,
});

function AnotacoesPageRoute() {
  const search = Route.useSearch();
  return <AnotacoesPage {...search} />;
}
