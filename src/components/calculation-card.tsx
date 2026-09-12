import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { useRef, useState } from "react";
import { marcarRespostaCorrigida } from "@/lib/questions/engine";
import {
  type ResultadoVerificacao,
  registrarRespostaCalculo,
} from "@/lib/questions/engine-calculo";
import type { QuestaoCalculo } from "@/lib/questions/types";

type Fase = "respondendo" | "corrigindo" | "resultado";

export function CalculationCard({
  questao,
  onProxima,
  onRegistrado,
}: {
  questao: QuestaoCalculo;
  onProxima: () => void;
  onRegistrado?: (correta: boolean) => void;
}) {
  const [input, setInput] = useState("");
  const [fase, setFase] = useState<Fase>("respondendo");
  const [resultado, setResultado] = useState<ResultadoVerificacao | null>(null);
  const [mostrarPassos, setMostrarPassos] = useState(false);
  const inicioRef = useRef(Date.now());
  const valorDigitado = Number.parseFloat(input.replace(",", "."));
  const valorValido = Number.isFinite(valorDigitado) && Math.abs(valorDigitado) <= 1_000_000_000;

  function responder() {
    if (!valorValido || fase === "resultado") return;
    const tempo = Math.max(1, Math.round((Date.now() - inicioRef.current) / 1_000));
    const verificacao = registrarRespostaCalculo(questao, valorDigitado, tempo);

    if (fase === "respondendo" && !verificacao.correta) {
      setResultado(verificacao);
      setFase("corrigindo");
      setInput("");
      return;
    }

    if (fase === "corrigindo" && verificacao.correta) marcarRespostaCorrigida(questao.id);
    setResultado(verificacao);
    setFase("resultado");
    onRegistrado?.(verificacao.correta);
  }

  return (
    <article className="ff-card overflow-hidden">
      <div className="grid md:grid-cols-[minmax(0,1fr)_13rem]">
        <div className="p-5 sm:p-7 lg:p-9">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground">
            <span>Cálculo</span>
            <span aria-hidden="true">/</span>
            <span>{questao.subassunto}</span>
          </div>
          <h2 className="reading-copy mt-5 text-xl leading-snug sm:text-2xl">
            {questao.enunciado}
          </h2>

          <dl className="mt-5 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
            {questao.dados.map((dado) => (
              <div
                key={dado.simbolo}
                className="flex justify-between gap-4 bg-card px-3 py-2 text-sm"
              >
                <dt className="font-mono font-bold text-primary">{dado.simbolo}</dt>
                <dd>{dado.valor}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 border-l-2 border-primary pl-4 font-mono text-lg font-bold text-primary">
            {questao.formula}
          </div>

          <div className="mt-7">
            <label htmlFor={`calculo-${questao.id}`} className="mb-2 block text-sm font-bold">
              Sua resposta em {questao.unidade}
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id={`calculo-${questao.id}`}
                type="text"
                inputMode="decimal"
                value={input}
                onChange={(evento) => setInput(evento.target.value.slice(0, 32))}
                onKeyDown={(evento) => {
                  if (evento.key === "Enter") responder();
                }}
                disabled={fase === "resultado"}
                placeholder="Exemplo: 9,8"
                className="ff-input max-w-xs font-mono text-lg"
              />
              <button
                type="button"
                onClick={responder}
                disabled={!valorValido || fase === "resultado"}
                className="ff-btn-primary"
              >
                {fase === "corrigindo" ? "Verificar correção" : "Verificar"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {fase === "corrigindo" && resultado && (
            <div className="mt-6 border-l-2 border-warning bg-warning/8 px-4 py-3" role="status">
              <p className="text-sm font-bold">Revise a montagem e tente novamente</p>
              <p className="reading-copy mt-1 text-sm leading-relaxed text-muted-foreground">
                {resultado.diagnostico}
              </p>
            </div>
          )}

          {fase === "resultado" && resultado && (
            <div className="mt-6 border-t border-border pt-5" aria-live="polite">
              <p className="ff-kicker">
                {resultado.correta ? "Resultado correto" : "Resultado para revisão"}
              </p>
              <p className="mt-2 text-lg font-bold">
                {questao.valorCorreto} {questao.unidade}
              </p>
              {!resultado.correta && resultado.diagnostico && (
                <p className="reading-copy mt-2 text-sm text-muted-foreground">
                  {resultado.diagnostico}
                </p>
              )}

              <button
                type="button"
                onClick={() => setMostrarPassos((aberto) => !aberto)}
                className="mt-5 flex min-h-11 w-full items-center justify-between border-y border-border py-2 text-left text-sm font-bold"
              >
                Resolução passo a passo
                {mostrarPassos ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {mostrarPassos && (
                <div className="ff-divider-list border-b border-border">
                  {questao.passos.map((passo, indice) => (
                    <div key={passo.descricao} className="grid grid-cols-[4.5rem_1fr] gap-3 py-4">
                      <span className="font-mono text-xs font-bold text-muted-foreground">
                        Passo {indice + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{passo.descricao}</p>
                        <p className="mt-1 font-mono text-sm font-bold text-primary">
                          {passo.calculo}
                        </p>
                      </div>
                    </div>
                  ))}
                  <p className="reading-copy py-4 text-sm leading-relaxed text-muted-foreground">
                    {questao.explicacaoFinal}
                  </p>
                </div>
              )}

              <button type="button" onClick={onProxima} className="ff-btn-primary mt-6">
                Próxima questão <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        <aside className="focus-optional border-t border-border bg-secondary/45 p-5 md:border-l md:border-t-0">
          <p className="ff-kicker">Estratégia</p>
          <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>1. Liste os dados.</li>
            <li>2. Isole a incógnita.</li>
            <li>3. Confira unidade e sinal.</li>
          </ol>
        </aside>
      </div>
    </article>
  );
}
