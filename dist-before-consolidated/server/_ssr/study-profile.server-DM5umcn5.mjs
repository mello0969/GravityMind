import { c as createServerRpc, e as exigirUsuarioAutenticado, a as aplicarRateLimit } from "./session.server-DL0xVT0X.mjs";
import { c as createServerFn, s as setResponseHeaders } from "./server-DwUI_Cux.mjs";
import { g as getD1 } from "./schemas-Dga4YmnR.mjs";

import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, b as booleanType, s as stringType, n as numberType } from "../_libs/zod.mjs";

import "../_libs/h3-v2.mjs";
import "../_libs/unenv.mjs";


import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";





import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";

import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
const activitySchema = objectType({
  eventId: stringType().uuid(),
  correct: booleanType(),
  corrected: booleanType()
}).strict();
const goalSchema = objectType({
  dailyGoal: numberType().int().min(1).max(40)
}).strict();
function privateResponse() {
  setResponseHeaders(new Headers({
    "cache-control": "private, no-store, max-age=0",
    vary: "Cookie"
  }));
}
function localDate(daysFromNow = 0) {
  const date = new Date(Date.now() + daysFromNow * 864e5);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}
async function ensureProfile(userId) {
  await getD1().prepare(`INSERT INTO perfis_estudo (user_id)
       VALUES (?)
       ON CONFLICT(user_id) DO NOTHING`).bind(userId).run();
}
async function readProfile(userId) {
  await ensureProfile(userId);
  const today = localDate();
  const row = await getD1().prepare(`SELECT p.meta_diaria, p.ofensiva_dias, p.sequencia_acertos,
              p.melhor_sequencia, p.total_xp,
              a.respostas AS respostas_hoje, a.acertos AS acertos_hoje,
              CASE
                WHEN s.plano = 'plus' AND s.status = 'active'
                  AND (s.valida_ate IS NULL OR datetime(s.valida_ate) > datetime('now'))
                THEN 'plus'
                ELSE 'free'
              END AS plano
       FROM perfis_estudo AS p
       LEFT JOIN atividade_estudo AS a
         ON a.user_id = p.user_id AND a.data_local = ?
       LEFT JOIN assinaturas AS s ON s.user_id = p.user_id
       WHERE p.user_id = ?
       LIMIT 1`).bind(today, userId).first();
  return {
    dailyGoal: row?.meta_diaria ?? 5,
    currentStreakDays: row?.ofensiva_dias ?? 0,
    correctStreak: row?.sequencia_acertos ?? 0,
    bestCorrectStreak: row?.melhor_sequencia ?? 0,
    totalXp: row?.total_xp ?? 0,
    todayAnswers: row?.respostas_hoje ?? 0,
    todayCorrect: row?.acertos_hoje ?? 0,
    plan: row?.plano === "plus" ? "plus" : "free"
  };
}
const getStudyProfileServerFn_createServerFn_handler = createServerRpc({
  id: "90b59c6bd92c28e4b6063b4ca823be7c46c8198f8e5fa1eebf69021826fbc452",
  name: "getStudyProfileServerFn",
  filename: "src/lib/profile/study-profile.server.ts"
}, (opts) => getStudyProfileServerFn.__executeServer(opts));
const getStudyProfileServerFn = createServerFn({
  method: "GET"
}).handler(getStudyProfileServerFn_createServerFn_handler, async () => {
  privateResponse();
  try {
    const userId = await exigirUsuarioAutenticado();
    return {
      profile: await readProfile(userId)
    };
  } catch {
    return {
      profile: null
    };
  }
});
const updateDailyGoalServerFn_createServerFn_handler = createServerRpc({
  id: "7645c34232cca93b40eec405566a5f48e3b921bca38cdc6495231e1819de46f7",
  name: "updateDailyGoalServerFn",
  filename: "src/lib/profile/study-profile.server.ts"
}, (opts) => updateDailyGoalServerFn.__executeServer(opts));
const updateDailyGoalServerFn = createServerFn({
  method: "POST"
}).validator((input) => goalSchema.parse(input)).handler(updateDailyGoalServerFn_createServerFn_handler, async ({
  data
}) => {
  privateResponse();
  try {
    const userId = await exigirUsuarioAutenticado();
    await aplicarRateLimit("profile:goal", 20, 6e4, userId);
    await ensureProfile(userId);
    await getD1().prepare(`UPDATE perfis_estudo
           SET meta_diaria = ?, atualizado_em = datetime('now')
           WHERE user_id = ?`).bind(data.dailyGoal, userId).run();
    return {
      profile: await readProfile(userId)
    };
  } catch {
    return {
      profile: null
    };
  }
});
const recordStudyActivityServerFn_createServerFn_handler = createServerRpc({
  id: "26c8a62cc85b683df6a59458a67577251aff47955ade0210cc845d54889aeecc",
  name: "recordStudyActivityServerFn",
  filename: "src/lib/profile/study-profile.server.ts"
}, (opts) => recordStudyActivityServerFn.__executeServer(opts));
const recordStudyActivityServerFn = createServerFn({
  method: "POST"
}).validator((input) => activitySchema.parse(input)).handler(recordStudyActivityServerFn_createServerFn_handler, async ({
  data
}) => {
  privateResponse();
  try {
    const userId = await exigirUsuarioAutenticado();
    await aplicarRateLimit("profile:activity", 120, 60 * 6e4, userId);
    await ensureProfile(userId);
    const xp = 4 + (data.correct ? 4 : 0) + (data.corrected ? 3 : 0);
    const inserted = await getD1().prepare(`INSERT OR IGNORE INTO eventos_recompensa
           (id, user_id, correta, corrigida, xp)
           VALUES (?, ?, ?, ?, ?)`).bind(data.eventId, userId, data.correct ? 1 : 0, data.corrected ? 1 : 0, xp).run();
    if (Number(inserted.meta.changes ?? 0) === 0) {
      return {
        profile: await readProfile(userId)
      };
    }
    const today = localDate();
    const yesterday = localDate(-1);
    const current = await getD1().prepare(`SELECT ofensiva_dias, ultimo_estudo_em, sequencia_acertos,
                  melhor_sequencia, total_xp
           FROM perfis_estudo WHERE user_id = ? LIMIT 1`).bind(userId).first();
    const currentStreak = current?.ofensiva_dias ?? 0;
    const lastDay = current?.ultimo_estudo_em ?? null;
    const nextDailyStreak = lastDay === today ? currentStreak : lastDay === yesterday ? currentStreak + 1 : 1;
    const nextCorrectStreak = data.correct ? (current?.sequencia_acertos ?? 0) + 1 : 0;
    const bestCorrectStreak = Math.max(current?.melhor_sequencia ?? 0, nextCorrectStreak);
    await getD1().prepare(`UPDATE perfis_estudo
           SET ofensiva_dias = ?, ultimo_estudo_em = ?, sequencia_acertos = ?,
               melhor_sequencia = ?, total_xp = total_xp + ?,
               atualizado_em = datetime('now')
           WHERE user_id = ?`).bind(nextDailyStreak, today, nextCorrectStreak, bestCorrectStreak, xp, userId).run();
    await getD1().prepare(`INSERT INTO atividade_estudo (user_id, data_local, respostas, acertos, xp)
           VALUES (?, ?, 1, ?, ?)
           ON CONFLICT(user_id, data_local) DO UPDATE SET
             respostas = atividade_estudo.respostas + 1,
             acertos = atividade_estudo.acertos + excluded.acertos,
             xp = atividade_estudo.xp + excluded.xp`).bind(userId, today, data.correct ? 1 : 0, xp).run();
    return {
      profile: await readProfile(userId)
    };
  } catch (error) {
    console.error("Falha ao registrar atividade do perfil", error);
    return {
      profile: null
    };
  }
});
export {
  getStudyProfileServerFn_createServerFn_handler,
  recordStudyActivityServerFn_createServerFn_handler,
  updateDailyGoalServerFn_createServerFn_handler
};
