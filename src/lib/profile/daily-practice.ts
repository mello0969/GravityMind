import type { Resposta } from "@/lib/questions/types";

const day = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" });

export function studyDay(date = new Date()) {
  return day.format(date);
}

// A correction is another attempt at the same question, not another daily goal item.
export function dailyPractice(history: Resposta[], now = new Date()) {
  const today = studyDay(now);
  const latest = new Map<string, Resposta>();
  for (const answer of history) {
    const time = Date.parse(answer.respondidoEm);
    if (!Number.isFinite(time) || studyDay(new Date(time)) !== today) continue;
    const previous = latest.get(answer.questaoId);
    if (!previous || time >= Date.parse(previous.respondidoEm))
      latest.set(answer.questaoId, answer);
  }
  return {
    todayAnswers: latest.size,
    todayCorrect: [...latest.values()].filter((answer) => answer.correta).length,
  };
}
