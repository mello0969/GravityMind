import { createFileRoute } from "@tanstack/react-router";

import { FlashcardsPage } from "@/features/flashcards/flashcards-page";

export const Route = createFileRoute("/flashcards")({
  head: () => ({ meta: [{ title: "Flash Cards | GRAVITYMIND" }] }),
  component: FlashcardsPage,
});
