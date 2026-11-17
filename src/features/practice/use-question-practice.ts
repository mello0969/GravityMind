import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth/use-auth";
import { emitProgressUpdated } from "@/lib/brand";
import { recordStudyActivityServerFn } from "@/lib/profile/study-profile.server";
import { selecionarAdaptativa } from "@/lib/questions/adaptive";
import { QUESTOES } from "@/lib/questions/bank";
import { QUESTOES_CALCULO } from "@/lib/questions/bank-calculo";
import { escolherQuestaoFixa } from "@/lib/questions/fixed";
import {
  marcarRespostaCorrigida,
  obterDicasQuestao,
  obterHistorico,
  registrarResposta,
} from "@/lib/questions/practice-service";
import type { Confianca, Etapa, Letra, PracticeMode, TipoQuestao } from "@/lib/questions/session";
import type { Questao, QuestaoCalculo, QuestionScope } from "@/lib/questions/types";
import { useSiteSettings } from "@/lib/settings/use-site-settings";

const META_POR_MINUTOS = { 5: 3, 10: 5, 15: 8 } as const;

export function useQuestionPractice({
  assunto,
  compact = false,
  initialMode = "adaptativo",
}: {
  assunto: QuestionScope;
  compact?: boolean;
  initialMode?: PracticeMode;
}) {
  const settings = useSiteSettings();
  const { usuario } = useAuth();
  const [modo, setModo] = useState<PracticeMode>(initialMode);
  const [tipo, setTipo] = useState<TipoQuestao>("multipla");
  const [questaoAtual, setQuestaoAtual] = useState<Questao | null>(null);
  const [questaoCalculo, setQuestaoCalculo] = useState<QuestaoCalculo | null>(null);
  const [respondidoIds, setRespondidoIds] = useState<string[]>([]);
  const [respondidoIdsCalculo, setRespondidoIdsCalculo] = useState<string[]>([]);
  const [calcKey, setCalcKey] = useState(0);
  const [requestIds, setRequestIds] = useState<string[]>([]);
  const adaptiveAccountId = usuario?.id;
  const [selecionada, setSelecionada] = useState<Letra | null>(null);
  const [primeiroErro, setPrimeiroErro] = useState<Letra | null>(null);
  const [confianca, setConfianca] = useState<Confianca>("media");
  const [etapa, setEtapa] = useState<Etapa>("responder");
  const [dicasUsadas, setDicasUsadas] = useState(0);
  const [dicasAtuais, setDicasAtuais] = useState<string[]>([]);
  const [quadroAberto, setQuadroAberto] = useState(false);
  const [avisoAdaptativo, setAvisoAdaptativo] = useState<string | null>(null);
  const [sessao, setSessao] = useState({ acertos: 0, total: 0, creditos: 0 });
  const [segundosSessao, setSegundosSessao] = useState(0);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successShown, setSuccessShown] = useState(false);
  const inicioQuestaoRef = useRef(Date.now());
  const inicioSessaoRef = useRef(Date.now());
  const metaSessao = META_POR_MINUTOS[settings.sessionMinutes];
  const duracaoMovimento = settings.motion === "reduced" || settings.focusMode ? 0 : 0.24;

  function carregarMultipla() {
    setRequestIds([...respondidoIds]);
  }

  function carregarCalculo() {
    setRequestIds([...respondidoIdsCalculo, ...(questaoCalculo ? [questaoCalculo.id] : [])]);
  }

  const selectionScope = `${assunto}:${modo}:${tipo}:${adaptiveAccountId ?? ""}`;
  const previousScope = useRef(selectionScope);
  useEffect(() => {
    if (previousScope.current === selectionScope) return;
    previousScope.current = selectionScope;
    setRespondidoIds([]);
    setRespondidoIdsCalculo([]);
    setRequestIds([]);
  }, [selectionScope]);

  useEffect(() => {
    // History is scoped to the active account; reselect when that account changes.
    void adaptiveAccountId;
    setQuestaoAtual(null);
    setQuestaoCalculo(null);
    setSelecionada(null);
    setPrimeiroErro(null);
    setConfianca("media");
    setEtapa("responder");
    setDicasAtuais([]);
    setAvisoAdaptativo(null);
    if (modo !== "adaptativo") {
      if (tipo === "multipla")
        setQuestaoAtual(escolherQuestaoFixa(QUESTOES, assunto, modo, requestIds));
      else {
        setQuestaoCalculo(escolherQuestaoFixa(QUESTOES_CALCULO, assunto, modo, requestIds));
        setCalcKey((current) => current + 1);
      }
    } else {
      const result = selecionarAdaptativa({
        assunto,
        tipo,
        excluirIds: requestIds,
        historico: obterHistorico(),
      });
      if (result.tipo === "multipla") setQuestaoAtual(result.questao);
      else {
        setQuestaoCalculo(result.questao);
        setCalcKey((current) => current + 1);
      }
    }
    inicioQuestaoRef.current = Date.now();
  }, [assunto, modo, tipo, requestIds, adaptiveAccountId]);

  useEffect(() => {
    const intervalo = window.setInterval(() => {
      setSegundosSessao(Math.floor((Date.now() - inicioSessaoRef.current) / 1_000));
    }, 1_000);
    return () => window.clearInterval(intervalo);
  }, []);

  useEffect(() => {
    if (
      compact ||
      successShown ||
      sessao.total < metaSessao ||
      sessao.acertos / Math.max(1, sessao.total) < 0.8
    ) {
      return;
    }
    setSuccessShown(true);
    setSuccessOpen(true);
  }, [compact, metaSessao, sessao, successShown]);

  function concluirQuestao(acertou: boolean, corrigiu: boolean) {
    if (!questaoAtual) return;
    if (modo === "adaptativo")
      setAvisoAdaptativo("Seu resultado será considerado na próxima questão.");
    setRespondidoIds((atuais) => [...atuais, questaoAtual.id]);
    setSessao((atual) => ({
      acertos: atual.acertos + (acertou ? 1 : 0),
      total: atual.total + 1,
      creditos: atual.creditos + 4 + (acertou ? 4 : 0) + (corrigiu ? 3 : 0),
    }));
    if (usuario) {
      void recordStudyActivityServerFn({
        data: {
          eventId: crypto.randomUUID(),
          correct: acertou,
          corrected: corrigiu,
        },
      })
        .then(() => emitProgressUpdated())
        .catch(() => undefined);
    }
  }

  function responder(letra: Letra) {
    if (!questaoAtual || etapa === "resultado" || letra === primeiroErro) return;
    setSelecionada(letra);
    const correta = letra === questaoAtual.correta;
    const tempoSegundos = Math.max(1, Math.round((Date.now() - inicioQuestaoRef.current) / 1_000));

    registrarResposta({
      questaoId: questaoAtual.id,
      letraEscolhida: letra,
      correta,
      tempoSegundos,
      respondidoEm: new Date().toISOString(),
      confianca: confianca === "muito-alta" ? "alta" : confianca,
    });

    if (etapa === "responder" && !correta) {
      setPrimeiroErro(letra);
      setEtapa("corrigir");
      setSelecionada(null);
      return;
    }

    const corrigiu = etapa === "corrigir" && correta;
    if (corrigiu) marcarRespostaCorrigida(questaoAtual.id);
    setEtapa("resultado");
    concluirQuestao(correta, corrigiu);
  }

  function proximaQuestao() {
    carregarMultipla();
  }

  function proximaQuestaoCalculo() {
    if (questaoCalculo) {
      setRespondidoIdsCalculo((atuais) => [...atuais, questaoCalculo.id]);
    }
    carregarCalculo();
  }

  function registrarSessaoCalculo(correta: boolean) {
    setSessao((atual) => ({
      acertos: atual.acertos + (correta ? 1 : 0),
      total: atual.total + 1,
      creditos: atual.creditos + 4 + (correta ? 4 : 0),
    }));
    if (usuario) {
      void recordStudyActivityServerFn({
        data: {
          eventId: crypto.randomUUID(),
          correct: correta,
          corrected: false,
        },
      })
        .then(() => emitProgressUpdated())
        .catch(() => undefined);
    }
  }

  function useHint() {
    if (!questaoAtual || dicasUsadas >= 2) return;
    const hints = obterDicasQuestao(questaoAtual);
    const nextHint = hints[dicasAtuais.length];
    if (!nextHint) return;
    setDicasAtuais((current) => [...current, nextHint]);
    setDicasUsadas((current) => current + 1);
  }

  const sessaoConcluida = sessao.total >= metaSessao;
  const horaDaPausa = settings.breakReminders && segundosSessao >= settings.sessionMinutes * 60;

  function reiniciarTempo() {
    inicioSessaoRef.current = Date.now();
    setSegundosSessao(0);
  }

  return {
    settings,
    modo,
    setModo,
    tipo,
    setTipo,
    questaoAtual,
    questaoCalculo,
    calcKey,
    selecionada,
    setSelecionada,
    primeiroErro,
    confianca,
    setConfianca,
    etapa,
    dicasUsadas,
    dicasAtuais,
    quadroAberto,
    setQuadroAberto,
    avisoAdaptativo,
    sessao,
    segundosSessao,
    successOpen,
    setSuccessOpen,
    metaSessao,
    duracaoMovimento,
    responder,
    proximaQuestao,
    proximaQuestaoCalculo,
    registrarSessaoCalculo,
    useHint,
    sessaoConcluida,
    horaDaPausa,
    reiniciarTempo,
  };
}
