import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { migrateLegacyStorage, storageKey } from "@/lib/brand";

export type ThemeMode = "light" | "dark" | "gravity";
type MotionMode = "full" | "reduced";
type ReadingMode = "standard" | "large";
export type SessionMinutes = 5 | 10 | 15;

type SiteSettings = {
  theme: ThemeMode;
  motion: MotionMode;
  reading: ReadingMode;
  focusMode: boolean;
  sessionMinutes: SessionMinutes;
  breakReminders: boolean;
  showTimer: boolean;
};

type SiteSettingsContextValue = SiteSettings & {
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemeMode) => void;
  setMotion: (motion: MotionMode) => void;
  setReading: (reading: ReadingMode) => void;
  setFocusMode: (enabled: boolean) => void;
  setSessionMinutes: (minutes: SessionMinutes) => void;
  setBreakReminders: (enabled: boolean) => void;
  setShowTimer: (enabled: boolean) => void;
};

const STORAGE_KEY = storageKey("settings");
const DEFAULT_SETTINGS: SiteSettings = {
  theme: "gravity",
  motion: "full",
  reading: "standard",
  focusMode: false,
  sessionMinutes: 10,
  breakReminders: true,
  showTimer: false,
};

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null);

function isMotion(value: unknown): value is MotionMode {
  return value === "full" || value === "reduced";
}

function isReading(value: unknown): value is ReadingMode {
  return value === "standard" || value === "large";
}

function isSessionMinutes(value: unknown): value is SessionMinutes {
  return value === 5 || value === 10 || value === 15;
}

function readSettings(): SiteSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<
      string,
      unknown
    >;
    return {
      theme:
        parsed.theme === "light" || parsed.theme === "gravity"
          ? parsed.theme
          : parsed.theme === "dark" && parsed.themeVersion === 2
            ? "dark"
            : parsed.theme === "system" &&
                !window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "light"
              : "gravity",
      motion: isMotion(parsed.motion)
        ? parsed.motion
        : window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "reduced"
          : "full",
      reading: isReading(parsed.reading) ? parsed.reading : DEFAULT_SETTINGS.reading,
      focusMode:
        typeof parsed.focusMode === "boolean" ? parsed.focusMode : DEFAULT_SETTINGS.focusMode,
      sessionMinutes: isSessionMinutes(parsed.sessionMinutes)
        ? parsed.sessionMinutes
        : DEFAULT_SETTINGS.sessionMinutes,
      breakReminders:
        typeof parsed.breakReminders === "boolean"
          ? parsed.breakReminders
          : DEFAULT_SETTINGS.breakReminders,
      showTimer:
        typeof parsed.showTimer === "boolean" ? parsed.showTimer : DEFAULT_SETTINGS.showTimer,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    migrateLegacyStorage();
    setSettings(readSettings());
    setInitialized(true);
  }, []);

  const resolvedTheme = settings.theme === "light" ? "light" : "dark";

  useEffect(() => {
    if (!initialized) return;
    const root = document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.dataset.theme = settings.theme;
    root.dataset.motion = settings.motion;
    root.dataset.reading = settings.reading;
    root.dataset.appReady = "true";
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...settings, themeVersion: 2 }));
    } catch {
      // Preferences still work for this visit when browser storage is unavailable.
    }
  }, [initialized, settings, resolvedTheme]);

  const value = useMemo<SiteSettingsContextValue>(
    () => ({
      ...settings,
      resolvedTheme,
      setTheme: (theme) => setSettings((current) => ({ ...current, theme })),
      setMotion: (motion) => setSettings((current) => ({ ...current, motion })),
      setReading: (reading) => setSettings((current) => ({ ...current, reading })),
      setFocusMode: (focusMode) => setSettings((current) => ({ ...current, focusMode })),
      setSessionMinutes: (sessionMinutes) =>
        setSettings((current) => ({ ...current, sessionMinutes })),
      setBreakReminders: (breakReminders) =>
        setSettings((current) => ({ ...current, breakReminders })),
      setShowTimer: (showTimer) => setSettings((current) => ({ ...current, showTimer })),
    }),
    [settings, resolvedTheme],
  );

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) throw new Error("useSiteSettings precisa estar dentro de SiteSettingsProvider.");
  return context;
}
