export default {
  mutate: [
    "src/lib/questions/engine.ts:187-203",
    "src/lib/questions/calculation.ts",
    "src/lib/security/schemas.ts:172-176",
  ],
  testRunner: "vitest",
  reporters: ["clear-text", "progress", "html"],
  coverageAnalysis: "perTest",
  ignoreStatic: true,
  incremental: false,
  thresholds: { high: 80, low: 60, break: 55 },
  timeoutMS: 15000,
};
