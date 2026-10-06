import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const output = "artifacts/visual/welcome";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const reports = [];
try {
  for (const width of [1440, 390, 320, 768, 1920]) {
    const context = await browser.newContext({
      viewport: { width, height: width > 1000 ? 1000 : 844 },
      reducedMotion: "reduce",
    });
    await context.addInitScript(() => {
      localStorage.setItem("gravitymind:cookie-consent", "essential");
      if (!localStorage.getItem("gravitymind:settings"))
        localStorage.setItem(
          "gravitymind:settings",
          JSON.stringify({ theme: "dark", motion: "reduced" }),
        );
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const paths =
      width === 1440 || width === 390
        ? ["/", "/questoes", "/flashcards", "/tutor", "/plus", "/calculo"]
        : ["/"];
    for (const path of paths) {
      await page.goto(`http://127.0.0.1:4173${path}`);
      await page.locator("html[data-app-ready=true]").waitFor();
      await page.getByRole("heading", { level: 1 }).waitFor();
      await page.getByRole("status", { name: "Carregando estudo" }).waitFor({ state: "hidden" });
      await page.evaluate(() => document.fonts.ready);
      if (path === "/")
        await page.waitForFunction(() => document.querySelector(".gm-welcome-image")?.complete);
      if (path === "/questoes") await page.getByRole("group", { name: "Alternativas" }).waitFor();
      const name = path === "/" ? "home" : path.slice(1);
      await page.screenshot({ path: `${output}/${name}-${width}.png` });
      if (path === "/")
        await page.screenshot({ path: `${output}/home-${width}-full.png`, fullPage: true });
      const metrics = await page.evaluate(() => {
        const hero = document.querySelector(".gm-welcome-hero")?.getBoundingClientRect();
        const overflow = document.documentElement.scrollWidth - innerWidth;
        const textOverflow = [
          ...document.querySelectorAll("main h1, main h2, main h3, main p, main a"),
        ]
          .filter((el) => el.scrollWidth > el.clientWidth + 1)
          .map((el) => el.textContent);
        const image = document.querySelector(".gm-welcome-image");
        return {
          overflow,
          textOverflow,
          nextSectionVisible: hero ? hero.bottom < innerHeight : undefined,
          imageWidth: image?.naturalWidth,
        };
      });
      reports.push({ path, width, theme: "dark", errors: [...errors], ...metrics });
      if (path === "/questoes") {
        await page.getByRole("button", { name: "Modo foco", exact: true }).click();
        await page.screenshot({ path: `${output}/questoes-focus-${width}.png` });
      }
    }
    if (width === 1440 || width === 390) {
      await page.goto("http://127.0.0.1:4173/configuracoes");
      await page.getByRole("button", { name: "Claro", exact: true }).click();
      await page.goto("http://127.0.0.1:4173/");
      await page.locator("html[data-app-ready=true]:not(.dark)").waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.querySelector(".gm-welcome-image")?.complete);
      await page.screenshot({
        path: `${output}/home-light-${width}-full.png`,
        fullPage: true,
      });
    }
    await context.close();
  }
} finally {
  await browser.close();
}
await writeFile(`${output}/report.json`, JSON.stringify(reports, null, 2));
console.log(JSON.stringify(reports));
