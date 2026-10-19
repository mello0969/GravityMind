import { createServerFn } from "@tanstack/react-start";
import { setResponseHeaders } from "@tanstack/react-start/server";
import { z } from "zod";
import { exigirUsuarioAutenticado } from "@/lib/auth/session.server";
import { getDatabase } from "@/lib/db/supabase.server";
import type { Nota } from "@/lib/notes/types";
import { criptografarTexto, descriptografarTexto } from "@/lib/security/crypto";
import { aplicarRateLimit, RateLimitError } from "@/lib/security/rate-limit";
import {
  type ConversationSummary,
  conversationIdSchema,
  saveConversationSchema,
  type TutorConversation,
  type TutorResult,
  tutorMessagesSchema,
  tutorNoteSchema,
} from "./conversations";

class ConversationError extends Error {}
async function withUser<T>(action: (userId: string) => Promise<T>): Promise<TutorResult<T>> {
  setResponseHeaders(new Headers({ "cache-control": "private, no-store", vary: "Cookie" }));
  try {
    const userId = await exigirUsuarioAutenticado();
    await aplicarRateLimit("tutor:library", 90, 60_000, userId, true);
    return { value: await action(userId) };
  } catch (error) {
    return {
      error:
        error instanceof ConversationError || error instanceof RateLimitError
          ? error.message
          : "Não foi possível salvar ou abrir a conversa. Tente novamente.",
    };
  }
}
const aad = (userId: string, id: string, field: string) => `${userId}:${id}:${field}`;
type StoredSummary = {
  id: string;
  titulo: string;
  pasta: string;
  versao: number;
  atualizada_em: string;
};
async function summary(row: StoredSummary, userId: string): Promise<ConversationSummary> {
  return {
    id: row.id,
    titulo: await descriptografarTexto(row.titulo, aad(userId, row.id, "titulo")),
    pasta: await descriptografarTexto(row.pasta, aad(userId, row.id, "pasta")),
    versao: row.versao,
    atualizadaEm: row.atualizada_em,
  };
}
const metadata = "id,titulo,pasta,versao,atualizada_em";

export const listTutorConversations = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({}).strict().parse(data))
  .handler(() =>
    withUser(async (userId) => {
      const { data, error } = await getDatabase()
        .from("tutor_conversas")
        .select(metadata)
        .eq("user_id", userId)
        .order("atualizada_em", { ascending: false })
        .limit(200);
      if (error) throw error;
      const rows: ConversationSummary[] = [];
      for (const row of data) rows.push(await summary(row, userId));
      return rows;
    }),
  );

export const createTutorConversation = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({}).strict().parse(data))
  .handler(() =>
    withUser(async (userId): Promise<TutorConversation> => {
      await aplicarRateLimit("tutor:create", 10, 60_000, userId, true);
      const db = getDatabase();
      const { count, error: countError } = await db
        .from("tutor_conversas")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);
      if (countError) throw countError;
      if ((count ?? 0) >= 200)
        throw new ConversationError("Você chegou a 200 conversas. Exclua uma para criar outra.");
      const id = crypto.randomUUID();
      const { data, error } = await db
        .from("tutor_conversas")
        .insert({
          id,
          user_id: userId,
          titulo: await criptografarTexto("Nova conversa", aad(userId, id, "titulo")),
          pasta: await criptografarTexto("", aad(userId, id, "pasta")),
          mensagens: await criptografarTexto("[]", aad(userId, id, "mensagens")),
        })
        .select(metadata)
        .single();
      if (error) throw error;
      return { ...(await summary(data, userId)), mensagens: [] };
    }),
  );

export const readTutorConversation = createServerFn({ method: "POST" })
  .validator((data: unknown) => conversationIdSchema.parse(data))
  .handler(({ data: input }) =>
    withUser(async (userId): Promise<TutorConversation> => {
      const { data, error } = await getDatabase()
        .from("tutor_conversas")
        .select(`${metadata},mensagens`)
        .eq("id", input.id)
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new ConversationError("Conversa não encontrada.");
      return {
        ...(await summary(data, userId)),
        mensagens: tutorMessagesSchema.parse(
          JSON.parse(await descriptografarTexto(data.mensagens, aad(userId, data.id, "mensagens"))),
        ),
      };
    }),
  );

export const saveTutorConversation = createServerFn({ method: "POST" })
  .validator((data: unknown) => saveConversationSchema.parse(data))
  .handler(({ data: input }) =>
    withUser(async (userId): Promise<TutorConversation> => {
      const { data, error } = await getDatabase()
        .from("tutor_conversas")
        .update({
          titulo: await criptografarTexto(input.titulo, aad(userId, input.id, "titulo")),
          pasta: await criptografarTexto(input.pasta, aad(userId, input.id, "pasta")),
          mensagens: await criptografarTexto(
            JSON.stringify(input.mensagens),
            aad(userId, input.id, "mensagens"),
          ),
          versao: input.versao + 1,
          atualizada_em: new Date().toISOString(),
        })
        .eq("id", input.id)
        .eq("user_id", userId)
        .eq("versao", input.versao)
        .select(metadata)
        .maybeSingle();
      if (error) throw error;
      if (!data)
        throw new ConversationError(
          "A conversa mudou em outra aba. Reabra a conversa antes de continuar.",
        );
      return { ...(await summary(data, userId)), mensagens: input.mensagens };
    }),
  );

export const deleteTutorConversation = createServerFn({ method: "POST" })
  .validator((data: unknown) => conversationIdSchema.parse(data))
  .handler(({ data: input }) =>
    withUser(async (userId) => {
      const { error } = await getDatabase()
        .from("tutor_conversas")
        .delete()
        .eq("id", input.id)
        .eq("user_id", userId);
      if (error) throw error;
      return true;
    }),
  );

export const saveTutorNote = createServerFn({ method: "POST" })
  .validator((data: unknown) => tutorNoteSchema.parse(data))
  .handler(({ data: input }) =>
    withUser(async (userId): Promise<Nota> => {
      const db = getDatabase();
      if (input.conversaId) {
        const { data, error } = await db
          .from("tutor_conversas")
          .select("id")
          .eq("id", input.conversaId)
          .eq("user_id", userId)
          .maybeSingle();
        if (error) throw error;
        if (!data) throw new ConversationError("Conversa não encontrada.");
      }
      const note: Nota = {
        id: `nota-${crypto.randomUUID()}`,
        titulo: (input.pergunta || "Resposta do Tutor").slice(0, 160),
        conteudo: `${input.pergunta ? `${input.pergunta}\n\n` : ""}${input.resposta}`,
        assunto: "geral",
        conversaId: input.conversaId,
        criadaEm: new Date().toISOString(),
        atualizadaEm: new Date().toISOString(),
      };
      const { error } = await db.from("notas").insert({
        id: note.id,
        user_id: userId,
        assunto: note.assunto,
        titulo: await criptografarTexto(note.titulo, aad(userId, note.id, "titulo")),
        conteudo: await criptografarTexto(note.conteudo, aad(userId, note.id, "conteudo")),
        criada_em: note.criadaEm,
        atualizada_em: note.atualizadaEm,
        tutor_conversa_id: input.conversaId ?? null,
      });
      if (error) throw error;
      return note;
    }),
  );
