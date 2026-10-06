import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PROGRESS_EVENT } from "@/lib/brand";
import { percentualLicao } from "@/lib/profile/lesson-progress";

export const LESSONS = [
  {
    id: "lei-1",
    title: "Inércia e equilíbrio",
    description: "Reconheça quando a força resultante é nula.",
    number: "01",
    duration: "10 min",
  },
  {
    id: "lei-2",
    title: "Força, massa e aceleração",
    description: "Use a resultante para prever o movimento.",
    number: "02",
    duration: "15 min",
  },
  {
    id: "lei-3",
    title: "Ação e reação",
    description: "Identifique os dois corpos de uma interação.",
    number: "03",
    duration: "10 min",
  },
] as const;
export function StudyTrail({ compact = false }: { compact?: boolean }) {
  const [progress, setProgress] = useState([0, 0, 0]);
  useEffect(() => {
    const refresh = () => setProgress(LESSONS.map(({ id }) => percentualLicao(id)));
    refresh();
    window.addEventListener(PROGRESS_EVENT, refresh);
    return () => window.removeEventListener(PROGRESS_EVENT, refresh);
  }, []);
  return (
    <ol className="gm-trail mt-5 divide-y divide-border border-y border-border">
      {LESSONS.map((lesson, index) => (
        <li key={lesson.id}>
          <Link
            to={`/${lesson.id}`}
            className={`grid grid-cols-[3rem_minmax(0,1fr)] gap-4 py-5 ${compact ? "" : "md:grid-cols-[3rem_minmax(0,1fr)_7rem] md:gap-6 md:py-7"}`}
          >
            <span className="gm-trail-number">{lesson.number}</span>
            <div>
              <h3
                className={
                  compact ? "text-base font-semibold leading-snug" : "text-xl font-semibold"
                }
              >
                {lesson.title}
              </h3>
              {!compact && <p className="mt-2 text-muted-foreground">{lesson.description}</p>}
              <p className="mt-2 text-sm text-muted-foreground">
                {lesson.duration} · {progress[index]}% dos materiais visitados
              </p>
              <div className="gm-trail-progress" aria-hidden="true">
                <span style={{ width: `${progress[index]}%` }} />
              </div>
            </div>
            {!compact && (
              <span className="col-start-2 text-sm font-semibold text-primary md:col-start-auto md:self-center">
                {progress[index] ? "Continuar aula" : "Abrir aula"}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ol>
  );
}
