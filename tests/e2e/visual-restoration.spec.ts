import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("gravitymind:cookie-consent", "essential"));
});

test("restored navigation exposes every study route on desktop and mobile", async ({
  page,
}, info) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-app-ready", "true");
  if (info.project.name.includes("mobile")) {
    await page.getByRole("button", { name: "Abrir menu" }).click();
    const nav = page.getByRole("navigation", { name: "Navegação móvel" });
    await expect(nav.getByRole("link", { name: "Anotações", exact: true })).toBeVisible();
    await nav.getByRole("link", { name: "Cálculo", exact: true }).click();
    await expect(nav).toHaveCount(0);
  } else {
    await page.getByText("Explorar", { exact: true }).click();
    await page
      .getByRole("navigation", { name: "Ferramentas" })
      .getByRole("link", { name: "Cálculo", exact: true })
      .click();
  }
  await expect(page.getByRole("heading", { name: "Calculadora científica" })).toBeVisible();
});

test("practice submits a response and still offers calculation mode", async ({ page }) => {
  await page.goto("/questoes?assunto=lei-2&modo=facil");
  await page.getByRole("button", { name: "Fácil", exact: true }).waitFor();
  const answers = page.getByRole("group", { name: "Alternativas" }).getByRole("button");
  await answers.first().click();
  await page.getByRole("button", { name: "Verificar resposta", exact: true }).click();
  if (await page.getByText("Tente mais uma vez", { exact: true }).isVisible()) {
    await answers.nth(1).click();
    await page.getByRole("button", { name: "Verificar correção", exact: true }).click();
  }
  await expect(page.getByRole("button", { name: "Próxima questão" })).toBeVisible();
  await page.getByRole("button", { name: "Cálculo aplicado" }).click();
  await expect(page.getByRole("button", { name: "Conceitos", exact: true })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
});

test("flashcard reveal and rating advance without showing premature statistics", async ({
  page,
}) => {
  await page.goto("/flashcards");
  const autoAdvance = page.getByRole("switch", { name: "Avanço automático" });
  await expect(autoAdvance).toHaveAttribute("data-state", "checked");
  const switchBox = await autoAdvance.boundingBox();
  expect(switchBox?.width).toBeLessThanOrEqual(42);
  expect(switchBox?.height).toBeLessThanOrEqual(24);
  await page.getByRole("button", { name: "Revelar resposta" }).click();
  await page.getByRole("button", { name: "Lembrei", exact: true }).click();
  await expect(page.getByText("Cartão 2 de 12", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sessão concluída" })).toHaveCount(0);
  await page.getByRole("button", { name: "Terminar", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Sessão concluída" })).toBeVisible();
});

test("practice keeps its mobile tools expandable and difficulty available", async ({
  page,
}, info) => {
  await page.goto("/questoes");
  const tools = page.locator("#practice-tools");
  if (info.project.name.includes("mobile")) {
    await expect(tools).not.toBeVisible();
    await page.getByRole("button", { name: "Objetivo e ferramentas" }).click();
  }
  await expect(tools.getByRole("link", { name: "Calculadora científica" })).toBeVisible();
  await page.getByRole("button", { name: "Difícil", exact: true }).click();
  await expect(page).toHaveURL(/modo=dificil/);
  await expect(page.getByRole("button", { name: "Difícil", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("light theme and reduced motion persist on the welcome page", async ({ page }) => {
  await page.goto("/configuracoes");
  await page.getByRole("button", { name: "Claro", exact: true }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await page.getByRole("switch", { name: "Reduzir movimento" }).click();
  await page.goto("/?visualTest=1");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await expect(page.locator(".gm-welcome-statement")).toContainText("Sua curiosidade");
  await expect(page.locator("[data-apple-scene]")).toHaveCount(0);
  await expect(page.locator(".gm-welcome-image")).toBeVisible();
});

test("primary study surfaces have no serious accessibility violations", async ({ page }, info) => {
  test.skip(info.project.name.includes("mobile"), "Semantic and contrast audit on desktop.");
  test.setTimeout(120000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const theme of ["dark", "light"]) {
    await page.goto("/configuracoes");
    await page
      .getByRole("button", { name: theme === "dark" ? "Escuro" : "Claro", exact: true })
      .click();
    for (const route of ["/", "/questoes", "/flashcards", "/tutor", "/plus", "/login", "/aulas"]) {
      await page.goto(route);
      await expect(page.locator("html")).toHaveAttribute("data-app-ready", "true");
      await expect(page.getByRole("status", { name: "Carregando estudo" })).toHaveCount(0);
      await page.evaluate(() => document.fonts.ready);
      for (const surface of await page.locator(".study-focus-surface").all()) {
        await expect(surface).toHaveCSS("opacity", "1");
      }
      const result = await new AxeBuilder({ page }).analyze();
      expect(
        result.violations.filter((v) => v.impact === "critical" || v.impact === "serious"),
        theme + route,
      ).toEqual([]);
    }
  }
});
