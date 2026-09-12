import { expect, type Page, test } from "@playwright/test";

async function sampleApple(page: Page) {
  return page.locator("[data-apple-scene] canvas").evaluate((source: HTMLCanvasElement) => {
    const target = document.createElement("canvas");
    target.width = 80;
    target.height = 80;
    const context = target.getContext("2d");
    if (!context) throw new Error("No canvas context");
    context.drawImage(source, 0, 0, 80, 80);
    const pixels = context.getImageData(0, 0, 80, 80).data;
    let colored = 0;
    let clipped = 0;
    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index + 3] === 0) continue;
      colored++;
      const x = (index / 4) % 80;
      const y = Math.floor(index / 4 / 80);
      if (x === 0 || x === 79 || y === 0 || y === 79) clipped++;
    }
    return { colored, clipped, image: target.toDataURL() };
  });
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("gravitymind:cookie-consent", "essential");
    if (!localStorage.getItem("gravitymind:settings")) {
      localStorage.setItem("gravitymind:settings", JSON.stringify({ motion: "full" }));
    }
  });
});

test("GLB renders within the viewport, rotates and responds to reduced motion", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const response = page.waitForResponse((item) => item.url().endsWith("/models/apple.glb"));
  await page.goto("/?visualTest=1");
  expect((await response).ok()).toBe(true);
  await expect(page.locator("[data-apple-scene]")).toHaveAttribute("data-state", "ready");
  const initial = await sampleApple(page);
  expect(initial.colored).toBeGreaterThan(200);
  expect(initial.clipped).toBe(0);
  await expect.poll(async () => (await sampleApple(page)).image).not.toBe(initial.image);

  await page.goto("/configuracoes");
  await expect(page.locator("html")).toHaveAttribute("data-app-ready", "true");
  await page.getByRole("switch", { name: "Reduzir movimento" }).check();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await page.goto("/?visualTest=1");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await expect(page.locator("[data-apple-scene]")).toHaveAttribute("data-state", "ready");
  const still = await sampleApple(page);
  expect(still.colored).toBeGreaterThan(200);
  await page.mouse.move(50, 200);
  await page.waitForTimeout(500);
  expect((await sampleApple(page)).image).toBe(still.image);
  expect(errors).toEqual([]);
});

test("failed model downloads show an honest status without breaking the home", async ({ page }) => {
  await page.route("**/models/apple.glb", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator("[data-apple-scene]")).toHaveAttribute("data-state", "error");
  await expect(page.getByText("Modelo 3D indisponível.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Começar uma sessão" })).toBeVisible();
});
