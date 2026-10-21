// @vitest-environment node
import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { validStripeSignature } from "@/lib/billing/stripe-signature";
import { handleStripeWebhook } from "@/lib/billing/webhook.server";

const mocks = vi.hoisted(() => ({ find: vi.fn(), save: vi.fn(), env: vi.fn() }));
vi.mock("@tanstack/react-start/server-only", () => ({}));
vi.mock("@/lib/billing/subscriptions.server", () => ({
  findSubscriber: mocks.find,
  savePlusSubscription: mocks.save,
}));
vi.mock("@/lib/security/env.server", () => ({ serverEnv: mocks.env }));
const secret = "test-signature-secret";
const owner = "00000000-0000-4000-8000-000000000001";
function signature(payload: string, timestamp = Math.floor(Date.now() / 1000)) {
  return `t=${timestamp},v1=${createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex")}`;
}
function request(event: unknown) {
  const payload = JSON.stringify(event);
  return new Request("https://example.test/api/stripe-webhook", {
    method: "POST",
    body: payload,
    headers: { "stripe-signature": signature(payload) },
  });
}
beforeEach(() => {
  vi.clearAllMocks();
  mocks.env.mockReturnValue(secret);
  mocks.find.mockResolvedValue(owner);
  mocks.save.mockResolvedValue(undefined);
});
afterEach(() => vi.restoreAllMocks());

describe("Stripe signature validation", () => {
  it("accepts a valid signature and rejects tampering and expired requests", async () => {
    expect(await validStripeSignature("payload", signature("payload"), secret)).toBe(true);
    expect(await validStripeSignature("changed", signature("payload"), secret)).toBe(false);
    expect(
      await validStripeSignature(
        "payload",
        signature("payload", Math.floor(Date.now() / 1000) - 301),
        secret,
      ),
    ).toBe(false);
    expect(await validStripeSignature("payload", "v1=missing-timestamp", secret)).toBe(false);
  });
});
describe("webhook application service", () => {
  it("rejects unsigned or unconfigured requests before persistence", async () => {
    expect(
      (
        await handleStripeWebhook(
          new Request("https://example.test", { method: "POST", body: "{}" }),
        )
      ).status,
    ).toBe(400);
    mocks.env.mockReturnValue(undefined);
    expect(
      (await handleStripeWebhook(request({ type: "checkout.session.completed" }))).status,
    ).toBe(400);
    expect(mocks.save).not.toHaveBeenCalled();
  });
  it("ignores unrelated events without accessing subscriptions", async () => {
    const response = await handleStripeWebhook(
      request({ type: "invoice.created", data: { object: { status: null } } }),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(mocks.find).not.toHaveBeenCalled();
    expect(mocks.save).not.toHaveBeenCalled();
  });
  it("accepts only whitelisted subscription fields from a signed checkout event", async () => {
    const response = await handleStripeWebhook(
      request({
        type: "checkout.session.completed",
        data: {
          object: {
            metadata: { user_id: owner },
            subscription: { id: "sub_test" },
            customer: "cus_test",
            plano: "admin",
            user_id: "other",
          },
        },
      }),
    );
    expect(response.status).toBe(200);
    expect(mocks.save).toHaveBeenCalledWith(owner, {
      status: "active",
      provider_customer_id: "cus_test",
      provider_subscription_id: "sub_test",
    });
  });
  it("finds the owner by subscription when metadata is absent and cancels deleted subscriptions", async () => {
    const response = await handleStripeWebhook(
      request({
        type: "customer.subscription.deleted",
        data: { object: { id: "sub_test", status: "active", current_period_end: 1800000000 } },
      }),
    );
    expect(response.status).toBe(200);
    expect(mocks.find).toHaveBeenCalledWith("sub_test");
    expect(mocks.save).toHaveBeenCalledWith(
      owner,
      expect.objectContaining({
        status: "canceled",
        valida_ate: new Date(1800000000000).toISOString(),
      }),
    );
  });
  it("rejects malformed signed events instead of trusting a type cast", async () => {
    const response = await handleStripeWebhook(
      request({
        type: "checkout.session.completed",
        data: { object: { metadata: { user_id: { unexpected: true } } } },
      }),
    );
    expect(response.status).toBe(400);
    expect(mocks.save).not.toHaveBeenCalled();
  });
  it("returns a safe failure when persistence is unavailable", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.save.mockRejectedValueOnce(new Error("internal database detail"));
    const response = await handleStripeWebhook(
      request({
        type: "checkout.session.completed",
        data: { object: { metadata: { user_id: owner }, subscription: "sub_test" } },
      }),
    );
    expect(response.status).toBe(500);
    expect(await response.text()).not.toContain("internal database detail");
  });
});
