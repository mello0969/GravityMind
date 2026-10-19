import { z } from "zod";

export const tutorMessageSchema = z
  .object({
    id: z.string().uuid(),
    role: z.enum(["user", "assistant"]),
    content: z.string().min(1).max(1500),
  })
  .strict();
export const tutorMessagesSchema = z.array(tutorMessageSchema).max(80);
export const conversationIdSchema = z.object({ id: z.string().uuid() }).strict();
export const saveConversationSchema = conversationIdSchema
  .extend({
    titulo: z.string().trim().min(1).max(100),
    pasta: z.string().trim().max(60),
    versao: z.number().int().nonnegative(),
    mensagens: tutorMessagesSchema,
  })
  .strict();
export const tutorNoteSchema = z
  .object({
    conversaId: z.string().uuid().optional(),
    pergunta: z.string().max(1500),
    resposta: z.string().min(1).max(1500),
  })
  .strict();
export type TutorEntry = z.infer<typeof tutorMessageSchema>;
export type ConversationSummary = {
  id: string;
  titulo: string;
  pasta: string;
  versao: number;
  atualizadaEm: string;
};
export type TutorConversation = ConversationSummary & { mensagens: TutorEntry[] };
export type TutorResult<T> = { value: T; error?: never } | { error: string; value?: never };
export function unwrapTutor<T>(result: TutorResult<T>): T {
  if (result.error) throw new Error(result.error);
  return result.value as T;
}
