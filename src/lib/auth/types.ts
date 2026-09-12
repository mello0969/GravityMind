export type UsuarioPublico = {
  id: string;
  nome: string;
  email: string;
};

export type ResultadoAuth = {
  usuario?: UsuarioPublico;
  erro?: string;
  retryAfter?: number;
};
