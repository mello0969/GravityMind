import { createServerFn } from "@tanstack/react-start";
import { setResponseHeaders } from "@tanstack/react-start/server";
import { exigirUsuarioAutenticado } from "@/lib/auth/session.server";
import { getDatabase } from "@/lib/db/supabase.server";
import { criptografarTexto, descriptografarTexto } from "@/lib/security/crypto";
import { aplicarRateLimit } from "@/lib/security/rate-limit";
import { type FotoDadosLocaisValidada, fotoDadosLocaisSchema } from "@/lib/security/schemas";

export type FotoDadosLocais = FotoDadosLocaisValidada;

function respostaPrivada() {
  setResponseHeaders(
    new Headers({ "cache-control": "private, no-store, max-age=0", vary: "Cookie" }),
  );
}

// PostgreSQL returns +00:00, while local event keys use .000Z. Normalize to avoid duplicates.
function iso(value: string) {
  return new Date(value).toISOString();
}

export const enviarParaNuvemServerFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => fotoDadosLocaisSchema.parse(input))
  .handler(async ({ data }): Promise<{ ok: boolean; erro?: string }> => {
    respostaPrivada();
    try {
      const userId = await exigirUsuarioAutenticado();
      if (data.expectedUserId && data.expectedUserId !== userId)
        return { ok: false, erro: "A conta mudou. Recarregue a página antes de sincronizar." };
      await aplicarRateLimit("sync:upload", 12, 60_000, userId);
      const notas = await Promise.all(
        data.notas.map(async (nota) => ({
          ...nota,
          titulo: await criptografarTexto(nota.titulo, `${userId}:${nota.id}:titulo`),
          conteudo: await criptografarTexto(nota.conteudo, `${userId}:${nota.id}:conteudo`),
        })),
      );
      await getDatabase()
        .rpc("gm_sync", {
          p_user_id: userId,
          p_data: { ...data, notas },
        })
        .throwOnError();
      return { ok: true };
    } catch {
      return { ok: false, erro: "Não foi possível sincronizar os dados agora." };
    }
  });

export const baixarDaNuvemServerFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<FotoDadosLocais | { erro: string }> => {
    respostaPrivada();
    try {
      const userId = await exigirUsuarioAutenticado();
      await aplicarRateLimit("sync:download", 30, 60_000, userId);
      const db = getDatabase();
      const [notasRes, respQRes, respCRes, progRes, difRes, quizRes] = await Promise.all([
        db
          .from("notas")
          .select("id,titulo,conteudo,assunto,criada_em,atualizada_em")
          .eq("user_id", userId)
          .order("atualizada_em", { ascending: false })
          .limit(200)
          .throwOnError(),
        db
          .from("respostas_questoes")
          .select(
            "questao_id,letra_escolhida,correta,tempo_segundos,respondido_em,confianca,corrigida",
          )
          .eq("user_id", userId)
          .order("respondido_em", { ascending: false })
          .limit(500)
          .throwOnError(),
        db
          .from("respostas_calculo")
          .select("questao_id,valor_digitado,correta,diagnostico,tempo_segundos,respondido_em")
          .eq("user_id", userId)
          .order("respondido_em", { ascending: false })
          .limit(300)
          .throwOnError(),
        db
          .from("progresso_licoes")
          .select("assunto,marco,concluido_em")
          .eq("user_id", userId)
          .limit(30)
          .throwOnError(),
        db
          .from("dificuldade_adaptativa")
          .select("assunto,nivel")
          .eq("user_id", userId)
          .limit(3)
          .throwOnError(),
        db
          .from("quiz_resultados")
          .select("assunto,formato,acertos,total,aprovado,respondido_em")
          .eq("user_id", userId)
          .order("respondido_em", { ascending: false })
          .limit(200)
          .throwOnError(),
      ]);
      const notas = await Promise.all(
        notasRes.data.map(async (nota) => ({
          id: nota.id,
          titulo: await descriptografarTexto(nota.titulo, `${userId}:${nota.id}:titulo`),
          conteudo: await descriptografarTexto(nota.conteudo, `${userId}:${nota.id}:conteudo`),
          assunto: nota.assunto,
          criadaEm: iso(nota.criada_em),
          atualizadaEm: iso(nota.atualizada_em),
        })),
      );

      return fotoDadosLocaisSchema.parse({
        notas,
        expectedUserId: userId,
        respostasQuestoes: respQRes.data.map((resposta) => ({
          questaoId: resposta.questao_id,
          letraEscolhida: resposta.letra_escolhida,
          correta: resposta.correta === 1,
          tempoSegundos: resposta.tempo_segundos,
          respondidoEm: iso(resposta.respondido_em),
          confianca: resposta.confianca ?? undefined,
          corrigida: resposta.corrigida === 1,
        })),
        respostasCalculo: respCRes.data.map((resposta) => ({
          questaoId: resposta.questao_id,
          valorDigitado: resposta.valor_digitado,
          correta: resposta.correta === 1,
          diagnostico: resposta.diagnostico ?? undefined,
          tempoSegundos: resposta.tempo_segundos,
          respondidoEm: iso(resposta.respondido_em),
        })),
        progressoLicoes: progRes.data.map((progresso) => ({
          assunto: progresso.assunto,
          marco: progresso.marco,
          concluidoEm: iso(progresso.concluido_em),
        })),
        dificuldadeAdaptativa: difRes.data.map((dificuldade) => ({
          assunto: dificuldade.assunto,
          nivel: dificuldade.nivel,
        })),
        quizResultados: quizRes.data.map((quiz) => ({
          assunto: quiz.assunto,
          formato: quiz.formato,
          acertos: quiz.acertos,
          total: quiz.total,
          aprovado: quiz.aprovado === 1,
          respondidoEm: iso(quiz.respondido_em),
        })),
      });
    } catch {
      return { erro: "Não foi possível carregar seus dados agora." };
    }
  },
);
