import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("gravitymind:cookie-consent", "essential"));
});
test("lesson simulation stays available outside the marketing home", async ({ page }) => {
  await page.goto("/lei-2");
  await page.getByRole("button", { name: "Simulação", exact: true }).click();
  const canvas = page.getByRole("img", { name: "Simulação de forças e movimento" });
  const before = await canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL());
  await page.getByRole("button", { name: "Reproduzir", exact: true }).click();
  await expect
    .poll(() => canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL()))
    .not.toBe(before);
});
test("new header routes to the actual lessons and Tutor has no fabricated history", async ({
  page,
}) => {
  await page.goto("/tutor");
  await expect(page.getByRole("heading", { name: "Tutor de Física" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Suas dúvidas têm espaço aqui." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Entrar para conversar" })).toBeVisible();
  await expect(page.getByText("Conversas recentes")).toHaveCount(0);
  await page.goto("/aulas");
  await page.getByRole("link", { name: /01 Inércia/ }).click();
  await expect(page).toHaveURL(/lei-1/);
});
