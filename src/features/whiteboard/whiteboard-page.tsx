import { Focus, X } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { Whiteboard } from "@/components/whiteboard";
import { useSiteSettings } from "@/lib/settings/use-site-settings";

export function QuadroPage() {
  const settings = useSiteSettings();
  return (
    <main className="ff-page study-focus-shell" data-focus={settings.focusMode ? "true" : "false"}>
      <div className="ff-shell relative">
        <PageHeading title="Quadro de resolução">
          <button
            type="button"
            className="ff-btn-outline w-fit"
            aria-pressed={settings.focusMode}
            onClick={() => settings.setFocusMode(!settings.focusMode)}
          >
            {settings.focusMode ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Focus className="h-4 w-4" aria-hidden="true" />
            )}
            {settings.focusMode ? "Sair do foco" : "Entrar no modo foco"}
          </button>
        </PageHeading>

        <div className="study-focus-surface mt-8">
          <Whiteboard />
        </div>
      </div>
    </main>
  );
}
