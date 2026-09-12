import "@tanstack/react-start/server-only";

import {
  deleteCookie,
  getCookie,
  setCookie,
  setResponseHeaders,
} from "@tanstack/react-start/server";
import type { z } from "zod";
import {
  gerarHashSenha,
  gerarHashTokenSessao,
  gerarId,
  gerarTokenSessao,
  senhaPrecisaRehash,
  verificarSenha,
} from "@/lib/auth/hash";
import type { ResultadoAuth, UsuarioPublico } from "@/lib/auth/types";
import { getD1 } from "@/lib/db/context";
import { validarTurnstile } from "@/lib/security/bot";
import { aplicarRateLimit, RateLimitError } from "@/lib/security/rate-limit";
import type { cadastroSchema, loginSchema } from "@/lib/security/schemas";
import { validarTempoFormulario } from "@/lib/security/schemas";

const COOKIE_DESENVOLVIMENTO = "gm_session";
const COOKIE_PRODUCAO = "__Host-gm_session";
const COOKIE_LEGADO_DESENVOLVIMENTO = "ff_sessao";
const COOKIE_LEGADO_PRODUCAO = "__Host-ff_sessao";
const DIAS_EXPIRACAO = 14;

type DadosCadastro = z.infer<typeof cadastroSchema>;
type DadosLogin = z.infer<typeof loginSchema>;

function emProducao() {
  return process.env.NODE_ENV === "production";
}

function nomeCookieSessao() {
  return emProducao() ? COOKIE_PRODUCAO : COOKIE_DESENVOLVIMENTO;
}

function respostaPrivada() {
  setResponseHeaders(
    new Headers({
      "cache-control": "private, no-store, max-age=0",
      vary: "Cookie",
    }),
  );
}

function erroPublico(error: unknown): ResultadoAuth {
  if (error instanceof RateLimitError) {
    return { erro: error.message, retryAfter: error.retryAfterSeconds };
  }
  console.error("Falha de autenticação", error);
  return {
    erro: "Não foi possível concluir agora. Tente novamente em instantes.",
  };
}

function lerTokenSessao() {
  const atual = getCookie(nomeCookieSessao());
  if (atual) return atual;
  const legado = getCookie(emProducao() ? COOKIE_LEGADO_PRODUCAO : COOKIE_LEGADO_DESENVOLVIMENTO);
  if (legado) {
    setCookie(nomeCookieSessao(), legado, {
      httpOnly: true,
      secure: emProducao(),
      sameSite: "strict",
      path: "/",
      maxAge: DIAS_EXPIRACAO * 86_400,
    });
  }
  return legado;
}

function limparCookiesSessao() {
  deleteCookie(nomeCookieSessao(), {
    path: "/",
    secure: emProducao(),
    sameSite: "strict",
  });
  if (emProducao()) {
    deleteCookie(COOKIE_DESENVOLVIMENTO, {
      path: "/",
      sameSite: "strict",
    });
  }
  deleteCookie(COOKIE_LEGADO_DESENVOLVIMENTO, {
    path: "/",
    sameSite: "strict",
  });
  deleteCookie(COOKIE_LEGADO_PRODUCAO, {
    path: "/",
    secure: true,
    sameSite: "strict",
  });
}

async function criarSessao(userId: string) {
  const db = getD1();
  const token = gerarTokenSessao();
  const tokenHash = await gerarHashTokenSessao(token);
  const expiraEm = new Date(Date.now() + DIAS_EXPIRACAO * 86_400_000).toISOString();

  await db.prepare("DELETE FROM sessoes WHERE datetime(expira_em) <= datetime('now')").run();
  await db
    .prepare("INSERT INTO sessoes (token, user_id, expira_em) VALUES (?, ?, ?)")
    .bind(tokenHash, userId, expiraEm)
    .run();
  await db
    .prepare(
      `DELETE FROM sessoes
       WHERE user_id = ? AND token NOT IN (
         SELECT token FROM sessoes WHERE user_id = ? ORDER BY criado_em DESC LIMIT 5
       )`,
    )
    .bind(userId, userId)
    .run();

  setCookie(nomeCookieSessao(), token, {
    httpOnly: true,
    secure: emProducao(),
    sameSite: "strict",
    path: "/",
    maxAge: DIAS_EXPIRACAO * 86_400,
  });
}

