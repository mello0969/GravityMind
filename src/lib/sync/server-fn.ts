import { createServerFn } from "@tanstack/react-start";
import { setResponseHeaders } from "@tanstack/react-start/server";
import { exigirUsuarioAutenticado } from "@/lib/auth/session.server";
import { getD1 } from "@/lib/db/context";
import { criptografarTexto, descriptografarTexto } from "@/lib/security/crypto";
import { aplicarRateLimit } from "@/lib/security/rate-limit";
import { type FotoDadosLocaisValidada, fotoDadosLocaisSchema } from "@/lib/security/schemas";

export type FotoDadosLocais = FotoDadosLocaisValidada;

function respostaPrivada() {
  setResponseHeaders(
    new Headers({
      "cache-control": "private, no-store, max-age=0",
      vary: "Cookie",
    }),
  );
}

export const enviarParaNuvemServerFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => fotoDadosLocaisSchema.parse(input))
  .handler(async ({ data }): Promise<{ ok: boolean; erro?: string }> => {
    respostaPrivada();
    try {
      const userId = await exigirUsuarioAutenticado();
      await aplicarRateLimit("sync:upload", 12, 60_000, userId);
      const db = getD1();

      for (const nota of data.notas) {
        const [titulo, conteudo] = await Promise.all([
          criptografarTexto(nota.titulo, `${userId}:${nota.id}:titulo`),
          criptografarTexto(nota.conteudo, `${userId}:${nota.id}:conteudo`),
        ]);
        await db
          .prepare(
            `INSERT INTO notas (id, user_id, titulo, conteudo, assunto, criada_em, atualizada_em)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(id) DO UPDATE SET
               titulo = excluded.titulo,
               conteudo = excluded.conteudo,
               assunto = excluded.assunto,
               atualizada_em = excluded.atualizada_em
             WHERE notas.user_id = excluded.user_id
               AND excluded.atualizada_em > notas.atualizada_em`,
          )
          .bind(nota.id, userId, titulo, conteudo, nota.assunto, nota.criadaEm, nota.atualizadaEm)
          .run();
      }

      for (const resposta of data.respostasQuestoes) {
        await db
          .prepare(
            `INSERT INTO respostas_questoes
             (user_id, questao_id, letra_escolhida, correta, tempo_segundos, respondido_em, confianca, corrigida)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(user_id, questao_id, respondido_em)
             DO UPDATE SET
               confianca = COALESCE(excluded.confianca, respostas_questoes.confianca),
               corrigida = MAX(respostas_questoes.corrigida, excluded.corrigida)`,
          )
          .bind(
            userId,
            resposta.questaoId,
            resposta.letraEscolhida,
            resposta.correta ? 1 : 0,
            resposta.tempoSegundos,
            resposta.respondidoEm,
            resposta.confianca ?? null,
            resposta.corrigida ? 1 : 0,
          )
          .run();
      }

      for (const resposta of data.respostasCalculo) {
        await db
          .prepare(
            `INSERT OR IGNORE INTO respostas_calculo
             (user_id, questao_id, valor_digitado, correta, diagnostico, tempo_segundos, respondido_em)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
          )
          .bind(
            userId,
            resposta.questaoId,
            resposta.valorDigitado,
            resposta.correta ? 1 : 0,
            resposta.diagnostico ?? null,
            resposta.tempoSegundos,
            resposta.respondidoEm,
          )
          .run();
      }

      for (const progresso of data.progressoLicoes) {
        await db
          .prepare(
            `INSERT INTO progresso_licoes (user_id, assunto, marco, concluido_em)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(user_id, assunto, marco) DO NOTHING`,
          )
          .bind(userId, progresso.assunto, progresso.marco, progresso.concluidoEm)
          .run();
      }

      for (const dificuldade of data.dificuldadeAdaptativa) {
        await db
          .prepare(
            `INSERT INTO dificuldade_adaptativa (user_id, assunto, nivel)
             VALUES (?, ?, ?)
             ON CONFLICT(user_id, assunto)
             DO UPDATE SET nivel = excluded.nivel`,
          )
          .bind(userId, dificuldade.assunto, dificuldade.nivel)
          .run();
      }

      for (const quiz of data.quizResultados) {
        await db
          .prepare(
            `INSERT OR IGNORE INTO quiz_resultados
             (user_id, assunto, formato, acertos, total, aprovado, respondido_em)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
          )
          .bind(
            userId,
            quiz.assunto,
            quiz.formato,
            quiz.acertos,
            quiz.total,
            quiz.aprovado ? 1 : 0,
            quiz.respondidoEm,
          )
          .run();
      }

      return { ok: true };
    } catch (error) {
      console.error("Falha ao sincronizar dados", error);
      return {
        ok: false,
        erro: "Não foi possível sincronizar os dados agora.",
      };
    }
  });

