import { d as getRequest } from "./server-DwUI_Cux.mjs";
import { o as objectType, s as stringType, n as numberType, a as arrayType, e as enumType, b as booleanType, Z as ZodIssueCode } from "../_libs/zod.mjs";
function getD1() {
  const request = getRequest();
  const db = request.runtime?.cloudflare?.env?.DB;
  if (!db) {
    throw new Error(
      "Banco de dados (D1) não disponível. Confira se o binding 'DB' está configurado no wrangler.jsonc e se o deploy foi feito via `wrangler deploy` (não `vite dev`)."
    );
  }
  return db;
}
const assuntoSchema = enumType(["lei-1", "lei-2", "lei-3"]);
const dataIsoSchema = stringType().datetime({ offset: true });
const idSchema = stringType().trim().min(1).max(96).regex(/^[A-Za-z0-9:_-]+$/);
const nomeSchema = stringType().trim().min(2, "Digite seu nome.").max(80, "O nome deve ter no máximo 80 caracteres.").regex(/^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u, "Use apenas letras e sinais comuns de nome.");
const emailSchema = stringType().trim().toLowerCase().email("Digite um e-mail válido.").max(254, "O e-mail é muito longo.");
const senhaCadastroSchema = stringType().min(10, "Use pelo menos 10 caracteres na senha.").max(128, "A senha deve ter no máximo 128 caracteres.");
const protecaoFormularioSchema = {
  turnstileToken: stringType().trim().min(1).max(2048),
  website: stringType().max(0).optional().default(""),
  formularioIniciadoEm: numberType().int().positive()
};
const cadastroSchema = objectType({
  nome: nomeSchema,
  email: emailSchema,
  senha: senhaCadastroSchema,
  ...protecaoFormularioSchema
}).strict();
const loginSchema = objectType({
  email: emailSchema,
  senha: stringType().min(1).max(128),
  ...protecaoFormularioSchema
}).strict();
const notaSyncSchema = objectType({
  id: idSchema,
  titulo: stringType().trim().min(1).max(160),
  conteudo: stringType().max(4e4),
  assunto: enumType(["geral", "lei-1", "lei-2", "lei-3"]),
  criadaEm: dataIsoSchema,
  atualizadaEm: dataIsoSchema
}).strict();
const respostaQuestaoSchema = objectType({
  questaoId: idSchema,
  letraEscolhida: enumType(["A", "B", "C", "D", "CALC"]),
  correta: booleanType(),
  tempoSegundos: numberType().int().min(1).max(7200),
  respondidoEm: dataIsoSchema,
  confianca: enumType(["baixa", "media", "alta"]).optional(),
  corrigida: booleanType().optional()
}).strict();
const respostaCalculoSchema = objectType({
  questaoId: idSchema,
  valorDigitado: numberType().finite().min(-1e9).max(1e9),
  correta: booleanType(),
  diagnostico: stringType().max(1e3).optional(),
  tempoSegundos: numberType().int().min(1).max(7200),
  respondidoEm: dataIsoSchema
}).strict();
const progressoSchema = objectType({
  assunto: assuntoSchema,
  marco: enumType(["texto", "narracao", "video", "resumo", "visual", "animacao"]),
  concluidoEm: dataIsoSchema
}).strict();
const dificuldadeSchema = objectType({
  assunto: assuntoSchema,
  nivel: enumType(["facil", "medio", "dificil"])
}).strict();
const quizSchema = objectType({
  assunto: assuntoSchema,
  formato: stringType().trim().min(1).max(32),
  acertos: numberType().int().min(0).max(100),
  total: numberType().int().min(1).max(100),
  aprovado: booleanType(),
  respondidoEm: dataIsoSchema
}).strict().refine((value) => value.acertos <= value.total, "Resultado de quiz inválido.");
const fotoDadosLocaisSchema = objectType({
  notas: arrayType(notaSyncSchema).max(200),
  respostasQuestoes: arrayType(respostaQuestaoSchema).max(500),
  respostasCalculo: arrayType(respostaCalculoSchema).max(300),
  progressoLicoes: arrayType(progressoSchema).max(30),
  dificuldadeAdaptativa: arrayType(dificuldadeSchema).max(3),
  quizResultados: arrayType(quizSchema).max(200)
}).strict().superRefine((value, context) => {
  if (JSON.stringify(value).length > 9e5) {
    context.addIssue({
      code: ZodIssueCode.custom,
      message: "Carga de sincronização muito grande."
    });
  }
});
const gravityInputSchema = objectType({
  historico: arrayType(
    objectType({
      role: enumType(["user", "assistant"]),
      content: stringType().trim().min(1).max(1500)
    }).strict()
  ).min(1).max(12),
  context: objectType({
    leiAtual: objectType({
      numero: stringType().max(8),
      titulo: stringType().max(120),
      enunciado: stringType().max(600)
    }).strict().optional(),
    resumoPerfil: stringType().max(1500).optional()
  }).strict().optional()
}).strict();
function validarTempoFormulario(iniciadoEm) {
  const idade = Date.now() - iniciadoEm;
  return idade >= 800 && idade <= 2 * 60 * 60 * 1e3;
}
export {
  gravityInputSchema as a,
  cadastroSchema as c,
  fotoDadosLocaisSchema as f,
  getD1 as g,
  loginSchema as l,
  validarTempoFormulario as v
};
