import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
process.chdir(root);
const require = createRequire(import.meta.url);
const wrangler = path.join(
  path.dirname(require.resolve("wrangler/package.json")),
  "bin/wrangler.js",
);
const mode = process.argv[2];
assert(["setup", "check", "backup"].includes(mode), "Use setup, check ou backup.");
assert(
  process.argv.length <= 4 && (!process.argv[3] || process.argv[3] === "--remote"),
  "Opcao invalida.",
);
const remote = process.argv[3] === "--remote";
assert(!(remote && mode === "setup"), "Para migrations online, use npm run db:migrate:remote.");
const location = remote ? "remoto" : "local";
const locationFlag = remote ? "--remote" : "--local";

function run(args, capture = false, quiet = false) {
  const result = spawnSync(process.execPath, [wrangler, ...args, "--config", "wrangler.jsonc"], {
    cwd: root,
    encoding: "utf8",
    stdio: capture || quiet ? ["ignore", "pipe", "pipe"] : "inherit",
    env: { ...process.env, CI: "true", WRANGLER_SEND_METRICS: "false" },
  });
  if (result.error || result.status !== 0) {
    throw new Error(`Falha ao acessar o D1 ${location}. Confira a configuracao e a autenticacao.`);
  }
  return capture ? JSON.parse(result.stdout) : undefined;
}

if (mode === "setup") {
  await import("./setup-local.mjs");
  run(["d1", "migrations", "apply", "DB", "--local"]);
}

if (mode === "backup") {
  mkdirSync(path.join(root, "backups"), { recursive: true });
  const filename = `backups/gravitymind-${location}-${new Date().toISOString().replaceAll(":", "-")}.sql`;
  // Wrangler prints a signed download URL; keep it out of terminal and CI logs.
  run(["d1", "export", "DB", locationFlag, "--output", filename], false, true);
  console.log(
    `Backup privado criado em ${filename}. Preserve tambem a chave de criptografia separadamente.`,
  );
} else {
  const expectedTables = [
    "users",
    "sessoes",
    "respostas_questoes",
    "respostas_calculo",
    "notas",
    "notas_historico",
    "progresso_licoes",
    "dificuldade_adaptativa",
    "quiz_resultados",
    "rate_limits",
    "perfis_estudo",
    "atividade_estudo",
    "eventos_recompensa",
    "assinaturas",
  ];
  const results = run(
    [
      "d1",
      "execute",
      "DB",
      locationFlag,
      "--json",
      "--command",
      "SELECT name FROM sqlite_schema WHERE type='table'; PRAGMA quick_check; PRAGMA foreign_key_check; SELECT name FROM d1_migrations; PRAGMA table_info(respostas_questoes);",
    ],
    true,
  );
  assert(
    results.length === 5 && results.every((r) => r.success),
    "Consulta de verificacao falhou.",
  );
  const [tables, integrity, foreignKeys, migrations, columns] = results.map((r) => r.results);
  assert(
    expectedTables.every((name) => tables.some((table) => table.name === name)),
    remote
      ? "Faltam tabelas. Execute npm run db:migrate:remote."
      : "Faltam tabelas. Execute npm run db:setup.",
  );
  assert(
    integrity.length === 1 && integrity[0].quick_check === "ok",
    "A integridade do banco precisa de revisao.",
  );
  assert(foreignKeys.length === 0, "Existem relacionamentos invalidos no banco.");
  const expectedMigrations = readdirSync(path.join(root, "migrations")).filter((name) =>
    name.endsWith(".sql"),
  );
  assert(
    expectedMigrations.every((name) => migrations.some((migration) => migration.name === name)),
    "Existem migrations pendentes.",
  );
  assert(
    ["confianca", "corrigida"].every((name) => columns.some((column) => column.name === name)),
    "Faltam colunas de aprendizagem.",
  );
  console.log(
    `D1 ${location} pronto: ${expectedTables.length} tabelas, ${expectedMigrations.length} migrations, integridade e relacionamentos OK. Nenhum dado pessoal exibido.`,
  );
}
