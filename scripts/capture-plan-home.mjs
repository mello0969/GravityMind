import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const output = "artifacts/visual/plan-home";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const reports = [];
const lightOnly = process.argv.includes("--light-only");
try {
  for (const width of lightOnly ? [1440, 390] : [1440, 390, 320, 768, 1920]) {
    const context = await browser.newContext({
      viewport: { width, height: width > 1000 ? 1000 : 844 },
    });
    await context.addInitScript(() => {
      localStorage.setItem("gravitymind:cookie-consent", "essential");
      if (!localStorage.getItem("gravitymind:settings")) {
        localStorage.setItem(
          "gravitymind:settings",
          JSON.stringify({ theme: "dark", motion: "full" }),
        );
      }
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const paths =
      width === 1440 || width === 390
        ? ["/", "/questoes", "/questoes?modo=adaptativo", "/tutor", "/plus"]
        : ["/"];
    for (const path of lightOnly ? [] : paths) {
      await page.goto(`http://127.0.0.1:4173${path}${path.includes("?") ? "&" : "?"}visualTest=1`);
      await page.locator("html[data-app-ready=true]").waitFor();
      await page.getByRole("heading", { level: 1 }).waitFor();
      await page.evaluate(() => document.fonts.ready);
      let apple;
      if (path === "/") {
        await page.locator('[data-apple-scene][data-state="ready"]').waitFor({ timeout: 25000 });
        const canvas = page.locator("[data-apple-scene] canvas");
        const before = await canvas.evaluate((el) => el.toDataURL());
        await page.mouse.move(width * 0.8, 280);
        await page.waitForTimeout(500);
        apple = {
          moving: before !== (await canvas.evaluate((el) => el.toDataURL())),
          bounds: await canvas.evaluate((el) => {
            const target = document.createElement("canvas");
            target.width = 160;
            target.height = 100;
            const ctx = target.getContext("2d");
            ctx.drawImage(el, 0, 0, 160, 100);
            const pixels = ctx.getImageData(0, 0, 160, 100).data;
            let minX = 160,
              maxX = 0,
              minY = 100,
              maxY = 0,
              colored = 0;
            for (let y = 0; y < 100; y++)
              for (let x = 0; x < 160; x++) {
                if (pixels[(y * 160 + x) * 4 + 3] > 100) {
                  colored++;
                  minX = Math.min(x, minX);
                  maxX = Math.max(x, maxX);
                  minY = Math.min(y, minY);
                  maxY = Math.max(y, maxY);
                }
              }
            return { minX, maxX, minY, maxY, colored };
          }),
        };
      }
      await page.waitForTimeout(300);
      const name = path === "/" ? "home" : path.includes("?") ? "adaptive-locked" : path.slice(1);
      await page.screenshot({ path: `${output}/${name}-${width}.png` });
      if (path === "/")
        await page.screenshot({ path: `${output}/home-${width}-full.png`, fullPage: true });
      reports.push({
        path,
        width,
        errors: [...errors],
        apple,
        overflow: await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
      });
    }
    if (width === 1440 || width === 390) {
      await page.goto("http://127.0.0.1:4173/configuracoes");
      await page.getByRole("button", { name: "Claro", exact: true }).click();
      await page.goto("http://127.0.0.1:4173/");
      await page.locator("html[data-app-ready=true]:not(.dark)").waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.locator('[data-apple-scene][data-state="ready"]').waitFor({ timeout: 25000 });
      await page.screenshot({ path: `${output}/home-light-${width}-full.png`, fullPage: true });
    }
    await context.close();
  }
} finally {
  await browser.close();
}
if (!lightOnly) await writeFile(`${output}/report.json`, JSON.stringify(reports, null, 2));
console.log(JSON.stringify(reports));
