import { type FormEvent, useRef, useState } from "react";
import { useAuth } from "@/lib/auth/use-auth";
import { createPlusCheckoutServerFn } from "@/lib/billing/checkout.server";
import { usePlan } from "@/lib/billing/use-plan";

export function usePlusCheckout() {
  const { usuario } = useAuth();
  const { hasPlus } = usePlan();
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  async function startCheckout(event: FormEvent) {
    event.preventDefault();
    if (!usuario || !accepted || inFlight.current) return;
    inFlight.current = true;
    setSubmitting(true);
    setError(null);
    try {
      const result = await createPlusCheckoutServerFn({
        data: { plan: "plus", acceptedRecurringCharge: true },
      });
      if (result.url) window.location.assign(result.url);
      else setError(result.error ?? "Não foi possível iniciar o checkout.");
    } catch {
      setError("Não foi possível iniciar o checkout.");
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  return { usuario, hasPlus, accepted, setAccepted, submitting, error, startCheckout };
}
