import { createFileRoute } from "@tanstack/react-router";
import { Focus, X } from "lucide-react";
import { Whiteboard } from "@/components/whiteboard";
import { useSiteSettings } from "@/lib/settings/use-site-settings";

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

function QuadroPage() {
  const settings = useSiteSettings();
  return (
    <main className="ff-page study-focus-shell" data-focus={settings.focusMode ? "true" : "false"}>
      <div className="ff-shell relative">
        {settings.focusMode && (
          <button
            type="button"
            className="ff-btn-outline absolute right-0 top-0 z-10"
            onClick={() => settings.setFocusMode(false)}
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Sair do foco
          </button>
        )}
        <header className="focus-optional grid gap-6 border-b border-border pb-7 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-3xl">
            <p className="ff-kicker">Ferramenta de estudo</p>
            <h1 className="mt-3 text-3xl sm:text-4xl">Quadro de resolução</h1>
            <p className="reading-copy mt-3 text-muted-foreground">
              Desenhe diagramas de força, escreva cálculos e exporte a resolução. Imagens ficam
              limitadas a formatos e dimensões seguros.
            </p>
          </div>
          <button
            type="button"
            className="ff-btn-outline w-fit"
            onClick={() => settings.setFocusMode(true)}
          >
            <Focus className="h-4 w-4" aria-hidden="true" />
            Entrar no modo foco
          </button>
        </header>

        <div className="study-focus-surface mt-8">
          <Whiteboard />
        </div>
      </div>
    </main>
  );
}
