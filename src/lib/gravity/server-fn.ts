import { createServerFn } from "@tanstack/react-start";
import { setResponseHeaders } from "@tanstack/react-start/server";
import { exigirUsuarioAutenticado } from "@/lib/auth/session.server";
import { serverEnv } from "@/lib/security/env.server";
import { aplicarRateLimit, RateLimitError } from "@/lib/security/rate-limit";
import { gravityInputSchema } from "@/lib/security/schemas";
import { requestTutor, TutorRateLimitError } from "./groq.server";

export type GravityMessage = { role: "user" | "assistant"; content: string };
export type GravityContext = {
  leiAtual?: { numero: string; titulo: string; enunciado: string };
  resumoPerfil?: string;
};
type GravityServerOutput = { texto?: string; erro?: string; retryAfter?: number };

export const gravityServerFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => gravityInputSchema.parse(input))
  .handler(async ({ data }): Promise<GravityServerOutput> => {
    setResponseHeaders(
      new Headers({ "cache-control": "private, no-store, max-age=0", vary: "Cookie" }),
    );
    try {
      const userId = await exigirUsuarioAutenticado();
      const apiKey = serverEnv("GROQ_API_KEY");
      if (!apiKey)
        return {
          erro: "O Tutor ainda não foi ativado pelo responsável pelo site. Continue estudando nas aulas e na prática.",
        };
      await aplicarRateLimit("gravity:ip", 40, 10 * 60_000);
      await aplicarRateLimit("gravity:account", 20, 10 * 60_000, userId, true);
      await aplicarRateLimit("gravity:daily", 80, 24 * 60 * 60_000, userId, true);
      await aplicarRateLimit("gravity:site", 300, 24 * 60 * 60_000, "all", true);
      const texto = await requestTutor({
        apiKey,
        model: serverEnv("GROQ_MODEL"),
        historico: data.historico,
        context: data.context,
      });
      return { texto };
    } catch (error) {
      if (error instanceof RateLimitError)
        return { erro: error.message, retryAfter: error.retryAfterSeconds };
      if (error instanceof TutorRateLimitError)
        return {
          erro: "O limite de uso do Tutor foi atingido. Tente novamente mais tarde.",
          retryAfter: error.retryAfterSeconds,
        };
      return { erro: "Não foi possível consultar o Tutor. Tente novamente em instantes." };
    }
  });
