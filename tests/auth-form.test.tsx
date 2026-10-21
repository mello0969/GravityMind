import { act, renderHook } from "@testing-library/react";
import type { FormEvent } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthForm } from "@/features/auth/use-auth-form";

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
  register: vi.fn(),
  sync: vi.fn(),
  navigate: vi.fn(),
}));
vi.mock("@/lib/auth/use-auth", () => ({
  useAuth: () => ({ entrar: mocks.login, cadastrar: mocks.register }),
}));
vi.mock("@/lib/sync/sync", () => ({ sincronizarAposLogin: mocks.sync }));
vi.mock("@tanstack/react-router", () => ({ useNavigate: () => mocks.navigate }));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.login.mockResolvedValue({ usuario: { id: "student" } });
  mocks.register.mockResolvedValue({ usuario: { id: "student" } });
  mocks.sync.mockResolvedValue(undefined);
  mocks.navigate.mockResolvedValue(undefined);
});
function submitEvent() {
  return {
    preventDefault: vi.fn(),
    currentTarget: document.createElement("form"),
  } as unknown as FormEvent<HTMLFormElement>;
}

describe("shared authentication form controller", () => {
  it("does not submit before human verification", async () => {
    const { result } = renderHook(() => useAuthForm("login"));
    await act(() => result.current.handleSubmit(submitEvent()));
    expect(result.current.erro).toContain("verificação");
    expect(mocks.login).not.toHaveBeenCalled();
  });
  it("requires acceptance of terms before registering", async () => {
    const { result } = renderHook(() => useAuthForm("cadastro"));
    act(() => result.current.atualizarToken("test-verification"));
    await act(() => result.current.handleSubmit(submitEvent()));
    expect(result.current.erro).toContain("Termos de Uso");
    expect(mocks.register).not.toHaveBeenCalled();
  });
  it("focuses invalid native fields without contacting the server", async () => {
    const { result } = renderHook(() => useAuthForm("login"));
    const event = submitEvent();
    event.currentTarget.innerHTML = '<input type="email" required>';
    const focus = vi.spyOn(event.currentTarget.querySelector("input") as HTMLInputElement, "focus");
    await act(() => result.current.handleSubmit(event));
    expect(focus).toHaveBeenCalled();
    expect(mocks.login).not.toHaveBeenCalled();
  });
  it.each(["login", "cadastro"] as const)(
    "%s synchronizes before navigation and resets verification",
    async (mode) => {
      const { result } = renderHook(() => useAuthForm(mode));
      act(() => {
        result.current.setNome("Aluno de teste");
        result.current.setEmail("aluno@example.test");
        result.current.setSenha("test-password-only");
        result.current.setAceitouTermos(true);
        result.current.atualizarToken("test-verification");
      });
      await act(() => result.current.handleSubmit(submitEvent()));
      const method = mode === "login" ? mocks.login : mocks.register;
      expect(method).toHaveBeenCalledOnce();
      expect(method.mock.calls[0].at(-1)).toMatchObject({
        turnstileToken: "test-verification",
        website: "",
        formularioIniciadoEm: expect.any(Number),
      });
      expect(mocks.sync).toHaveBeenCalledOnce();
      expect(mocks.navigate).toHaveBeenCalledWith({ to: "/dashboard" });
      expect(mocks.sync.mock.invocationCallOrder[0]).toBeLessThan(
        mocks.navigate.mock.invocationCallOrder[0],
      );
      expect(result.current).toMatchObject({
        turnstileToken: "",
        verificationAttempt: 1,
        enviando: false,
      });
    },
  );
  it("surfaces server errors without navigating", async () => {
    mocks.login.mockResolvedValueOnce({ erro: "Credenciais inválidas" });
    const { result } = renderHook(() => useAuthForm("login"));
    act(() => result.current.atualizarToken("test-verification"));
    await act(() => result.current.handleSubmit(submitEvent()));
    expect(result.current.erro).toBe("Credenciais inválidas");
    expect(result.current.turnstileToken).toBe("");
    expect(mocks.sync).not.toHaveBeenCalled();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });
  it("ignores duplicate submissions while the first request is pending", async () => {
    let resolveLogin: (value: { erro: string }) => void = () => {};
    mocks.login.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveLogin = resolve;
      }),
    );
    const { result } = renderHook(() => useAuthForm("login"));
    act(() => result.current.atualizarToken("test-verification"));
    await act(async () => {
      const first = result.current.handleSubmit(submitEvent());
      const second = result.current.handleSubmit(submitEvent());
      resolveLogin({ erro: "Teste concluído" });
      await Promise.all([first, second]);
    });
    expect(mocks.login).toHaveBeenCalledOnce();
  });
});
