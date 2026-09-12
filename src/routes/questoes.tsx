import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Focus, X } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import {
  type PracticeMode,
  QuestionPractice,
  ResetHistoricoButton,
} from "@/components/question-practice";
import { contarRevisoesPendentes, limparHistorico } from "@/lib/questions/engine";
import type { Assunto, QuestionScope } from "@/lib/questions/types";
import { ASSUNTO_LABEL } from "@/lib/questions/types";
import { useSiteSettings } from "@/lib/settings/use-site-settings";

const searchSchema = z.object({
  assunto: z.enum(["misto", "mecanica", "lei-1", "lei-2", "lei-3"]).optional(),
  modo: z.enum(["adaptativo", "facil", "medio", "dificil"]).optional(),
});

export const Route = createFileRoute("/questoes")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Prática adaptativa | GRAVITYMIND" },
      {
        name: "description",
        content:
          "Pratique as Leis de Newton com revisão de erros, recuperação ativa e dificuldade adaptativa.",
      },
    ],
  }),
  component: QuestoesPage,
});

type SelecaoAssunto = QuestionScope;

const ASSUNTOS: {
  id: SelecaoAssunto;
  marcador: string;
  titulo: string;
  apoio: string;
}[] = [
  {
    id: "misto",
    marcador: "Todas",
    titulo: "Revisão mista",
    apoio: "Prioriza erros e conteúdos esquecidos",
  },
  {
    id: "mecanica",
    marcador: "M",
    titulo: "Mecânica",
    apoio: "Vetores, diagramas, atrito e sistemas",
  },
  {
    id: "lei-1",
    marcador: "1ª",
    titulo: ASSUNTO_LABEL["lei-1"],
    apoio: "Inércia e equilíbrio",
  },
  {
    id: "lei-2",
    marcador: "2ª",
    titulo: ASSUNTO_LABEL["lei-2"],
    apoio: "Força, massa e aceleração",
  },
  {
    id: "lei-3",
    marcador: "3ª",
    titulo: ASSUNTO_LABEL["lei-3"],
    apoio: "Pares de ação e reação",
  },
];

function QuestoesPage() {
  const { assunto = "misto", modo = "adaptativo" } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const settings = useSiteSettings();
  const [resetKey, setResetKey] = useState(0);
  const revisoes = contarRevisoesPendentes(
    assunto === "misto" || assunto === "mecanica" ? undefined : (assunto as Assunto),
  );

  function setAssunto(next: SelecaoAssunto) {
    void navigate({ search: (current) => ({ ...current, assunto: next }) });
  }

  function setModo(next: PracticeMode) {
    void navigate({ search: (current) => ({ ...current, modo: next }) });
  }

  function reiniciar() {
    limparHistorico();
    setResetKey((valor) => valor + 1);
  }

  return (
    <main
      className="gm-reference-page study-focus-shell py-8"
      data-focus={settings.focusMode ? "true" : "false"}
    >
      <div className="gm-shell relative">
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

        <div className="study-focus-layout grid gap-10 lg:grid-cols-[15.75rem_minmax(0,1fr)]">
          <aside className="focus-optional border-r border-border pr-9 lg:min-h-[calc(100dvh-9.5rem)]">
            <label
              htmlFor="practice-subject"
              className="font-mono text-xs tracking-[0.17em] text-muted-foreground"
            >
              DISCIPLINA
            </label>
            <select
              id="practice-subject"
              className="mt-2 w-full border-0 border-b border-border bg-transparent py-3 text-base text-foreground"
              value={assunto}
              onChange={(event) => setAssunto(event.target.value as SelecaoAssunto)}
            >
              {ASSUNTOS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.titulo}
                </option>
              ))}
            </select>

            <fieldset className="mt-8 border-b border-border pb-8">
              <legend className="font-mono text-xs tracking-[0.17em] text-muted-foreground">
                DIFICULDADE
              </legend>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(
                  [
                    ["facil", "Fácil"],
                    ["medio", "Médio"],
                    ["dificil", "Difícil"],
                    ["adaptativo", "Adaptativo"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setModo(value)}
                    aria-pressed={modo === value}
                    className={`min-h-10 border px-2 text-xs font-medium ${
                      modo === value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {modo === "adaptativo"
                  ? "O nível muda conforme seus acertos e correções."
                  : "Nível fixo durante esta sessão."}
              </p>
            </fieldset>

            <div className="border-b border-border py-8">
              <p className="font-mono text-xs tracking-[0.17em] text-muted-foreground">DICAS</p>
              <p className="mt-2 text-base">2 dicas por sessão</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                O botão aparece junto à questão para manter a dica ligada ao raciocínio atual.
              </p>
            </div>

            <div className="border-b border-border py-8">
              <p className="font-mono text-xs tracking-[0.17em] text-muted-foreground">
                META DIÁRIA
              </p>
              <p className="mt-2 text-base">Meta de hoje: 0 de 5</p>
              <div className="ff-progress-track mt-4">
                <div className="ff-progress-fill w-0" />
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                {revisoes} {revisoes === 1 ? "revisão pendente" : "revisões pendentes"}
              </p>
            </div>

            <button
              type="button"
              className="ff-btn-outline mt-8 w-full"
              onClick={() => settings.setFocusMode(true)}
            >
              <Focus className="h-4 w-4" aria-hidden="true" />
              Entrar no modo foco
            </button>
          </aside>

          <section className="min-w-0" aria-live="polite">
            <QuestionPractice
              key={`${assunto}-${modo}-${resetKey}`}
              assunto={assunto}
              initialMode={modo as PracticeMode}
              showToolbar={false}
              workspace
              onModeChange={(nextMode) =>
                void navigate({
                  search: (current) => ({ ...current, modo: nextMode }),
                })
              }
            />
            <div className="focus-optional mt-5 border-t border-border pt-3">
              <ResetHistoricoButton onReset={reiniciar} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
