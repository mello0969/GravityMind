import { listarNotas } from "@/lib/notes/store";
import { MARCOS_ATIVOS, marcosConcluidos } from "@/lib/profile/lesson-progress";
import { obterHistorico } from "@/lib/questions/engine";
import type { Assunto } from "@/lib/questions/types";

const ASSUNTOS: Assunto[] = ["lei-1", "lei-2", "lei-3"];

export type RecompensaResumo = {
  creditos: number;
  nivel: number;
  creditosNoNivel: number;
  creditosParaProximoNivel: number;
  detalhamento: {
    pratica: number;
    acertos: number;
    correcoes: number;
    aulas: number;
    anotacoes: number;
  };
};

export type MarcoRecompensa = {
  id: string;
  titulo: string;
  criterio: string;
  concluido: boolean;
};

export function calcularRecompensas(): RecompensaResumo {
  const respostas = obterHistorico();
  const notas = listarNotas();
  const questoesPraticadas = new Set(respostas.map((resposta) => resposta.questaoId));
  const questoesComAcerto = new Set(
    respostas.filter((resposta) => resposta.correta).map((resposta) => resposta.questaoId),
  );
  const questoesCorrigidas = new Set(
    respostas.filter((resposta) => resposta.corrigida).map((resposta) => resposta.questaoId),
  );
  const marcosAula = ASSUNTOS.reduce(
    (total, assunto) =>
      total + marcosConcluidos(assunto).filter((marco) => MARCOS_ATIVOS.includes(marco)).length,
    0,
  );

  const detalhamento = {
    pratica: questoesPraticadas.size * 4,
    acertos: questoesComAcerto.size * 4,
    correcoes: questoesCorrigidas.size * 3,
    aulas: marcosAula * 12,
    anotacoes: Math.min(notas.length, 20) * 5,
  };
  const creditos = Object.values(detalhamento).reduce((total, valor) => total + valor, 0);
  const nivel = Math.floor(creditos / 100) + 1;
  const creditosNoNivel = creditos % 100;

  return {
    creditos,
    nivel,
    creditosNoNivel,
    creditosParaProximoNivel: 100 - creditosNoNivel,
    detalhamento,
  };
}

export function listarMarcosReais(): MarcoRecompensa[] {
  const respostas = obterHistorico();
  const assuntosPraticados = new Set(
    respostas
      .map((resposta) => {
        if (resposta.questaoId.includes("lei1")) return "lei-1";
        if (resposta.questaoId.includes("lei2")) return "lei-2";
        if (resposta.questaoId.includes("lei3")) return "lei-3";
        return null;
      })
      .filter(Boolean),
  );
  const correcoes = new Set(
    respostas.filter((resposta) => resposta.corrigida).map((resposta) => resposta.questaoId),
  ).size;
  const acertos = new Set(
    respostas.filter((resposta) => resposta.correta).map((resposta) => resposta.questaoId),
  ).size;
  const aulaCompleta = ASSUNTOS.some(
    (assunto) =>
      marcosConcluidos(assunto).filter((marco) => MARCOS_ATIVOS.includes(marco)).length ===
      MARCOS_ATIVOS.length,
  );

  return [
    {
      id: "primeira-pratica",
      titulo: "Primeira prática",
      criterio: "Responder uma questão",
      concluido: respostas.length >= 1,
    },
    {
      id: "corrigir-erro",
      titulo: "Erro transformado em revisão",
      criterio: "Corrigir uma resposta na segunda tentativa",
      concluido: correcoes >= 1,
    },
    {
      id: "dez-acertos",
      titulo: "Dez acertos",
      criterio: "Acertar dez questões",
      concluido: acertos >= 10,
    },
    {
      id: "tres-leis",
      titulo: "Três leis em prática",
      criterio: "Praticar as três Leis de Newton",
      concluido: assuntosPraticados.size >= 3,
    },
    {
      id: "aula-completa",
      titulo: "Aula concluída",
      criterio: "Concluir os quatro formatos de uma aula",
      concluido: aulaCompleta,
    },
    {
      id: "anotacao",
      titulo: "Registro próprio",
      criterio: "Criar uma anotação de estudo",
      concluido: listarNotas().length >= 1,
    },
  ];
}
