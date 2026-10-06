import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const ignoredDirectories = new Set([
  ".git",
  ".img2threejs",
  ".tanstack",
  ".wrangler",
  "coverage",
  "dist",
  "node_modules",
  "playwright-report",
  "test-results",
  "artifacts",
  "backups",
  "output",
  ".agents",
  ".stryker-tmp",
  "dist-before-consolidated",
]);
const ignoredFiles = new Set(["package-lock.json", ".env.example"]);
const extensions = new Set([
  ".cjs",
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".sql",
  ".ts",
  ".tsx",
  ".yaml",
  ".yml",
]);
const secretPatterns = [
  /\bgsk_[A-Za-z0-9_-]{20,}\b/g,
  /\bsb_secret_[A-Za-z0-9_-]{20,}\b/g,
  /\bsk_live_[A-Za-z0-9]{20,}\b/g,
  /\bwhsec_[A-Za-z0-9]{20,}\b/g,
  /\b(?:sk-ant-|sk-proj-)[A-Za-z0-9_-]{20,}\b/g,
  /\bghp_[A-Za-z0-9]{30,}\b/g,
  /\bAKIA[A-Z0-9]{16}\b/g,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
];

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink() || (entry.isDirectory() && ignoredDirectories.has(entry.name)))
      continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(absolute)));
    else if (!ignoredFiles.has(entry.name) && extensions.has(path.extname(entry.name)))
      files.push(absolute);
  }
  return files;
}

const findings = [];
for (const file of await walk(root)) {
  const content = await readFile(file, "utf8");
  for (const pattern of secretPatterns) {
    pattern.lastIndex = 0;
    if (pattern.test(content)) findings.push(path.relative(root, file));
  }
}

if (findings.length > 0) {
  console.error(`Potential secrets found in: ${[...new Set(findings)].join(", ")}`);
  process.exitCode = 1;
} else {
  console.log(
    "Source scan passed: no known credential patterns found. Git history is not scanned.",
  );
}
