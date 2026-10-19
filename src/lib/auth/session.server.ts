import "@tanstack/react-start/server-only";

import {
  deleteCookie,
  getCookie,
  setCookie,
  setResponseHeaders,
} from "@tanstack/react-start/server";
import type { z } from "zod";
import {
  gerarHashTokenSessao,
  gerarId,
  gerarTokenSessao,
  senhaPrecisaRehash,
} from "@/lib/auth/hash";
import { gerarHashSenha, verificarSenha } from "@/lib/auth/password.server";
import type { ResultadoAuth, UsuarioPublico } from "@/lib/auth/types";
import { getDatabase } from "@/lib/db/supabase.server";
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
  console.error("Falha de autenticação no servidor.");
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
  const db = getDatabase();
  const token = gerarTokenSessao();
  const tokenHash = await gerarHashTokenSessao(token);
  const expiraEm = new Date(Date.now() + DIAS_EXPIRACAO * 86_400_000).toISOString();

  await db
    .rpc("gm_create_session", {
      p_user_id: userId,
      p_token: tokenHash,
      p_expires: expiraEm,
    })
    .throwOnError();

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

  const { data: session } = await getDatabase()
    .from("sessoes")
    .select("users!inner(id,nome,email)")
    .eq("token", await gerarHashTokenSessao(token))
    .gt("expira_em", new Date().toISOString())
    .maybeSingle()
    .throwOnError();
  const linha = session?.users;
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
    await aplicarRateLimit("auth:cadastro:ip", 10, 15 * 60_000);
    await aplicarRateLimit("auth:cadastro:account", 5, 15 * 60_000, data.email, true);
    if (!(await validarTurnstile(data.turnstileToken, "cadastro"))) {
      return { erro: "Não foi possível confirmar que este acesso é legítimo." };
    }

    const db = getDatabase();
    const { data: existente } = await db
      .from("users")
      .select("id")
      .eq("email", data.email)
      .maybeSingle()
      .throwOnError();
    if (existente) return { erro: "Não foi possível criar a conta com esses dados." };

    const { hash, salt } = await gerarHashSenha(data.senha);
    const id = gerarId();
    await db
      .from("users")
      .insert({
        id,
        nome: data.nome,
        email: data.email,
        senha_hash: hash,
        senha_salt: salt,
      })
      .throwOnError();
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
    await aplicarRateLimit("auth:login:ip", 30, 15 * 60_000);
    await aplicarRateLimit("auth:login:account", 10, 15 * 60_000, data.email, true);
    if (!(await validarTurnstile(data.turnstileToken, "login"))) {
      return { erro: "Não foi possível confirmar que este acesso é legítimo." };
    }

    const db = getDatabase();
    const { data: usuario } = await db
      .from("users")
      .select("id,nome,email,senha_hash,senha_salt")
      .eq("email", data.email)
      .maybeSingle()
      .throwOnError();

    const validPassword = await verificarSenha(
      data.senha,
      usuario?.senha_hash ?? `pbkdf2-v1$600000$${"0".repeat(128)}`,
      usuario?.senha_salt ?? "0".repeat(32),
    );
    if (!usuario || !validPassword) {
      return { erro: "E-mail ou senha incorretos." };
    }

    if (senhaPrecisaRehash(usuario.senha_hash)) {
      const novo = await gerarHashSenha(data.senha);
      await db
        .from("users")
        .update({ senha_hash: novo.hash, senha_salt: novo.salt })
        .eq("id", usuario.id)
        .throwOnError();
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
      await getDatabase()
        .from("sessoes")
        .delete()
        .eq("token", await gerarHashTokenSessao(token))
        .throwOnError();
    } catch {
      console.error("Falha ao remover sessão no servidor.");
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
