const HASH_VERSION = "pbkdf2-v1";
const ITERACOES = 600_000;
const BITS = 512;

function bytesParaHex(bytes: ArrayBuffer | Uint8Array) {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  return Array.from(view, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function hexParaBytes(value: string) {
  const bytes = new Uint8Array(value.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(value.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

async function derivarChave(senha: string, salt: string, iteracoes: number) {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(senha),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  return crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: hexParaBytes(salt),
      iterations: iteracoes,
    },
    material,
    BITS,
  );
}

function comparacaoConstante(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let diferenca = 0;
  for (let index = 0; index < a.length; index += 1) {
    diferenca |= a[index] ^ b[index];
  }
  return diferenca === 0;
}

export async function gerarHashSenha(senha: string) {
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const salt = bytesParaHex(saltBytes);
  const derivedKey = await derivarChave(senha, salt, ITERACOES);
  return {
    hash: `${HASH_VERSION}$${ITERACOES}$${bytesParaHex(derivedKey)}`,
    salt,
  };
}

export async function verificarSenha(senha: string, hash: string, salt: string) {
  const [version, iteracoesTexto, hashHex] = hash.split("$");
  if (version !== HASH_VERSION || !/^\d+$/.test(iteracoesTexto)) return false;
  if (!/^[a-f0-9]{128}$/i.test(hashHex) || !/^[a-f0-9]{32}$/i.test(salt)) return false;
  const iteracoes = Number(iteracoesTexto);
  if (iteracoes < 100_000 || iteracoes > 1_000_000) return false;
  const derivedKey = new Uint8Array(await derivarChave(senha, salt, iteracoes));
  return comparacaoConstante(derivedKey, hexParaBytes(hashHex));
}

export function senhaPrecisaRehash(hash: string) {
  return !hash.startsWith(`${HASH_VERSION}$${ITERACOES}$`);
}

export function gerarId() {
  return crypto.randomUUID();
}

export function gerarTokenSessao() {
  return bytesParaHex(crypto.getRandomValues(new Uint8Array(32)));
}

export async function gerarHashTokenSessao(token: string) {
  return bytesParaHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token)));
}
