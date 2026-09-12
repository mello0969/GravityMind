import AxeBuilder from "@axe-core/playwright";
import { expect, type Locator, type Page, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("gravitymind:cookie-consent", "essential");
  });
});

test("home renders the GRAVITYMIND product and a nonblank 3D canvas", async ({ page }) => {
  await page.goto("/?visualTest=1");
  await waitForApp(page);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Entenda a força\. Treine o raciocínio\./,
    }),
  ).toBeVisible();
  const canvas = page.locator("[data-apple-scene] canvas");
  await expect(canvas).toBeVisible();
  await expect
    .poll(async () =>
      canvas.evaluate((source) => {
        const target = document.createElement("canvas");
        target.width = 80;
        target.height = 80;
        const context = target.getContext("2d");
        context?.drawImage(source, 0, 0, 80, 80);
        const pixels = context?.getImageData(0, 0, 80, 80).data ?? [];
        let colored = 0;
        for (let index = 0; index < pixels.length; index += 4) {
          if (pixels[index + 3] > 0 && (pixels[index] > 30 || pixels[index + 1] > 30)) colored += 1;
        }
        return colored;
      }),
    )
    .toBeGreaterThan(200);
});

test("question hints stop at two and filters live in the URL", async ({ page }) => {
  await page.goto("/questoes?assunto=mecanica&modo=dificil");
  await waitForApp(page);
  await expect(page.getByRole("button", { name: "Adaptativo" })).toBeVisible();
  const hint = page.getByRole("button", { name: /Usar dica/ });
  await hint.click();
  await hint.click();
  await expect(hint).toBeDisabled();
  await expect(page).toHaveURL(/assunto=mecanica/);
  await expect(page).toHaveURL(/modo=dificil/);
});

test("flashcard statistics stay hidden until the session ends", async ({ page }) => {
  await page.goto("/flashcards");
  await waitForApp(page);
  await expect(page.getByRole("heading", { name: "Resultado do deck" })).toHaveCount(0);
  await page.getByRole("button", { name: "Terminar" }).click();
  await expect(page.getByRole("heading", { name: "Resultado do deck" })).toBeVisible();
});

test("Plus never asks for raw card credentials", async ({ page }) => {
  await page.goto("/plus");
  await waitForApp(page);
  await expect(page.getByText(/Esta tela não pede número, validade ou CVC/)).toBeVisible();
  await expect(page.locator('input[autocomplete="cc-number"]')).toHaveCount(0);
  await expect(page.locator('input[autocomplete="cc-csc"]')).toHaveCount(0);
});

test("theme and larger text apply visibly and persist", async ({ page }) => {
  await page.goto("/configuracoes");
  await waitForApp(page);
  const root = page.locator("html");
  const initialSize = await root.evaluate((element) =>
    Number.parseFloat(window.getComputedStyle(element).fontSize),
  );

  await page.getByRole("button", { name: "Escuro" }).click();
  await page.getByRole("switch", { name: "Usar texto maior" }).click();
  await expect(root).toHaveClass(/dark/);
  await expect(root).toHaveAttribute("data-reading", "large");
  await expect
    .poll(() =>
      root.evaluate((element) => Number.parseFloat(window.getComputedStyle(element).fontSize)),
    )
    .toBeGreaterThan(initialSize);

  await page.reload();
  await waitForApp(page);
  await expect(root).toHaveClass(/dark/);
  await expect(root).toHaveAttribute("data-reading", "large");
});

test("focus mode isolates the practice surface", async ({ page }) => {
  await page.goto("/questoes");
  await waitForApp(page);
  await page.getByRole("button", { name: "Entrar no modo foco" }).click();
  await expect(page.locator("html")).not.toHaveAttribute("data-focus");
  await expect(page.locator(".study-focus-shell")).toHaveAttribute("data-focus", "true");
  await expect(page.locator(".study-focus-surface")).toBeVisible();
  await expect(page.locator(".focus-optional").first()).toBeHidden();

  await page.goto("/calculo");
  await waitForApp(page);
  await expect(page.locator("html")).not.toHaveAttribute("data-focus");
  await expect(page.locator(".study-focus-shell")).toHaveCount(0);
  await expect(page.locator(".gm-site-header")).toBeVisible();
});

