import { createServerFn } from "@tanstack/react-start";
import { setResponseHeaders } from "@tanstack/react-start/server";
import { z } from "zod";
import { exigirUsuarioAutenticado } from "@/lib/auth/session.server";
import { getDatabase } from "@/lib/db/supabase.server";
import { aplicarRateLimit } from "@/lib/security/rate-limit";

export type StudyProfile = {
  dailyGoal: number;
  currentStreakDays: number;
  correctStreak: number;
  bestCorrectStreak: number;
  totalXp: number;
  todayAnswers: number;
  todayCorrect: number;
  plan: "free" | "plus";
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
    new Headers({ "cache-control": "private, no-store, max-age=0", vary: "Cookie" }),
  );
}

async function readProfile(userId: string): Promise<StudyProfile> {
  const { data } = await getDatabase()
    .rpc("gm_read_profile", { p_user_id: userId })
    .single()
    .throwOnError();
  return {
    dailyGoal: data.meta_diaria,
    currentStreakDays: data.ofensiva_dias,
    correctStreak: data.sequencia_acertos,
    bestCorrectStreak: data.melhor_sequencia,
    totalXp: data.total_xp,
    todayAnswers: data.respostas_hoje,
    todayCorrect: data.acertos_hoje,
    plan: data.plano === "plus" ? "plus" : "free",
  };
}

export const getStudyProfileServerFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ profile: StudyProfile | null }> => {
    privateResponse();
    try {
      return { profile: await readProfile(await exigirUsuarioAutenticado()) };
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
      await getDatabase()
        .from("perfis_estudo")
        .upsert(
          {
            user_id: userId,
            meta_diaria: data.dailyGoal,
            atualizado_em: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        )
        .throwOnError();
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
      await getDatabase()
        .rpc("gm_record_activity", {
          p_user_id: userId,
          p_event_id: data.eventId,
          p_correct: data.correct,
          p_corrected: data.corrected,
        })
        .throwOnError();
      return { profile: await readProfile(userId) };
    } catch {
      return { profile: null };
    }
  });
