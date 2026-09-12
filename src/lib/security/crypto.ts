import "@tanstack/react-start/server-only";

const PREFIXO_V1 = "enc:v1:";
const PREFIXO_V2 = "enc:v2:";

function emProducao() {
  return process.env.NODE_ENV === "production";
}

function bytesParaBase64(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function base64ParaBytes(value: string) {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function obterChave() {
  const encoded = process.env.DATA_ENCRYPTION_KEY;
  if (!encoded) {
    if (emProducao()) throw new Error("DATA_ENCRYPTION_KEY ausente em produção.");
    return null;
  }

  const bytes = base64ParaBytes(encoded);
  if (bytes.byteLength !== 32)
    throw new Error("DATA_ENCRYPTION_KEY deve conter 32 bytes em base64.");
  return crypto.subtle.importKey("raw", bytes, "AES-GCM", false, ["encrypt", "decrypt"]);
}

export async function criptografarTexto(value: string, contexto: string) {
  const key = await obterChave();
  if (!key) return value;
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: new TextEncoder().encode(contexto) },
    key,
    new TextEncoder().encode(value),
  );
  return `${PREFIXO_V2}${bytesParaBase64(iv)}:${bytesParaBase64(new Uint8Array(cipher))}`;
}

export async function descriptografarTexto(value: string, contexto: string) {
  if (!value.startsWith(PREFIXO_V1) && !value.startsWith(PREFIXO_V2)) return value;
  const key = await obterChave();
  if (!key) throw new Error("Conteúdo criptografado sem chave disponível.");
  const [prefixo, versao, ivEncoded, cipherEncoded] = value.split(":");
  if (prefixo !== "enc" || !ivEncoded || !cipherEncoded) {
    throw new Error("Conteúdo criptografado inválido.");
  }
  const algoritmo =
    versao === "v2"
      ? {
          name: "AES-GCM" as const,
          iv: base64ParaBytes(ivEncoded),
          additionalData: new TextEncoder().encode(contexto),
        }
      : { name: "AES-GCM" as const, iv: base64ParaBytes(ivEncoded) };
  const plain = await crypto.subtle.decrypt(algoritmo, key, base64ParaBytes(cipherEncoded));
  return new TextDecoder().decode(plain);
}
