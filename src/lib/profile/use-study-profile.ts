import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/use-auth";
import { PROGRESS_EVENT, storageKey } from "@/lib/brand";
import { montarPerfilAprendizagem } from "@/lib/profile/engine";
import {
  getStudyProfileServerFn,
  type StudyProfile,
  updateDailyGoalServerFn,
} from "@/lib/profile/study-profile.server";
import { obterHistorico } from "@/lib/questions/engine";
import { calcularRecompensas } from "@/lib/rewards/engine";

const LOCAL_GOAL_KEY = storageKey("daily-goal");

function localProfile(): StudyProfile {
  const history = obterHistorico();
  const today = new Date().toLocaleDateString("en-CA");
  const todayAnswers = history.filter(
    (answer) => new Date(answer.respondidoEm).toLocaleDateString("en-CA") === today,
  );
  let correctStreak = 0;
  for (const answer of [...history].reverse()) {
    if (!answer.correta) break;
    correctStreak += 1;
  }
  const dailyGoal = Number(window.localStorage.getItem(LOCAL_GOAL_KEY) ?? 5);
  return {
    dailyGoal: Number.isInteger(dailyGoal) && dailyGoal >= 1 && dailyGoal <= 40 ? dailyGoal : 5,
    currentStreakDays: montarPerfilAprendizagem().streak.atual,
    correctStreak,
    bestCorrectStreak: correctStreak,
    totalXp: calcularRecompensas().creditos,
    todayAnswers: todayAnswers.length,
    todayCorrect: todayAnswers.filter((answer) => answer.correta).length,
    plan: "free",
  };
}

export function useStudyProfile() {
  const { usuario, carregando: authLoading } = useAuth();
  const [profile, setProfile] = useState<StudyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (typeof window === "undefined") return;
    setLoading(true);
    const fallback = localProfile();
    if (!usuario) {
      setProfile(fallback);
      setLoading(false);
      return;
    }
    try {
      const result = await getStudyProfileServerFn();
      setProfile(result.profile ?? fallback);
    } catch {
      setProfile(fallback);
    } finally {
      setLoading(false);
    }
  }, [usuario]);

  useEffect(() => {
    if (authLoading) return;
    void refresh();
    window.addEventListener(PROGRESS_EVENT, refresh);
    return () => window.removeEventListener(PROGRESS_EVENT, refresh);
  }, [authLoading, refresh]);

  const updateDailyGoal = useCallback(
    async (dailyGoal: number) => {
      if (!Number.isInteger(dailyGoal) || dailyGoal < 1 || dailyGoal > 40) return;
      window.localStorage.setItem(LOCAL_GOAL_KEY, String(dailyGoal));
      setProfile((current) =>
        current ? { ...current, dailyGoal } : { ...localProfile(), dailyGoal },
      );
      if (!usuario) return;
      try {
        const result = await updateDailyGoalServerFn({ data: { dailyGoal } });
        if (result.profile) setProfile(result.profile);
      } catch {
        // The local goal remains usable until cloud sync is available again.
      }
    },
    [usuario],
  );

  return { profile, loading, refresh, updateDailyGoal };
}
