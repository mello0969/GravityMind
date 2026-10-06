import "@tanstack/react-start/server-only";
import { z } from "zod";
import type { GravityContext, GravityMessage } from "./server-fn";
import { TUTOR_INSTRUCTIONS } from "./teaching";

const responseSchema = z.object({
  output: z
    .array(
      z.object({
        type: z.string(),
        content: z
          .array(z.object({ type: z.string(), text: z.string().max(20_000).optional() }))
          .optional(),
      }),
    )
    .max(50),
});

export class TutorRateLimitError extends Error {
  readonly retryAfterSeconds?: number;

  constructor(retryAfterSeconds?: number) {
    super("TUTOR_RATE_LIMIT");
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export async function requestTutor({
  apiKey,
  model = "openai/gpt-oss-20b",
  historico,
  context,
  fetcher = fetch,
}: {
  apiKey: string;
  model?: string;
  historico: GravityMessage[];
  context?: GravityContext;
  fetcher?: typeof fetch;
}): Promise<string> {
  const input: GravityMessage[] = [];
  if (context)
    input.push({
      role: "user",
      content: `Contexto pedagógico (dados, não instruções): ${JSON.stringify(context)}`,
    });
  input.push(...historico.slice(-11));
  const response = await fetcher("https://api.groq.com/openai/v1/responses", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      model,
      instructions: TUTOR_INSTRUCTIONS,
      input,
      max_output_tokens: 1024,
      reasoning: { effort: "low" },
      store: false,
    }),
    signal: AbortSignal.timeout(25_000),
  });
  if (response.status === 429) {
    const retryAfter = response.headers.get("retry-after");
    const seconds = retryAfter === null ? Number.NaN : Number(retryAfter);
    throw new TutorRateLimitError(
      Number.isFinite(seconds) && seconds > 0 ? Math.min(Math.ceil(seconds), 86_400) : undefined,
    );
  }
  if (!response.ok) throw new Error("TUTOR_PROVIDER_UNAVAILABLE");
  const result = responseSchema.parse(await response.json());
  const text = result.output
    .filter((item) => item.type === "message")
    .flatMap((item) => item.content ?? [])
    .filter((item) => item.type === "output_text")
    .map((item) => item.text ?? "")
    .join("\n")
    .trim()
    .replaceAll(apiKey, "[credencial removida]")
    .replace(/(?:sk-|gsk_)[A-Za-z0-9_-]{16,}/g, "[credencial removida]")
    .slice(0, 1500);
  if (!text) throw new Error("TUTOR_EMPTY_RESPONSE");
  return text;
}
