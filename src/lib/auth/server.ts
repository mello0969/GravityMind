import { createServerFn } from "@tanstack/react-start";
import {
  cadastrarUsuario,
  consultarUsuarioAtual,
  entrarUsuario,
  sairUsuario,
} from "@/lib/auth/session.server";
import { cadastroSchema, loginSchema } from "@/lib/security/schemas";

export type { UsuarioPublico } from "@/lib/auth/types";

export const cadastrarServerFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => cadastroSchema.parse(input))
  .handler(async ({ data }) => cadastrarUsuario(data));

export const entrarServerFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => loginSchema.parse(input))
  .handler(async ({ data }) => entrarUsuario(data));

export const sairServerFn = createServerFn({ method: "POST" }).handler(sairUsuario);

export const usuarioAtualServerFn = createServerFn({ method: "GET" }).handler(
  consultarUsuarioAtual,
);
