import { useNavigate } from "@tanstack/react-router";
import { type FormEvent, useCallback, useRef, useState } from "react";
import { useAuth } from "@/lib/auth/use-auth";
import { sincronizarAposLogin } from "@/lib/sync/sync";

export function useAuthForm(mode: "login" | "cadastro") {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [website, setWebsite] = useState("");
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [verificationAttempt, setVerificationAttempt] = useState(0);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const formularioIniciadoEm = useRef(Date.now());
  const submitting = useRef(false);
  const { entrar, cadastrar } = useAuth();
  const navigate = useNavigate();
  const atualizarToken = useCallback((token: string) => setTurnstileToken(token), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    setErro(null);
    if (!event.currentTarget.checkValidity()) {
      setErro(
        mode === "login"
          ? "Confira seu e-mail e preencha a senha."
          : "Confira seu nome, e-mail e senha antes de continuar.",
      );
      event.currentTarget.querySelector<HTMLInputElement>("input:invalid")?.focus();
      return;
    }
    if (mode === "cadastro" && !aceitouTermos) {
      setErro("Leia e aceite os Termos de Uso e a Política de Privacidade.");
      return;
    }
    if (!turnstileToken) {
      setErro("Conclua a verificação de segurança.");
      return;
    }
    submitting.current = true;
    setEnviando(true);
    try {
      const proof = { turnstileToken, website, formularioIniciadoEm: formularioIniciadoEm.current };
      const result =
        mode === "login"
          ? await entrar(email, senha, proof)
          : await cadastrar(nome, email, senha, proof);
      if (result.erro) {
        setErro(result.erro);
        return;
      }
      await sincronizarAposLogin();
      await navigate({ to: "/dashboard" });
    } catch {
      setErro(
        mode === "login"
          ? "Não foi possível entrar agora. Tente novamente em instantes."
          : "Não foi possível criar a conta agora. Revise os dados e tente novamente.",
      );
    } finally {
      submitting.current = false;
      setEnviando(false);
      setTurnstileToken("");
      setVerificationAttempt((attempt) => attempt + 1);
    }
  }

  return {
    mostrarSenha,
    setMostrarSenha,
    nome,
    setNome,
    email,
    setEmail,
    senha,
    setSenha,
    website,
    setWebsite,
    aceitouTermos,
    setAceitouTermos,
    turnstileToken,
    verificationAttempt,
    erro,
    enviando,
    atualizarToken,
    handleSubmit,
  };
}
