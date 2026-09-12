import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { storageKey } from "@/lib/brand";

type CookieChoice = "essential" | "metrics";

const CONSENT_KEY = storageKey("cookie-consent");
export const COOKIE_CONSENT_EVENT = "gravitymind:cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(window.localStorage.getItem(CONSENT_KEY) === null);
  }, []);

  function choose(choice: CookieChoice) {
    window.localStorage.setItem(CONSENT_KEY, choice);
    document.documentElement.dataset.cookieConsent = choice;
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: choice }));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <section
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border-strong bg-card"
      aria-label="Preferências de cookies"
    >
      <div className="ff-shell flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Cookies essenciais mantêm sua sessão e preferências. Métricas de erro só serão ativadas
          com sua escolha. Leia a nossa{" "}
          <Link
            to="/privacidade"
            className="font-semibold text-foreground underline underline-offset-4"
          >
            Política de Privacidade
          </Link>
          .
        </p>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button type="button" className="ff-btn-outline" onClick={() => choose("essential")}>
            Somente essenciais
          </button>
          <button type="button" className="ff-btn-primary" onClick={() => choose("metrics")}>
            Permitir métricas
          </button>
        </div>
      </div>
    </section>
  );
}
