/**
 * Sincronização, Client
 * ----------------------------------------------------------------
 * Lê os dados exatamente como cada módulo já os grava em localStorage
 * (mesmas chaves, mesmos formatos) e monta a "foto" que vai para o
 * banco. Isso significa que nenhum outro arquivo do projeto precisa
 * mudar, o sync é uma camada por cima do que já existe.
 *
 * QUANDO RODA:
 * - `sincronizarAposLogin()`: chamado uma vez logo após login/cadastro
 *   bem-sucedido. Primeiro baixa o que já existe na nuvem (mescla no
 *   localStorage), depois envia o que havia localmente (útil se a
 *   pessoa já tinha usado como visitante antes de criar conta).
 */

import { emitProgressUpdated, localAccountId, storageKey } from "@/lib/brand";
import { listarNotas } from "@/lib/notes/store";
import type { Nota } from "@/lib/notes/types";
import { type MarcoLicao, marcosConcluidos } from "@/lib/profile/lesson-progress";
import { obterDificuldadeAtual, obterHistorico } from "@/lib/questions/engine";
import { obterHistoricoCalculo } from "@/lib/questions/engine-calculo";
import type { Assunto, Dificuldade, Resposta } from "@/lib/questions/types";
import { baixarDaNuvemServerFn, enviarParaNuvemServerFn, type FotoDadosLocais } from "./server-fn";

const CHAVES = () => ({
  respostas: storageKey("respostas"),
  respostasCalculo: storageKey("respostas-calculo"),
  dificuldade: storageKey("dificuldade-adaptativa"),
  progresso: storageKey("progresso-licoes"),
  notas: storageKey("notas"),
});

const ASSUNTOS: Assunto[] = ["lei-1", "lei-2", "lei-3"];

function selecionarPorOrcamento<T>(itens: T[], limiteItens: number, limiteCaracteres: number) {
  const selecionados: T[] = [];
  let caracteres = 2;
  for (const item of itens.slice(0, limiteItens)) {
    const tamanho = JSON.stringify(item).length + 1;
    if (caracteres + tamanho > limiteCaracteres) continue;
    selecionados.push(item);
    caracteres += tamanho;
  }
  return selecionados;
}

function montarFotoLocal(): FotoDadosLocais {
  const respostas = obterHistorico();
  const respostasCalculo = obterHistoricoCalculo();
  const notas = listarNotas();

  const progressoLicoes: FotoDadosLocais["progressoLicoes"] = [];
  for (const assunto of ASSUNTOS) {
    for (const marco of marcosConcluidos(assunto)) {
      // Não temos a data exata de quando cada marco foi concluído localmente
      // (o módulo original não grava isso), usamos "agora" como aproximação
      // só no envio; a leitura de volta preserva a data real do banco.
      progressoLicoes.push({
        assunto,
        marco,
        concluidoEm: new Date().toISOString(),
      });
    }
  }

  const dificuldadeAdaptativa: FotoDadosLocais["dificuldadeAdaptativa"] = ASSUNTOS.map(
    (assunto) => ({
      assunto,
      nivel: obterDificuldadeAtual(assunto),
    }),
  );

  const notasParaEnvio = notas.map((nota) => ({
    id: nota.id,
    titulo: nota.titulo,
    conteudo: nota.conteudo,
    assunto: nota.assunto,
    criadaEm: nota.criadaEm,
    atualizadaEm: nota.atualizadaEm,
  }));
  const respostasParaEnvio = [...respostas].reverse().map((resposta) => ({
    questaoId: resposta.questaoId,
    letraEscolhida: resposta.letraEscolhida,
    correta: resposta.correta,
    tempoSegundos: resposta.tempoSegundos,
    respondidoEm: resposta.respondidoEm,
    confianca: resposta.confianca,
    corrigida: resposta.corrigida,
  }));
  const calculosParaEnvio = [...respostasCalculo].reverse().map((resposta) => ({
    questaoId: resposta.questaoId,
    valorDigitado: resposta.valorDigitado,
    correta: resposta.correta,
    diagnostico: resposta.diagnostico,
    tempoSegundos: resposta.tempoSegundos,
    respondidoEm: resposta.respondidoEm,
  }));

  return {
    notas: selecionarPorOrcamento(notasParaEnvio, 200, 430_000),
    expectedUserId: localAccountId() ?? undefined,
    respostasQuestoes: selecionarPorOrcamento(respostasParaEnvio, 500, 180_000),
    respostasCalculo: selecionarPorOrcamento(calculosParaEnvio, 300, 180_000),
    progressoLicoes,
    dificuldadeAdaptativa,
    quizResultados: [], // não há armazenamento local de tentativas de quiz hoje
  };
}

