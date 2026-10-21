import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useFlashcardSession } from "@/features/flashcards/use-flashcard-session";
import { setLocalAccount, storageKey } from "@/lib/brand";
import { FLASHCARD_DECKS } from "@/lib/flashcards/decks";
import { flashcardPosition, summarizeFlashcardSession } from "@/lib/flashcards/session";
import { saveFlashcardSession } from "@/lib/flashcards/session-store";

const mocks = vi.hoisted(() => ({ premium: vi.fn() }));
vi.mock("@/lib/flashcards/server-fn", () => ({ premiumDeckServerFn: mocks.premium }));
const deck = FLASHCARD_DECKS[0];
beforeEach(() => {
  setLocalAccount(null);
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  setLocalAccount(null);
});

describe("flashcard domain and storage", () => {
  it("summarizes only evaluated cards belonging to this deck", () => {
    const summary = summarizeFlashcardSession(deck, {
      [deck.cards[0].id]: "review",
      [deck.cards[1].id]: "mastered",
      unrelated: "almost",
    });
    expect(summary).toMatchObject({ total: 2, review: 1, almost: 0, mastered: 1 });
    expect(summary.toReview.map((card) => card.id)).toEqual([deck.cards[0].id]);
    expect(flashcardPosition(-1, 12)).toEqual({ index: 0, finished: false });
    expect(flashcardPosition(12, 12)).toEqual({ index: 11, finished: true });
  });
  it("keeps at most 30 session summaries in the current account", () => {
    setLocalAccount("student-a");
    for (let i = 0; i < 33; i++) saveFlashcardSession(deck, { [deck.cards[0].id]: "mastered" });
    const sessions = JSON.parse(localStorage.getItem(storageKey("flashcard-sessions")) ?? "[]");
    expect(sessions).toHaveLength(30);
    expect(sessions[0]).toMatchObject({ deckId: "fundamentos", total: 1, mastered: 1 });
    setLocalAccount("student-b");
    expect(localStorage.getItem(storageKey("flashcard-sessions"))).toBeNull();
  });
  it("does not prevent completion when browser storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => saveFlashcardSession(deck, {})).not.toThrow();
  });
});

describe("flashcard session controller", () => {
  it("requires reveal before rating, then advances automatically", () => {
    const { result } = renderHook(() => useFlashcardSession());
    act(() => result.current.rate("mastered"));
    expect(result.current.summary.total).toBe(0);
    act(() => result.current.setRevealed(true));
    act(() => result.current.rate("mastered"));
    expect(result.current.index).toBe(0);
    act(() => vi.advanceTimersByTime(300));
    expect(result.current.index).toBe(1);
    expect(result.current.revealed).toBe(false);
    expect(result.current.finished).toBe(false);
  });
  it("cancels pending advance when the user chooses manual advance", () => {
    const { result } = renderHook(() => useFlashcardSession());
    act(() => result.current.setRevealed(true));
    act(() => result.current.rate("almost"));
    act(() => result.current.setAutoAdvance(false));
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.index).toBe(0);
    act(() => result.current.goTo(1));
    expect(result.current.index).toBe(1);
  });
  it("includes the last rating and persists completion only once", () => {
    const { result } = renderHook(() => useFlashcardSession());
    act(() => result.current.goTo(deck.cards.length - 1));
    act(() => result.current.setRevealed(true));
    act(() => result.current.rate("mastered"));
    act(() => vi.advanceTimersByTime(300));
    expect(result.current.finished).toBe(true);
    expect(result.current.summary.mastered).toBe(1);
    act(() => {
      result.current.finish();
      result.current.finish();
    });
    expect(JSON.parse(localStorage.getItem(storageKey("flashcard-sessions")) ?? "[]")).toHaveLength(
      1,
    );
    act(() => result.current.reset());
    expect(result.current).toMatchObject({
      index: 0,
      finished: false,
      revealed: false,
      ratings: {},
    });
  });
  it("keeps the free deck when the server denies the premium deck", async () => {
    mocks.premium.mockResolvedValueOnce({ error: "Plus necessário" });
    const { result } = renderHook(() => useFlashcardSession());
    await act(() => result.current.selectDeck(FLASHCARD_DECKS[1]));
    expect(result.current.deck.id).toBe("fundamentos");
    expect(result.current.deckError).toBe("Plus necessário");
    expect(result.current.loadingDeck).toBe(false);
  });
  it("cleans up the advance timer on unmount", () => {
    const { result, unmount } = renderHook(() => useFlashcardSession());
    act(() => result.current.setRevealed(true));
    act(() => result.current.rate("review"));
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
