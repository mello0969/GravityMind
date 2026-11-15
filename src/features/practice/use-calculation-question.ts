import { useRef, useState } from "react";
import {
  type ResultadoVerificacao,
  registrarRespostaCalculo,
} from "@/lib/questions/engine-calculo";
import { marcarRespostaCorrigida } from "@/lib/questions/practice-service";
import type { QuestaoCalculo } from "@/lib/questions/types";

type Fase = "respondendo" | "corrigindo" | "resultado";

export function useCalculationQuestion(
  questao: QuestaoCalculo,
  onRegistrado?: (correta: boolean) => void,
) {
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

  return {
    input,
    setInput,
    fase,
    resultado,
    mostrarPassos,
    setMostrarPassos,
    valorValido,
    responder,
  };
}
