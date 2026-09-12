import {
  ArrowRight,
  Calculator,
  ChevronDown,
  ChevronUp,
  Clock3,
  Lightbulb,
  ListChecks,
  PenLine,
  RotateCcw,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CalculationCard } from "@/components/calculation-card";
import { HighScoreDialog } from "@/components/high-score-dialog";
import { Whiteboard } from "@/components/whiteboard";
import { useAuth } from "@/lib/auth/use-auth";
import { emitProgressUpdated } from "@/lib/brand";
import { recordStudyActivityServerFn } from "@/lib/profile/study-profile.server";
import {
  atualizarDificuldadeAdaptativa,
  calcularDesempenhoPorAssunto,
  escolherAssuntoAdaptativo,
  escolherProximaQuestao,
  escolherProximaQuestaoMecanica,
  marcarRespostaCorrigida,
  obterDicasQuestao,
  obterDificuldadeAtual,
  registrarResposta,
} from "@/lib/questions/engine";
import { escolherProximaQuestaoCalculo } from "@/lib/questions/engine-calculo";
import type { Dificuldade, Questao, QuestaoCalculo, QuestionScope } from "@/lib/questions/types";
import { ASSUNTO_LABEL } from "@/lib/questions/types";
import { useSiteSettings } from "@/lib/settings/use-site-settings";

const DIFICULDADE_LABEL: Record<Dificuldade, string> = {
  facil: "Fundamentos",
  medio: "Aplicação",
  dificil: "Desafio",
};

export type PracticeMode = Dificuldade | "adaptativo";
type TipoQuestao = "multipla" | "calculo";
type Confianca = "baixa" | "media" | "alta" | "muito-alta";
type Etapa = "responder" | "corrigir" | "resultado";
type Letra = "A" | "B" | "C" | "D";

const META_POR_MINUTOS = { 5: 3, 10: 5, 15: 8 } as const;

function formatarRelogio(segundos: number) {
  const minutos = Math.floor(segundos / 60)
    .toString()
    .padStart(2, "0");
  const resto = (segundos % 60).toString().padStart(2, "0");
  return `${minutos}:${resto}`;
}

function assuntoParaProxima(selecao: QuestionScope) {
  return selecao === "misto" || selecao === "mecanica" ? escolherAssuntoAdaptativo() : selecao;
}

function escolherQuestaoMultipla(
  assunto: QuestionScope,
  modo: PracticeMode,
  idsExcluidos: string[],
) {
  const assuntoEfetivo = assuntoParaProxima(assunto);
  const dificuldade = modo === "adaptativo" ? obterDificuldadeAtual(assuntoEfetivo) : modo;
  return assunto === "mecanica"
    ? escolherProximaQuestaoMecanica(dificuldade, idsExcluidos)
    : escolherProximaQuestao(assuntoEfetivo, dificuldade, idsExcluidos);
}

function escolherQuestaoCalculo(
  assunto: QuestionScope,
  modo: PracticeMode,
  idsExcluidos: string[],
) {
  const assuntoEfetivo = assuntoParaProxima(assunto);
  const dificuldade = modo === "adaptativo" ? obterDificuldadeAtual(assuntoEfetivo) : modo;
  return escolherProximaQuestaoCalculo(assuntoEfetivo, dificuldade, idsExcluidos);
}

function pedagogicalAnalysis({
  confidence,
  firstError,
  correct,
}: {
  confidence: Confianca;
  firstError: Letra | null;
  correct: boolean;
}) {
  if (firstError && correct) {
    return "Você revisou a primeira hipótese e recuperou o conceito na segunda tentativa. Esse tipo de correção conta mais do que acertar por acaso.";
  }
  if (!correct && (confidence === "alta" || confidence === "muito-alta")) {
    return "Sua confiança estava alta, mas o modelo mental não previu o resultado. Marque as forças no corpo analisado antes de escolher uma fórmula.";
  }
  if (correct && confidence === "baixa") {
    return "A resposta está correta, mas sua confiança ainda está baixa. Explique em uma frase por que as outras forças não mudam a resultante.";
  }
  if (!correct) {
    return "A dificuldade apareceu na leitura da interação. Refaça o diagrama de corpo livre e nomeie o corpo que recebe cada força.";
  }
  return "Resposta e confiança estão alinhadas. A próxima questão pode exigir o mesmo conceito em outra representação.";
}

