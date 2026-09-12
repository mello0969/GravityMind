import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const output = "artifacts/visual/polyhaven-apple";
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1536, height: 1024 } });
  await page.addInitScript(() => {
    localStorage.setItem("gravitymind:cookie-consent", "essential");
    localStorage.setItem("gravitymind:settings", JSON.stringify({ motion: "full" }));
  });
  await page.goto("http://127.0.0.1:4173/?visualTest=1");
  await page.locator('[data-apple-scene][data-state="ready"]').waitFor({ timeout: 60_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);

  const frames = [];
  for (let angle = 1; angle <= 2; angle++) {
    if (angle === 2) await page.waitForTimeout(9000);
    await page.screenshot({ path: `${output}/home-angle-${angle}.png`, fullPage: true });
    const frame = await page.locator("[data-apple-scene] canvas").evaluate((source) => {
      const scratch = document.createElement("canvas");
      scratch.width = source.width;
      scratch.height = source.height;
      const context = scratch.getContext("2d");
      context.drawImage(source, 0, 0);
      const pixels = context.getImageData(0, 0, source.width, source.height).data;
      let left = source.width;
      let top = source.height;
      let right = 0;
      let bottom = 0;
      for (let index = 0; index < pixels.length; index += 4) {
        if (pixels[index + 3] < 10) continue;
        const x = (index / 4) % source.width;
        const y = Math.floor(index / 4 / source.width);
        left = Math.min(left, x);
        right = Math.max(right, x);
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
      }
      if (right <= left) throw new Error("Blank apple canvas");
      const closeup = document.createElement("canvas");
      closeup.width = closeup.height = 800;
      const result = closeup.getContext("2d");
      result.fillStyle = "#08150f";
      result.fillRect(0, 0, 800, 800);
      const width = right - left + 1;
      const height = bottom - top + 1;
      const scale = 720 / Math.max(width, height);
      result.drawImage(
        scratch,
        left,
        top,
        width,
        height,
        (800 - width * scale) / 2,
        (800 - height * scale) / 2,
        width * scale,
        height * scale,
      );
      return closeup.toDataURL("image/png");
    });
    frames.push(frame);
    await writeFile(
      `${output}/apple-angle-${angle}.png`,
      Buffer.from(frame.split(",")[1], "base64"),
    );
  }

  const materialReport = await page.evaluate(async () => {
    const { loadAppleModel, disposeAppleModel } = await import(
      "/src/lib/three/create-apple-model.ts"
    );
    const model = await loadAppleModel();
    const maps = [];
    model.traverse((object) => {
      if (!object.isMesh) return;
      for (const key of ["map", "normalMap", "roughnessMap"]) {
        const texture = object.material[key];
        maps.push({
          key,
          width: texture?.image.width,
          height: texture?.image.height,
          colorSpace: texture?.colorSpace,
        });
      }
    });
    disposeAppleModel(model);
    return maps;
  });
  await writeFile(`${output}/materials.json`, JSON.stringify(materialReport, null, 2));
  console.log(JSON.stringify(materialReport));

  const reference = process.argv[2];
  if (reference) {
    const data = `data:image/png;base64,${(await readFile(reference)).toString("base64")}`;
    await page.setContent(`<html lang="pt-BR"><body style="margin:0;background:#08150f;color:#eef3ef;font:16px Arial">
      <div style="display:grid;grid-template-columns:repeat(3,1fr)">
      ${[data, ...frames].map((src, index) => `<figure style="margin:0;padding:16px"><figcaption style="padding:12px 0">${["Foto de referencia", "GLB: vista 1", "GLB: vista 2"][index]}</figcaption><img src="${src}" style="width:100%;height:510px;object-fit:contain"></figure>`).join("")}
      </div></body></html>`);
    await page
      .locator("img")
      .evaluateAll((images) => Promise.all(images.map((image) => image.decode())));
    await page.screenshot({
      path: `${output}/comparison.png`,
      clip: { x: 0, y: 0, width: 1536, height: 590 },
    });
  }
} finally {
  await browser.close();
}
