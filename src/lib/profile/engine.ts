/**
 * Perfil de Aprendizagem, Motor
 * ----------------------------------------------------------------
 * Consolida dados já coletados pelos outros módulos (questões,
 * anotações, progresso de lições) em uma visão única: pontos fortes,
 * pontos fracos, streak de estudo, tempo total e recomendações.
 *
 * STREAK DE DIAS ESTUDADOS:
 * Um "dia estudado" é qualquer dia em que houve pelo menos 1 resposta
 * de questão OU 1 marco de lição concluído. Calculamos a sequência
 * atual andando de hoje para trás até encontrar um dia sem atividade.
 *
 * RECOMENDAÇÕES INTELIGENTES:
 * Regra simples e auditável (nada de caixa-preta): primeiro recomenda
 * revisar o assunto com pior desempenho (<50% de acerto, min. 3 respostas);
 * se não houver nenhum, recomenda continuar a lição menos avançada;
 * se tudo estiver com bom desempenho e lições completas, recomenda
 * avançar para questões de nível mais difícil.
 */

import { listarNotas } from "@/lib/notes/store";
import { todasLicoes } from "@/lib/profile/lesson-progress";
import {
  calcularDesempenhoPorAssunto,
  identificarPontosFortesEFracos,
  obterHistorico,
} from "@/lib/questions/engine";
import type { Assunto, Resposta } from "@/lib/questions/types";
import { ASSUNTO_LABEL } from "@/lib/questions/types";

// ───────────────────────── Tempo de estudo ─────────────────────────

function tempoTotalEstudoSegundos(): number {
  return obterHistorico().reduce((soma, r) => soma + r.tempoSegundos, 0);
}

export function formatarDuracao(segundos: number): string {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.round((segundos % 3600) / 60);
  if (horas === 0 && minutos === 0) return "0min";
  if (horas === 0) return `${minutos}min`;
  return `${horas}h ${minutos}min`;
}

// ───────────────────────── Streak de dias estudados ─────────────────────────

