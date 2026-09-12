import { y as registrarResposta, Q as QUESTOES_CALCULO, s as storageKey } from "./router-BiedwaEF.mjs";
const STORAGE_CALCULO_KEY = storageKey("respostas-calculo");
const MAX_HISTORICO_CALCULO = 1e3;
function respostaCalculoValida(valor) {
  if (!valor || typeof valor !== "object") return false;
  const resposta = valor;
  return typeof resposta.questaoId === "string" && resposta.questaoId.length > 0 && resposta.questaoId.length <= 96 && typeof resposta.valorDigitado === "number" && Number.isFinite(resposta.valorDigitado) && Math.abs(resposta.valorDigitado) <= 1e9 && typeof resposta.correta === "boolean" && (resposta.diagnostico === void 0 || typeof resposta.diagnostico === "string" && resposta.diagnostico.length <= 1e3) && typeof resposta.tempoSegundos === "number" && Number.isInteger(resposta.tempoSegundos) && resposta.tempoSegundos >= 0 && resposta.tempoSegundos <= 7200 && typeof resposta.respondidoEm === "string" && !Number.isNaN(Date.parse(resposta.respondidoEm));
}
function lerRespostasCalculo() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_CALCULO_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(respostaCalculoValida).slice(-MAX_HISTORICO_CALCULO) : [];
  } catch {
    return [];
  }
}
function salvarRespostasCalculo(respostas) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_CALCULO_KEY,
    JSON.stringify(respostas.slice(-MAX_HISTORICO_CALCULO))
  );
}
function obterQuestoesCalculoPorAssunto(assunto, dificuldade) {
  return QUESTOES_CALCULO.filter(
    (q) => q.assunto === assunto && (dificuldade ? q.dificuldade === dificuldade : true)
  );
}
function escolherProximaQuestaoCalculo(assunto, dificuldade, excluirIds = []) {
  const candidatas = obterQuestoesCalculoPorAssunto(assunto, dificuldade).filter(
    (q) => !excluirIds.includes(q.id)
  );
  const pool = candidatas.length > 0 ? candidatas : obterQuestoesCalculoPorAssunto(assunto, dificuldade);
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}
function verificarRespostaCalculo(questao, valorDigitado) {
  const tolerancia = questao.toleranciaPercent ?? 2;
  const margemAbsoluta = Math.abs(questao.valorCorreto) * (tolerancia / 100);
  const correta = Math.abs(valorDigitado - questao.valorCorreto) <= margemAbsoluta;
  if (correta) return { correta: true };
  const faixaEncontrada = questao.faixasErro.find(
    (f) => valorDigitado >= f.min && valorDigitado <= f.max
  );
  return {
    correta: false,
    diagnostico: faixaEncontrada?.diagnostico ?? "O valor ainda não fecha com os dados. Confira a operação usada para isolar a incógnita e a unidade final."
  };
}
function registrarRespostaCalculo(questao, valorDigitado, tempoSegundos) {
  const resultado = verificarRespostaCalculo(questao, valorDigitado);
  const respostas = lerRespostasCalculo();
  respostas.push({
    questaoId: questao.id,
    valorDigitado,
    correta: resultado.correta,
    diagnostico: resultado.diagnostico,
    tempoSegundos,
    respondidoEm: (/* @__PURE__ */ new Date()).toISOString()
  });
  salvarRespostasCalculo(respostas);
  registrarResposta({
    questaoId: questao.id,
    letraEscolhida: "CALC",
    correta: resultado.correta,
    tempoSegundos,
    respondidoEm: (/* @__PURE__ */ new Date()).toISOString()
  });
  return resultado;
}
function obterHistoricoCalculo() {
  return lerRespostasCalculo();
}
export {
  escolherProximaQuestaoCalculo as e,
  obterHistoricoCalculo as o,
  registrarRespostaCalculo as r
};
