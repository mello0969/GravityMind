import "@tanstack/react-start/server-only";
import { createRequire } from "node:module";
import type { PlatformProxy } from "wrangler";
import type { D1Database } from "./context";

declare global {
  var __gravitymindLocalProxy:
    | Promise<PlatformProxy<Record<string, unknown> & { DB: D1Database }>>
    | undefined;
}
export async function attachLocalBindings(request: Request) {
  if (!import.meta.env.DEV) return;
  if (!globalThis.__gravitymindLocalProxy) {
    const require = createRequire(`${process.cwd()}/package.json`);
    const { getPlatformProxy } = require("wrangler") as typeof import("wrangler");
    globalThis.__gravitymindLocalProxy = getPlatformProxy({
      configPath: "wrangler.jsonc",
      remoteBindings: false,
      persist: true,
    });
  }
  const proxy = await globalThis.__gravitymindLocalProxy;
  const runtime = ("runtime" in request ? request.runtime : {}) as Record<string, unknown>;
  Object.assign(request, { runtime: { ...runtime, cloudflare: { env: proxy.env } } });
}
