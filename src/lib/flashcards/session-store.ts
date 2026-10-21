import { storageKey } from "@/lib/brand";
import type { FlashcardDeck } from "./decks";
import { type FlashcardRatings, summarizeFlashcardSession } from "./session";

export function saveFlashcardSession(deck: FlashcardDeck, ratings: FlashcardRatings) {
  try {
    const key = storageKey("flashcard-sessions");
    const raw: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    const previous = Array.isArray(raw) ? raw : [];
    const { total, mastered } = summarizeFlashcardSession(deck, ratings);
    localStorage.setItem(
      key,
      JSON.stringify([
        ...previous.slice(-29),
        { deckId: deck.id, finishedAt: new Date().toISOString(), total, mastered },
      ]),
    );
  } catch {
    // A session can still finish when browser storage is unavailable.
  }
}
