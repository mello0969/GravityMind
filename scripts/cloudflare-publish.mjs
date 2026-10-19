import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { loadEnv } from "vite";

const configPath = "wrangler.production.json";
const config = JSON.parse(readFileSync(configPath, "utf8"));
const wrangler = "node_modules/wrangler/bin/wrangler.js";
const phase = process.argv[2] ?? "audit";
if (!["audit", "prepare", "deploy"].includes(phase))
  throw new Error("Use audit, prepare ou deploy.");

async function main() {
  const credentials = JSON.parse(
    execFileSync(process.execPath, [wrangler, "auth", "token", "--json"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }),
  );
  if (!credentials.token) throw new Error("Entre na Cloudflare pelo Wrangler antes de continuar.");
  async function api(path, method = "GET", body) {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${config.account_id}${path}`,
      {
        method,
        headers: {
          Authorization: `Bearer ${credentials.token}`,
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(30_000),
      },
    );
    const data = await response.json();
    if (!response.ok || !data.success)
      throw new Error(
        `Cloudflare ${method} ${path}: HTTP ${response.status}; códigos ${(data.errors ?? []).map((item) => item.code).join(",")}`,
      );
    return data.result;
  }
  const plans = await api("/subscriptions").catch((error) => {
    if (error.message.includes("HTTP 403")) return null;
    throw error;
  });
  const scripts = await api("/workers/scripts");
  let subdomain = await api("/workers/subdomain").catch((error) => {
    if (error.message.includes("HTTP 404")) return null;
    throw error;
  });
  const widgets = await api("/challenges/widgets");
  const workerPlans = (plans ?? []).filter((plan) =>
    /worker/i.test(JSON.stringify(plan.rate_plan ?? {})),
  );
  if (workerPlans.some((plan) => !/free/i.test(JSON.stringify(plan.rate_plan)))) {
    throw new Error(
      "Há uma assinatura Workers que não é Free. Publicação bloqueada para evitar custo.",
    );
  }
  const planConfirmed = !!plans || process.argv.includes("--free-confirmed");
  if (!planConfirmed && phase !== "audit")
    throw new Error(
      "Confirme Workers Free no painel antes de usar --free-confirmed. O token não pode ler assinaturas.",
    );
  if (!subdomain?.subdomain && phase === "prepare") {
    const requested = new URL(config.vars.APP_ORIGIN).hostname.split(".")[1];
    subdomain = await api("/workers/subdomain", "PUT", { subdomain: requested });
  }
  if (!subdomain?.subdomain) {
    if (phase === "audit") {
      console.log(
        JSON.stringify({ missingSubdomain: true, planConfirmed, workerCount: scripts.length }),
      );
      return;
    }
    throw new Error("Configure primeiro o subdomínio gratuito workers.dev.");
  }
  const origin = `https://${config.name}.${subdomain.subdomain}.workers.dev`;
  const hostname = new URL(origin).hostname;
  const widgetName = "GRAVITYMIND - producao TCC";
  const existingWidget = widgets.find(
    (widget) => widget.name === widgetName && widget.domains.includes(hostname),
  );
  if (phase === "audit") {
    console.log(
      JSON.stringify({
        origin,
        workerAlreadyExists: scripts.some((script) => script.id === config.name),
        planConfirmed,
        reusableTurnstile: !!existingWidget,
      }),
    );
    return;
  }
  if (phase === "prepare") {
    if (scripts.some((script) => script.id === config.name))
      throw new Error(
        "Já existe um Worker com este nome. Verifique a implantação existente antes de substituir.",
      );
    if (existsSync(".env.production.local"))
      throw new Error(
        ".env.production.local já existe. Preserve e confira sua configuração antes de recriar.",
      );
    execFileSync("git", ["check-ignore", ".env.production.local"], { stdio: "ignore" });
    const widget = existingWidget
      ? await api(`/challenges/widgets/${existingWidget.sitekey}`)
      : await api("/challenges/widgets", "POST", {
          name: widgetName,
          domains: [hostname],
          mode: "managed",
          clearance_level: "no_clearance",
        });
    if (!widget.secret || !widget.sitekey)
      throw new Error("O Turnstile não retornou uma configuração válida.");
    // Generated secrets stay in the ignored local env file, never in command arguments or logs.
    writeFileSync(
      ".env.production.local",
      `APP_ORIGIN=${origin}\nVITE_TURNSTILE_SITE_KEY=${widget.sitekey}\nTURNSTILE_SECRET_KEY=${widget.secret}\n`,
      { flag: "wx", mode: 0o600 },
    );
    console.log(JSON.stringify({ origin, productionEnvCreated: true, turnstileReady: true }));
    return;
  }
  const env = {
    ...loadEnv("development", process.cwd(), ""),
    ...loadEnv("production", process.cwd(), ""),
  };
  if (env.APP_ORIGIN !== origin || !env.VITE_TURNSTILE_SITE_KEY || !env.TURNSTILE_SECRET_KEY)
    throw new Error("Prepare a configuração de produção antes de publicar.");
  const secretNames = [
    "SUPABASE_URL",
    "SUPABASE_SECRET_KEY",
    "DATA_ENCRYPTION_KEY",
    "TURNSTILE_SECRET_KEY",
    "GROQ_API_KEY",
  ];
  for (const name of secretNames)
    if (!env[name]) throw new Error(`${name} não configurada. Publicação bloqueada.`);
  const runtimeEnv = {
    ...process.env,
    ...env,
    NODE_ENV: "production",
    WRANGLER_SEND_METRICS: "false",
  };
  for (const [file, args] of [
    ["node_modules/vite/bin/vite.js", ["build"]],
    ["scripts/check-client-bundle.mjs", []],
    [wrangler, ["deploy", "--config", configPath]],
  ]) {
    const result = spawnSync(process.execPath, [file, ...args], {
      env: runtimeEnv,
      stdio: "inherit",
    });
    if (result.status !== 0)
      throw new Error(`A etapa ${file} falhou. Verifique os diagnósticos sem publicar segredos.`);
  }
  const secretResult = spawnSync(
    process.execPath,
    [wrangler, "secret", "bulk", "--config", configPath],
    {
      env: runtimeEnv,
      input: JSON.stringify(Object.fromEntries(secretNames.map((name) => [name, env[name]]))),
      stdio: ["pipe", "pipe", "pipe"],
      encoding: "utf8",
    },
  );
  if (secretResult.status !== 0)
    throw new Error(
      "Não foi possível configurar os secrets de produção. Confira no painel da Cloudflare.",
    );
  console.log(
    JSON.stringify({ origin, deployed: true, serverSecretsConfigured: secretNames.length }),
  );
}

main().catch((error) => {
  console.error(
    error instanceof Error && !error.message.includes("Command failed")
      ? error.message
      : "Falha na publicação. Nenhuma credencial foi exibida.",
  );
  process.exitCode = 1;
});
