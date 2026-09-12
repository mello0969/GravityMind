import { r as reactExports } from "../_libs/react.mjs";
import { d as useAuth, P as PROGRESS_EVENT, n as obterHistorico, m as montarPerfilAprendizagem, s as storageKey, h as marcosConcluidos, M as MARCOS_ATIVOS, l as listarNotas } from "./router-BiedwaEF.mjs";
import { g as getStudyProfileServerFn, u as updateDailyGoalServerFn } from "./study-profile.server-BL4XQx6e.mjs";
const ASSUNTOS = ["lei-1", "lei-2", "lei-3"];
function calcularRecompensas() {
  const respostas = obterHistorico();
  const notas = listarNotas();
  const questoesPraticadas = new Set(respostas.map((resposta) => resposta.questaoId));
  const questoesComAcerto = new Set(
    respostas.filter((resposta) => resposta.correta).map((resposta) => resposta.questaoId)
  );
  const questoesCorrigidas = new Set(
    respostas.filter((resposta) => resposta.corrigida).map((resposta) => resposta.questaoId)
  );
  const marcosAula = ASSUNTOS.reduce(
    (total, assunto) => total + marcosConcluidos(assunto).filter((marco) => MARCOS_ATIVOS.includes(marco)).length,
    0
  );
  const detalhamento = {
    pratica: questoesPraticadas.size * 4,
    acertos: questoesComAcerto.size * 4,
    correcoes: questoesCorrigidas.size * 3,
    aulas: marcosAula * 12,
    anotacoes: Math.min(notas.length, 20) * 5
  };
  const creditos = Object.values(detalhamento).reduce((total, valor) => total + valor, 0);
  const nivel = Math.floor(creditos / 100) + 1;
  const creditosNoNivel = creditos % 100;
  return {
    creditos,
    nivel,
    creditosNoNivel,
    creditosParaProximoNivel: 100 - creditosNoNivel,
    detalhamento
  };
}
function listarMarcosReais() {
  const respostas = obterHistorico();
  const assuntosPraticados = new Set(
    respostas.map((resposta) => {
      if (resposta.questaoId.includes("lei1")) return "lei-1";
      if (resposta.questaoId.includes("lei2")) return "lei-2";
      if (resposta.questaoId.includes("lei3")) return "lei-3";
      return null;
    }).filter(Boolean)
  );
  const correcoes = new Set(
    respostas.filter((resposta) => resposta.corrigida).map((resposta) => resposta.questaoId)
  ).size;
  const acertos = new Set(
    respostas.filter((resposta) => resposta.correta).map((resposta) => resposta.questaoId)
  ).size;
  const aulaCompleta = ASSUNTOS.some(
    (assunto) => marcosConcluidos(assunto).filter((marco) => MARCOS_ATIVOS.includes(marco)).length === MARCOS_ATIVOS.length
  );
  return [
    {
      id: "primeira-pratica",
      titulo: "Primeira prática",
      criterio: "Responder uma questão",
      concluido: respostas.length >= 1
    },
    {
      id: "corrigir-erro",
      titulo: "Erro transformado em revisão",
      criterio: "Corrigir uma resposta na segunda tentativa",
      concluido: correcoes >= 1
    },
    {
      id: "dez-acertos",
      titulo: "Dez acertos",
      criterio: "Acertar dez questões",
      concluido: acertos >= 10
    },
    {
      id: "tres-leis",
      titulo: "Três leis em prática",
      criterio: "Praticar as três Leis de Newton",
      concluido: assuntosPraticados.size >= 3
    },
    {
      id: "aula-completa",
      titulo: "Aula concluída",
      criterio: "Concluir os quatro formatos de uma aula",
      concluido: aulaCompleta
    },
    {
      id: "anotacao",
      titulo: "Registro próprio",
      criterio: "Criar uma anotação de estudo",
      concluido: listarNotas().length >= 1
    }
  ];
}
const LOCAL_GOAL_KEY = storageKey("daily-goal");
function localProfile() {
  const history = obterHistorico();
  const today = (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA");
  const todayAnswers = history.filter(
    (answer) => new Date(answer.respondidoEm).toLocaleDateString("en-CA") === today
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
    plan: "free"
  };
}
function useStudyProfile() {
  const { usuario, carregando: authLoading } = useAuth();
  const [profile, setProfile] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const refresh = reactExports.useCallback(async () => {
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
  reactExports.useEffect(() => {
    if (authLoading) return;
    void refresh();
    window.addEventListener(PROGRESS_EVENT, refresh);
    return () => window.removeEventListener(PROGRESS_EVENT, refresh);
  }, [authLoading, refresh]);
  const updateDailyGoal = reactExports.useCallback(
    async (dailyGoal) => {
      if (!Number.isInteger(dailyGoal) || dailyGoal < 1 || dailyGoal > 40) return;
      window.localStorage.setItem(LOCAL_GOAL_KEY, String(dailyGoal));
      setProfile(
        (current) => current ? { ...current, dailyGoal } : { ...localProfile(), dailyGoal }
      );
      if (!usuario) return;
      try {
        const result = await updateDailyGoalServerFn({ data: { dailyGoal } });
        if (result.profile) setProfile(result.profile);
      } catch {
      }
    },
    [usuario]
  );
  return { profile, loading, refresh, updateDailyGoal };
}
export {
  calcularRecompensas as c,
  listarMarcosReais as l,
  useStudyProfile as u
};
