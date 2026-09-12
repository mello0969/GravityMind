import { useCallback, useEffect, useState } from "react";
import {
  cadastrarServerFn,
  entrarServerFn,
  sairServerFn,
  type UsuarioPublico,
  usuarioAtualServerFn,
} from "@/lib/auth/server";

type EstadoAuth = {
  usuario: UsuarioPublico | null;
  carregando: boolean;
};

export type ProvaHumana = {
  turnstileToken: string;
  website: string;
  formularioIniciadoEm: number;
};

let ouvintes: ((estado: EstadoAuth) => void)[] = [];
let estadoGlobal: EstadoAuth = { usuario: null, carregando: true };

function emitir(novoEstado: EstadoAuth) {
  estadoGlobal = novoEstado;
  ouvintes.forEach((fn) => {
    fn(estadoGlobal);
  });
}

async function carregarUsuarioAtual() {
  try {
    const usuario = await usuarioAtualServerFn();
    emitir({ usuario, carregando: false });
  } catch {
    emitir({ usuario: null, carregando: false });
  }
}

let carregamentoIniciado = false;

/** Estado de autenticação compartilhado entre todos os componentes que usam o hook. */
export function useAuth() {
  const [estado, setEstado] = useState<EstadoAuth>(estadoGlobal);

  useEffect(() => {
    ouvintes.push(setEstado);
    if (!carregamentoIniciado) {
      carregamentoIniciado = true;
      carregarUsuarioAtual();
    }
    return () => {
      ouvintes = ouvintes.filter((fn) => fn !== setEstado);
    };
  }, []);

  const cadastrar = useCallback(
    async (nome: string, email: string, senha: string, prova: ProvaHumana) => {
      const resultado = await cadastrarServerFn({
        data: { nome, email, senha, ...prova },
      });
      if (resultado.usuario) emitir({ usuario: resultado.usuario, carregando: false });
      return resultado;
    },
    [],
  );

  const entrar = useCallback(async (email: string, senha: string, prova: ProvaHumana) => {
    const resultado = await entrarServerFn({
      data: { email, senha, ...prova },
    });
    if (resultado.usuario) emitir({ usuario: resultado.usuario, carregando: false });
    return resultado;
  }, []);

  const sair = useCallback(async () => {
    await sairServerFn();
    emitir({ usuario: null, carregando: false });
  }, []);

  return { ...estado, cadastrar, entrar, sair };
}
