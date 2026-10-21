import { createFileRoute } from "@tanstack/react-router";

import { CadastroPage } from "@/features/auth/register-page";

export const Route = createFileRoute("/cadastro")({
  head: () => ({ meta: [{ title: "Criar conta | GRAVITYMIND" }] }),
  component: CadastroPage,
});
