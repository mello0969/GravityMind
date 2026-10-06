import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const output = "artifacts/visual/restored";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const reports = [];
const routes = [
  "",
  "questoes",
  "flashcards",
  "plus",
  "tutor",
  "calculo",
  "aulas",
  "dashboard",
  "configuracoes",
  "login",
  "quadro",
  "anotacoes",
  "cadastro",
  "lei-1",
  "lei-2",
  "lei-3",
  "sobre",
  "contato",
  "privacidade",
  "termos",
];
try {
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
  ]) {
    const context = await browser.newContext({ viewport });
    await context.addInitScript(() => {
      localStorage.setItem("gravitymind:cookie-consent", "essential");
      localStorage.setItem(
        "gravitymind:settings",
        JSON.stringify({ theme: "dark", motion: "full" }),
      );
    });
    const page = await context.newPage();
    for (const route of routes) {
      const errors = [];
      const record = (error) => errors.push(error.message);
      page.on("pageerror", record);
      await page.goto(`http://127.0.0.1:4173/${route}?visualTest=1`);
      await page.locator("html[data-app-ready=true]").waitFor();
      await page.getByRole("heading", { level: 1 }).waitFor();
      await page.evaluate(() => document.fonts.ready);
      let apple;
      if (!route) {
        await page.locator('[data-apple-scene][data-state="ready"]').waitFor({ timeout: 25000 });
        const canvas = page.locator("[data-apple-scene] canvas");
        const before = await canvas.evaluate((el) => el.toDataURL());
        await page.waitForTimeout(450);
        const after = await canvas.evaluate((el) => el.toDataURL());
        apple = {
          moving:
            createHash("sha256").update(before).digest("hex") !==
            createHash("sha256").update(after).digest("hex"),
          nonblank: await canvas.evaluate((source) => {
            const target = document.createElement("canvas");
            target.width = 80;
            target.height = 80;
            const ctx = target.getContext("2d");
            ctx.drawImage(source, 0, 0, 80, 80);
            const pixels = ctx.getImageData(0, 0, 80, 80).data;
            return Array.from({ length: 6400 }, (_, i) => pixels[i * 4 + 3]).filter((v) => v > 0)
              .length;
          }),
        };
      }
      await page.waitForTimeout(300);
      const name = `${route || "home"}-${viewport.width > 1000 ? "desktop" : "mobile"}`;
      await page.screenshot({ path: `${output}/${name}.png` });
      if (!route) await page.screenshot({ path: `${output}/${name}-full.png`, fullPage: true });
      reports.push({
        route: route || "home",
        width: viewport.width,
        overflow: await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
        errors,
        apple,
      });
      page.off("pageerror", record);
    }
    await page.goto("http://127.0.0.1:4173/questoes");
    await page.getByRole("button", { name: "Modo foco", exact: true }).click();
    await page.screenshot({ path: `${output}/practice-focus-${viewport.width}.png` });
    await page.goto("http://127.0.0.1:4173/configuracoes");
    await page.getByRole("button", { name: "Claro", exact: true }).click();
    await page.screenshot({ path: `${output}/settings-light-${viewport.width}.png` });
    await context.close();
  }
  for (const width of [320, 768, 1920]) {
    const context = await browser.newContext({
      viewport: { width, height: width > 1000 ? 1080 : 900 },
    });
    await context.addInitScript(() => {
      localStorage.setItem("gravitymind:cookie-consent", "essential");
      localStorage.setItem(
        "gravitymind:settings",
        JSON.stringify({ theme: "dark", motion: "full" }),
      );
    });
    const page = await context.newPage();
    for (const route of ["", "questoes", "flashcards", "plus", "tutor", "calculo"]) {
      await page.goto(`http://127.0.0.1:4173/${route}?visualTest=1`);
      await page.locator("html[data-app-ready=true]").waitFor();
      await page.getByRole("heading", { level: 1 }).waitFor();
      await page.evaluate(() => document.fonts.ready);
      let apple;
      if (!route) {
        await page.locator('[data-apple-scene][data-state="ready"]').waitFor({ timeout: 25000 });
        const canvas = page.locator("[data-apple-scene] canvas");
        const first = await canvas.evaluate((el) => el.toDataURL());
        await page.mouse.move(width * 0.8, 250);
        await page.waitForTimeout(500);
        apple = {
          moving: first !== (await canvas.evaluate((el) => el.toDataURL())),
          nonblank: await canvas.evaluate((el) => {
            const target = document.createElement("canvas");
            target.width = target.height = 80;
            const ctx = target.getContext("2d");
            ctx.drawImage(el, 0, 0, 80, 80);
            return [...ctx.getImageData(0, 0, 80, 80).data].filter(
              (value, index) => index % 4 === 3 && value > 0,
            ).length;
          }),
        };
      }
      await page.screenshot({ path: `${output}/${route || "home"}-${width}.png` });
      reports.push({
        route: route || "home",
        width,
        overflow: await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
        apple,
      });
    }
    await context.close();
  }
} finally {
  await browser.close();
}
await writeFile(`${output}/report.json`, JSON.stringify(reports, null, 2));
console.log(JSON.stringify(reports));
