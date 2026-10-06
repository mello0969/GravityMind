import { createServerFn } from "@tanstack/react-start";
import { setResponseHeaders } from "@tanstack/react-start/server";
import { exigirAssinaturaPlus, PlusAccessError } from "@/lib/billing/entitlements.server";
import type { FlashcardDeck } from "./decks";
import { PREMIUM_DECK } from "./premium.server";

export const premiumDeckServerFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ deck?: FlashcardDeck; error?: string }> => {
    setResponseHeaders(new Headers({ "cache-control": "private, no-store", vary: "Cookie" }));
    try {
      await exigirAssinaturaPlus();
      return { deck: PREMIUM_DECK };
    } catch (error) {
      if (error instanceof PlusAccessError) return { error: error.message };
      return { error: "Não foi possível carregar o deck agora." };
    }
  },
);
