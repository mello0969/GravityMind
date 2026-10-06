import { readFileSync } from "node:fs";
import process from "node:process";
import { loadEnv } from "vite";

const localEnv = loadEnv("development", process.cwd(), "");
for (const [name, value] of Object.entries(localEnv)) process.env[name] ??= value;

const production = process.argv.includes("--production") || process.env.NODE_ENV === "production";
const errors = [];
const warnings = [];
const requiredServerVariables = [
  "APP_ORIGIN",
  "DATA_ENCRYPTION_KEY",
  "TURNSTILE_SECRET_KEY",
  "SUPABASE_URL",
  "SUPABASE_SECRET_KEY",
];
const optionalIntegrations = [
  ["GROQ_API_KEY", "Tutor de IA indisponível até configurar a chave Groq no servidor."],
  ["STRIPE_SECRET_KEY", "Checkout Plus desativado."],
  ["STRIPE_WEBHOOK_SECRET", "Webhook do Stripe desativado."],
  ["STRIPE_PLUS_PRICE_ID", "Checkout Plus sem produto configurado."],
  ["VITE_SENTRY_DSN", "Observabilidade do cliente desativada."],
];

function hasValue(name) {
  return typeof process.env[name] === "string" && process.env[name].trim().length > 0;
}

for (const name of requiredServerVariables) {
  if (!hasValue(name)) {
    const message = `${name} não configurada.`;
    if (production) errors.push(message);
    else warnings.push(message);
  }
}

for (const [name, message] of optionalIntegrations) {
  if (!hasValue(name)) warnings.push(`${name}: ${message}`);
}

if (hasValue("APP_ORIGIN")) {
  try {
    const origin = new URL(process.env.APP_ORIGIN);
    if (production && origin.protocol !== "https:") {
      errors.push("APP_ORIGIN deve usar HTTPS em produção.");
    }
  } catch {
    errors.push("APP_ORIGIN não é uma URL válida.");
  }
}

if (hasValue("DATA_ENCRYPTION_KEY")) {
  const key = Buffer.from(process.env.DATA_ENCRYPTION_KEY, "base64");
  if (key.byteLength !== 32) errors.push("DATA_ENCRYPTION_KEY deve conter 32 bytes em base64.");
}

const example = readFileSync(new URL("../.env.example", import.meta.url), "utf8");
const declaredNames = [...example.matchAll(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=/gm)].map(
  (match) => match[1],
);
for (const name of new Set([...declaredNames, ...Object.keys(localEnv)])) {
  if (name.startsWith("VITE_") && /(SECRET|PRIVATE|TOKEN|API_KEY)/i.test(name)) {
    errors.push(`${name} usa prefixo público para um possível segredo.`);
  }
}

if (hasValue("SUPABASE_URL")) {
  try {
    const url = new URL(process.env.SUPABASE_URL);
    if (url.protocol !== "https:" || url.username || url.password)
      errors.push("SUPABASE_URL deve ser uma URL HTTPS sem credenciais.");
  } catch {
    errors.push("SUPABASE_URL invalida.");
  }
}
if (hasValue("SUPABASE_SECRET_KEY") && !process.env.SUPABASE_SECRET_KEY.startsWith("sb_secret_")) {
  errors.push("SUPABASE_SECRET_KEY deve ser a Secret key, nao a Publishable key.");
}

for (const warning of warnings) console.warn(`AVISO: ${warning}`);
for (const error of errors) console.error(`ERRO: ${error}`);

if (errors.length > 0) process.exit(1);
console.log(`Configuração verificada${production ? " para produção" : " em modo local"}.`);
