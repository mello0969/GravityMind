import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("gravitymind:cookie-consent", "essential");
    localStorage.setItem("gravitymind:plan", "plus");
    localStorage.setItem(
      "gravitymind:subscription",
      JSON.stringify({ plan: "plus", status: "active" }),
    );
  });
});

test("adaptive practice is free while the Tutor requires a real account", async ({ page }) => {
  await page.goto("/tutor");
  await expect(page.getByRole("link", { name: "Entrar para conversar" })).toBeVisible();
  await expect(page.locator("main textarea")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Nova conversa" })).toHaveCount(0);
  await page.goto("/questoes");
  await expect(page.getByRole("button", { name: "Adaptativo", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByRole("group", { name: "Alternativas" })).toBeVisible();
  await page.getByRole("button", { name: "Fácil", exact: true }).click();
  await expect(page.getByRole("group", { name: "Alternativas" })).toBeVisible();
  await expect(page).toHaveURL(/modo=facil/);
});

test("the home has no plans and Essencial includes adaptive practice and the Tutor", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".gm-plan")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Criar conta gratuita", exact: true })).toBeVisible();
  await page.goto("/plus");
  const free = page
    .locator(".gm-plan")
    .filter({ has: page.getByRole("heading", { name: "Essencial", exact: true }) });
  await expect(free.getByText("Prática adaptativa e questões de nível fixo")).toBeVisible();
  await expect(free.getByText("Tutor de IA incluído, com conta e limites de uso.")).toBeVisible();
});
