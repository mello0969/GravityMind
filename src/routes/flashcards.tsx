import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  LockKeyhole,
  RotateCcw,
  Square,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { storageKey } from "@/lib/brand";
import { FLASHCARD_DECKS, type FlashcardDeck, type FlashcardRating } from "@/lib/flashcards/decks";
import { useStudyProfile } from "@/lib/profile/use-study-profile";
import { useSiteSettings } from "@/lib/settings/use-site-settings";

export const Route = createFileRoute("/flashcards")({
  head: () => ({
    meta: [
      { title: "Flash Cards | GRAVITYMIND" },
      {
        name: "description",
        content: "Recupere conceitos de Mecânica e das Leis de Newton em um deck sem distrações.",
      },
    ],
  }),
  component: FlashcardsPage,
});

type Phase = "study" | "results";

function FlashcardsPage() {
  const settings = useSiteSettings();
  const { profile } = useStudyProfile();
  const [deckId, setDeckId] = useState<FlashcardDeck["id"]>("fundamentos");
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [ratings, setRatings] = useState<Record<string, FlashcardRating>>({});
  const [phase, setPhase] = useState<Phase>("study");
  const timerRef = useRef<number | null>(null);
  const deck = FLASHCARD_DECKS.find((item) => item.id === deckId) ?? FLASHCARD_DECKS[0];
  const card = deck.cards[index];
  const reducedMotion = settings.motion === "reduced";

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  useEffect(() => {
    function handleKeyboard(event: KeyboardEvent) {
      if (phase !== "study") return;
      if (event.key === "ArrowLeft") goTo(index - 1);
      if (event.key === "ArrowRight") goTo(index + 1);
      if (event.key === " ") {
        event.preventDefault();
        setRevealed(true);
      }
      if (!revealed) return;
      if (event.key === "1") rate("review");
      if (event.key === "2") rate("almost");
      if (event.key === "3") rate("mastered");
    }
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  });

  function finish(nextRatings = ratings) {
    setRatings(nextRatings);
    setPhase("results");
    const historyKey = storageKey("flashcard-sessions");
    const previous = JSON.parse(window.localStorage.getItem(historyKey) ?? "[]") as unknown[];
    const summary = {
      deckId,
      finishedAt: new Date().toISOString(),
      total: Object.keys(nextRatings).length,
      mastered: Object.values(nextRatings).filter((value) => value === "mastered").length,
    };
    window.localStorage.setItem(historyKey, JSON.stringify([...previous.slice(-29), summary]));
  }

  function goTo(nextIndex: number) {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setIndex((nextIndex + deck.cards.length) % deck.cards.length);
    setRevealed(false);
  }

  function rate(rating: FlashcardRating) {
    if (!card) return;
    const nextRatings = { ...ratings, [card.id]: rating };
    setRatings(nextRatings);
    if (!autoAdvance) return;
    timerRef.current = window.setTimeout(
      () => {
        if (index >= deck.cards.length - 1) {
          finish(nextRatings);
          return;
        }
        goTo(index + 1);
      },
      reducedMotion ? 0 : 260,
    );
  }

  function reset() {
    setIndex(0);
    setRevealed(false);
    setRatings({});
    setPhase("study");
  }

  function selectDeck(nextId: FlashcardDeck["id"]) {
    const next = FLASHCARD_DECKS.find((item) => item.id === nextId);
    if (!next || (next.plusOnly && profile?.plan !== "plus")) return;
    setDeckId(nextId);
    reset();
  }

  const results = useMemo(() => {
    const values = Object.values(ratings);
    return {
      total: values.length,
      review: values.filter((value) => value === "review").length,
      almost: values.filter((value) => value === "almost").length,
      mastered: values.filter((value) => value === "mastered").length,
    };
  }, [ratings]);

  return (
    <main className="gm-reference-page py-12 sm:py-14">
      <div className="gm-shell">
        {phase === "study" && card ? (
          <section aria-label="Deck em andamento">
            <div className="mx-auto flex max-w-[62rem] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-4xl font-normal sm:text-5xl">Flash Cards</h1>
              <div className="flex items-center gap-6 text-base text-[#d7dfda]">
                <span>
                  Cartão {index + 1} de {deck.cards.length}
                </span>
                <div className="ff-progress-track w-52">
                  <div
                    className="ff-progress-fill"
                    style={{ width: `${((index + 1) / deck.cards.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-9 grid items-center gap-5 lg:grid-cols-[4.25rem_minmax(0,62rem)_4.25rem] lg:justify-center lg:gap-16">
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                className="hidden h-16 w-16 place-items-center border border-border-strong text-foreground hover:bg-secondary lg:grid"
                aria-label="Cartão anterior"
              >
                <ChevronLeft className="h-8 w-8" strokeWidth={1.5} aria-hidden="true" />
              </button>

              <div className="[perspective:1400px]">
                <motion.article
                  animate={{ rotateY: revealed ? 180 : 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.46, ease: [0.16, 1, 0.3, 1] }}
                  className="relative h-[34.25rem] border border-border-strong bg-[#0a1812] [transform-style:preserve-3d]"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-between p-8 text-center [backface-visibility:hidden] sm:p-14">
                    <h2 className="reading-copy max-w-3xl text-3xl font-normal leading-snug sm:text-[2.35rem]">
                      {card.prompt}
                    </h2>
                    <BusDiagram />
                    <p className="font-mono text-[0.65rem] tracking-[0.16em] text-muted-foreground">
                      {card.topic}
                    </p>
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-between p-8 [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-14">
                    <span className="font-mono text-xs tracking-[0.18em] text-primary">
                      RESPOSTA
                    </span>
                    <div>
                      <p className="reading-copy text-2xl leading-relaxed sm:text-3xl">
                        {card.answer}
                      </p>
                      {card.formula && (
                        <p className="mt-7 border-t border-border pt-5 font-[Georgia,serif] text-2xl italic text-primary">
                          {card.formula}
                        </p>
                      )}
                    </div>
                    <fieldset className="grid grid-cols-3 gap-2">
                      <legend className="sr-only">Como foi lembrar?</legend>
                      <RatingButton label="Rever" onClick={() => rate("review")} />
                      <RatingButton label="Quase" onClick={() => rate("almost")} />
                      <RatingButton label="Dominei" onClick={() => rate("mastered")} primary />
                    </fieldset>
                  </div>
                </motion.article>
              </div>

              <button
                type="button"
                onClick={() => goTo(index + 1)}
                className="hidden h-16 w-16 place-items-center border border-border-strong text-foreground hover:bg-secondary lg:grid"
                aria-label="Próximo cartão"
              >
                <ChevronRight className="h-8 w-8" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>

            <div className="mx-auto mt-10 grid max-w-[62rem] gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
              <button
                type="button"
                className="ff-btn-primary min-h-16 text-lg"
                onClick={() => setRevealed(true)}
              >
                Revelar resposta
              </button>
              <button
                type="button"
                className="ff-btn-outline min-h-16 text-lg"
                onClick={() => finish()}
              >
                <Square className="h-4 w-4" aria-hidden="true" />
                Terminar
              </button>
              <button
                type="button"
                role="switch"
                aria-checked={autoAdvance}
                onClick={() => setAutoAdvance((value) => !value)}
                className="flex min-h-16 items-center gap-5 border-l border-border px-6 text-sm text-[#d8e0db]"
              >
                Avanço automático
                <span
                  className={`relative h-7 w-14 rounded-full ${autoAdvance ? "bg-primary" : "bg-secondary"}`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-[#eef3ef] transition-transform ${
                      autoAdvance ? "translate-x-8" : "translate-x-1"
                    }`}
                  />
                </span>
              </button>
            </div>

            <div className="mx-auto mt-32 flex max-w-[62rem] flex-wrap items-end justify-between gap-4 border-t border-border pt-6">
              <label className="grid gap-2 text-xs text-muted-foreground" htmlFor="deck-select">
                Deck
                <select
                  id="deck-select"
                  className="ff-input min-w-72"
                  value={deckId}
                  onChange={(event) => selectDeck(event.target.value as FlashcardDeck["id"])}
                >
                  {FLASHCARD_DECKS.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                      disabled={item.plusOnly && profile?.plan !== "plus"}
                    >
                      {item.name}
                      {item.plusOnly ? " · Plus" : ""}
                    </option>
                  ))}
                </select>
              </label>
              {profile?.plan !== "plus" && (
                <Link
                  to="/plus"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <LockKeyhole className="h-4 w-4" aria-hidden="true" />
                  Desafios integrados no Plus
                </Link>
              )}
            </div>
          </section>
        ) : (
          <section className="mx-auto max-w-3xl py-16" aria-labelledby="results-title">
            <p className="ff-kicker">Sessão encerrada</p>
            <h1 id="results-title" className="mt-3 text-4xl font-normal">
              Resultado do deck
            </h1>
            <p className="reading-copy mt-3 text-muted-foreground">
              Use a lista de revisão para escolher o próximo formato de estudo.
            </p>
            <dl className="mt-8 grid grid-cols-2 border-y border-border sm:grid-cols-4">
              <ResultMetric label="Respondidos" value={results.total} />
              <ResultMetric label="Rever" value={results.review} />
              <ResultMetric label="Quase" value={results.almost} />
              <ResultMetric label="Dominados" value={results.mastered} />
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" className="ff-btn-primary" onClick={reset}>
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Refazer deck
              </button>
              <Link to="/questoes" className="ff-btn-outline">
                Aplicar em questões
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function BusDiagram() {
  return (
    <svg
      viewBox="0 0 720 300"
      className="h-auto w-full max-w-[55rem] text-[#d8e2dd]"
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      >
        <path d="M112 235h508M178 204h349c18 0 30-12 30-30v-70l-24-54c-6-14-19-22-35-22H235c-31 0-57 25-57 56v120Z" />
        <path d="M198 51h300l22 78H198V51Zm92 0v78m189-78v78M405 51v153" />
        <path d="M535 130h22m-379 74h379m-30-73v73" />
        <circle cx="258" cy="204" r="34" />
        <circle cx="258" cy="204" r="17" />
        <circle cx="486" cy="204" r="34" />
        <circle cx="486" cy="204" r="17" />
        <circle cx="356" cy="79" r="13" />
        <path d="M352 94c-16 14-21 32-18 51l8 38m16-76 17 21 22 5m-48 48h28l8 23m-50-72-8 34" />
        <circle cx="447" cy="79" r="13" />
        <path d="m440 94-17 31 18 20h30m-31-26 31 13 17 22m-67-10 1 35h35l8 25" />
        <path d="M291 78h42m-42 12h42m-31-25 10 7-10 7" strokeDasharray="6 7" />
        <path d="M112 204h35m-45-20h45m-34-20h34" opacity="0.68" />
      </g>
    </svg>
  );
}

function RatingButton({
  label,
  onClick,
  primary = false,
}: {
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={primary ? "ff-btn-primary min-w-0 px-2" : "ff-btn-outline min-w-0 px-2"}
    >
      {label}
    </button>
  );
}

function ResultMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-b border-r border-border p-4 last:border-r-0 sm:border-b-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold">{value}</dd>
    </div>
  );
}