export const baixarDaNuvemServerFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<FotoDadosLocais | { erro: string }> => {
    respostaPrivada();
    try {
      const userId = await exigirUsuarioAutenticado();
      await aplicarRateLimit("sync:download", 30, 60_000, userId);
      const db = getD1();

      const [notasRes, respQRes, respCRes, progRes, difRes, quizRes] = await Promise.all([
        db
          .prepare(
            `SELECT id, titulo, conteudo, assunto, criada_em, atualizada_em
             FROM notas WHERE user_id = ? ORDER BY atualizada_em DESC LIMIT 200`,
          )
          .bind(userId)
          .all(),
        db
          .prepare(
            `SELECT questao_id, letra_escolhida, correta, tempo_segundos, respondido_em, confianca, corrigida
             FROM respostas_questoes WHERE user_id = ? ORDER BY respondido_em DESC LIMIT 500`,
          )
          .bind(userId)
          .all(),
        db
          .prepare(
            `SELECT questao_id, valor_digitado, correta, diagnostico, tempo_segundos, respondido_em
             FROM respostas_calculo WHERE user_id = ? ORDER BY respondido_em DESC LIMIT 300`,
          )
          .bind(userId)
          .all(),
        db
          .prepare(
            `SELECT assunto, marco, concluido_em
             FROM progresso_licoes WHERE user_id = ? LIMIT 30`,
          )
          .bind(userId)
          .all(),
        db
          .prepare(
            `SELECT assunto, nivel
             FROM dificuldade_adaptativa WHERE user_id = ? LIMIT 3`,
          )
          .bind(userId)
          .all(),
        db
          .prepare(
            `SELECT assunto, formato, acertos, total, aprovado, respondido_em
             FROM quiz_resultados WHERE user_id = ? ORDER BY respondido_em DESC LIMIT 200`,
          )
          .bind(userId)
          .all(),
      ]);

      const notas = await Promise.all(
        notasRes.results.map(async (nota: Record<string, unknown>) => ({
          id: nota.id as string,
          titulo: await descriptografarTexto(
            nota.titulo as string,
            `${userId}:${String(nota.id)}:titulo`,
          ),
          conteudo: await descriptografarTexto(
            nota.conteudo as string,
            `${userId}:${String(nota.id)}:conteudo`,
          ),
          assunto: nota.assunto as FotoDadosLocais["notas"][number]["assunto"],
          criadaEm: nota.criada_em as string,
          atualizadaEm: nota.atualizada_em as string,
        })),
      );

      return {
        notas,
        respostasQuestoes: respQRes.results.map((resposta: Record<string, unknown>) => ({
          questaoId: resposta.questao_id as string,
          letraEscolhida:
            resposta.letra_escolhida as FotoDadosLocais["respostasQuestoes"][number]["letraEscolhida"],
          correta: resposta.correta === 1,
          tempoSegundos: resposta.tempo_segundos as number,
          respondidoEm: resposta.respondido_em as string,
          confianca: (resposta.confianca as "baixa" | "media" | "alta" | null) ?? undefined,
          corrigida: resposta.corrigida === 1,
        })),
        respostasCalculo: respCRes.results.map((resposta: Record<string, unknown>) => ({
          questaoId: resposta.questao_id as string,
          valorDigitado: resposta.valor_digitado as number,
          correta: resposta.correta === 1,
          diagnostico: (resposta.diagnostico as string | null) ?? undefined,
          tempoSegundos: resposta.tempo_segundos as number,
          respondidoEm: resposta.respondido_em as string,
        })),
        progressoLicoes: progRes.results.map((progresso: Record<string, unknown>) => ({
          assunto: progresso.assunto as FotoDadosLocais["progressoLicoes"][number]["assunto"],
          marco: progresso.marco as FotoDadosLocais["progressoLicoes"][number]["marco"],
          concluidoEm: progresso.concluido_em as string,
        })),
        dificuldadeAdaptativa: difRes.results.map((dificuldade: Record<string, unknown>) => ({
          assunto:
            dificuldade.assunto as FotoDadosLocais["dificuldadeAdaptativa"][number]["assunto"],
          nivel: dificuldade.nivel as FotoDadosLocais["dificuldadeAdaptativa"][number]["nivel"],
        })),
        quizResultados: quizRes.results.map((quiz: Record<string, unknown>) => ({
          assunto: quiz.assunto as FotoDadosLocais["quizResultados"][number]["assunto"],
          formato: quiz.formato as string,
          acertos: quiz.acertos as number,
          total: quiz.total as number,
          aprovado: quiz.aprovado === 1,
          respondidoEm: quiz.respondido_em as string,
        })),
      };
    } catch (error) {
      console.error("Falha ao carregar dados sincronizados", error);
      return { erro: "Não foi possível carregar seus dados agora." };
    }
  },
);
