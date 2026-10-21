import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { Switch } from "@/components/ui/switch";
import { FLASHCARD_DECKS } from "@/lib/flashcards/decks";
import { useStudyProfile } from "@/lib/profile/use-study-profile";
import { useFlashcardSession } from "./use-flashcard-session";

export function FlashcardsPage() {
  const { profile } = useStudyProfile();
  const {
    deck,
    deckId,
    card,
    index,
    revealed,
    setRevealed,
    autoAdvance,
    setAutoAdvance,
    ratings,
    finished,
    deckError,
    loadingDeck,
    selectDeck,
    reset,
    finish,
    goTo,
    rate,
    summary,
  } = useFlashcardSession();
  return (
    <main className="gm-shell py-10">
      <PageHeading title="Flash Cards">
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
            <Switch id="auto-advance" checked={autoAdvance} onCheckedChange={setAutoAdvance} />
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
                ["Revisados", summary.total],
                ["Preciso rever", summary.review],
                ["Quase", summary.almost],
                ["Lembrei", summary.mastered],
              ].map(([label, value]) => (
                <div key={label} className="py-6">
                  <dt className="text-sm text-muted-foreground">{label}</dt>
                  <dd className="mt-2 text-3xl">{value}</dd>
                </div>
              ))}
            </dl>
            <ul className="mt-5 divide-y divide-border">
              {summary.toReview.map((item) => (
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
