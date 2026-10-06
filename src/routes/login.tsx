import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { TurnstileWidget } from "@/components/turnstile-widget";
import { useAuth } from "@/lib/auth/use-auth";
import { sincronizarAposLogin } from "@/lib/sync/sync";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar | GRAVITYMIND" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [website, setWebsite] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [verificationAttempt, setVerificationAttempt] = useState(0);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const formularioIniciadoEm = useRef(Date.now());
  const { entrar } = useAuth();
  const navigate = useNavigate();
  const atualizarToken = useCallback((token: string) => setTurnstileToken(token), []);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);
    if (!turnstileToken) {
      setErro("Conclua a verificação de segurança.");
      return;
    }
    setEnviando(true);
    try {
      const resultado = await entrar(email, senha, {
        turnstileToken,
        website,
        formularioIniciadoEm: formularioIniciadoEm.current,
      });
      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }
      await sincronizarAposLogin();
      await navigate({ to: "/dashboard" });
    } catch {
      setErro("Não foi possível entrar agora. Tente novamente em instantes.");
    } finally {
      setEnviando(false);
      setTurnstileToken("");
      setVerificationAttempt((attempt) => attempt + 1);
    }
  }

  return (
    <main className="ff-page">
      <div className="gm-shell gm-auth-layout">
        <section className="gm-auth-intro">
          <Link to="/" className="gm-text-link">
            Voltar ao estudo
          </Link>
          <h1 className="mt-3 text-4xl">Entrar</h1>
          <p className="reading-copy mt-4 text-muted-foreground">
            A conta sincroniza respostas, progresso e anotações entre sessões.
          </p>
          <p className="gm-auth-formula" aria-hidden="true">
            F = m · a
          </p>
        </section>

        <section className="pt-2" aria-labelledby="login-form-title">
          <h2 id="login-form-title" className="sr-only">
            Seus dados
          </h2>
          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            {erro && (
              <div role="alert" className="border border-border px-4 py-3 text-sm text-destructive">
                {erro}
              </div>
            )}

            <div className="sr-only" aria-hidden="true">
              <label htmlFor="login-website">Website</label>
              <input
                id="login-website"
                name="website"
                value={website}
                onChange={(evento) => setWebsite(evento.target.value)}
                autoComplete="off"
                tabIndex={-1}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold" htmlFor="login-email">
                E-mail
              </label>
              <div className="ff-input-wrap">
                <Mail aria-hidden="true" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  spellCheck={false}
                  value={email}
                  onChange={(evento) => setEmail(evento.target.value.slice(0, 254))}
                  autoComplete="email"
                  inputMode="email"
                  maxLength={254}
                  className="ff-input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold" htmlFor="login-senha">
                Senha
              </label>
              <div className="ff-input-wrap">
                <Lock aria-hidden="true" />
                <input
                  id="login-senha"
                  name="senha"
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(evento) => setSenha(evento.target.value.slice(0, 128))}
                  autoComplete="current-password"
                  maxLength={128}
                  className="ff-input pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((valor) => !valor)}
                  className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center text-muted-foreground hover:text-foreground"
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <TurnstileWidget
              key={verificationAttempt}
              action="login"
              onTokenChange={atualizarToken}
            />

            <button
              type="submit"
              disabled={enviando || !turnstileToken}
              className="ff-btn-primary w-full"
            >
              {enviando ? "Verificando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-6 border-t border-border pt-5 text-sm text-muted-foreground">
            Ainda não tem conta?{" "}
            <Link to="/cadastro" className="font-bold text-primary">
              Criar conta
            </Link>
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Ao entrar, aplicam-se os{" "}
            <Link to="/termos" className="underline">
              Termos de Uso
            </Link>{" "}
            e a{" "}
            <Link to="/privacidade" className="underline">
              Política de Privacidade
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
