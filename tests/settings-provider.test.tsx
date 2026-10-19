import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SiteSettingsProvider, useSiteSettings } from "@/lib/settings/use-site-settings";

function SettingsHarness() {
  const settings = useSiteSettings();
  return (
    <div>
      <output data-testid="theme">{settings.resolvedTheme}</output>
      <output data-testid="theme-mode">{settings.theme}</output>
      <button type="button" onClick={() => settings.setTheme("gravity")}>
        Gravity Mind
      </button>
      <button type="button" onClick={() => settings.setTheme("light")}>
        Claro
      </button>
      <button type="button" onClick={() => settings.setTheme("dark")}>
        Tema escuro
      </button>
      <button type="button" onClick={() => settings.setReading("large")}>
        Texto maior
      </button>
      <button type="button" onClick={() => settings.setFocusMode(true)}>
        Modo foco
      </button>
    </div>
  );
}

describe("SiteSettingsProvider", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    document.documentElement.className = "";
    delete document.documentElement.dataset.motion;
    delete document.documentElement.dataset.reading;
    delete document.documentElement.dataset.focus;
  });

  it("migra preferências legadas e aplica os atributos reais no documento", async () => {
    window.localStorage.setItem(
      "fisicafacil:settings",
      JSON.stringify({
        theme: "dark",
        motion: "reduced",
        reading: "large",
        focusMode: true,
        sessionMinutes: 5,
        breakReminders: false,
        showTimer: true,
      }),
    );

    render(
      <SiteSettingsProvider>
        <SettingsHarness />
      </SiteSettingsProvider>,
    );

    await waitFor(() => expect(screen.getByTestId("theme")).toHaveTextContent("dark"));
    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement.dataset.theme).toBe("gravity");
    expect(document.documentElement.dataset.motion).toBe("reduced");
    expect(document.documentElement.dataset.reading).toBe("large");
    expect(document.documentElement.dataset.focus).toBeUndefined();
    expect(window.localStorage.getItem("gravitymind:settings")).not.toBeNull();
  });

  it("persiste mudanças feitas pelos controles", async () => {
    const user = userEvent.setup();
    render(
      <SiteSettingsProvider>
        <SettingsHarness />
      </SiteSettingsProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Tema escuro" }));
    await user.click(screen.getByRole("button", { name: "Texto maior" }));
    await user.click(screen.getByRole("button", { name: "Modo foco" }));

    await waitFor(() => {
      expect(document.documentElement).toHaveClass("dark");
      expect(document.documentElement.dataset.reading).toBe("large");
      expect(document.documentElement.dataset.focus).toBeUndefined();
    });

    const saved = JSON.parse(window.localStorage.getItem("gravitymind:settings") ?? "{}") as {
      theme?: string;
      reading?: string;
      focusMode?: boolean;
    };
    expect(saved).toMatchObject({ theme: "dark", reading: "large", focusMode: true });
  });

  it("separates all three themes and restores neutral dark without legacy remapping", async () => {
    window.localStorage.setItem(
      "gravitymind:settings",
      JSON.stringify({ theme: "dark", themeVersion: 2 }),
    );
    const user = userEvent.setup();
    render(
      <SiteSettingsProvider>
        <SettingsHarness />
      </SiteSettingsProvider>,
    );
    await waitFor(() => expect(screen.getByTestId("theme-mode")).toHaveTextContent("dark"));
    expect(document.documentElement.dataset.theme).toBe("dark");
    await user.click(screen.getByRole("button", { name: "Gravity Mind" }));
    expect(document.documentElement.dataset.theme).toBe("gravity");
    expect(document.documentElement).toHaveClass("dark");
    await user.click(screen.getByRole("button", { name: "Claro" }));
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(document.documentElement).not.toHaveClass("dark");
    expect(JSON.parse(window.localStorage.getItem("gravitymind:settings") ?? "{}")).toMatchObject({
      theme: "light",
      themeVersion: 2,
    });
  });
});
