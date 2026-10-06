import "@tanstack/react-start/server-only";
import { getRequest } from "@tanstack/react-start/server";

export function serverEnv(name: string): string | undefined {
  const request = getRequest() as Request & {
    runtime?: { cloudflare?: { env?: Record<string, unknown> } };
  };
  const value = request.runtime?.cloudflare?.env?.[name] ?? process.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
