import { storageKey } from "@/lib/brand";
import { type ResultadoVerificacao, verificarRespostaCalculo } from "./calculation";

import { registrarResposta } from "./practice-service";
import type { QuestaoCalculo } from "./types";

export { escolherProximaQuestaoCalculo, type ResultadoVerificacao } from "./calculation";

const STORAGE_CALCULO_KEY = () => storageKey("respostas-calculo");
const MAX_HISTORICO_CALCULO = 1_000;

export type RespostaCalculo = {
  questaoId: string;
  valorDigitado: number;
  correta: boolean;
  diagnostico?: string;
  tempoSegundos: number;
  respondidoEm: string;
};

function respostaCalculoValida(valor: unknown): valor is RespostaCalculo {
  if (!valor || typeof valor !== "object") return false;
  const resposta = valor as Partial<RespostaCalculo>;
  return (
    typeof resposta.questaoId === "string" &&
    resposta.questaoId.length > 0 &&
    resposta.questaoId.length <= 96 &&
    typeof resposta.valorDigitado === "number" &&
    Number.isFinite(resposta.valorDigitado) &&
    Math.abs(resposta.valorDigitado) <= 1_000_000_000 &&
    typeof resposta.correta === "boolean" &&
    (resposta.diagnostico === undefined ||
      (typeof resposta.diagnostico === "string" && resposta.diagnostico.length <= 1_000)) &&
    typeof resposta.tempoSegundos === "number" &&
    Number.isInteger(resposta.tempoSegundos) &&
    resposta.tempoSegundos >= 0 &&
    resposta.tempoSegundos <= 7_200 &&
    typeof resposta.respondidoEm === "string" &&
    !Number.isNaN(Date.parse(resposta.respondidoEm))
  );
}

function lerRespostasCalculo(): RespostaCalculo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_CALCULO_KEY());
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed)
      ? parsed.filter(respostaCalculoValida).slice(-MAX_HISTORICO_CALCULO)
      : [];
  } catch {
    return [];
  }
}

function salvarRespostasCalculo(respostas: RespostaCalculo[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_CALCULO_KEY(),
    JSON.stringify(respostas.slice(-MAX_HISTORICO_CALCULO)),
  );
}

// ───────────────────────── Registro ─────────────────────────

export function registrarRespostaCalculo(
  questao: QuestaoCalculo,
  valorDigitado: number,
  tempoSegundos: number,
): ResultadoVerificacao {
  const resultado = verificarRespostaCalculo(questao, valorDigitado);

  // Salva no storage próprio de cálculo
  const respostas = lerRespostasCalculo();
  respostas.push({
    questaoId: questao.id,
    valorDigitado,
    correta: resultado.correta,
    diagnostico: resultado.diagnostico,
    tempoSegundos,
    respondidoEm: new Date().toISOString(),
  });
  salvarRespostasCalculo(respostas);

  // Também registra no histórico unificado (para o dashboard/perfil contabilizar)
  registrarResposta({
    questaoId: questao.id,
    letraEscolhida: "CALC",
    correta: resultado.correta,
    tempoSegundos,
    respondidoEm: new Date().toISOString(),
  });

  return resultado;
}

export function obterHistoricoCalculo(): RespostaCalculo[] {
  return lerRespostasCalculo();
}
