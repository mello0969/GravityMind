import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("gravitymind:cookie-consent", "essential"));
});

test("lesson verification replaces reading, receives focus and can be closed", async ({ page }) => {
  await page.goto("/lei-1");
  await page.getByRole("button", { name: "Verificar compreensão", exact: true }).click();
  const verification = page.getByRole("region", {
    name: "Verificação de compreensão",
    exact: true,
  });
  await expect(verification).toBeVisible();
  await expect(verification).toBeFocused();
  await expect(page.locator("blockquote")).toBeHidden();
  await verification.getByRole("button").nth(1).click();
  await expect(verification.getByRole("button", { name: "Próxima pergunta" })).toBeVisible();
  await verification.getByRole("button", { name: "Voltar à aula" }).click();
  await expect(page.locator("blockquote")).toBeVisible();
});

test("practice starts with one task and keeps secondary choices collapsed", async ({ page }) => {
  await page.goto("/questoes");
  await expect(page.getByRole("group", { name: "Alternativas" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Fácil", exact: true })).toBeHidden();
  await expect(page.getByRole("button", { name: "Muito alta", exact: true })).toBeHidden();
  await page.getByText("Personalizar prática", { exact: false }).click();
  await page.getByRole("button", { name: "Fácil", exact: true }).click();
  await expect(page).toHaveURL(/modo=facil/);
});

test("session time is visible when enabled and the scratchpad belongs only to calculations", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/configuracoes");
  await page.getByRole("button", { name: "5 min", exact: true }).click();
  await page.getByRole("switch", { name: "Mostrar cronômetro", exact: true }).click();
  await page.goto("/questoes");
  await expect(page.getByText("Sessão de 5 min", { exact: true })).toBeVisible();
  await expect(page.getByRole("timer", { name: "Tempo decorrido" })).toBeVisible();
  await expect(page.getByRole("progressbar", { name: "Tempo da sessão" })).toHaveAttribute(
    "max",
    "300",
  );
  await expect(page.getByRole("button", { name: "Quadro de rascunho" })).toHaveCount(0);
  await page.clock.fastForward(300_000);
  await expect(page.getByText("Tempo planejado concluído.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Reiniciar tempo", exact: true }).click();
  await expect(page.getByRole("timer", { name: "Tempo decorrido" })).toHaveText("00:00");
  await page.getByRole("button", { name: "Cálculo aplicado", exact: true }).click();
  await page.getByRole("button", { name: "Quadro de rascunho", exact: true }).click();
  await expect(page.locator('section[aria-label^="Área do quadro"] canvas')).toBeVisible();
});

test("daily goal counts a question once even after a second attempt", async ({ page }) => {
  await page.goto("/questoes?assunto=lei-1&modo=facil");
  const answers = page.getByRole("group", { name: "Alternativas" }).getByRole("button");
  await answers.first().click();
  await page.getByRole("button", { name: "Verificar resposta", exact: true }).click();
  if (await page.getByText("Tente mais uma vez", { exact: true }).isVisible()) {
    await answers.nth(1).click();
    await page.getByRole("button", { name: "Verificar correção", exact: true }).click();
  }
  await expect(page.getByLabel("Meta diária", { exact: true })).toContainText("1/5");
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