test("scientific calculator covers memory, power and trigonometry", async ({ page }) => {
  await page.goto("/calculo");
  await waitForApp(page);
  await page.getByRole("button", { name: "2", exact: true }).click();
  await page.getByRole("button", { name: "xʸ" }).click();
  await page.getByRole("button", { name: "3", exact: true }).click();
  await page.getByRole("button", { name: "=" }).click();
  await expect(page.getByLabel("Visor da calculadora")).toHaveText("8");

  await page.getByRole("button", { name: "M+" }).click();
  await page.getByRole("button", { name: "AC" }).click();
  await page.getByRole("button", { name: "MR" }).click();
  await expect(page.getByLabel("Visor da calculadora")).toHaveText("8");
});

test("whiteboard text works and the square eraser reveals its original surface", async ({
  page,
}) => {
  await page.goto("/quadro");
  await waitForApp(page);
  const canvas = page.locator('section[aria-label^="Área do quadro"] canvas');
  await expect(canvas).toBeVisible();

  await page.getByRole("button", { name: "Texto", exact: true }).click();
  await canvas.scrollIntoViewIfNeeded();
  let bounds = await canvas.boundingBox();
  if (!bounds) throw new Error("Whiteboard canvas has no measurable bounds.");
  await page.mouse.click(bounds.x + 90, bounds.y + 70);
  const textEditor = page.getByPlaceholder("Digite o texto");
  await textEditor.fill("ΣF = m · a");
  await textEditor.press("Control+Enter");
  await expect(page.getByRole("button", { name: "ΣF = m · a" })).toBeVisible();

  await page.getByRole("button", { name: "Lápis" }).click();
  await canvas.scrollIntoViewIfNeeded();
  bounds = await canvas.boundingBox();
  if (!bounds) throw new Error("Whiteboard canvas has no measurable bounds.");
  await page.mouse.move(bounds.x + 130, bounds.y + 130);
  await page.mouse.down();
  await page.mouse.move(bounds.x + 190, bounds.y + 130, { steps: 8 });
  await page.mouse.up();
  await expect.poll(() => pixelAlpha(canvas, 160, 130)).toBeGreaterThan(0);

  await page.getByRole("button", { name: "Borracha quadrada" }).click();
  await canvas.scrollIntoViewIfNeeded();
  bounds = await canvas.boundingBox();
  if (!bounds) throw new Error("Whiteboard canvas has no measurable bounds.");
  await page.mouse.move(bounds.x + 150, bounds.y + 130);
  const eraserCursor = page.locator(".pointer-events-none.absolute.z-30");
  await expect(eraserCursor).toBeVisible();
  const cursorSize = await eraserCursor.evaluate((element) => ({
    width: window.getComputedStyle(element).width,
    height: window.getComputedStyle(element).height,
  }));
  expect(cursorSize.width).toBe(cursorSize.height);

  await page.mouse.down();
  await page.mouse.move(bounds.x + 175, bounds.y + 130, { steps: 6 });
  await page.mouse.up();
  await expect.poll(() => pixelAlpha(canvas, 160, 130)).toBe(0);
});

test("primary pages have no critical automated accessibility violations", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name.includes("mobile"),
    "One axe pass per desktop build is sufficient.",
  );
  await page.goto("/flashcards");
  await waitForApp(page);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => violation.impact === "critical")).toEqual([]);
});

test("mobile layout does not create horizontal overflow", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile viewport assertion.");
  for (const path of ["/", "/questoes", "/flashcards", "/plus", "/tutor", "/calculo"]) {
    await page.goto(path);
    await waitForApp(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow, path).toBeLessThanOrEqual(1);
  }
});

async function waitForApp(page: Page) {
  await expect(page.locator("html")).toHaveAttribute("data-app-ready", "true");
}

async function pixelAlpha(canvas: Locator, x: number, y: number) {
  return canvas.evaluate(
    (source, point) => {
      const context = source.getContext("2d");
      if (!context) return -1;
      const scaleX = source.width / source.clientWidth;
      const scaleY = source.height / source.clientHeight;
      return context.getImageData(point.x * scaleX, point.y * scaleY, 1, 1).data[3];
    },
    { x, y },
  );
}
