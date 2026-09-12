import { storageKey } from "@/lib/brand";

let sdkPromise: Promise<typeof import("@sentry/tanstackstart-react")> | null = null;
let initialized = false;

function metricsAllowed() {
  return (
    typeof window !== "undefined" &&
    window.localStorage.getItem(storageKey("cookie-consent")) === "metrics"
  );
}

export async function initializeClientObservability() {
  const dsn = import.meta.env.VITE_SENTRY_DSN?.trim();
  if (!dsn || !metricsAllowed() || initialized) return null;
  sdkPromise ??= import("@sentry/tanstackstart-react");
  const Sentry = await sdkPromise;
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    sendDefaultPii: false,
    tracesSampleRate: 0.05,
    beforeSend(event) {
      if (!metricsAllowed()) return null;
      if (event.user) delete event.user;
      return event;
    },
  });
  initialized = true;
  return Sentry;
}

export async function captureClientError(error: unknown) {
  const Sentry = await initializeClientObservability();
  Sentry?.captureException(error);
}
