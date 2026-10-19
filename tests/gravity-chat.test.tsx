import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GravityChat } from "@/components/gravity-chat";
import { enviarMensagemGravity } from "@/lib/gravity/client";
import type { TutorEntry } from "@/lib/gravity/conversations";

vi.mock("@/lib/gravity/conversations.server", () => ({ saveTutorNote: vi.fn() }));

vi.mock("@/lib/auth/use-auth", () => ({
  useAuth: () => ({ usuario: { id: "qa-tutor" }, carregando: false }),
}));
vi.mock("@/lib/gravity/client", () => ({
  enviarMensagemGravity: vi.fn(),
  GravityError: class extends Error {},
}));

describe("Tutor message formatting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(Element.prototype, "scrollTo", {
      configurable: true,
      value: vi.fn(),
    });
  });

  async function conversar(reply: string, pergunta = "Como funciona na prática?") {
    vi.mocked(enviarMensagemGravity).mockResolvedValue(reply);
    const user = userEvent.setup();
    render(<GravityChat />);
    await user.type(screen.getByRole("textbox", { name: "Sua pergunta de Física" }), pergunta);
    await user.click(screen.getByRole("button", { name: "Enviar pergunta" }));
    const log = screen.getByRole("log", { name: "Mensagens da conversa" });
    await waitFor(() => expect(log.querySelectorAll(".gm-chat-message")).toHaveLength(2));
    return log;
  }

  it("renders assistant bold without markers, preserves line breaks and keeps user text literal", async () => {
    const pergunta = "**Como funciona na prática?**";
    const reply =
      "**Como funciona na prática?**\nPense num ônibus. A **inércia** mantém o movimento.";
    const log = await conversar(reply, pergunta);
    const emphasis = log.querySelectorAll("strong");
    expect(emphasis).toHaveLength(2);
    expect(emphasis[0]).toHaveTextContent("Como funciona na prática?");
    expect(emphasis[1]).toHaveTextContent("inércia");
    expect(emphasis[0].parentElement?.textContent).toBe(
      "Como funciona na prática?\nPense num ônibus. A inércia mantém o movimento.",
    );
    expect(within(log).getByText(pergunta)).toBeInTheDocument();
    expect(enviarMensagemGravity).toHaveBeenCalledWith(
      [{ role: "user", content: pergunta }],
      undefined,
    );
  });

  it.each([
    "A força é 2 * 3 = 6 N. **Um destaque incompleto",
    '<img src=x onerror="alert(1)"> <script>alert(1)</script>',
    "F = m · a\na = 6/2 = 3 m/s²",
  ])("preserves plain text safely: %s", async (reply) => {
    const log = await conversar(reply, "Me explica?");
    expect(log.querySelectorAll(".gm-chat-message")[1]?.textContent).toBe(reply);
    expect(log.querySelector("img, script, strong")).toBeNull();
  });

  it("saves the question before generation, then the answer, without erasing history", async () => {
    const calls: TutorEntry[][] = [];
    const first: TutorEntry = { id: crypto.randomUUID(), role: "user", content: "Pergunta antiga" };
    const persist = vi.fn(async (messages: TutorEntry[]) => {
      calls.push(messages);
    });
    vi.mocked(enviarMensagemGravity).mockResolvedValue("A força muda o movimento.");
    const user = userEvent.setup();
    render(
      <GravityChat
        conversationId={crypto.randomUUID()}
        initialMessages={[first]}
        onPersist={persist}
      />,
    );
    await user.type(screen.getByRole("textbox", { name: "Sua pergunta de Física" }), "E a força?");
    await user.click(screen.getByRole("button", { name: "Enviar pergunta" }));
    await waitFor(() => expect(persist).toHaveBeenCalledTimes(2));
    expect(calls[0].map((item) => item.role)).toEqual(["user", "user"]);
    expect(calls[1].map((item) => item.role)).toEqual(["user", "user", "assistant"]);
    expect(calls[1][0]).toEqual(first);
    expect(screen.queryByRole("button", { name: "Reiniciar conversa" })).toBeNull();
  });

  it("keeps unsaved messages visible and offers retry when storage fails", async () => {
    const persist = vi
      .fn()
      .mockRejectedValueOnce(new Error("Falha de conexão"))
      .mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<GravityChat conversationId={crypto.randomUUID()} onPersist={persist} />);
    await user.type(
      screen.getByRole("textbox", { name: "Sua pergunta de Física" }),
      "O que é força?",
    );
    await user.click(screen.getByRole("button", { name: "Enviar pergunta" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Falha de conexão");
    expect(screen.getByText("O que é força?")).toBeVisible();
    expect(enviarMensagemGravity).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Tentar salvar" }));
    await waitFor(() => expect(persist).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
  });

  it("uses an in-app dialog for clearing the compact conversation", async () => {
    await conversar("Uma explicação simples.");
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Reiniciar conversa" }));
    expect(screen.getByRole("dialog", { name: "Limpar esta conversa?" })).toBeVisible();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByText("Uma explicação simples.")).toBeVisible();
  });
});
