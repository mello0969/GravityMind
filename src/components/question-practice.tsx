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
import { useEffect, useRef, useState } from "react";
import { CalculationCard } from "@/components/calculation-card";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { HighScoreDialog } from "@/components/high-score-dialog";
import { Whiteboard } from "@/components/whiteboard";
import { useAuth } from "@/lib/auth/use-auth";
import { emitProgressUpdated } from "@/lib/brand";
import { recordStudyActivityServerFn } from "@/lib/profile/study-profile.server";
import { selecionarAdaptativa } from "@/lib/questions/adaptive";
import { QUESTOES } from "@/lib/questions/bank";
import { QUESTOES_CALCULO } from "@/lib/questions/bank-calculo";
import {
  marcarRespostaCorrigida,
  obterDicasQuestao,
  obterHistorico,
  registrarResposta,
} from "@/lib/questions/engine";
import { escolherQuestaoFixa } from "@/lib/questions/fixed";
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
  const duracaoMovimento = settings.motion === "reduced" ? 0 : 0.24;

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
        <fieldset className="ff-tabs focus-optional">
          <legend className="sr-only">Formato da questão</legend>
          <button
            type="button"
            className={`ff-tab ${tipo === "multipla" ? "active" : ""}`}
            aria-pressed={tipo === "multipla"}
            onClick={() => setTipo("multipla")}
          >
            Conceitos
          </button>
          <button
            type="button"
            className={`ff-tab ${tipo === "calculo" ? "active" : ""}`}
            aria-pressed={tipo === "calculo"}
            onClick={() => setTipo("calculo")}
          >
            Cálculo aplicado
          </button>
        </fieldset>
      ) : null}
      {workspace ? (
        <div className="gm-session-progress grid gap-4 border-b border-border pb-5 sm:grid-cols-[1fr_minmax(14rem,24rem)_auto] sm:items-center">
          <p className="font-mono text-xs tracking-normal text-muted-foreground">
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
                          ? "mt-7 text-center font-[Georgia,serif] text-4xl italic text-foreground "
                          : "mt-4 border-y border-border py-4  font-mono text-lg font-bold text-primary"
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
                    <div className="gm-confidence">
                      <span className="mr-1 text-xs font-semibold text-muted-foreground">
                        Antes de responder, sua confiança:
                      </span>
                      {(["baixa", "media", "alta", "muito-alta"] as Confianca[]).map((valor) => (
                        <button
                          type="button"
                          key={valor}
                          aria-pressed={confianca === valor}
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
                        <div className="border-y border-border px-4 py-4" role="status">
                          <p className="text-base font-semibold text-foreground">
                            Tente mais uma vez
                          </p>
                          <p className="reading-copy mt-2 text-base leading-relaxed text-foreground">
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
                        <div className="border-t border-border pt-5" role="status">
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
                          <details className="mt-4 border-y border-border py-3">
                            <summary className="cursor-pointer text-sm font-semibold text-foreground">
                              Sobre esta resposta
                            </summary>
                            <p className="reading-copy mt-1 text-sm leading-relaxed text-muted-foreground">
                              {pedagogicalAnalysis({
                                confidence: confianca,
                                firstError: primeiroErro,
                                correct: selecionada === questaoAtual.correta,
                              })}
                            </p>
                          </details>
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

                <aside className="gm-practice-support" aria-label="Dicas e rascunho">
                  <div className="gm-practice-hints">
                    <h3>Dicas</h3>
                    <button
                      type="button"
                      onClick={useHint}
                      disabled={dicasUsadas >= 2 || dicasAtuais.length >= 2}
                      className="gm-hint-button"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" aria-hidden="true" />
                        Usar dica
                      </span>
                      <span className="text-sm">
                        {Math.max(0, 2 - dicasUsadas)}{" "}
                        {dicasUsadas === 1 ? "restante" : "restantes"}
                      </span>
                    </button>
                    {dicasAtuais.length > 0 && (
                      <ol className="gm-hint-list" aria-live="polite">
                        {dicasAtuais.map((hint, index) => (
                          <li key={hint}>
                            <span className="mr-2 font-semibold text-primary">{index + 1}.</span>
                            {hint}
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                  <div className="gm-practice-scratch">
                    <button
                      type="button"
                      onClick={() => setQuadroAberto((aberto) => !aberto)}
                      aria-expanded={quadroAberto}
                      aria-controls={`practice-whiteboard-${assunto}`}
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
                  </div>
                </aside>
              </div>

              {quadroAberto && (
                <div
                  id={`practice-whiteboard-${assunto}`}
                  className="border-t border-border p-3 sm:p-5"
                >
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
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reiniciar histórico de questões
      </button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Reiniciar histórico?"
        description="As respostas de questões salvas neste aparelho serão apagadas. Essa ação não pode ser desfeita."
        confirmLabel="Apagar histórico"
        destructive
        onConfirm={() => {
          onReset();
          setOpen(false);
        }}
      />
    </>
  );
}
