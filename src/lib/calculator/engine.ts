export type AngleUnit = "deg" | "rad";
export type BinaryOperator = "+" | "−" | "×" | "÷" | "^";
export type UnaryOperator = "sin" | "cos" | "tan" | "log" | "ln" | "sqrt" | "square";

export function calculateBinary(left: number, right: number, operator: BinaryOperator) {
  if (operator === "+") return left + right;
  if (operator === "−") return left - right;
  if (operator === "×") return left * right;
  if (operator === "÷") return right === 0 ? Number.NaN : left / right;
  return left ** right;
}

export function calculateUnary(value: number, operator: UnaryOperator, unit: AngleUnit) {
  const angle = unit === "deg" ? (value * Math.PI) / 180 : value;
  if (operator === "sin") return Math.sin(angle);
  if (operator === "cos") return Math.cos(angle);
  if (operator === "tan") return Math.tan(angle);
  if (operator === "log") return value > 0 ? Math.log10(value) : Number.NaN;
  if (operator === "ln") return value > 0 ? Math.log(value) : Number.NaN;
  if (operator === "sqrt") return value >= 0 ? Math.sqrt(value) : Number.NaN;
  return value ** 2;
}

export function formatCalculatorValue(value: number) {
  if (!Number.isFinite(value)) return "Erro";
  const normalized = Number.parseFloat(value.toPrecision(12));
  if (Math.abs(normalized) >= 1e12 || (Math.abs(normalized) > 0 && Math.abs(normalized) < 1e-9)) {
    return normalized.toExponential(7);
  }
  return String(normalized);
}
