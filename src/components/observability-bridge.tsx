import { useEffect } from "react";
import { COOKIE_CONSENT_EVENT } from "@/components/cookie-consent";
import { initializeClientObservability } from "@/lib/observability/client";

export function ObservabilityBridge() {
  useEffect(() => {
    void initializeClientObservability();
    const handleConsent = () => void initializeClientObservability();
    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsent);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsent);
  }, []);

  return null;
}