function aplicarFotoNoLocal(foto: FotoDadosLocais) {
  // Notas: mescla por id, mantendo a versão com atualizadaEm mais recente
  const notasLocais = listarNotas();
  const notasPorId = new Map(notasLocais.map((n) => [n.id, n]));
  for (const n of foto.notas) {
    const local = notasPorId.get(n.id);
    if (!local || n.atualizadaEm > local.atualizadaEm) {
      notasPorId.set(n.id, {
        id: n.id,
        titulo: n.titulo,
        conteudo: n.conteudo,
        assunto: n.assunto as Nota["assunto"],
        criadaEm: n.criadaEm,
        atualizadaEm: n.atualizadaEm,
      });
    }
  }
  window.localStorage.setItem(CHAVES().notas, JSON.stringify([...notasPorId.values()]));

  // Respostas de questões: une por (questaoId + respondidoEm), sem duplicar
  const respostasLocais = obterHistorico();
  const chaveResp = (r: { questaoId: string; respondidoEm: string }) =>
    `${r.questaoId}|${r.respondidoEm}`;
  const respostasPorEvento = new Map(
    respostasLocais.map((resposta) => [chaveResp(resposta), resposta]),
  );
  for (const resposta of foto.respostasQuestoes) {
    const chave = chaveResp(resposta);
    const local = respostasPorEvento.get(chave);
    const remota: Resposta = {
      questaoId: resposta.questaoId,
      letraEscolhida: resposta.letraEscolhida,
      correta: resposta.correta,
      tempoSegundos: resposta.tempoSegundos,
      respondidoEm: resposta.respondidoEm,
      confianca: resposta.confianca,
      corrigida: resposta.corrigida,
    };
    respostasPorEvento.set(
      chave,
      local
        ? {
            ...local,
            confianca: remota.confianca ?? local.confianca,
            corrigida: Boolean(local.corrigida || remota.corrigida),
          }
        : remota,
    );
  }
  const respostasMescladas = [...respostasPorEvento.values()]
    .sort((a, b) => a.respondidoEm.localeCompare(b.respondidoEm))
    .slice(-2_000);
  window.localStorage.setItem(CHAVES().respostas, JSON.stringify(respostasMescladas));

  // Respostas de cálculo: mesma lógica
  const calculosPorEvento = new Map(
    obterHistoricoCalculo().map((resposta) => [chaveResp(resposta), resposta]),
  );
  for (const resposta of foto.respostasCalculo) {
    calculosPorEvento.set(chaveResp(resposta), resposta);
  }
  const calculosMesclados = [...calculosPorEvento.values()]
    .sort((a, b) => a.respondidoEm.localeCompare(b.respondidoEm))
    .slice(-1_000);
  window.localStorage.setItem(CHAVES().respostasCalculo, JSON.stringify(calculosMesclados));

  // Progresso de lições: união de marcos (nunca remove, só adiciona)
  const progressoLocal: Record<Assunto, MarcoLicao[]> = {
    "lei-1": marcosConcluidos("lei-1"),
    "lei-2": marcosConcluidos("lei-2"),
    "lei-3": marcosConcluidos("lei-3"),
  };
  for (const p of foto.progressoLicoes) {
    const assunto = p.assunto as Assunto;
    const marco = p.marco as MarcoLicao;
    if (!progressoLocal[assunto]) progressoLocal[assunto] = [];
    if (!progressoLocal[assunto].includes(marco)) progressoLocal[assunto].push(marco);
  }
  window.localStorage.setItem(CHAVES().progresso, JSON.stringify(progressoLocal));

  // Dificuldade adaptativa: nuvem só sobrescreve se local ainda está no padrão "facil"
  // (evita a nuvem "rebaixar" um progresso que só existe localmente ainda não sincronizado)
  const dificuldadeLocal: Record<Assunto, Dificuldade> = {
    "lei-1": obterDificuldadeAtual("lei-1"),
    "lei-2": obterDificuldadeAtual("lei-2"),
    "lei-3": obterDificuldadeAtual("lei-3"),
  };
  for (const d of foto.dificuldadeAdaptativa) {
    const assunto = d.assunto as Assunto;
    if (!dificuldadeLocal[assunto] || dificuldadeLocal[assunto] === "facil") {
      dificuldadeLocal[assunto] = d.nivel as Dificuldade;
    }
  }
  window.localStorage.setItem(CHAVES().dificuldade, JSON.stringify(dificuldadeLocal));
  emitProgressUpdated();
}

export type ResultadoSync = { ok: boolean; mensagem: string };

/** Roda uma vez após login/cadastro: baixa o que já existe na nuvem e envia o que havia localmente. */
export async function sincronizarAposLogin(): Promise<ResultadoSync> {
  if (typeof window === "undefined") return { ok: false, mensagem: "Ambiente sem navegador." };
  const owner = localAccountId();
  if (!owner) return { ok: false, mensagem: "Entre na conta para sincronizar." };
  try {
    const daNuvem = await baixarDaNuvemServerFn();
    if ("erro" in daNuvem) return { ok: false, mensagem: daNuvem.erro };
    if (daNuvem.expectedUserId !== owner || localAccountId() !== owner)
      return { ok: false, mensagem: "A conta mudou. Recarregue a página." };
    aplicarFotoNoLocal(daNuvem);

    const foto = montarFotoLocal();
    const envio = await enviarParaNuvemServerFn({ data: foto });
    if (!envio.ok) return { ok: false, mensagem: envio.erro ?? "Falha ao sincronizar." };

    return { ok: true, mensagem: "Dados sincronizados com sucesso." };
  } catch {
    return { ok: false, mensagem: "Não foi possível sincronizar agora." };
  }
}
