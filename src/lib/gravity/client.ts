/**
 * Agente IA Tutor "Gravity", Cliente
 * ----------------------------------------------------------------
 * A chamada à API da Anthropic acontece no SERVIDOR (ver server-fn.ts),
 * não direto do navegador. Isso é necessário por dois motivos: (1) a API
 * da Anthropic não permite chamadas CORS de um browser para um domínio
 * arbitrário, só funciona em ambientes com proxy próprio (como artifacts
 * dentro do claude.ai); (2) mesmo que permitisse, expor a chave de API no
 * código do cliente seria um risco de segurança grave. Esta função
 * client-side só invoca a server function, do ponto de vista de quem usa,
 * é idêntico a uma chamada de API qualquer.
 */

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
