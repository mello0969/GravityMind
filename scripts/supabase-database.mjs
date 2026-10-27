import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { loadEnv } from "vite";

const root = fileURLToPath(new URL("../", import.meta.url));
process.chdir(root);
const env = { ...loadEnv("development", root, ""), ...process.env };
const tables = [
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
  "tutor_conversas",
];
const keys = {
  users: "id",
  sessoes: "token",
  respostas_questoes: "user_id,questao_id,respondido_em",
  respostas_calculo: "user_id,questao_id,respondido_em",
  notas: "id",
  notas_historico: "id",
  progresso_licoes: "user_id,assunto,marco",
  dificuldade_adaptativa: "user_id,assunto",
  quiz_resultados: "user_id,assunto,formato,respondido_em",
  rate_limits: "chave_hash,janela_inicio",
  perfis_estudo: "user_id",
  atividade_estudo: "user_id,data_local",
  eventos_recompensa: "user_id,id",
  assinaturas: "user_id",
  tutor_conversas: "id",
};
const mode = process.argv[2];
assert(
  ["check", "backup", "import-d1", "verify"].includes(mode),
  "Use check, backup, import-d1 ou verify.",
);
assert(
  env.SUPABASE_URL && env.SUPABASE_SECRET_KEY?.startsWith("sb_secret_"),
  "Configure SUPABASE_URL e SUPABASE_SECRET_KEY no .env.local. Nao envie a chave na conversa.",
);
assert(new URL(env.SUPABASE_URL).protocol === "https:", "Supabase exige HTTPS.");
const options = {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
};
const db = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, options);
const check = async () => {
  for (const table of tables) {
    const { error } = await db.from(table).select("*", { count: "exact", head: true });
    assert(!error, `Falha ao verificar a tabela ${table}. Confira a chave e as migrations.`);
  }
  console.log(
    `Supabase: ${tables.length} tabelas acessiveis pelo servidor. Nenhum dado pessoal exibido.`,
  );
};

async function backup() {
  const data = {};
  for (const table of tables) {
    data[table] = [];
    let offset = 0;
    const ordering = keys[table].split(",");
    while (true) {
      let query = db
        .from(table)
        .select("*")
        .range(offset, offset + 499);
      for (const key of ordering) query = query.order(key);
      const page = await query.throwOnError();
      data[table].push(...page.data);
      if (page.data.length < 500) break;
      offset += 500;
    }
  }
  mkdirSync(path.join(root, "backups"), { recursive: true });
  const name = `backups/supabase-${new Date().toISOString().replaceAll(":", "-")}.json`;
  writeFileSync(name, JSON.stringify({ version: 1, createdAt: new Date().toISOString(), data }), {
    flag: "wx",
    mode: 0o600,
  });
  console.log(`Backup privado criado: ${name}. Guarde DATA_ENCRYPTION_KEY separadamente.`);
}

async function importD1() {
  // Export through Wrangler, restore with SQLite's parser, then send structured rows.
  // Never translate SQL with string replacement, or modify the source D1 database.
  const require = createRequire(import.meta.url);
  const wrangler = path.join(
    path.dirname(require.resolve("wrangler/package.json")),
    "bin/wrangler.js",
  );
  mkdirSync("backups", { recursive: true });
  const filename = path.join(root, "backups", `d1-before-supabase-${Date.now()}.sql`);
  const remote = process.argv.includes("--remote");
  const result = spawnSync(
    process.execPath,
    [
      wrangler,
      "d1",
      "export",
      "DB",
      remote ? "--remote" : "--local",
      "--config",
      "wrangler.jsonc",
      "--output",
      filename,
    ],
    { encoding: "utf8", env: { ...process.env, CI: "true" } },
  );
  assert(result.status === 0, "Falha no backup D1. Origem preservada.");
  const sqlite = new DatabaseSync(":memory:");
  try {
    sqlite.exec(readFileSync(filename, "utf8"));
    assert(sqlite.prepare("PRAGMA quick_check").get().quick_check === "ok", "Backup D1 invalido.");
    const importedUsers = sqlite.prepare("SELECT * FROM users").all();
    const destination = await db
      .from("users")
      .select("id,email,senha_hash,senha_salt")
      .throwOnError();
    for (const user of importedUsers) {
      const existing = destination.data.find(
        (row) => row.id === user.id || row.email === user.email,
      );
      assert(
        !existing ||
          (existing.id === user.id &&
            existing.email === user.email &&
            existing.senha_hash === user.senha_hash &&
            existing.senha_salt === user.senha_salt),
        "Conta conflitante. Importacao interrompida sem sobrescrever senhas.",
      );
    }
    await backup();
    for (const table of tables) {
      // Sessions expire; Tutor conversations do not exist in the legacy D1 schema.
      if (["sessoes", "rate_limits", "tutor_conversas"].includes(table)) continue;
      const rows = sqlite
        .prepare(`SELECT * FROM "${table}"`)
        .all()
        .map((row) => {
          const converted = { ...row };
          if (["respostas_questoes", "respostas_calculo", "quiz_resultados"].includes(table))
            delete converted.id;
          for (const [key, value] of Object.entries(converted)) {
            if (key.endsWith("_em") && typeof value === "string" && value.includes(" ")) {
              converted[key] = new Date(`${value.replace(" ", "T")}Z`).toISOString();
            }
          }
          return converted;
        });
      for (let index = 0; index < rows.length; index += 100) {
        await db
          .from(table)
          .upsert(rows.slice(index, index + 100), {
            onConflict: keys[table],
            ignoreDuplicates: true,
          })
          .throwOnError();
      }
      console.log(`${table}: ${rows.length} registros processados, existentes preservados.`);
    }
    console.log("Importacao concluida. D1 e backups preservados; entre novamente na conta.");
  } finally {
    sqlite.close();
  }
}