function diaISO(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function diasComAtividade(): Set<string> {
  const dias = new Set<string>();
  for (const r of obterHistorico()) {
    dias.add(diaISO(new Date(r.respondidoEm)));
  }
  // Marcos de lição não têm timestamp próprio hoje (lesson-progress.ts não grava data);
  // por isso o streak considera apenas respostas de questões, que é o dado com data confiável.
  return dias;
}

function calcularStreak(): { atual: number; recorde: number } {
  const dias = diasComAtividade();
  if (dias.size === 0) return { atual: 0, recorde: 0 };

  // Streak atual: anda de hoje para trás.
  let atual = 0;
  const cursor = new Date();
  // Se hoje ainda não tem atividade, não quebra o streak, começa a contar de ontem.
  if (!dias.has(diaISO(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (dias.has(diaISO(cursor))) {
    atual += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  // Recorde: maior sequência de dias consecutivos em todo o histórico.
  const ordenados = Array.from(dias).sort();
  let recorde = 0;
  let sequenciaAtual = 0;
  let anterior: Date | null = null;
  for (const diaStr of ordenados) {
    const dia = new Date(`${diaStr}T12:00:00`);
    if (anterior) {
      const diffDias = Math.round((dia.getTime() - anterior.getTime()) / 86_400_000);
      sequenciaAtual = diffDias === 1 ? sequenciaAtual + 1 : 1;
    } else {
      sequenciaAtual = 1;
    }
    recorde = Math.max(recorde, sequenciaAtual);
    anterior = dia;
  }

  return { atual, recorde: Math.max(recorde, atual) };
}

// ───────────────────────── Atividade dos últimos 7 dias (para o gráfico) ─────────────────────────

type AtividadeDia = {
  label: string;
  data: string;
  respostas: number;
  acertos: number;
};

function atividadeUltimos7Dias(): AtividadeDia[] {
  const historico = obterHistorico();
  const porDia = new Map<string, Resposta[]>();
  for (const r of historico) {
    const dia = diaISO(new Date(r.respondidoEm));
    const lista = porDia.get(dia) ?? [];
    lista.push(r);
    porDia.set(dia, lista);
  }

  const labels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const resultado: AtividadeDia[] = [];
  for (let i = 6; i >= 0; i--) {
    const data = new Date();
    data.setDate(data.getDate() - i);
    const diaStr = diaISO(data);
    const respostasDoDia = porDia.get(diaStr) ?? [];
    resultado.push({
      label: labels[data.getDay()],
      data: diaStr,
      respostas: respostasDoDia.length,
      acertos: respostasDoDia.filter((r) => r.correta).length,
    });
  }
  return resultado;
}

// ───────────────────────── Perfil consolidado ─────────────────────────

type Recomendacao = {
  tipo: "revisar" | "continuar-licao" | "avancar-dificuldade" | "comecar";
  assunto: Assunto;
  motivo: string;
  to: string;
};

function gerarRecomendacao(): Recomendacao {
  const { precisamRevisao } = identificarPontosFortesEFracos();
  const licoes = todasLicoes();

  // 1. Prioridade máxima: reforçar o que está fraco.
  if (precisamRevisao.length > 0) {
    const pior = [...precisamRevisao].sort((a, b) => a.taxaAcerto - b.taxaAcerto)[0];
    return {
      tipo: "revisar",
      assunto: pior.assunto,
      motivo: `Sua taxa de acerto em ${ASSUNTO_LABEL[pior.assunto]} está em ${pior.taxaAcerto}%. Vale revisar antes de seguir.`,
      to: "/questoes",
    };
  }

  // 2. Continuar a lição menos avançada, se houver alguma incompleta.
  const licaoIncompleta = [...licoes].sort((a, b) => a.percentual - b.percentual)[0];
  if (licaoIncompleta && licaoIncompleta.percentual < 100) {
    return {
      tipo: "continuar-licao",
      assunto: licaoIncompleta.assunto,
      motivo: `Você está com ${licaoIncompleta.percentual}% da lição de ${ASSUNTO_LABEL[licaoIncompleta.assunto]}. Continue de onde parou.`,
      to: `/${licaoIncompleta.assunto}`,
    };
  }

  // 3. Tudo completo e sem pontos fracos: sugerir avançar a dificuldade.
  const desempenho = calcularDesempenhoPorAssunto();
  const semHistorico = desempenho.every((d) => d.totalRespostas === 0);
  if (semHistorico) {
    return {
      tipo: "comecar",
      assunto: "lei-1",
      motivo: "Você ainda não praticou nenhuma questão. Que tal começar pela 1ª Lei?",
      to: "/questoes",
    };
  }

  const melhor = [...desempenho].sort((a, b) => b.taxaAcerto - a.taxaAcerto)[0];
  return {
    tipo: "avancar-dificuldade",
    assunto: melhor.assunto,
    motivo: `Seu desempenho em ${ASSUNTO_LABEL[melhor.assunto]} está ótimo (${melhor.taxaAcerto}%). Hora de subir o nível.`,
    to: "/questoes",
  };
}

export type PerfilAprendizagem = {
  streak: { atual: number; recorde: number };
  tempoTotalSegundos: number;
  totalRespostas: number;
  totalNotas: number;
  progressoGeralLicoes: number; // 0-100, média das 3 leis
  licoes: ReturnType<typeof todasLicoes>;
  dominados: ReturnType<typeof identificarPontosFortesEFracos>["dominados"];
  precisamRevisao: ReturnType<typeof identificarPontosFortesEFracos>["precisamRevisao"];
  desempenho: ReturnType<typeof identificarPontosFortesEFracos>["desempenho"];
  recomendacao: Recomendacao;
  atividade7Dias: AtividadeDia[];
};

export function montarPerfilAprendizagem(): PerfilAprendizagem {
  const { dominados, precisamRevisao, desempenho } = identificarPontosFortesEFracos();
  const licoes = todasLicoes();
  const progressoGeralLicoes = Math.round(
    licoes.reduce((soma, l) => soma + l.percentual, 0) / licoes.length,
  );

  return {
    streak: calcularStreak(),
    tempoTotalSegundos: tempoTotalEstudoSegundos(),
    totalRespostas: obterHistorico().length,
    totalNotas: listarNotas().length,
    progressoGeralLicoes,
    licoes,
    dominados,
    precisamRevisao,
    desempenho,
    recomendacao: gerarRecomendacao(),
    atividade7Dias: atividadeUltimos7Dias(),
  };
}
