import process from "node:process";
import { T as TSS_SERVER_FUNCTION, d as getRequest, e as getCookie, f as setCookie, h as deleteCookie, s as setResponseHeaders } from "./server-DwUI_Cux.mjs";
import { g as getD1, v as validarTempoFormulario } from "./schemas-Dga4YmnR.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const HASH_VERSION = "pbkdf2-v1";
const ITERACOES = 6e5;
const BITS = 512;
function bytesParaHex$1(bytes) {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  return Array.from(view, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
function hexParaBytes(value) {
  const bytes = new Uint8Array(value.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(value.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}
async function derivarChave(senha, salt, iteracoes) {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(senha),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  return crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: hexParaBytes(salt),
      iterations: iteracoes
    },
    material,
    BITS
  );
}
function comparacaoConstante(a, b) {
  if (a.length !== b.length) return false;
  let diferenca = 0;
  for (let index = 0; index < a.length; index += 1) {
    diferenca |= a[index] ^ b[index];
  }
  return diferenca === 0;
}
async function gerarHashSenha(senha) {
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const salt = bytesParaHex$1(saltBytes);
  const derivedKey = await derivarChave(senha, salt, ITERACOES);
  return {
    hash: `${HASH_VERSION}$${ITERACOES}$${bytesParaHex$1(derivedKey)}`,
    salt
  };
}
async function verificarSenha(senha, hash, salt) {
  const [version, iteracoesTexto, hashHex] = hash.split("$");
  if (version !== HASH_VERSION || !/^\d+$/.test(iteracoesTexto)) return false;
  if (!/^[a-f0-9]{128}$/i.test(hashHex) || !/^[a-f0-9]{32}$/i.test(salt)) return false;
  const iteracoes = Number(iteracoesTexto);
  if (iteracoes < 1e5 || iteracoes > 1e6) return false;
  const derivedKey = new Uint8Array(await derivarChave(senha, salt, iteracoes));
  return comparacaoConstante(derivedKey, hexParaBytes(hashHex));
}
function senhaPrecisaRehash(hash) {
  return !hash.startsWith(`${HASH_VERSION}$${ITERACOES}$`);
}
function gerarId() {
  return crypto.randomUUID();
}
function gerarTokenSessao() {
  return bytesParaHex$1(crypto.getRandomValues(new Uint8Array(32)));
}
async function gerarHashTokenSessao(token) {
  return bytesParaHex$1(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token)));
}
const TURNSTILE_TEST_SECRET = "1x0000000000000000000000000000000AA";
function ambienteLocal() {
  const hostname = new URL(getRequest().url).hostname;
  return hostname === "localhost" || hostname === "127.0.0.1";
}
async function validarTurnstile(token, action) {
  const local = ambienteLocal();
  const secret = local ? TURNSTILE_TEST_SECRET : process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY ausente em produção.");
    return false;
  }
  const request = getRequest();
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/json" },
    signal: AbortSignal.timeout(5e3),
    body: JSON.stringify({
      secret,
      response: token,
      remoteip: request.headers.get("cf-connecting-ip") ?? void 0,
      idempotency_key: crypto.randomUUID()
    })
  });
  if (!response.ok) return false;
  const result = await response.json();
  if (!result.success) return false;
  if (!local && result.action !== action) return false;
  const origin = process.env.APP_ORIGIN ?? process.env.PUBLIC_APP_ORIGIN;
  if (!local && origin && result.hostname !== new URL(origin).hostname) return false;
  return true;
}
class RateLimitError extends Error {
  constructor(retryAfterSeconds) {
    super("Muitas tentativas. Aguarde um pouco antes de tentar novamente.");
    this.retryAfterSeconds = retryAfterSeconds;
  }
  retryAfterSeconds;
}
function bytesParaHex(bytes) {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
async function sha256(value) {
  return bytesParaHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}
function identificarCliente() {
  const request = getRequest();
  return request.headers.get("cf-connecting-ip") ?? "ambiente-local";
}
async function aplicarRateLimit(escopo, limite, janelaMs, identidadeExtra = "") {
  const agora = Date.now();
  const janelaInicioMs = Math.floor(agora / janelaMs) * janelaMs;
  const janelaInicio = new Date(janelaInicioMs).toISOString();
  const expiraEm = new Date(janelaInicioMs + janelaMs).toISOString();
  const chaveHash = await sha256(`${escopo}:${identificarCliente()}:${identidadeExtra}`);
  const db = getD1();
  const linha = await db.prepare(
    `INSERT INTO rate_limits (chave_hash, janela_inicio, requisicoes, expira_em)
       VALUES (?, ?, 1, ?)
       ON CONFLICT(chave_hash, janela_inicio)
       DO UPDATE SET requisicoes = requisicoes + 1
       RETURNING requisicoes`
  ).bind(chaveHash, janelaInicio, expiraEm).first();
  if ((linha?.requisicoes ?? limite + 1) > limite) {
    throw new RateLimitError(Math.max(1, Math.ceil((janelaInicioMs + janelaMs - agora) / 1e3)));
  }
  if (Math.random() < 0.02) {
    await db.prepare("DELETE FROM rate_limits WHERE datetime(expira_em) < datetime('now', '-1 day')").run();
  }
}
const COOKIE_DESENVOLVIMENTO = "gm_session";
const COOKIE_PRODUCAO = "__Host-gm_session";
const COOKIE_LEGADO_DESENVOLVIMENTO = "ff_sessao";
const COOKIE_LEGADO_PRODUCAO = "__Host-ff_sessao";
const DIAS_EXPIRACAO = 14;
function emProducao() {
  return true;
}
function nomeCookieSessao() {
  return COOKIE_PRODUCAO;
}
function respostaPrivada() {
  setResponseHeaders(
    new Headers({
      "cache-control": "private, no-store, max-age=0",
      vary: "Cookie"
    })
  );
}
function erroPublico(error) {
  if (error instanceof RateLimitError) {
    return { erro: error.message, retryAfter: error.retryAfterSeconds };
  }
  console.error("Falha de autenticação", error);
  return {
    erro: "Não foi possível concluir agora. Tente novamente em instantes."
  };
}
function lerTokenSessao() {
  const atual = getCookie(nomeCookieSessao());
  if (atual) return atual;
  const legado = getCookie(COOKIE_LEGADO_PRODUCAO);
  if (legado) {
    setCookie(nomeCookieSessao(), legado, {
      httpOnly: true,
      secure: emProducao(),
      sameSite: "strict",
      path: "/",
      maxAge: DIAS_EXPIRACAO * 86400
    });
  }
  return legado;
}
function limparCookiesSessao() {
  deleteCookie(nomeCookieSessao(), {
    path: "/",
    secure: emProducao(),
    sameSite: "strict"
  });
  {
    deleteCookie(COOKIE_DESENVOLVIMENTO, {
      path: "/",
      sameSite: "strict"
    });
  }
  deleteCookie(COOKIE_LEGADO_DESENVOLVIMENTO, {
    path: "/",
    sameSite: "strict"
  });
  deleteCookie(COOKIE_LEGADO_PRODUCAO, {
    path: "/",
    secure: true,
    sameSite: "strict"
  });
}
async function criarSessao(userId) {
  const db = getD1();
  const token = gerarTokenSessao();
  const tokenHash = await gerarHashTokenSessao(token);
  const expiraEm = new Date(Date.now() + DIAS_EXPIRACAO * 864e5).toISOString();
  await db.prepare("DELETE FROM sessoes WHERE datetime(expira_em) <= datetime('now')").run();
  await db.prepare("INSERT INTO sessoes (token, user_id, expira_em) VALUES (?, ?, ?)").bind(tokenHash, userId, expiraEm).run();
  await db.prepare(
    `DELETE FROM sessoes
       WHERE user_id = ? AND token NOT IN (
         SELECT token FROM sessoes WHERE user_id = ? ORDER BY criado_em DESC LIMIT 5
       )`
  ).bind(userId, userId).run();
  setCookie(nomeCookieSessao(), token, {
    httpOnly: true,
    secure: emProducao(),
    sameSite: "strict",
    path: "/",
    maxAge: DIAS_EXPIRACAO * 86400
  });
}
async function obterUsuarioAtual() {
  const token = lerTokenSessao();
  if (!token || !/^[a-f0-9]{64}$/i.test(token)) {
    if (token) limparCookiesSessao();
    return null;
  }
  const db = getD1();
  const linha = await db.prepare(
    `SELECT u.id, u.nome, u.email
       FROM sessoes AS s
       INNER JOIN users AS u ON u.id = s.user_id
       WHERE s.token = ? AND datetime(s.expira_em) > datetime('now')
       LIMIT 1`
  ).bind(await gerarHashTokenSessao(token)).first();
  if (!linha) limparCookiesSessao();
  return linha ?? null;
}
async function cadastrarUsuario(data) {
  respostaPrivada();
  try {
    if (!validarTempoFormulario(data.formularioIniciadoEm)) {
      return {
        erro: "O formulário expirou. Recarregue a página e tente novamente."
      };
    }
    await aplicarRateLimit("auth:cadastro", 5, 15 * 6e4, data.email);
    if (!await validarTurnstile(data.turnstileToken, "cadastro")) {
      return { erro: "Não foi possível confirmar que este acesso é legítimo." };
    }
    const db = getD1();
    const existente = await db.prepare("SELECT id FROM users WHERE email = ? LIMIT 1").bind(data.email).first();
    if (existente) return { erro: "Não foi possível criar a conta com esses dados." };
    const { hash, salt } = await gerarHashSenha(data.senha);
    const id = gerarId();
    await db.prepare("INSERT INTO users (id, nome, email, senha_hash, senha_salt) VALUES (?, ?, ?, ?, ?)").bind(id, data.nome, data.email, hash, salt).run();
    await criarSessao(id);
    return { usuario: { id, nome: data.nome, email: data.email } };
  } catch (error) {
    return erroPublico(error);
  }
}
async function entrarUsuario(data) {
  respostaPrivada();
  try {
    if (!validarTempoFormulario(data.formularioIniciadoEm)) {
      return {
        erro: "O formulário expirou. Recarregue a página e tente novamente."
      };
    }
    await aplicarRateLimit("auth:login", 10, 15 * 6e4, data.email);
    if (!await validarTurnstile(data.turnstileToken, "login")) {
      return { erro: "Não foi possível confirmar que este acesso é legítimo." };
    }
    const db = getD1();
    const usuario = await db.prepare("SELECT id, nome, email, senha_hash, senha_salt FROM users WHERE email = ? LIMIT 1").bind(data.email).first();
    if (!usuario || !await verificarSenha(data.senha, usuario.senha_hash, usuario.senha_salt)) {
      return { erro: "E-mail ou senha incorretos." };
    }
    if (senhaPrecisaRehash(usuario.senha_hash)) {
      const novo = await gerarHashSenha(data.senha);
      await db.prepare("UPDATE users SET senha_hash = ?, senha_salt = ? WHERE id = ?").bind(novo.hash, novo.salt, usuario.id).run();
    }
    await criarSessao(usuario.id);
    return {
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
    };
  } catch (error) {
    return erroPublico(error);
  }
}
async function sairUsuario() {
  respostaPrivada();
  const token = lerTokenSessao();
  if (token && /^[a-f0-9]{64}$/i.test(token)) {
    try {
      await getD1().prepare("DELETE FROM sessoes WHERE token = ?").bind(await gerarHashTokenSessao(token)).run();
    } catch (error) {
      console.error("Falha ao remover sessão", error);
    }
  }
  limparCookiesSessao();
  return { ok: true };
}
async function consultarUsuarioAtual() {
  respostaPrivada();
  try {
    return await obterUsuarioAtual();
  } catch {
    return null;
  }
}
async function exigirUsuarioAutenticado() {
  const usuario = await obterUsuarioAtual();
  if (!usuario) throw new Error("Não autenticado.");
  return usuario.id;
}
export {
  RateLimitError as R,
  aplicarRateLimit as a,
  cadastrarUsuario as b,
  createServerRpc as c,
  entrarUsuario as d,
  exigirUsuarioAutenticado as e,
  consultarUsuarioAtual as f,
  obterUsuarioAtual as o,
  sairUsuario as s
};