async function verify() {
  assert(
    env.SUPABASE_PUBLISHABLE_KEY,
    "Configure a Publishable key para testar o bloqueio publico.",
  );
  const publicDb = createClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, options);
  for (const table of tables) {
    const result = await publicDb.from(table).select("*").limit(1);
    assert(result.error?.code === "42501", `Acesso publico inesperado em ${table}.`);
  }
  const owner = randomUUID();
  const other = randomUUID();
  const event = randomUUID();
  const noteId = `qa-${randomUUID()}`;
  const now = new Date().toISOString();
  const empty = {
    notas: [],
    respostasQuestoes: [],
    respostasCalculo: [],
    progressoLicoes: [],
    dificuldadeAdaptativa: [],
    quizResultados: [],
  };
  const rows = [owner, other].map((id) => ({
    id,
    nome: "Teste Supabase",
    email: `qa-${id}@example.test`,
    senha_hash: "non-login-fixture",
    senha_salt: "non-login-fixture",
  }));
  try {
    await db.from("users").insert(rows).throwOnError();
    const note = {
      id: noteId,
      titulo: "encrypted-fixture",
      conteudo: "encrypted-fixture",
      assunto: "geral",
      criadaEm: now,
      atualizadaEm: now,
    };
    await db
      .rpc("gm_sync", { p_user_id: owner, p_data: { ...empty, notas: [note] } })
      .throwOnError();
    await db
      .rpc("gm_sync", {
        p_user_id: other,
        p_data: {
          ...empty,
          notas: [
            {
              ...note,
              titulo: "must-not-overwrite",
              atualizadaEm: new Date(Date.now() + 60000).toISOString(),
            },
          ],
        },
      })
      .throwOnError();
    const saved = await db
      .from("notas")
      .select("user_id,titulo")
      .eq("id", noteId)
      .single()
      .throwOnError();
    assert(
      saved.data.user_id === owner && saved.data.titulo === "encrypted-fixture",
      "Falha no isolamento de notas.",
    );
    const attempts = [
      ["gm_create_session", { p_user_id: owner, p_token: "a".repeat(64), p_expires: now }],
      ["gm_rate_limit", { p_key: "a".repeat(64), p_window: now, p_expires: now }],
      ["gm_sync", { p_user_id: owner, p_data: empty }],
      ["gm_read_profile", { p_user_id: owner }],
      [
        "gm_record_activity",
        { p_user_id: owner, p_event_id: event, p_correct: true, p_corrected: false },
      ],
    ];
    for (const [name, args] of attempts) {
      const denied = await publicDb.rpc(name, args);
      assert(denied.error?.code === "42501", `RPC publica inesperada: ${name}.`);
    }
    await Promise.all(
      Array.from({ length: 5 }, () =>
        db
          .rpc("gm_record_activity", {
            p_user_id: owner,
            p_event_id: event,
            p_correct: true,
            p_corrected: false,
          })
          .throwOnError(),
      ),
    );
    const profile = await db.rpc("gm_read_profile", { p_user_id: owner }).single().throwOnError();
    assert(profile.data.total_xp === 8 && profile.data.respostas_hoje === 1, "Evento duplicou XP.");
    // A failed upload must roll back the note inserted earlier in the same transaction.
    const badId = `qa-${randomUUID()}`;
    const invalid = await db.rpc("gm_sync", {
      p_user_id: owner,
      p_data: {
        ...empty,
        notas: [{ ...note, id: badId }],
        dificuldadeAdaptativa: [{ assunto: "lei-1", nivel: "INVALID" }],
      },
    });
    assert(invalid.error, "Upload invalido foi aceito.");
    const rollback = await db.from("notas").select("id").eq("id", badId).throwOnError();
    assert(rollback.data.length === 0, "Upload parcial persistiu.");
    console.log(
      "Verificado: bloqueio publico, RPCs privadas, isolamento de notas, rollback e XP idempotente.",
    );
  } finally {
    await db.from("users").delete().in("id", [owner, other]).throwOnError();
  }
}

try {
  if (mode === "check") await check();
  if (mode === "backup") await backup();
  if (mode === "import-d1") await importD1();
  if (mode === "verify") await verify();
} catch (error) {
  // Do not log database detail fields: they can contain emails or private notes.
  console.error(
    error instanceof assert.AssertionError
      ? error.message
      : "Operacao falhou. Verifique conexao, chave e schema.",
  );
  process.exitCode = 1;
}
