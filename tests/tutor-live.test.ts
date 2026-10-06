// @vitest-environment node
import { loadEnv } from "vite";
import { expect, it, vi } from "vitest";

vi.mock("@tanstack/react-start/server-only", () => ({}));

import { requestTutor } from "@/lib/gravity/groq.server";

it.skipIf(import.meta.env.MODE !== "tutor-live")(
  "receives a real Portuguese physics answer from Groq",
  async () => {
    const env = loadEnv("development", process.cwd(), "");
    const apiKey = env.GROQ_API_KEY?.trim();
    if (!apiKey) throw new Error("Configure GROQ_API_KEY before running the live test.");
    const reply = await requestTutor({
      apiKey,
      model: env.GROQ_MODEL || undefined,
      historico: [
        {
          role: "user",
          content:
            "Um bloco de 2 kg recebe força resultante de 6 N. Calculei a = F/m = 3 m/s². Minha conta está certa?",
        },
      ],
    });
    expect(reply.length).toBeGreaterThan(20);
    expect(reply.length).toBeLessThanOrEqual(1500);
    expect(reply.includes(apiKey)).toBe(false);
    expect(reply).toMatch(/3/);
  },
  30_000,
);