export function QuestionPractice({
  assunto,
  compact = false,
  initialMode = "adaptativo",
  showToolbar = true,
  workspace = false,
  onModeChange,
}: {
  assunto: QuestionScope;
  compact?: boolean;
  initialMode?: PracticeMode;
  showToolbar?: boolean;
  workspace?: boolean;
  onModeChange?: (mode: PracticeMode) => void;
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
  const duracaoMovimento = settings.motion === "reduced" ? 0 : 0.24;

  function carregarMultipla() {
    const proxima = escolherQuestaoMultipla(assunto, modo, respondidoIds);
    setQuestaoAtual(proxima);
    setSelecionada(null);
    setPrimeiroErro(null);
    setConfianca("media");
    setEtapa("responder");
    setDicasAtuais([]);
    setAvisoAdaptativo(null);
    inicioQuestaoRef.current = Date.now();
  }

  function carregarCalculo() {
    const proxima = escolherQuestaoCalculo(assunto, modo, respondidoIdsCalculo);
    setQuestaoCalculo(proxima);
    setCalcKey((valor) => valor + 1);
  }

  useEffect(() => {
    setRespondidoIds([]);
    setRespondidoIdsCalculo([]);
    if (tipo === "multipla") {
      setQuestaoAtual(escolherQuestaoMultipla(assunto, modo, []));
      setSelecionada(null);
      setPrimeiroErro(null);
      setConfianca("media");
      setEtapa("responder");
      setDicasAtuais([]);
      setAvisoAdaptativo(null);
      inicioQuestaoRef.current = Date.now();
    } else {
      setQuestaoCalculo(escolherQuestaoCalculo(assunto, modo, []));
      setCalcKey((valor) => valor + 1);
    }
  }, [assunto, modo, tipo]);

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
    const resultado = atualizarDificuldadeAdaptativa(questaoAtual.assunto);
    if (modo === "adaptativo" && resultado.mudou) {
      setAvisoAdaptativo(
        resultado.nivelNovo === "dificil"
          ? "As próximas questões vão exigir mais integração entre conceitos."
          : resultado.nivelNovo === "medio"
            ? "A sequência avançou para questões de aplicação."
            : "A sequência voltou aos fundamentos para consolidar a base.",
      );
    }
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

  const desempenho = useMemo(() => {
    void sessao.total;
    const todos = calcularDesempenhoPorAssunto();
    if (assunto === "misto") {
      const total = todos.reduce((soma, item) => soma + item.totalRespostas, 0);
      const acertos = todos.reduce((soma, item) => soma + item.acertos, 0);
      return {
        totalRespostas: total,
        taxaAcerto: total ? Math.round((acertos / total) * 100) : 0,
      };
    }
    return todos.find((item) => item.assunto === assunto);
  }, [assunto, sessao.total]);

  const sessaoConcluida = sessao.total >= metaSessao;
  const horaDaPausa = settings.breakReminders && segundosSessao >= settings.sessionMinutes * 60;

  return (
    <div className="space-y-5">
      <HighScoreDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        correct={sessao.acertos}
        total={sessao.total}
        xp={sessao.creditos}
        reducedMotion={settings.motion === "reduced"}
      />
      {!compact && showToolbar && (
        <div className="focus-optional flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="ff-kicker">Formato</p>
            <fieldset className="ff-tabs mt-1">
              <legend className="sr-only">Tipo de questão</legend>
              <button
                type="button"
                onClick={() => setTipo("multipla")}
                className={`ff-tab ${tipo === "multipla" ? "active" : ""}`}
              >
                <ListChecks className="h-4 w-4" aria-hidden="true" /> Escolha conceitual
              </button>
              <button
                type="button"
                onClick={() => setTipo("calculo")}
                className={`ff-tab ${tipo === "calculo" ? "active" : ""}`}
              >
                <Calculator className="h-4 w-4" aria-hidden="true" /> Cálculo
              </button>
            </fieldset>
          </div>
          <div>
            <p className="ff-kicker">Ritmo</p>
            <fieldset className="ff-tabs mt-1">
              <legend className="sr-only">Dificuldade</legend>
              {(["facil", "medio", "dificil", "adaptativo"] as PracticeMode[]).map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => {
                    setModo(item);
                    onModeChange?.(item);
                  }}
                  className={`ff-tab ${modo === item ? "active" : ""}`}
                >
                  {item === "adaptativo" ? "Adaptativo" : DIFICULDADE_LABEL[item]}
                </button>
              ))}
            </fieldset>
          </div>
        </div>
      )}

      {workspace ? (
        <div className="grid gap-4 border-b border-border pb-5 sm:grid-cols-[1fr_minmax(14rem,24rem)_auto] sm:items-center">
          <p className="font-mono text-xs tracking-[0.17em] text-muted-foreground">
            QUESTÃO {Math.min(sessao.total + 1, metaSessao)} DE {metaSessao}
          </p>
          <div className="ff-progress-track">
            <div
              className="ff-progress-fill"
              style={{
                width: `${Math.min(100, ((sessao.total + 1) / metaSessao) * 100)}%`,
              }}
            />
          </div>
          <span className="text-sm text-muted-foreground">
            {Math.min(100, Math.round(((sessao.total + 1) / metaSessao) * 100))}%
          </span>
        </div>
      ) : (
        <div className="grid gap-3 border-y border-border py-3 text-sm sm:grid-cols-3">
          <div>
            <span className="text-muted-foreground">Sessão</span>
            <strong className="ml-2 text-foreground">
              {sessao.total}/{metaSessao}
            </strong>
          </div>
          <div>
            <span className="text-muted-foreground">Acertos</span>
            <strong className="ml-2 text-foreground">{sessao.acertos}</strong>
          </div>
          <div className="flex items-center sm:justify-end">
            {settings.showTimer && (
              <span className="mr-4 inline-flex items-center gap-1 text-muted-foreground">
                <Clock3 className="h-4 w-4" aria-hidden="true" /> {formatarRelogio(segundosSessao)}
              </span>
            )}
            <span className="text-muted-foreground">Créditos</span>
            <strong className="ml-2 text-primary">+{sessao.creditos}</strong>
          </div>
          <div className="sm:col-span-3">
            <div
              className="ff-progress-track"
              role="progressbar"
              aria-label={`${sessao.total} de ${metaSessao} questões`}
              aria-valuemin={0}
              aria-valuemax={metaSessao}
              aria-valuenow={Math.min(sessao.total, metaSessao)}
            >
              <div
                className="ff-progress-fill"
                style={{
                  width: `${Math.min(100, (sessao.total / metaSessao) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {(sessaoConcluida || horaDaPausa) && (
        <div className="border-l-2 border-accent bg-card px-4 py-3 text-sm" role="status">
          <strong>{sessaoConcluida ? "Meta curta concluída." : "Momento de pausa."}</strong>{" "}
          <span className="text-muted-foreground">
            {sessaoConcluida
              ? "Feche a sessão agora ou continue sem perder o progresso."
              : "Levante, descanse os olhos e volte quando estiver pronto."}
          </span>
        </div>
      )}

      {tipo === "calculo" ? (
        questaoCalculo ? (
          <CalculationCard
            key={calcKey}
            questao={questaoCalculo}
            onProxima={proximaQuestaoCalculo}
            onRegistrado={registrarSessaoCalculo}
          />
        ) : (
          <EmptyPractice />
        )
      ) : (
        <AnimatePresence mode="wait">
          {questaoAtual ? (
            <motion.article
              key={questaoAtual.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: duracaoMovimento }}
              className={
                workspace
                  ? "study-focus-surface overflow-hidden"
                  : "ff-card study-focus-surface overflow-hidden"
              }
            >
              <div className={workspace ? "grid" : "grid md:grid-cols-[minmax(0,1fr)_13rem]"}>
                <div className={workspace ? "p-5" : "p-5 sm:p-7 lg:p-9"}>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <span>{ASSUNTO_LABEL[questaoAtual.assunto]}</span>
                    <span aria-hidden="true">/</span>
                    <span>{questaoAtual.subassunto}</span>
                    <span aria-hidden="true">/</span>
                    <span>{DIFICULDADE_LABEL[questaoAtual.dificuldade]}</span>
                  </div>

                  <h2
                    className={`reading-copy mt-5 max-w-5xl leading-[1.18] ${
                      workspace
                        ? "font-normal text-2xl sm:text-3xl lg:text-[2.45rem]"
                        : "text-xl sm:text-2xl"
                    }`}
                  >
                    {questaoAtual.enunciado}
                  </h2>

                  {questaoAtual.formula && (
                    <div
                      className={
                        workspace
                          ? "mt-7 text-center font-[Georgia,serif] text-4xl italic text-foreground sm:text-5xl"
                          : "mt-4 border-l-2 border-primary pl-4 font-mono text-lg font-bold text-primary"
                      }
                    >
                      {questaoAtual.formula}
                    </div>
                  )}

                  <fieldset className="mt-7">
                    <legend className="sr-only">Alternativas</legend>
                    <div
                      className={
                        workspace ? "grid gap-2" : "ff-divider-list border-y border-border"
                      }
                    >
                      {questaoAtual.alternativas.map((alternativa) => {
                        const correta = alternativa.letra === questaoAtual.correta;
                        const escolhida = alternativa.letra === selecionada;
                        const erroAnterior = alternativa.letra === primeiroErro;
                        const resultadoCorreto = etapa === "resultado" && correta;
                        const resultadoErrado = etapa === "resultado" && escolhida && !correta;
                        return (
                          <button
                            type="button"
                            key={alternativa.letra}
                            onClick={() => setSelecionada(alternativa.letra)}
                            disabled={etapa === "resultado" || erroAnterior}
                            aria-pressed={escolhida}
                            className={`flex min-h-14 w-full items-center gap-4 text-left transition-colors ${
                              workspace ? "border px-5 py-3" : "px-1 py-4"
                            } ${
                              resultadoCorreto
                                ? "bg-success/10 text-foreground"
                                : resultadoErrado || erroAnterior
                                  ? "bg-destructive/8 text-muted-foreground"
                                  : escolhida
                                    ? "border-primary bg-primary/8 text-foreground"
                                    : "border-border bg-transparent text-foreground hover:bg-secondary"
                            }`}
                          >
                            <span
                              className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center border font-mono text-xs font-bold ${
                                resultadoCorreto
                                  ? "border-success bg-success text-success-foreground"
                                  : resultadoErrado || erroAnterior
                                    ? "border-destructive text-destructive"
                                    : "border-border-strong"
                              }`}
                            >
                              {alternativa.letra}
                            </span>
                            <span className="reading-copy flex-1 text-sm leading-relaxed sm:text-base">
                              {alternativa.texto}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  {etapa === "responder" && (
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <span className="mr-1 text-xs font-semibold text-muted-foreground">
                        Antes de responder, sua confiança:
                      </span>
                      {(["baixa", "media", "alta", "muito-alta"] as Confianca[]).map((valor) => (
                        <button
                          type="button"
                          key={valor}
                          onClick={() => setConfianca(valor)}
                          className={`min-h-9 border px-3 text-xs font-semibold capitalize ${
                            confianca === valor
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-transparent text-muted-foreground"
                          }`}
                        >
                          {valor === "media"
                            ? "Média"
                            : valor === "muito-alta"
                              ? "Muito alta"
                              : `${valor.charAt(0).toUpperCase()}${valor.slice(1)}`}
                        </button>
                      ))}
                    </div>
                  )}

                  {etapa !== "resultado" && (
                    <button
                      type="button"
                      onClick={() => selecionada && responder(selecionada)}
                      disabled={!selecionada}
                      className="ff-btn-primary mt-6 min-w-64"
                    >
                      {etapa === "corrigir" ? "Verificar correção" : "Verificar resposta"}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}

                  <AnimatePresence initial={false}>
                    {etapa === "corrigir" && primeiroErro && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: duracaoMovimento }}
                        className="mt-6 overflow-hidden"
                      >
                        <div className="border-l-2 border-warning bg-warning/8 px-4 py-3">
                          <p className="text-sm font-bold text-foreground">Tente mais uma vez</p>
                          <p className="reading-copy mt-1 text-sm leading-relaxed text-muted-foreground">
                            {
                              questaoAtual.alternativas.find(
                                (alternativa) => alternativa.letra === primeiroErro,
                              )?.explicacao
                            }
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {etapa === "resultado" && selecionada && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: duracaoMovimento }}
                        className="mt-6"
                      >
                        <div className="border-t border-border pt-5">
                          <p className="ff-kicker">
                            {selecionada === questaoAtual.correta
                              ? primeiroErro
                                ? "Conceito recuperado"
                                : "Resposta correta"
                              : "Revisão necessária"}
                          </p>
                          <p className="reading-copy mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                            {
                              questaoAtual.alternativas.find(
                                (alternativa) => alternativa.letra === questaoAtual.correta,
                              )?.explicacao
                            }
                          </p>
                          {avisoAdaptativo && (
                            <p className="mt-3 text-sm font-semibold text-primary">
                              {avisoAdaptativo}
                            </p>
                          )}
                          <div className="mt-4 border-y border-border py-3">
                            <p className="text-xs font-bold text-foreground">Análise pedagógica</p>
                            <p className="reading-copy mt-1 text-sm leading-relaxed text-muted-foreground">
                              {pedagogicalAnalysis({
                                confidence: confianca,
                                firstError: primeiroErro,
                                correct: selecionada === questaoAtual.correta,
                              })}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={proximaQuestao}
                            className="ff-btn-primary mt-5"
                          >
                            Próxima questão <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <aside
                  className={
                    workspace
                      ? "focus-optional grid gap-6 border-t border-border bg-secondary/25 p-5 sm:grid-cols-2"
                      : "focus-optional border-t border-border bg-secondary/45 p-5 md:border-l md:border-t-0"
                  }
                >
                  <p className="ff-kicker">Apoio</p>
                  <button
                    type="button"
                    onClick={useHint}
                    disabled={dicasUsadas >= 2 || dicasAtuais.length >= 2}
                    className="mt-3 flex min-h-11 w-full items-center justify-between gap-2 border-b border-border py-3 text-left text-sm font-semibold text-foreground disabled:cursor-not-allowed disabled:text-muted-foreground"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" aria-hidden="true" />
                      Usar dica
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {Math.max(0, 2 - dicasUsadas)} restantes
                    </span>
                  </button>
                  {dicasAtuais.length > 0 && (
                    <ol className="mt-3 grid gap-3 text-sm leading-relaxed text-muted-foreground">
                      {dicasAtuais.map((hint, index) => (
                        <li key={hint} className="border-b border-border pb-3 last:border-b-0">
                          <span className="mr-2 font-mono text-xs text-primary">{index + 1}</span>
                          {hint}
                        </li>
                      ))}
                    </ol>
                  )}

                  <button
                    type="button"
                    onClick={() => setQuadroAberto((aberto) => !aberto)}
                    className="mt-2 flex w-full items-center justify-between gap-2 border-b border-border py-3 text-left text-sm font-semibold text-foreground"
                  >
                    <span className="inline-flex items-center gap-2">
                      <PenLine className="h-4 w-4" aria-hidden="true" /> Quadro de rascunho
                    </span>
                    {quadroAberto ? (
                      <ChevronUp className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                  {desempenho && desempenho.totalRespostas > 0 && (
                    <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                      Histórico deste recorte: <strong>{desempenho.taxaAcerto}%</strong> de acerto
                      em {desempenho.totalRespostas} tentativas.
                    </p>
                  )}
                </aside>
              </div>

              {quadroAberto && (
                <div className="border-t border-border p-3 sm:p-5">
                  <Whiteboard compact />
                </div>
              )}
            </motion.article>
          ) : (
            <EmptyPractice />
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

function EmptyPractice() {
  return (
    <div className="ff-card p-8 text-center">
      <p className="text-sm text-muted-foreground">Ainda não há uma questão para este recorte.</p>
    </div>
  );
}

export function ResetHistoricoButton({ onReset }: { onReset: () => void }) {
  return (
    <button
      type="button"
      onClick={onReset}
      className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
    >
      <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reiniciar histórico de questões
    </button>
  );
}
