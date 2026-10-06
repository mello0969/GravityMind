// Provider credentials and requests stay in the server function.
import type { GravityContext, GravityMessage } from "@/lib/gravity/server-fn";
import { gravityServerFn } from "@/lib/gravity/server-fn";

export type { GravityContext, GravityMessage };

export class GravityError extends Error {}

export async function enviarMensagemGravity(
  historico: GravityMessage[],
  context?: GravityContext,
): Promise<string> {
  let resultado: { texto?: string; erro?: string };
  try {
    resultado = await gravityServerFn({ data: { historico, context } });
  } catch {
    throw new GravityError("Não consegui me conectar. Verifique sua internet e tente de novo.");
  }

  if (resultado.erro) {
    throw new GravityError(resultado.erro);
  }
  if (!resultado.texto) {
    throw new GravityError(
      "O Gravity não conseguiu formular uma resposta. Tente reformular sua pergunta.",
    );
  }
  return resultado.texto;
}
