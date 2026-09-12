import process from "node:process";
import { c as createServerRpc, e as exigirUsuarioAutenticado, a as aplicarRateLimit } from "./session.server-DL0xVT0X.mjs";
import { c as createServerFn, s as setResponseHeaders } from "./server-DwUI_Cux.mjs";
import { f as fotoDadosLocaisSchema, g as getD1 } from "./schemas-Dga4YmnR.mjs";

import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/unenv.mjs";


import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";





import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";

import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "../_libs/zod.mjs";
const PREFIXO_V1 = "enc:v1:";
const PREFIXO_V2 = "enc:v2:";
function bytesParaBase64(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}
function base64ParaBytes(value) {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}
async function obterChave() {
  const encoded = process.env.DATA_ENCRYPTION_KEY;
  if (!encoded) {
    throw new Error("DATA_ENCRYPTION_KEY ausente em produção.");
  }
  const bytes = base64ParaBytes(encoded);
  if (bytes.byteLength !== 32)
    throw new Error("DATA_ENCRYPTION_KEY deve conter 32 bytes em base64.");
  return crypto.subtle.importKey("raw", bytes, "AES-GCM", false, ["encrypt", "decrypt"]);
}
async function criptografarTexto(value, contexto) {
  const key = await obterChave();
  if (!key) return value;
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: new TextEncoder().encode(contexto) },
    key,
    new TextEncoder().encode(value)
  );
  return `${PREFIXO_V2}${bytesParaBase64(iv)}:${bytesParaBase64(new Uint8Array(cipher))}`;
}
async function descriptografarTexto(value, contexto) {
  if (!value.startsWith(PREFIXO_V1) && !value.startsWith(PREFIXO_V2)) return value;
  const key = await obterChave();
  if (!key) throw new Error("Conteúdo criptografado sem chave disponível.");
  const [prefixo, versao, ivEncoded, cipherEncoded] = value.split(":");
  if (prefixo !== "enc" || !ivEncoded || !cipherEncoded) {
    throw new Error("Conteúdo criptografado inválido.");
  }
  const algoritmo = versao === "v2" ? {
    name: "AES-GCM",
    iv: base64ParaBytes(ivEncoded),
    additionalData: new TextEncoder().encode(contexto)
  } : { name: "AES-GCM", iv: base64ParaBytes(ivEncoded) };
  const plain = await crypto.subtle.decrypt(algoritmo, key, base64ParaBytes(cipherEncoded));
  return new TextDecoder().decode(plain);
}
function respostaPrivada() {
  setResponseHeaders(new Headers({
    "cache-control": "private, no-store, max-age=0",
    vary: "Cookie"
  }));
}
const enviarParaNuvemServerFn_createServerFn_handler = createServerRpc({
  id: "711e049ff0720a86f8de5989c35fd8e1cac25147a55ae90c18941dd321b285c3",
  name: "enviarParaNuvemServerFn",
  filename: "src/lib/sync/server-fn.ts"
}, (opts) => enviarParaNuvemServerFn.__executeServer(opts));
const enviarParaNuvemServerFn = createServerFn({
  method: "POST"
}).validator((input) => fotoDadosLocaisSchema.parse(input)).handler(enviarParaNuvemServerFn_createServerFn_handler, async ({
  data
}) => {
  respostaPrivada();
  try {
    const userId = await exigirUsuarioAutenticado();
    await aplicarRateLimit("sync:upload", 12, 6e4, userId);
    const db = getD1();
    for (const nota of data.notas) {
      const [titulo, conteudo] = await Promise.all([criptografarTexto(nota.titulo, `${userId}:${nota.id}:titulo`), criptografarTexto(nota.conteudo, `${userId}:${nota.id}:conteudo`)]);
      await db.prepare(`INSERT INTO notas (id, user_id, titulo, conteudo, assunto, criada_em, atualizada_em)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(id) DO UPDATE SET
               titulo = excluded.titulo,
               conteudo = excluded.conteudo,
               assunto = excluded.assunto,
               atualizada_em = excluded.atualizada_em
             WHERE notas.user_id = excluded.user_id
               AND excluded.atualizada_em > notas.atualizada_em`).bind(nota.id, userId, titulo, conteudo, nota.assunto, nota.criadaEm, nota.atualizadaEm).run();
    }
    for (const resposta of data.respostasQuestoes) {
      await db.prepare(`INSERT INTO respostas_questoes
             (user_id, questao_id, letra_escolhida, correta, tempo_segundos, respondido_em, confianca, corrigida)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(user_id, questao_id, respondido_em)
             DO UPDATE SET
               confianca = COALESCE(excluded.confianca, respostas_questoes.confianca),
               corrigida = MAX(respostas_questoes.corrigida, excluded.corrigida)`).bind(userId, resposta.questaoId, resposta.letraEscolhida, resposta.correta ? 1 : 0, resposta.tempoSegundos, resposta.respondidoEm, resposta.confianca ?? null, resposta.corrigida ? 1 : 0).run();
    }
    for (const resposta of data.respostasCalculo) {
      await db.prepare(`INSERT OR IGNORE INTO respostas_calculo
             (user_id, questao_id, valor_digitado, correta, diagnostico, tempo_segundos, respondido_em)
             VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(userId, resposta.questaoId, resposta.valorDigitado, resposta.correta ? 1 : 0, resposta.diagnostico ?? null, resposta.tempoSegundos, resposta.respondidoEm).run();
    }
    for (const progresso of data.progressoLicoes) {
      await db.prepare(`INSERT INTO progresso_licoes (user_id, assunto, marco, concluido_em)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(user_id, assunto, marco) DO NOTHING`).bind(userId, progresso.assunto, progresso.marco, progresso.concluidoEm).run();
    }
    for (const dificuldade of data.dificuldadeAdaptativa) {
      await db.prepare(`INSERT INTO dificuldade_adaptativa (user_id, assunto, nivel)
             VALUES (?, ?, ?)
             ON CONFLICT(user_id, assunto)
             DO UPDATE SET nivel = excluded.nivel`).bind(userId, dificuldade.assunto, dificuldade.nivel).run();
    }
    for (const quiz of data.quizResultados) {
      await db.prepare(`INSERT OR IGNORE INTO quiz_resultados
             (user_id, assunto, formato, acertos, total, aprovado, respondido_em)
             VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(userId, quiz.assunto, quiz.formato, quiz.acertos, quiz.total, quiz.aprovado ? 1 : 0, quiz.respondidoEm).run();
    }
    return {
      ok: true
    };
  } catch (error) {
    console.error("Falha ao sincronizar dados", error);
    return {
      ok: false,
      erro: "Não foi possível sincronizar os dados agora."
    };
  }
});
const baixarDaNuvemServerFn_createServerFn_handler = createServerRpc({
  id: "280ebd4d74a30ab688edb3f9adbed4e9cf745eb1a249d53adbb1fc01b6b146eb",
  name: "baixarDaNuvemServerFn",
  filename: "src/lib/sync/server-fn.ts"
}, (opts) => baixarDaNuvemServerFn.__executeServer(opts));
const baixarDaNuvemServerFn = createServerFn({
  method: "GET"
}).handler(baixarDaNuvemServerFn_createServerFn_handler, async () => {
  respostaPrivada();
  try {
    const userId = await exigirUsuarioAutenticado();
    await aplicarRateLimit("sync:download", 30, 6e4, userId);
    const db = getD1();
    const [notasRes, respQRes, respCRes, progRes, difRes, quizRes] = await Promise.all([db.prepare(`SELECT id, titulo, conteudo, assunto, criada_em, atualizada_em
             FROM notas WHERE user_id = ? ORDER BY atualizada_em DESC LIMIT 200`).bind(userId).all(), db.prepare(`SELECT questao_id, letra_escolhida, correta, tempo_segundos, respondido_em, confianca, corrigida
             FROM respostas_questoes WHERE user_id = ? ORDER BY respondido_em DESC LIMIT 500`).bind(userId).all(), db.prepare(`SELECT questao_id, valor_digitado, correta, diagnostico, tempo_segundos, respondido_em
             FROM respostas_calculo WHERE user_id = ? ORDER BY respondido_em DESC LIMIT 300`).bind(userId).all(), db.prepare(`SELECT assunto, marco, concluido_em
             FROM progresso_licoes WHERE user_id = ? LIMIT 30`).bind(userId).all(), db.prepare(`SELECT assunto, nivel
             FROM dificuldade_adaptativa WHERE user_id = ? LIMIT 3`).bind(userId).all(), db.prepare(`SELECT assunto, formato, acertos, total, aprovado, respondido_em
             FROM quiz_resultados WHERE user_id = ? ORDER BY respondido_em DESC LIMIT 200`).bind(userId).all()]);
    const notas = await Promise.all(notasRes.results.map(async (nota) => ({
      id: nota.id,
      titulo: await descriptografarTexto(nota.titulo, `${userId}:${String(nota.id)}:titulo`),
      conteudo: await descriptografarTexto(nota.conteudo, `${userId}:${String(nota.id)}:conteudo`),
      assunto: nota.assunto,
      criadaEm: nota.criada_em,
      atualizadaEm: nota.atualizada_em
    })));
    return {
      notas,
      respostasQuestoes: respQRes.results.map((resposta) => ({
        questaoId: resposta.questao_id,
        letraEscolhida: resposta.letra_escolhida,
        correta: resposta.correta === 1,
        tempoSegundos: resposta.tempo_segundos,
        respondidoEm: resposta.respondido_em,
        confianca: resposta.confianca ?? void 0,
        corrigida: resposta.corrigida === 1
      })),
      respostasCalculo: respCRes.results.map((resposta) => ({
        questaoId: resposta.questao_id,
        valorDigitado: resposta.valor_digitado,
        correta: resposta.correta === 1,
        diagnostico: resposta.diagnostico ?? void 0,
        tempoSegundos: resposta.tempo_segundos,
        respondidoEm: resposta.respondido_em
      })),
      progressoLicoes: progRes.results.map((progresso) => ({
        assunto: progresso.assunto,
        marco: progresso.marco,
        concluidoEm: progresso.concluido_em
      })),
      dificuldadeAdaptativa: difRes.results.map((dificuldade) => ({
        assunto: dificuldade.assunto,
        nivel: dificuldade.nivel
      })),
      quizResultados: quizRes.results.map((quiz) => ({
        assunto: quiz.assunto,
        formato: quiz.formato,
        acertos: quiz.acertos,
        total: quiz.total,
        aprovado: quiz.aprovado === 1,
        respondidoEm: quiz.respondido_em
      }))
    };
  } catch (error) {
    console.error("Falha ao carregar dados sincronizados", error);
    return {
      erro: "Não foi possível carregar seus dados agora."
    };
  }
});
export {
  baixarDaNuvemServerFn_createServerFn_handler,
  enviarParaNuvemServerFn_createServerFn_handler
};
