import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { loadEnv } from "vite";

const root = path.resolve("dist/client");
const env = {
  ...loadEnv("development", process.cwd(), ""),
  ...loadEnv("production", process.cwd(), ""),
};
const secretValues = Object.entries(env)
  .filter(
    ([name, value]) =>
      !name.startsWith("VITE_") &&
      /(?:SECRET|PASSWORD|API_KEY|ENCRYPTION_KEY|TOKEN)/.test(name) &&
      value.length >= 16,
  )
  .map(([, value]) => value);
const forbiddenMarkers = [
  "GROQ_API_KEY",
  "OPENAI_API_KEY",
  "DATA_ENCRYPTION_KEY",
  "TURNSTILE_SECRET_KEY",
  "SUPABASE_SECRET_KEY",
  "fc-plus-elevador",
];

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(file)));
    else if (/\.(js|json|html|map)$/.test(entry.name)) files.push(file);
  }
  return files;
}

let failures = 0;
const files = await walk(root);
if (!files.length) throw new Error("Build the client before scanning.");
for (const file of files) {
  const contents = await readFile(file, "utf8");
  if ([...secretValues, ...forbiddenMarkers].some((value) => contents.includes(value))) {
    // Never print matching values: this command also runs in CI logs.
    console.error(`Private data or server marker found in ${path.relative(root, file)}`);
    failures += 1;
  }
}
if (failures) process.exitCode = 1;
else
  console.log(
    `Client scan passed: ${files.length} files, no configured secrets or protected deck marker found.`,
  );
