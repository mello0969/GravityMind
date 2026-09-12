import { Delete } from "lucide-react";
import { useState } from "react";
import {
  type AngleUnit,
  type BinaryOperator,
  calculateBinary,
  calculateUnary,
  formatCalculatorValue,
  type UnaryOperator,
} from "@/lib/calculator/engine";

export function ScientificCalculator() {
  const [display, setDisplay] = useState("0");
  const [stored, setStored] = useState<number | null>(null);
  const [pending, setPending] = useState<BinaryOperator | null>(null);
  const [replaceDisplay, setReplaceDisplay] = useState(true);
  const [memory, setMemory] = useState(0);
  const [unit, setUnit] = useState<AngleUnit>("deg");
  const [history, setHistory] = useState("");
  const value = Number(display);

  function show(result: number) {
    setDisplay(formatCalculatorValue(result));
    setReplaceDisplay(true);
  }

  function inputDigit(digit: string) {
    if (display === "Erro" || replaceDisplay) {
      setDisplay(digit);
      setReplaceDisplay(false);
      return;
    }
    if (display.replace(/[.-]/g, "").length < 14) setDisplay(`${display}${digit}`);
  }

  function inputDecimal() {
    if (display === "Erro" || replaceDisplay) {
      setDisplay("0.");
      setReplaceDisplay(false);
    } else if (!display.includes(".")) {
      setDisplay(`${display}.`);
    }
  }

  function chooseBinary(operator: BinaryOperator) {
    const current = Number.isFinite(value) ? value : 0;
    const nextStored =
      stored !== null && pending && !replaceDisplay
        ? calculateBinary(stored, current, pending)
        : current;
    setStored(nextStored);
    setPending(operator);
    setHistory(`${formatCalculatorValue(nextStored)} ${operator}`);
    show(nextStored);
  }

  function equals() {
    if (stored === null || !pending || !Number.isFinite(value)) return;
    const result = calculateBinary(stored, value, pending);
    setHistory(`${formatCalculatorValue(stored)} ${pending} ${formatCalculatorValue(value)} =`);
    setStored(null);
    setPending(null);
    show(result);
  }

  function unary(operator: UnaryOperator) {
    if (!Number.isFinite(value)) return;
    setHistory(`${operator}(${formatCalculatorValue(value)})`);
    show(calculateUnary(value, operator, unit));
  }

  function clear() {
    setDisplay("0");
    setStored(null);
    setPending(null);
    setHistory("");
    setReplaceDisplay(true);
  }

  return (
    <section
      className="border border-border-strong bg-[#0a1812]"
      aria-label="Calculadora científica"
    >
      <div className="border-b border-border p-5 text-right">
        <div className="flex items-center justify-between">
          <fieldset className="inline-flex border border-border">
            <legend className="sr-only">Unidade angular</legend>
            {(["deg", "rad"] as const).map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => setUnit(option)}
                aria-pressed={unit === option}
                className={`min-h-8 px-3 font-mono text-xs uppercase ${unit === option ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                {option}
              </button>
            ))}
          </fieldset>
          <span className="font-mono text-xs text-muted-foreground">
            M {formatCalculatorValue(memory)}
          </span>
        </div>
        <p className="mt-5 min-h-5 font-mono text-xs text-muted-foreground">{history}</p>
        <output
          className="mt-1 block min-h-14 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-4xl text-foreground"
          aria-label="Visor da calculadora"
        >
          {display}
        </output>
      </div>

      <div className="grid grid-cols-5 gap-px bg-border p-px">
        {["MC", "MR", "M+", "M−"].map((label) => (
          <CalcButton
            key={label}
            label={label}
            onClick={() => {
              if (label === "MC") setMemory(0);
              if (label === "MR") show(memory);
              if (label === "M+" && Number.isFinite(value)) setMemory((current) => current + value);
              if (label === "M−" && Number.isFinite(value)) setMemory((current) => current - value);
            }}
            subtle
          />
        ))}
        <CalcButton label="AC" onClick={clear} subtle />

        <CalcButton label="sin" onClick={() => unary("sin")} subtle />
        <CalcButton label="cos" onClick={() => unary("cos")} subtle />
        <CalcButton label="tan" onClick={() => unary("tan")} subtle />
        <CalcButton label="log" onClick={() => unary("log")} subtle />
        <CalcButton label="ln" onClick={() => unary("ln")} subtle />

        <CalcButton label="√x" onClick={() => unary("sqrt")} subtle />
        <CalcButton label="x²" onClick={() => unary("square")} subtle />
        <CalcButton label="xʸ" onClick={() => chooseBinary("^")} subtle />
        <CalcButton label="±" onClick={() => Number.isFinite(value) && show(-value)} subtle />
        <CalcButton label="%" onClick={() => Number.isFinite(value) && show(value / 100)} subtle />

        {["7", "8", "9"].map((digit) => (
          <CalcButton key={digit} label={digit} onClick={() => inputDigit(digit)} />
        ))}
        <CalcButton label="÷" onClick={() => chooseBinary("÷")} operator />
        <CalcButton
          label="⌫"
          ariaLabel="Apagar último dígito"
          onClick={() => {
            if (replaceDisplay || display === "Erro") return;
            setDisplay((current) => (current.length > 1 ? current.slice(0, -1) : "0"));
          }}
          icon={<Delete className="h-5 w-5" aria-hidden="true" />}
          subtle
        />

        {["4", "5", "6"].map((digit) => (
          <CalcButton key={digit} label={digit} onClick={() => inputDigit(digit)} />
        ))}
        <CalcButton label="×" onClick={() => chooseBinary("×")} operator />
        <CalcButton label="π" onClick={() => show(Math.PI)} subtle />

        {["1", "2", "3"].map((digit) => (
          <CalcButton key={digit} label={digit} onClick={() => inputDigit(digit)} />
        ))}
        <CalcButton label="−" onClick={() => chooseBinary("−")} operator />
        <CalcButton label="e" onClick={() => show(Math.E)} subtle />

        <CalcButton label="0" onClick={() => inputDigit("0")} />
        <CalcButton label="," onClick={inputDecimal} />
        <CalcButton label="=" onClick={equals} primary />
        <CalcButton label="+" onClick={() => chooseBinary("+")} operator />
        <CalcButton label="1/x" onClick={() => show(value === 0 ? Number.NaN : 1 / value)} subtle />
      </div>

      <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
        Trigonometria usa {unit === "deg" ? "graus" : "radianos"}. A memória fica nesta sessão.
      </p>
    </section>
  );
}

function CalcButton({
  label,
  ariaLabel,
  onClick,
  icon,
  subtle = false,
  operator = false,
  primary = false,
}: {
  label: string;
  ariaLabel?: string;
  onClick: () => void;
  icon?: React.ReactNode;
  subtle?: boolean;
  operator?: boolean;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel ?? label}
      onClick={onClick}
      className={`grid min-h-14 place-items-center text-base transition-colors ${
        primary
          ? "bg-primary font-semibold text-primary-foreground hover:bg-[var(--primary-hover)]"
          : operator
            ? "bg-[#183027] text-primary hover:bg-[#203c31]"
            : subtle
              ? "bg-[#10221a] text-[#b4c1ba] hover:bg-secondary"
              : "bg-[#0c1b15] text-foreground hover:bg-secondary"
      }`}
    >
      {icon ?? label}
    </button>
  );
}
