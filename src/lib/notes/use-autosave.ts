import { useEffect, useRef, useState } from "react";

export type AutosaveStatus = "ocioso" | "digitando" | "salvando" | "salvo";

/**
 * Dispara `onSave` `delayMs` depois da última mudança em `value`.
 * Expõe um status simples para a UI mostrar "salvando…" / "salvo".
 *
 * IMPORTANTE: `value` é frequentemente um objeto literal recriado a cada
 * render (ex: `{ titulo, conteudo }`), então não podemos depender dele por
 * referência, isso disparava o efeito em TODO render, mesmo sem mudança
 * real, e travava o status em "digitando" mais tempo do que deveria.
 * Em vez disso, comparamos uma versão serializada (JSON) do valor e só
 * reagimos quando o conteúdo de fato muda.
 */
export function useAutosave<T>(value: T, onSave: (value: T) => void, delayMs = 800) {
  const [status, setStatus] = useState<AutosaveStatus>("ocioso");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const primeiraRenderRef = useRef(true);
  const valorSerializado = JSON.stringify(value);
  const ultimoValorRef = useRef(valorSerializado);
  const valueRef = useRef(value);
  const onSaveRef = useRef(onSave);
  valueRef.current = value;
  onSaveRef.current = onSave;

  useEffect(() => {
    if (primeiraRenderRef.current) {
      primeiraRenderRef.current = false;
      ultimoValorRef.current = valorSerializado;
      return;
    }

    // Sem mudança real de conteúdo (só um re-render qualquer): não reinicia o timer.
    if (valorSerializado === ultimoValorRef.current) return;
    ultimoValorRef.current = valorSerializado;

    setStatus("digitando");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setStatus("salvando");
      onSaveRef.current(valueRef.current);
      statusTimeoutRef.current = setTimeout(() => setStatus("salvo"), 250);
    }, delayMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    };
  }, [delayMs, valorSerializado]);

  return status;
}