export async function obterUsuarioAtual(): Promise<UsuarioPublico | null> {
  const token = lerTokenSessao();
  if (!token || !/^[a-f0-9]{64}$/i.test(token)) {
    if (token) limparCookiesSessao();
    return null;
  }

  const db = getD1();
  const linha = await db
    .prepare(
      `SELECT u.id, u.nome, u.email
       FROM sessoes AS s
       INNER JOIN users AS u ON u.id = s.user_id
       WHERE s.token = ? AND datetime(s.expira_em) > datetime('now')
       LIMIT 1`,
    )
    .bind(await gerarHashTokenSessao(token))
    .first<UsuarioPublico>();
  if (!linha) limparCookiesSessao();
  return linha ?? null;
}

export async function cadastrarUsuario(data: DadosCadastro): Promise<ResultadoAuth> {
  respostaPrivada();
  try {
    if (!validarTempoFormulario(data.formularioIniciadoEm)) {
      return {
        erro: "O formulário expirou. Recarregue a página e tente novamente.",
      };
    }
    await aplicarRateLimit("auth:cadastro", 5, 15 * 60_000, data.email);
    if (!(await validarTurnstile(data.turnstileToken, "cadastro"))) {
      return { erro: "Não foi possível confirmar que este acesso é legítimo." };
    }

    const db = getD1();
    const existente = await db
      .prepare("SELECT id FROM users WHERE email = ? LIMIT 1")
      .bind(data.email)
      .first();
    if (existente) return { erro: "Não foi possível criar a conta com esses dados." };

    const { hash, salt } = await gerarHashSenha(data.senha);
    const id = gerarId();
    await db
      .prepare("INSERT INTO users (id, nome, email, senha_hash, senha_salt) VALUES (?, ?, ?, ?, ?)")
      .bind(id, data.nome, data.email, hash, salt)
      .run();
    await criarSessao(id);
    return { usuario: { id, nome: data.nome, email: data.email } };
  } catch (error) {
    return erroPublico(error);
  }
}

export async function entrarUsuario(data: DadosLogin): Promise<ResultadoAuth> {
  respostaPrivada();
  try {
    if (!validarTempoFormulario(data.formularioIniciadoEm)) {
      return {
        erro: "O formulário expirou. Recarregue a página e tente novamente.",
      };
    }
    await aplicarRateLimit("auth:login", 10, 15 * 60_000, data.email);
    if (!(await validarTurnstile(data.turnstileToken, "login"))) {
      return { erro: "Não foi possível confirmar que este acesso é legítimo." };
    }

    const db = getD1();
    const usuario = await db
      .prepare("SELECT id, nome, email, senha_hash, senha_salt FROM users WHERE email = ? LIMIT 1")
      .bind(data.email)
      .first<UsuarioPublico & { senha_hash: string; senha_salt: string }>();

    if (!usuario || !(await verificarSenha(data.senha, usuario.senha_hash, usuario.senha_salt))) {
      return { erro: "E-mail ou senha incorretos." };
    }

    if (senhaPrecisaRehash(usuario.senha_hash)) {
      const novo = await gerarHashSenha(data.senha);
      await db
        .prepare("UPDATE users SET senha_hash = ?, senha_salt = ? WHERE id = ?")
        .bind(novo.hash, novo.salt, usuario.id)
        .run();
    }

    await criarSessao(usuario.id);
    return {
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    };
  } catch (error) {
    return erroPublico(error);
  }
}

export async function sairUsuario() {
  respostaPrivada();
  const token = lerTokenSessao();
  if (token && /^[a-f0-9]{64}$/i.test(token)) {
    try {
      await getD1()
        .prepare("DELETE FROM sessoes WHERE token = ?")
        .bind(await gerarHashTokenSessao(token))
        .run();
    } catch (error) {
      console.error("Falha ao remover sessão", error);
    }
  }
  limparCookiesSessao();
  return { ok: true };
}

export async function consultarUsuarioAtual() {
  respostaPrivada();
  try {
    return await obterUsuarioAtual();
  } catch {
    return null;
  }
}

export async function exigirUsuarioAutenticado() {
  const usuario = await obterUsuarioAtual();
  if (!usuario) throw new Error("Não autenticado.");
  return usuario.id;
}
