import { useEffect, useId, useRef } from "react";

const TEST_SITE_KEY = "1x00000000000000000000AA";
const SCRIPT_ID = "cloudflare-turnstile-script";

type TurnstileApi = {
  render: (
    target: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      theme: "light" | "dark" | "auto";
      size: "flexible";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function TurnstileWidget({
  action,
  onTokenChange,
}: {
  action: "login" | "cadastro";
  onTokenChange: (token: string) => void;
}) {
  const reactId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const render = () => {
      if (cancelled || !containerRef.current || !window.turnstile || widgetRef.current) return;
      const configuredKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
      const local = ["localhost", "127.0.0.1"].includes(window.location.hostname);
      const sitekey = configuredKey || (local ? TEST_SITE_KEY : "");
      if (!sitekey) return;

      widgetRef.current = window.turnstile.render(containerRef.current, {
        sitekey,
        action,
        theme: "auto",
        size: "flexible",
        callback: onTokenChange,
        "expired-callback": () => onTokenChange(""),
        "error-callback": () => onTokenChange(""),
      });
    };

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (window.turnstile) {
      render();
    } else if (existing) {
      existing.addEventListener("load", render, { once: true });
    } else {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.addEventListener("load", render, { once: true });
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      if (widgetRef.current && window.turnstile) {
        window.turnstile.remove(widgetRef.current);
        widgetRef.current = null;
      }
    };
  }, [action, onTokenChange]);

  return (
    <div
      ref={containerRef}
      id={`turnstile-${reactId.replace(/:/g, "")}`}
      className="min-h-[65px] w-full"
    />
  );
}
