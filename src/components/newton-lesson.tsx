import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpen, Bot, FileText, Play, ScanSearch } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ContentQuiz } from "@/components/content-quiz";
import { GravityChat } from "@/components/gravity-chat";
import { LawAnimation } from "@/components/law-animation";
import { LawDiagram } from "@/components/law-diagram";
import { gerarResumoPerfilParaGravity } from "@/lib/gravity/perfil-resumo";
import {
  type MarcoLicao,
  marcarConcluido,
  marcosConcluidos,
  percentualLicao,
} from "@/lib/profile/lesson-progress";
import type { Assunto } from "@/lib/questions/types";
import { obterQuiz } from "@/lib/quiz/bank";
import type { FormatoQuiz } from "@/lib/quiz/types";
import { useSiteSettings } from "@/lib/settings/use-site-settings";

type LessonRoute = "/lei-1" | "/lei-2" | "/lei-3";

export type LessonContent = {
  number: "1ª" | "2ª" | "3ª";
  title: string;
  subtitle: string;
  statement: string;
  paragraphs: string[];
  summary: { keyPoint: string; bullets: string[] };
  examples: { title: string; desc: string }[];
  formula?: string;
  prev?: { to: LessonRoute; label: string };
  next?: { to: LessonRoute; label: string };
};

type Tab = "texto" | "resumo" | "visual" | "simulacao" | "tutor";

const ASSUNTO_MAP: Record<LessonContent["number"], Assunto> = {
  "1ª": "lei-1",
  "2ª": "lei-2",
  "3ª": "lei-3",
};

const TAB_LIST: { id: Tab; label: string; icon: typeof FileText }[] = [
  { id: "texto", label: "Aula", icon: BookOpen },
  { id: "resumo", label: "Resumo", icon: FileText },
  { id: "visual", label: "Diagrama", icon: ScanSearch },
  { id: "simulacao", label: "Simulação", icon: Play },
  { id: "tutor", label: "Tutor", icon: Bot },
];

