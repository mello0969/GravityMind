export default {
  mutate: [
    "src/lib/questions/engine.ts:302-351",
    "src/lib/questions/engine-calculo.ts:108-162",
    "src/lib/security/schemas.ts:166-169",
  ],
  testRunner: "vitest",
  reporters: ["clear-text", "progress", "html"],
  coverageAnalysis: "perTest",
  ignoreStatic: true,
  incremental: true,
  thresholds: { high: 80, low: 60, break: 55 },
  timeoutMS: 15000,
};
