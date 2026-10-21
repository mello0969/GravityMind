import type { FlashcardDeck, FlashcardRating } from "./decks";

export type FlashcardRatings = Record<string, FlashcardRating>;

export function summarizeFlashcardSession(deck: FlashcardDeck, ratings: FlashcardRatings) {
  const evaluated = deck.cards.filter((card) => ratings[card.id]);
  return {
    total: evaluated.length,
    review: evaluated.filter((card) => ratings[card.id] === "review").length,
    almost: evaluated.filter((card) => ratings[card.id] === "almost").length,
    mastered: evaluated.filter((card) => ratings[card.id] === "mastered").length,
    toReview: evaluated.filter((card) => ratings[card.id] !== "mastered"),
  };
}

export function flashcardPosition(next: number, total: number) {
  return { index: Math.max(0, Math.min(next, total - 1)), finished: next >= total };
}
