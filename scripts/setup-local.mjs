import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { loadEnv } from "vite";

const file = ".env.local";
let text = existsSync(file) ? readFileSync(file, "utf8") : "";
const existing = loadEnv("development", process.cwd(), "");
if (!existing.DATA_ENCRYPTION_KEY)
  text += `\nDATA_ENCRYPTION_KEY=${randomBytes(32).toString("base64")}\n`;
if (!existing.APP_ORIGIN) text += "APP_ORIGIN=http://127.0.0.1:4173\n";
writeFileSync(file, text, { mode: 0o600 });
console.log("Local encryption configured. No AI provider key was created or printed.");
