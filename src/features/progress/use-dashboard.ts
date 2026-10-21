import { useEffect, useState } from "react";
import { PROGRESS_EVENT } from "@/lib/brand";
import { montarPerfilAprendizagem, type PerfilAprendizagem } from "@/lib/profile/engine";
import type { StudyProfile } from "@/lib/profile/study-profile.server";
import { useStudyProfile } from "@/lib/profile/use-study-profile";
import { contarRevisoesPendentes } from "@/lib/questions/engine";
import {
  calcularRecompensas,
  listarMarcosReais,
  type MarcoRecompensa,
  type RecompensaResumo,
} from "@/lib/rewards/engine";

export type DashboardData = {
  perfil: PerfilAprendizagem;
  recompensas: RecompensaResumo;
  marcos: MarcoRecompensa[];
  revisoes: number;
  studyProfile: StudyProfile;
};

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const { profile } = useStudyProfile();
  useEffect(() => {
    const update = () =>
      setData({
        perfil: montarPerfilAprendizagem(),
        recompensas: calcularRecompensas(),
        marcos: listarMarcosReais(),
        revisoes: contarRevisoesPendentes(),
        studyProfile: profile ?? {
          dailyGoal: 5,
          currentStreakDays: 0,
          correctStreak: 0,
          bestCorrectStreak: 0,
          totalXp: 0,
          todayAnswers: 0,
          todayCorrect: 0,
          plan: "free",
        },
      });
    update();
    window.addEventListener(PROGRESS_EVENT, update);
    return () => window.removeEventListener(PROGRESS_EVENT, update);
  }, [profile]);
  return data;
}
