import { createFileRoute } from "@tanstack/react-router";

import { z } from "zod";

import { PlusPage } from "@/features/billing/plus-page";

export const Route = createFileRoute("/plus")({
  validateSearch: (search) =>
    z.object({ checkout: z.enum(["success", "canceled"]).optional() }).parse(search),
  head: () => ({ meta: [{ title: "Plano Plus | GRAVITYMIND" }] }),
  component: PlusPageRoute,
});

function PlusPageRoute() {
  const search = Route.useSearch();
  return <PlusPage {...search} />;
}
