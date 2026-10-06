import { ArrowRight, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { QuizFormato, RespostaQuiz } from "@/lib/quiz/types";
import { MINIMO_ACERTOS } from "@/lib/quiz/types";

type Fase = "respondendo" | "revelado" | "concluido";

const FORMATO_LABEL: Record<string, string> = {
  texto: "aula",
  resumo: "resumo",
  visual: "diagrama",
  video: "simulação",
};

export function ContentQuiz({
  quiz,
  onAprovado,
  onFechar,
  accent = "var(--primary)",
}: {
  quiz: QuizFormato;
  onAprovado: () => void;
  onFechar: () => void;
  accent?: string;
}) {
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [fase, setFase] = useState<Fase>("respondendo");
  const [respostas, setRespostas] = useState<RespostaQuiz[]>([]);
  const [escolhida, setEscolhida] = useState<number | null>(null);
  const perguntaAtual = quiz.perguntas[indiceAtual];
  const acertos = respostas.filter((resposta) => resposta.correta).length;
  const aprovado = acertos >= MINIMO_ACERTOS;

  function escolher(indice: number) {
    if (fase !== "respondendo") return;
    setEscolhida(indice);
    setRespostas((atuais) => [
      ...atuais,
      {
        perguntaId: perguntaAtual.id,
        indiceEscolhido: indice,
        correta: indice === perguntaAtual.correta,
      },
    ]);
    setFase("revelado");
  }

  function avancar() {
    if (indiceAtual < quiz.perguntas.length - 1) {
      setIndiceAtual((valor) => valor + 1);
      setEscolhida(null);
      setFase("respondendo");
    } else {
      setFase("concluido");
    }
  }

  function reiniciar() {
    setIndiceAtual(0);
    setEscolhida(null);
    setRespostas([]);
    setFase("respondendo");
  }

  if (fase === "concluido") {
    return (
      <section className="border border-border bg-card p-5 sm:p-7" aria-live="polite">
        <p className="ff-kicker">Resultado da verificação</p>
        <h3 className="mt-2 text-2xl">
          {aprovado ? "Compreensão confirmada" : "Revise este formato"}
        </h3>
        <p className="mt-3 text-sm text-muted-foreground">
          Você acertou {acertos} de {quiz.perguntas.length}. O progresso exige pelo menos{" "}
          {MINIMO_ACERTOS} respostas corretas.
        </p>
        <div className="mt-5 grid gap-px border border-border bg-border sm:grid-cols-3">
          {respostas.map((resposta, indice) => (
            <div key={resposta.perguntaId} className="bg-card px-3 py-3 text-xs">
              <span className="text-muted-foreground">Pergunta {indice + 1}</span>
              <strong className={`ml-2 ${resposta.correta ? "text-success" : "text-destructive"}`}>
                {resposta.correta ? "Correta" : "Incorreta"}
              </strong>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {aprovado ? (
            <button type="button" onClick={onAprovado} className="ff-btn-primary">
              Registrar progresso
            </button>
          ) : (
            <button type="button" onClick={reiniciar} className="ff-btn-primary">
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Tentar novamente
            </button>
          )}
          <button type="button" onClick={onFechar} className="ff-btn-outline">
            Fechar
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="border border-border bg-card p-5 sm:p-7" aria-labelledby="quiz-question">
      <div className="flex items-center justify-between gap-4 text-xs font-semibold text-muted-foreground">
        <span>Verificação do {FORMATO_LABEL[quiz.formato] ?? quiz.formato}</span>
        <span>
          {indiceAtual + 1} de {quiz.perguntas.length}
        </span>
      </div>
      <div className="ff-progress-track mt-3">
        <div
          className="h-full"
          style={{
            width: `${((indiceAtual + (fase === "revelado" ? 1 : 0)) / quiz.perguntas.length) * 100}%`,
            background: accent,
          }}
        />
      </div>

      <h3 id="quiz-question" className="reading-copy mt-6 text-lg leading-relaxed">
        {perguntaAtual.pergunta}
      </h3>
      <div className="ff-divider-list mt-5 border-y border-border">
        {perguntaAtual.opcoes.map((opcao, indice) => {
          const correta = indice === perguntaAtual.correta;
          const selecionada = indice === escolhida;
          return (
            <button
              type="button"
              key={opcao}
              onClick={() => escolher(indice)}
              disabled={fase === "revelado"}
              className={`flex min-h-14 w-full items-start gap-3 py-3 text-left text-sm ${
                fase === "revelado" && correta
                  ? "bg-success/10"
                  : fase === "revelado" && selecionada
                    ? "bg-destructive/8"
                    : "hover:bg-secondary"
              }`}
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center border border-border-strong font-mono text-xs font-bold">
                {String.fromCharCode(65 + indice)}
              </span>
              <span className="reading-copy leading-relaxed">{opcao}</span>
            </button>
          );
        })}
      </div>

      {fase === "revelado" && (
        <div className="mt-5 border-y border-border py-4 ">
          <p className="reading-copy text-sm leading-relaxed text-muted-foreground">
            {perguntaAtual.explicacao}
          </p>
          <button type="button" onClick={avancar} className="ff-btn-primary mt-4">
            {indiceAtual < quiz.perguntas.length - 1 ? "Próxima pergunta" : "Ver resultado"}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}