export function NewtonLesson({ lesson }: { lesson: LessonContent }) {
  const assunto = ASSUNTO_MAP[lesson.number];
  const settings = useSiteSettings();
  const [tab, setTab] = useState<Tab>("texto");
  const [concluidos, setConcluidos] = useState<MarcoLicao[]>(() => marcosConcluidos(assunto));
  const [percentual, setPercentual] = useState(() => percentualLicao(assunto));
  const [quizAberto, setQuizAberto] = useState<FormatoQuiz | null>(null);

  useEffect(() => {
    setConcluidos(marcosConcluidos(assunto));
    setPercentual(percentualLicao(assunto));
    setTab("texto");
    setQuizAberto(null);
  }, [assunto]);

  function marcar(marco: MarcoLicao) {
    marcarConcluido(assunto, marco);
    setConcluidos(marcosConcluidos(assunto));
    setPercentual(percentualLicao(assunto));
  }

  function abrirTab(novaTab: Tab) {
    setTab(novaTab);
    setQuizAberto(null);
  }

  const duracao = settings.motion === "reduced" ? 0 : 0.22;

  return (
    <main className="ff-page">
      <div className="ff-shell max-w-5xl">
        <header className="grid gap-7 border-b border-border pb-8 md:grid-cols-[1fr_15rem] md:items-end">
          <div>
            <p className="ff-kicker">{lesson.number} Lei de Newton</p>
            <h1 className="mt-3 max-w-3xl text-4xl ">{lesson.title}</h1>
            <p className="reading-copy mt-4 max-w-2xl text-lg text-muted-foreground">
              {lesson.subtitle}
            </p>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span>Progresso da aula</span>
              <span>{percentual}%</span>
            </div>
            <div className="ff-progress-track mt-2">
              <div className="ff-progress-fill" style={{ width: `${percentual}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {
                concluidos.filter((item) =>
                  ["texto", "resumo", "visual", "animacao"].includes(item),
                ).length
              }{" "}
              de 4 formatos
            </p>
          </div>
        </header>

        <nav className="ff-tabs mt-6 w-full" aria-label="Formatos da aula">
          {TAB_LIST.map((item) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => abrirTab(item.id)}
                className={`ff-tab ${tab === item.id ? "active" : ""}`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" /> {item.label}
              </button>
            );
          })}
        </nav>

        <AnimatePresence mode="wait">
          <motion.section
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: duracao }}
            className="mt-7"
          >
            {tab === "texto" && (
              <LessonText
                lesson={lesson}
                assunto={assunto}
                feito={concluidos.includes("texto")}
                onQuiz={setQuizAberto}
              />
            )}
            {tab === "resumo" && (
              <LessonSummary
                lesson={lesson}
                assunto={assunto}
                feito={concluidos.includes("resumo")}
                onQuiz={setQuizAberto}
              />
            )}
            {tab === "visual" && (
              <div>
                <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div>
                    <p className="ff-kicker">Leitura espacial</p>
                    <h2 className="mt-2 text-2xl">Forças e relações no mesmo quadro</h2>
                  </div>
                  <VerifyButton
                    formato="visual"
                    feito={concluidos.includes("visual")}
                    onQuiz={setQuizAberto}
                  />
                </div>
                <LawDiagram assunto={assunto} />
              </div>
            )}
            {tab === "simulacao" && (
              <div>
                <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div>
                    <p className="ff-kicker">Teste de variáveis</p>
                    <h2 className="mt-2 text-2xl">Mude um valor e observe o efeito</h2>
                  </div>
                  <VerifyButton
                    formato="video"
                    feito={concluidos.includes("animacao")}
                    onQuiz={setQuizAberto}
                  />
                </div>
                <LawAnimation assunto={assunto} />
              </div>
            )}
            {tab === "tutor" && (
              <div className="grid gap-6 md:grid-cols-[14rem_minmax(0,1fr)]">
                <div className="focus-optional">
                  <p className="ff-kicker">Tutor contextual</p>
                  <h2 className="mt-2 text-2xl">Pergunte sobre esta lei</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    O tutor recebe apenas esta aula e um resumo curto do seu progresso. Confirme
                    resultados numéricos no material da aula.
                  </p>
                </div>
                <div className="ff-card p-4 sm:p-6">
                  <GravityChat
                    context={{
                      leiAtual: {
                        numero: lesson.number,
                        titulo: lesson.title,
                        enunciado: lesson.statement,
                      },
                      resumoPerfil: gerarResumoPerfilParaGravity(),
                    }}
                    sugestoes={[
                      `Explique a ${lesson.number} Lei com outro exemplo`,
                      "Qual é o erro conceitual mais comum?",
                      "Crie uma pergunta curta para eu testar a ideia",
                    ]}
                    alturaMensagens="380px"
                  />
                </div>
              </div>
            )}
          </motion.section>
        </AnimatePresence>

        {quizAberto &&
          (() => {
            const quiz = obterQuiz(assunto, quizAberto);
            if (!quiz) return null;
            const marco: MarcoLicao =
              quizAberto === "texto"
                ? "texto"
                : quizAberto === "resumo"
                  ? "resumo"
                  : quizAberto === "visual"
                    ? "visual"
                    : "animacao";
            return (
              <div className="mt-7 border-t border-border pt-7">
                <ContentQuiz
                  quiz={quiz}
                  accent="var(--primary)"
                  onAprovado={() => {
                    marcar(marco);
                    setQuizAberto(null);
                  }}
                  onFechar={() => setQuizAberto(null)}
                />
              </div>
            );
          })()}

        <nav
          className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6"
          aria-label="Navegação entre aulas"
        >
          {lesson.prev ? (
            <Link to={lesson.prev.to} className="ff-btn-outline">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {lesson.prev.label}
            </Link>
          ) : (
            <span />
          )}
          {lesson.next ? (
            <Link to={lesson.next.to} className="ff-btn-primary">
              {lesson.next.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : (
            <Link to="/questoes" className="ff-btn-primary">
              Praticar as três leis <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </nav>
      </div>
    </main>
  );
}

function LessonText({
  lesson,
  assunto,
  feito,
  onQuiz,
}: {
  lesson: LessonContent;
  assunto: Assunto;
  feito: boolean;
  onQuiz: (formato: FormatoQuiz) => void;
}) {
  return (
    <article>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(15rem,0.65fr)]">
        <div>
          <blockquote className="border-y border-border py-4  text-xl font-semibold leading-relaxed">
            {lesson.statement}
          </blockquote>
          <div className="reading-copy mt-8 space-y-5 text-muted-foreground">
            {lesson.paragraphs.map((paragrafo) => (
              <p key={paragrafo}>{paragrafo}</p>
            ))}
          </div>
          {lesson.formula && (
            <div className="mt-8 border-y border-border py-8 text-center">
              <p className="ff-kicker">Equação central</p>
              <p className="mt-3 font-mono text-4xl font-bold text-primary ">{lesson.formula}</p>
            </div>
          )}
        </div>

        <aside className="focus-optional border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="ff-kicker">Exemplos observáveis</p>
          <div className="ff-divider-list mt-3 border-y border-border">
            {lesson.examples.map((exemplo) => (
              <div key={exemplo.title} className="py-4">
                <h3 className="text-sm">{exemplo.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{exemplo.desc}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
      <div className="mt-8 flex justify-end">
        <VerifyButton formato="texto" feito={feito} assunto={assunto} onQuiz={onQuiz} />
      </div>
    </article>
  );
}

function LessonSummary({
  lesson,
  assunto,
  feito,
  onQuiz,
}: {
  lesson: LessonContent;
  assunto: Assunto;
  feito: boolean;
  onQuiz: (formato: FormatoQuiz) => void;
}) {
  return (
    <article className="max-w-3xl">
      <p className="ff-kicker">Leitura curta</p>
      <h2 className="mt-3 border-y border-border py-4  text-2xl leading-snug sm:text-3xl">
        {lesson.summary.keyPoint}
      </h2>
      <ol className="mt-8 border-y border-border">
        {lesson.summary.bullets.map((item, indice) => (
          <li
            key={item}
            className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-border py-4 last:border-b-0"
          >
            <span className="font-mono text-xs font-bold text-muted-foreground">0{indice + 1}</span>
            <span className="reading-copy text-muted-foreground">{item}</span>
          </li>
        ))}
      </ol>
      <div className="mt-6 flex justify-end">
        <VerifyButton formato="resumo" feito={feito} assunto={assunto} onQuiz={onQuiz} />
      </div>
    </article>
  );
}

function VerifyButton({
  formato,
  feito,
  onQuiz,
}: {
  formato: FormatoQuiz;
  feito: boolean;
  assunto?: Assunto;
  onQuiz: (formato: FormatoQuiz) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onQuiz(formato)}
      disabled={feito}
      className={feito ? "ff-btn-outline text-success" : "ff-btn-primary"}
    >
      {feito ? "Verificação concluída" : "Verificar compreensão"}
    </button>
  );
}
