import { createServerFn } from "@tanstack/react-start";
import { setResponseHeaders } from "@tanstack/react-start/server";
import { z } from "zod";
import { exigirUsuarioAutenticado } from "@/lib/auth/session.server";
import { getD1 } from "@/lib/db/context";
import { aplicarRateLimit } from "@/lib/security/rate-limit";

type StudyPlan = "free" | "plus";

export type StudyProfile = {
  dailyGoal: number;
  currentStreakDays: number;
  correctStreak: number;
  bestCorrectStreak: number;
  totalXp: number;
  todayAnswers: number;
  todayCorrect: number;
  plan: StudyPlan;
};

type ProfileRow = {
  meta_diaria: number;
  ofensiva_dias: number;
  sequencia_acertos: number;
  melhor_sequencia: number;
  total_xp: number;
  respostas_hoje: number | null;
  acertos_hoje: number | null;
  plano: StudyPlan | null;
};

const activitySchema = z
  .object({
    eventId: z.string().uuid(),
    correct: z.boolean(),
    corrected: z.boolean(),
  })
  .strict();

const goalSchema = z.object({ dailyGoal: z.number().int().min(1).max(40) }).strict();

function privateResponse() {
  setResponseHeaders(
    new Headers({
      "cache-control": "private, no-store, max-age=0",
      vary: "Cookie",
    }),
  );
}

function localDate(daysFromNow = 0) {
  const date = new Date(Date.now() + daysFromNow * 86_400_000);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

async function ensureProfile(userId: string) {
  await getD1()
    .prepare(
      `INSERT INTO perfis_estudo (user_id)
       VALUES (?)
       ON CONFLICT(user_id) DO NOTHING`,
    )
    .bind(userId)
    .run();
}

async function readProfile(userId: string): Promise<StudyProfile> {
  await ensureProfile(userId);
  const today = localDate();
  const row = await getD1()
    .prepare(
      `SELECT p.meta_diaria, p.ofensiva_dias, p.sequencia_acertos,
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
       LIMIT 1`,
    )
    .bind(today, userId)
    .first<ProfileRow>();

  return {
    dailyGoal: row?.meta_diaria ?? 5,
    currentStreakDays: row?.ofensiva_dias ?? 0,
    correctStreak: row?.sequencia_acertos ?? 0,
    bestCorrectStreak: row?.melhor_sequencia ?? 0,
    totalXp: row?.total_xp ?? 0,
    todayAnswers: row?.respostas_hoje ?? 0,
    todayCorrect: row?.acertos_hoje ?? 0,
    plan: row?.plano === "plus" ? "plus" : "free",
  };
}

export const getStudyProfileServerFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ profile: StudyProfile | null }> => {
    privateResponse();
    try {
      const userId = await exigirUsuarioAutenticado();
      return { profile: await readProfile(userId) };
    } catch {
      return { profile: null };
    }
  },
);

export const updateDailyGoalServerFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => goalSchema.parse(input))
  .handler(async ({ data }): Promise<{ profile: StudyProfile | null }> => {
    privateResponse();
    try {
      const userId = await exigirUsuarioAutenticado();
      await aplicarRateLimit("profile:goal", 20, 60_000, userId);
      await ensureProfile(userId);
      await getD1()
        .prepare(
          `UPDATE perfis_estudo
           SET meta_diaria = ?, atualizado_em = datetime('now')
           WHERE user_id = ?`,
        )
        .bind(data.dailyGoal, userId)
        .run();
      return { profile: await readProfile(userId) };
    } catch {
      return { profile: null };
    }
  });

export const recordStudyActivityServerFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => activitySchema.parse(input))
  .handler(async ({ data }): Promise<{ profile: StudyProfile | null }> => {
    privateResponse();
    try {
      const userId = await exigirUsuarioAutenticado();
      await aplicarRateLimit("profile:activity", 120, 60 * 60_000, userId);
      await ensureProfile(userId);

      const xp = 4 + (data.correct ? 4 : 0) + (data.corrected ? 3 : 0);
      const inserted = await getD1()
        .prepare(
          `INSERT OR IGNORE INTO eventos_recompensa
           (id, user_id, correta, corrigida, xp)
           VALUES (?, ?, ?, ?, ?)`,
        )
        .bind(data.eventId, userId, data.correct ? 1 : 0, data.corrected ? 1 : 0, xp)
        .run();
      if (Number(inserted.meta.changes ?? 0) === 0) {
        return { profile: await readProfile(userId) };
      }

      const today = localDate();
      const yesterday = localDate(-1);
      const current = await getD1()
        .prepare(
          `SELECT ofensiva_dias, ultimo_estudo_em, sequencia_acertos,
                  melhor_sequencia, total_xp
           FROM perfis_estudo WHERE user_id = ? LIMIT 1`,
        )
        .bind(userId)
        .first<{
          ofensiva_dias: number;
          ultimo_estudo_em: string | null;
          sequencia_acertos: number;
          melhor_sequencia: number;
          total_xp: number;
        }>();

      const currentStreak = current?.ofensiva_dias ?? 0;
      const lastDay = current?.ultimo_estudo_em ?? null;
      const nextDailyStreak =
        lastDay === today ? currentStreak : lastDay === yesterday ? currentStreak + 1 : 1;
      const nextCorrectStreak = data.correct ? (current?.sequencia_acertos ?? 0) + 1 : 0;
      const bestCorrectStreak = Math.max(current?.melhor_sequencia ?? 0, nextCorrectStreak);

      await getD1()
        .prepare(
          `UPDATE perfis_estudo
           SET ofensiva_dias = ?, ultimo_estudo_em = ?, sequencia_acertos = ?,
               melhor_sequencia = ?, total_xp = total_xp + ?,
               atualizado_em = datetime('now')
           WHERE user_id = ?`,
        )
        .bind(nextDailyStreak, today, nextCorrectStreak, bestCorrectStreak, xp, userId)
        .run();

      await getD1()
        .prepare(
          `INSERT INTO atividade_estudo (user_id, data_local, respostas, acertos, xp)
           VALUES (?, ?, 1, ?, ?)
           ON CONFLICT(user_id, data_local) DO UPDATE SET
             respostas = atividade_estudo.respostas + 1,
             acertos = atividade_estudo.acertos + excluded.acertos,
             xp = atividade_estudo.xp + excluded.xp`,
        )
        .bind(userId, today, data.correct ? 1 : 0, xp)
        .run();

      return { profile: await readProfile(userId) };
    } catch (error) {
      console.error("Falha ao registrar atividade do perfil", error);
      return { profile: null };
    }
  });
