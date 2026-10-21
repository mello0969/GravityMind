import "@tanstack/react-start/server-only";
import type { Database } from "@/lib/db/database.types";
import { getDatabase } from "@/lib/db/supabase.server";

type SubscriptionUpdate = Omit<
  Database["public"]["Tables"]["assinaturas"]["Insert"],
  "user_id" | "plano" | "atualizado_em"
>;

export async function findSubscriber(subscriptionId: string): Promise<string | null> {
  const { data } = await getDatabase()
    .from("assinaturas")
    .select("user_id")
    .eq("provider_subscription_id", subscriptionId)
    .limit(1)
    .maybeSingle()
    .throwOnError();
  return data?.user_id ?? null;
}

export async function savePlusSubscription(userId: string, update: SubscriptionUpdate) {
  await getDatabase()
    .from("assinaturas")
    .upsert(
      {
        ...update,
        user_id: userId,
        plano: "plus",
        atualizado_em: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    )
    .throwOnError();
}
