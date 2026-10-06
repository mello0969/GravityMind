import "@tanstack/react-start/server-only";
import { exigirUsuarioAutenticado } from "@/lib/auth/session.server";
import { getDatabase } from "@/lib/db/supabase.server";

export class PlusAccessError extends Error {
  constructor() {
    super("Este recurso requer uma assinatura Plus ativa.");
  }
}

export async function exigirAssinaturaPlus(): Promise<string> {
  const userId = await exigirUsuarioAutenticado();
  const { data } = await getDatabase()
    .from("assinaturas")
    .select("valida_ate")
    .eq("user_id", userId)
    .eq("plano", "plus")
    .eq("status", "active")
    .maybeSingle()
    .throwOnError();
  if (!data || (data.valida_ate !== null && !(Date.parse(data.valida_ate) > Date.now()))) {
    throw new PlusAccessError();
  }
  return userId;
}
