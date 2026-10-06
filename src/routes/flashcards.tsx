import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PageHeading } from "@/components/page-heading";
import { Switch } from "@/components/ui/switch";
import { storageKey } from "@/lib/brand";
import { FLASHCARD_DECKS, type FlashcardDeck, type FlashcardRating } from "@/lib/flashcards/decks";
import { premiumDeckServerFn } from "@/lib/flashcards/server-fn";
import { useStudyProfile } from "@/lib/profile/use-study-profile";

export const Route = createFileRoute("/flashcards")({
  head: () => ({ meta: [{ title: "Flash Cards | GRAVITYMIND" }] }),
  component: FlashcardsPage,
});
function FlashcardsPage() {
  const { profile } = useStudyProfile();
  const [deckId, setDeckId] = useState<FlashcardDeck["id"]>("fundamentos");
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [ratings, setRatings] = useState<Record<string, FlashcardRating>>({});
  const [finished, setFinished] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [premium, setPremium] = useState<FlashcardDeck | null>(null);
  const [deckError, setDeckError] = useState<string | null>(null);
  const [loadingDeck, setLoadingDeck] = useState(false);
  const deck = deckId === "desafios" && premium ? premium : FLASHCARD_DECKS[0];
  async function selectDeck(item: FlashcardDeck) {
    if (loadingDeck) return;
    if (!item.plusOnly) {
      setDeckId(item.id);
      reset();
      return;
    }
    setLoadingDeck(true);
    setDeckError(null);
    try {
      const result = await premiumDeckServerFn();
      if (result.deck) {
        setPremium(result.deck);
        setDeckId(item.id);
        reset();
      } else setDeckError(result.error ?? "Deck indisponível.");
    } catch {
      setDeckError("Não foi possível carregar o deck.");
    } finally {
      setLoadingDeck(false);
    }
  }
  const card = deck.cards[index];
  function clearTimer() {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }
  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );
  function reset() {
    clearTimer();
    setIndex(0);
    setRevealed(false);
    setRatings({});
    setFinished(false);
  }
  function finish(next = ratings) {
    clearTimer();
    setRatings(next);
    setFinished(true);
    try {
      const key = storageKey("flashcard-sessions");
      const raw: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
      const previous = Array.isArray(raw) ? raw : [];
      localStorage.setItem(
        key,
        JSON.stringify([
          ...previous.slice(-29),
          {
            deckId,
            finishedAt: new Date().toISOString(),
            total: Object.keys(next).length,
            mastered: Object.values(next).filter((value) => value === "mastered").length,
          },
        ]),
      );
    } catch {
      /* The result remains visible if storage is unavailable. */
    }
  }
  function goTo(next: number) {
    clearTimer();
    if (next >= deck.cards.length) {
      finish();
      return;
    }
    setIndex(Math.max(0, next));
    setRevealed(false);
  }
  function rate(value: FlashcardRating) {
    if (!revealed || timer.current !== null) return;
    const next = { ...ratings, [card.id]: value };
    setRatings(next);
    if (autoAdvance)
      timer.current = setTimeout(() => {
        timer.current = null;
        if (index === deck.cards.length - 1) finish(next);
        else goTo(index + 1);
      }, 300);
  }
  useEffect(() => {
    function keydown(event: KeyboardEvent) {
      if (
        finished ||
        (event.target instanceof HTMLElement &&
          event.target.closest("input,textarea,select,button,a,[contenteditable]"))
      )
        return;
      if (event.key === " ") {
        event.preventDefault();
        setRevealed(true);
      }
      if (event.key === "ArrowRight") goTo(index + 1);
      if (event.key === "ArrowLeft") goTo(index - 1);
    }
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  });
  return (
    <main className="gm-shell py-10">
      <PageHeading title="Flash Cards" description="O que você consegue lembrar sem olhar?">
        {!finished && (
          <button type="button" onClick={() => finish()} className="ff-btn-outline">
            Terminar
          </button>
        )}
      </PageHeading>
      <div className="gm-flash-layout">
        <aside className="gm-flash-decks">
          <h2 className="text-lg font-semibold">Seus decks</h2>
          <div className="mt-4 divide-y divide-border border-y border-border">
            {FLASHCARD_DECKS.map((item) => (
              <button
                type="button"
                key={item.id}
                disabled={loadingDeck || (item.plusOnly && profile?.plan !== "plus")}
                aria-pressed={item.id === deckId}
                onClick={() => void selectDeck(item)}
                className="w-full py-5 text-left disabled:opacity-60"
              >
                <strong className={item.id === deckId ? "text-primary" : "text-foreground"}>
                  {item.name}
                </strong>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {item.plusOnly ? 5 : item.cards.length} cartões{item.plusOnly ? " · Plus" : ""}
                </span>
              </button>
            ))}
          </div>
          {loadingDeck && (
            <p role="status" className="mt-4 text-sm">
              Carregando deck…
            </p>
          )}
          {deckError && (
            <p role="alert" className="mt-4 text-sm text-destructive">
              {deckError}
            </p>
          )}
          <label
            htmlFor="auto-advance"
            className="mt-6 flex items-center justify-between gap-3 text-sm"
          >
            Avanço automático
            <Switch
              id="auto-advance"
              checked={autoAdvance}
              onCheckedChange={(value) => {
                clearTimer();
                setAutoAdvance(value);
              }}
            />
          </label>
          <Link
            to="/aulas"
            className="mt-8 block text-sm text-primary underline underline-offset-4"
          >
            Voltar às aulas
          </Link>
        </aside>
        {!finished ? (
          <section aria-label="Deck em andamento" className="min-w-0">
            <div className="mb-4 flex items-center justify-between gap-4 text-sm">
              <span>{deck.name}</span>
              <span className="shrink-0 text-muted-foreground">
                Cartão {index + 1} de {deck.cards.length}
              </span>
            </div>
            <progress
              className="gm-progress mb-5 w-full"
              value={index + 1}
              max={deck.cards.length}
              aria-label="Posição no deck"
            />
            <article className="gm-flashcard" aria-live="polite">
              <div className="gm-flash-topic">
                <span>{card.topic}</span>
                <span>{revealed ? "Resposta" : "Pergunta"}</span>
              </div>
              <div className="my-auto py-8" key={`${card.id}-${revealed}`} data-flash-copy>
                <h2 className="reading-copy max-w-3xl text-2xl font-medium leading-relaxed sm:text-3xl">
                  {revealed ? card.answer : card.prompt}
                </h2>
                {revealed && card.formula && <p className="gm-flash-formula">{card.formula}</p>}
                {!revealed && card.id === "fc-inercia" && (
                  <div
                    className="gm-flash-visual"
                    role="img"
                    aria-label="Um corpo de massa m se move junto ao ônibus antes da frenagem"
                  >
                    <span className="gm-mass">m</span>
                    <ArrowRight size={52} strokeWidth={1} aria-hidden="true" />
                    <span>v</span>
                  </div>
                )}
              </div>
              {revealed ? (
                <fieldset>
                  <legend className="mb-3 text-sm text-muted-foreground">Como foi lembrar?</legend>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        ["review", "Preciso rever"],
                        ["almost", "Quase"],
                        ["mastered", "Lembrei"],
                      ] as const
                    ).map(([value, label]) => (
                      <button
                        type="button"
                        key={value}
                        onClick={() => rate(value)}
                        aria-pressed={ratings[card.id] === value}
                        className={ratings[card.id] === value ? "ff-btn-primary" : "ff-btn-outline"}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ) : (
                <button
                  type="button"
                  className="ff-btn-primary w-fit"
                  onClick={() => setRevealed(true)}
                >
                  Revelar resposta
                </button>
              )}
            </article>
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                className="ff-btn-outline"
                disabled={index === 0}
                onClick={() => goTo(index - 1)}
                aria-label="Cartão anterior"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="ff-btn-outline"
                onClick={() => goTo(index + 1)}
                aria-label={index === deck.cards.length - 1 ? "Concluir deck" : "Próximo cartão"}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </section>
        ) : (
          <section aria-labelledby="results-title" className="min-w-0">
            <h2 id="results-title" className="text-3xl">
              Sessão concluída
            </h2>
            <p className="mt-3 text-muted-foreground">
              Sua autoavaliação ajuda a escolher o que revisar.
            </p>
            <dl className="mt-7 grid grid-cols-2 border-y border-border sm:grid-cols-4">
              {[
                ["Revisados", Object.keys(ratings).length],
                ["Preciso rever", Object.values(ratings).filter((v) => v === "review").length],
                ["Quase", Object.values(ratings).filter((v) => v === "almost").length],
                ["Lembrei", Object.values(ratings).filter((v) => v === "mastered").length],
              ].map(([label, value]) => (
                <div key={label} className="py-6">
                  <dt className="text-sm text-muted-foreground">{label}</dt>
                  <dd className="mt-2 text-3xl">{value}</dd>
                </div>
              ))}
            </dl>
            <ul className="mt-5 divide-y divide-border">
              {deck.cards
                .filter((item) => ratings[item.id] && ratings[item.id] !== "mastered")
                .map((item) => (
                  <li key={item.id} className="py-4 text-sm">
                    {item.prompt}
                  </li>
                ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" onClick={reset} className="ff-btn-primary">
                <RotateCcw size={16} />
                Refazer deck
              </button>
              <Link to="/questoes" className="ff-btn-outline">
                Aplicar em questões
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
