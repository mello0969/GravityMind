// @vitest-environment node
import { describe, expect, it } from "vitest";
import { limitRequestBody } from "@/lib/security/request-limits";

describe("request size limits", () => {
  it("preserves a valid payload and Cloudflare bindings", async () => {
    const req = Object.assign(
      new Request("https://example.test/_serverFn/x", { method: "POST", body: '{"ok":true}' }),
      { runtime: { cloudflare: { env: { DB: "bound" } } } },
    );
    const result = await limitRequestBody(req);
    expect(result).toBeInstanceOf(Request);
    expect(await result.text()).toBe('{"ok":true}');
    expect((result as typeof req).runtime).toEqual(req.runtime);
  });
  it("rejects a large body even without content-length", async () => {
    const result = await limitRequestBody(
      new Request("https://example.test/_serverFn/x", {
        method: "POST",
        body: "x".repeat(1_100_001),
      }),
    );
    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(413);
  });
});
