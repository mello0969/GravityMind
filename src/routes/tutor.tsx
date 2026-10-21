import { createFileRoute } from "@tanstack/react-router";

import { z } from "zod";

import { TutorPage } from "@/features/tutor/tutor-page";

export const Route = createFileRoute("/tutor")({
  head: () => ({ meta: [{ title: "Tutor de Física | GRAVITYMIND" }] }),
  validateSearch: (input: Record<string, unknown>): { conversa?: string } => ({
    conversa: z.string().uuid().catch("").parse(input.conversa) || undefined,
  }),
  component: TutorPageRoute,
});

function TutorPageRoute() {
  const search = Route.useSearch();
  return <TutorPage {...search} />;
}
