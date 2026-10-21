import { createFileRoute } from "@tanstack/react-router";

import { z } from "zod";

import { QuestoesPage } from "@/features/practice/practice-page";

const searchSchema = z.object({
  assunto: z.enum(["misto", "mecanica", "lei-1", "lei-2", "lei-3"]).optional(),
  modo: z.enum(["adaptativo", "facil", "medio", "dificil"]).optional(),
});

export const Route = createFileRoute("/questoes")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({ meta: [{ title: "Prática | GRAVITYMIND" }] }),
  component: QuestoesPageRoute,
});

function QuestoesPageRoute() {
  const search = Route.useSearch();
  return <QuestoesPage {...search} />;
}
