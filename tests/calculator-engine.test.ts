import { describe, expect, it } from "vitest";
import { calculateBinary, calculateUnary, formatCalculatorValue } from "@/lib/calculator/engine";

describe("scientific calculator engine", () => {
  it("covers arithmetic, angle units, powers and invalid domains", () => {
    expect(calculateBinary(12, 4, "÷")).toBe(3);
    expect(calculateBinary(3, 4, "^")).toBe(81);
    expect(calculateUnary(30, "sin", "deg")).toBeCloseTo(0.5);
    expect(calculateUnary(Math.PI, "cos", "rad")).toBeCloseTo(-1);
    expect(formatCalculatorValue(calculateUnary(-1, "sqrt", "deg"))).toBe("Erro");
  });
});
