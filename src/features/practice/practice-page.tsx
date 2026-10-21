import { Link, useNavigate } from "@tanstack/react-router";
import { Calculator, ChevronDown, Focus, NotebookPen, X } from "lucide-react";
import { useState } from "react";
import { PageHeading } from "@/components/page-heading";
import {
  type PracticeMode,
  QuestionPractice,
  ResetHistoricoButton,
} from "@/components/question-practice";
import { useStudyProfile } from "@/lib/profile/use-study-profile";
import { limparHistorico } from "@/lib/questions/engine";
import type { QuestionScope } from "@/lib/questions/types";
import { useSiteSettings } from "@/lib/settings/use-site-settings";

export function QuestoesPage({
  assunto = "misto",
  modo: requestedMode,
}: {
  assunto?: QuestionScope;
  modo?: PracticeMode;
}) {
  const modo = requestedMode ?? "adaptativo";
  const navigate = useNavigate({ from: "/questoes" });
  const settings = useSiteSettings();
  const { profile } = useStudyProfile();
  const [resetKey, setResetKey] = useState(0);
  const [toolsExpanded, setToolsExpanded] = useState(false);
  function setMode(value: PracticeMode) {
    void navigate({ search: (current) => ({ ...current, modo: value }) });
  }
  return (
    <main
      className="study-focus-shell gm-practice-page gm-shell py-10"
      data-focus={String(settings.focusMode)}
    >
      <PageHeading title="Prática">
        <button
          type="button"
          className="ff-btn-outline"
          aria-pressed={settings.focusMode}
          onClick={() => settings.setFocusMode(!settings.focusMode)}
        >
          {settings.focusMode ? (
            <X size={16} aria-hidden="true" />
          ) : (
            <Focus size={16} aria-hidden="true" />
          )}
          {settings.focusMode ? "Sair do foco" : "Modo foco"}
        </button>
      </PageHeading>
      <div className="gm-study-layout study-focus-layout">
        <aside className="gm-study-sidebar focus-optional" aria-label="Configurar prática">
          <fieldset>
            <legend>Conteúdo</legend>
            <label htmlFor="practice-subject" className="sr-only">
              Conteúdo
            </label>
            <select
              id="practice-subject"
              value={assunto}
              className="ff-input mt-2"
              onChange={(e) =>
                void navigate({
                  search: (current) => ({ ...current, assunto: e.target.value as QuestionScope }),
                })
              }
            >
              {[
                ["misto", "Revisão mista"],
                ["mecanica", "Mecânica"],
                ["lei-1", "1ª Lei · Inércia"],
                ["lei-2", "2ª Lei · Dinâmica"],
                ["lei-3", "3ª Lei · Ação e reação"],
              ].map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </fieldset>
          <fieldset>
            <legend>Dificuldade</legend>
            <div className="gm-mode-options">
              {(
                [
                  ["adaptativo", "Adaptativo"],
                  ["facil", "Fácil"],
                  ["medio", "Médio"],
                  ["dificil", "Difícil"],
                ] as const
              ).map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setMode(value)}
                  aria-pressed={modo === value}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          <button
            type="button"
            className="gm-study-extra-toggle"
            aria-controls="practice-tools"
            aria-expanded={toolsExpanded}
            onClick={() => setToolsExpanded((current) => !current)}
          >
            Objetivo e ferramentas <ChevronDown size={16} aria-hidden="true" />
          </button>
          <div id="practice-tools" className="gm-study-extra" data-expanded={toolsExpanded}>
            <div className="gm-study-target">
              <p>Objetivo de hoje</p>
              <strong>
                {profile?.todayAnswers ?? 0} de {profile?.dailyGoal ?? 5} questões
              </strong>
              <progress
                className="gm-progress w-full"
                aria-label="Objetivo diário"
                value={Math.min(profile?.todayAnswers ?? 0, profile?.dailyGoal ?? 5)}
                max={profile?.dailyGoal ?? 5}
              />
            </div>
            <nav className="gm-study-tools" aria-label="Instrumentos de estudo">
              <Link to="/calculo">
                <Calculator size={16} aria-hidden="true" />
                Calculadora científica
              </Link>
              <Link to="/anotacoes">
                <NotebookPen size={16} aria-hidden="true" />
                Minhas anotações
              </Link>
            </nav>
          </div>
        </aside>
        <div className="gm-practice-main">
          <QuestionPractice
            key={`${assunto}-${modo}-${resetKey}`}
            assunto={assunto}
            initialMode={modo}
            showToolbar={false}
            workspace
            onModeChange={setMode}
          />
          <div className="focus-optional mt-6 border-t border-border pt-4">
            <ResetHistoricoButton
              onReset={() => {
                limparHistorico();
                setResetKey((value) => value + 1);
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
