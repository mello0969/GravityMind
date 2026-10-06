import "@tanstack/react-start/server-only";

import { createClient } from "@supabase/supabase-js";
import { serverEnv } from "@/lib/security/env.server";
import type { Database } from "./database.types";

// This privileged client must never be imported by client code. Ownership is
// established from the HttpOnly session before any student query is performed.
export function getDatabase() {
  const url = serverEnv("SUPABASE_URL");
  const key = serverEnv("SUPABASE_SECRET_KEY");
  if (!url || !key) throw new Error("Configure SUPABASE_URL e SUPABASE_SECRET_KEY no servidor.");
  if (!key.startsWith("sb_secret_")) throw new Error("Use a Secret key somente no servidor.");
  if (new URL(url).protocol !== "https:") throw new Error("O Supabase deve usar HTTPS.");
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
