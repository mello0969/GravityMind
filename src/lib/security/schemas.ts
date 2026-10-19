import { z } from "zod";

const assuntoSchema = z.enum(["lei-1", "lei-2", "lei-3"]);
const dataIsoSchema = z.string().datetime({ offset: true });
const idSchema = z
  .string()
  .trim()
  .min(1)
  .max(96)
  .regex(/^[A-Za-z0-9:_-]+$/);

const nomeSchema = z
  .string()
  .trim()
  .min(2, "Digite seu nome.")
  .max(80, "O nome deve ter no máximo 80 caracteres.")
  .regex(/^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u, "Use apenas letras e sinais comuns de nome.");

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Digite um e-mail válido.")
  .max(254, "O e-mail é muito longo.");

const senhaCadastroSchema = z
  .string()
  .min(10, "Use pelo menos 10 caracteres na senha.")
  .max(128, "A senha deve ter no máximo 128 caracteres.");

const protecaoFormularioSchema = {
  turnstileToken: z.string().trim().min(1).max(2048),
  website: z.string().max(0).optional().default(""),
  formularioIniciadoEm: z.number().int().positive(),
};

export const cadastroSchema = z
  .object({
    nome: nomeSchema,
    email: emailSchema,
    senha: senhaCadastroSchema,
    ...protecaoFormularioSchema,
  })
  .strict();

export const loginSchema = z
  .object({
    email: emailSchema,
    senha: z.string().min(1).max(128),
    ...protecaoFormularioSchema,
  })
  .strict();

const notaSyncSchema = z
  .object({
    id: idSchema,
    conversaId: z.string().uuid().optional(),
    titulo: z.string().trim().min(1).max(160),
    conteudo: z.string().max(40_000),
    assunto: z.enum(["geral", "lei-1", "lei-2", "lei-3"]),
    criadaEm: dataIsoSchema,
    atualizadaEm: dataIsoSchema,
  })
  .strict();

export const respostaQuestaoSchema = z
  .object({
    questaoId: idSchema,
    letraEscolhida: z.enum(["A", "B", "C", "D", "CALC"]),
    correta: z.boolean(),
    tempoSegundos: z.number().int().min(1).max(7_200),
    respondidoEm: dataIsoSchema,
    confianca: z.enum(["baixa", "media", "alta"]).optional(),
    corrigida: z.boolean().optional(),
  })
  .strict();

const respostaCalculoSchema = z
  .object({
    questaoId: idSchema,
    valorDigitado: z.number().finite().min(-1_000_000_000).max(1_000_000_000),
    correta: z.boolean(),
    diagnostico: z.string().max(1_000).optional(),
    tempoSegundos: z.number().int().min(1).max(7_200),
    respondidoEm: dataIsoSchema,
  })
  .strict();

const progressoSchema = z
  .object({
    assunto: assuntoSchema,
    marco: z.enum(["texto", "narracao", "video", "resumo", "visual", "animacao"]),
    concluidoEm: dataIsoSchema,
  })
  .strict();

const dificuldadeSchema = z
  .object({
    assunto: assuntoSchema,
    nivel: z.enum(["facil", "medio", "dificil"]),
  })
  .strict();

const quizSchema = z
  .object({
    assunto: assuntoSchema,
    formato: z.string().trim().min(1).max(32),
    acertos: z.number().int().min(0).max(100),
    total: z.number().int().min(1).max(100),
    aprovado: z.boolean(),
    respondidoEm: dataIsoSchema,
  })
  .strict()
  .refine((value) => value.acertos <= value.total, "Resultado de quiz inválido.");

export const fotoDadosLocaisSchema = z
  .object({
    notas: z.array(notaSyncSchema).max(200),
    expectedUserId: z.string().uuid().optional(),
    respostasQuestoes: z.array(respostaQuestaoSchema).max(500),
    respostasCalculo: z.array(respostaCalculoSchema).max(300),
    progressoLicoes: z.array(progressoSchema).max(30),
    dificuldadeAdaptativa: z.array(dificuldadeSchema).max(3),
    quizResultados: z.array(quizSchema).max(200),
  })
  .strict()
  .superRefine((value, context) => {
    if (JSON.stringify(value).length > 900_000) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Carga de sincronização muito grande.",
      });
    }
  });

export type FotoDadosLocaisValidada = z.infer<typeof fotoDadosLocaisSchema>;

export const gravityInputSchema = z
  .object({
    historico: z
      .array(
        z
          .object({
            role: z.enum(["user", "assistant"]),
            content: z.string().trim().min(1).max(1_500),
          })
          .strict(),
      )
      .min(1)
      .max(12)
      .refine(
        (messages) => messages.at(-1)?.role === "user",
        "A conversa deve terminar com uma pergunta do estudante.",
      ),
    context: z
      .object({
        leiAtual: z
          .object({
            numero: z.string().max(8),
            titulo: z.string().max(120),
            enunciado: z.string().max(600),
          })
          .strict()
          .optional(),
        resumoPerfil: z.string().max(1_500).optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

export function validarTempoFormulario(iniciadoEm: number) {
  const idade = Date.now() - iniciadoEm;
  return idade >= 800 && idade <= 2 * 60 * 60 * 1_000;
}
