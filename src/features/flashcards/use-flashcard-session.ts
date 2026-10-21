import { useEffect, useRef, useState } from "react";
import { FLASHCARD_DECKS, type FlashcardDeck, type FlashcardRating } from "@/lib/flashcards/decks";
import { premiumDeckServerFn } from "@/lib/flashcards/server-fn";
import {
  type FlashcardRatings,
  flashcardPosition,
  summarizeFlashcardSession,
} from "@/lib/flashcards/session";
import { saveFlashcardSession } from "@/lib/flashcards/session-store";

export function useFlashcardSession() {
  const [deck, setDeck] = useState(FLASHCARD_DECKS[0]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [autoAdvance, setAutoAdvanceValue] = useState(true);
  const [ratings, setRatings] = useState<FlashcardRatings>({});
  const [finished, setFinished] = useState(false);
  const [deckError, setDeckError] = useState<string | null>(null);
  const [loadingDeck, setLoadingDeck] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishedRef = useRef(false);
  const selectingDeck = useRef(false);
  const mounted = useRef(true);

  function clearTimer() {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  }

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (timer.current !== null) clearTimeout(timer.current);
    };
  }, []);

  function reset() {
    clearTimer();
    finishedRef.current = false;
    setIndex(0);
    setRevealed(false);
    setRatings({});
    setFinished(false);
  }

  async function selectDeck(item: FlashcardDeck) {
    if (selectingDeck.current) return;
    clearTimer();
    setDeckError(null);
    if (!item.plusOnly) {
      setDeck(item);
      reset();
      return;
    }
    selectingDeck.current = true;
    setLoadingDeck(true);
    try {
      const result = await premiumDeckServerFn();
      if (!mounted.current) return;
      if (result.deck) {
        setDeck(result.deck);
        reset();
      } else setDeckError(result.error ?? "Deck indisponível.");
    } catch {
      if (mounted.current) setDeckError("Não foi possível carregar o deck.");
    } finally {
      selectingDeck.current = false;
      if (mounted.current) setLoadingDeck(false);
    }
  }

  function finish(next = ratings) {
    clearTimer();
    if (finishedRef.current) return;
    finishedRef.current = true;
    setRatings(next);
    setFinished(true);
    saveFlashcardSession(deck, next);
  }

  function goTo(next: number) {
    clearTimer();
    const position = flashcardPosition(next, deck.cards.length);
    if (position.finished) finish();
    else {
      setIndex(position.index);
      setRevealed(false);
    }
  }

  const card = deck.cards[index];
  function rate(value: FlashcardRating) {
    if (!revealed || finishedRef.current || timer.current !== null) return;
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

  function setAutoAdvance(value: boolean) {
    clearTimer();
    setAutoAdvanceValue(value);
  }

  return {
    deck,
    deckId: deck.id,
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
    summary: summarizeFlashcardSession(deck, ratings),
  };
}
