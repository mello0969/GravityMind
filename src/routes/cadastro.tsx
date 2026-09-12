import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { TurnstileWidget } from "@/components/turnstile-widget";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth/use-auth";
import { sincronizarAposLogin } from "@/lib/sync/sync";

export const Route = createFileRoute("/cadastro")({
  head: () => ({ meta: [{ title: "Criar conta | GRAVITYMIND" }] }),
  component: CadastroPage,
});

function CadastroPage() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [website, setWebsite] = useState("");
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const formularioIniciadoEm = useRef(Date.now());
  const { cadastrar } = useAuth();
  const navigate = useNavigate();
  const atualizarToken = useCallback((token: string) => setTurnstileToken(token), []);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);
    if (!aceitouTermos) {
      setErro("Leia e aceite os Termos de Uso e a Política de Privacidade.");
      return;
    }
    if (!turnstileToken) {
      setErro("Conclua a verificação de segurança.");
      return;
    }
    setEnviando(true);
    try {
      const resultado = await cadastrar(nome, email, senha, {
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
      setErro("Não foi possível criar a conta agora. Revise os dados e tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="ff-page">
      <div className="ff-shell grid gap-10 md:grid-cols-[minmax(0,0.8fr)_minmax(20rem,1.2fr)] md:items-start">
        <section className="max-w-sm md:sticky md:top-24">
          <p className="ff-kicker">Conta do estudante</p>
          <h1 className="mt-3 text-4xl">Criar conta</h1>
          <p className="reading-copy mt-4 text-muted-foreground">
            O cadastro guarda seu progresso no banco para que você possa retomar em outra sessão.
          </p>
          <div className="mt-8 border-y border-border py-2 text-sm">
            <SecurityLine text="Nome, e-mail e senha são validados no servidor" />
            <SecurityLine text="A senha exige pelo menos dez caracteres" />
            <SecurityLine text="Anotações sensíveis usam criptografia na aplicação" />
          </div>
        </section>

        <section className="ff-card max-w-xl p-5 sm:p-8" aria-labelledby="cadastro-form-title">
          <h2 id="cadastro-form-title" className="text-2xl">
            Dados da conta
          </h2>
          <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
            {erro && (
              <div
                role="alert"
                className="border-l-2 border-destructive bg-destructive/8 px-4 py-3 text-sm text-destructive"
              >
                {erro}
              </div>
            )}

            <div className="sr-only" aria-hidden="true">
              <label htmlFor="cadastro-website">Website</label>
              <input
                id="cadastro-website"
                name="website"
                value={website}
                onChange={(evento) => setWebsite(evento.target.value)}
                autoComplete="off"
                tabIndex={-1}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold" htmlFor="cadastro-nome">
                Nome
              </label>
              <div className="ff-input-wrap">
                <User aria-hidden="true" />
                <input
                  id="cadastro-nome"
                  name="nome"
                  value={nome}
                  onChange={(evento) => setNome(evento.target.value.slice(0, 80))}
                  autoComplete="name"
                  minLength={2}
                  maxLength={80}
                  className="ff-input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold" htmlFor="cadastro-email">
                E-mail
              </label>
              <div className="ff-input-wrap">
                <Mail aria-hidden="true" />
                <input
                  id="cadastro-email"
                  name="email"
                  type="email"
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
              <label className="mb-2 block text-sm font-bold" htmlFor="cadastro-senha">
                Senha
              </label>
              <div className="ff-input-wrap">
                <Lock aria-hidden="true" />
                <input
                  id="cadastro-senha"
                  name="senha"
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(evento) => setSenha(evento.target.value.slice(0, 128))}
                  autoComplete="new-password"
                  minLength={10}
                  maxLength={128}
                  className="ff-input pr-12"
                  aria-describedby="senha-ajuda"
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
              <p id="senha-ajuda" className="mt-2 text-xs text-muted-foreground">
                Use entre 10 e 128 caracteres. Uma frase longa costuma ser mais fácil de lembrar.
              </p>
            </div>

            <label
              htmlFor="cadastro-termos"
              className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
            >
              <Checkbox
                id="cadastro-termos"
                checked={aceitouTermos}
                onCheckedChange={(valor) => setAceitouTermos(valor === true)}
                className="mt-0.5 h-5 w-5 rounded-sm"
              />
              <span>
                Li e aceito os{" "}
                <Link to="/termos" className="font-bold text-primary underline">
                  Termos de Uso
                </Link>{" "}
                e a{" "}
                <Link to="/privacidade" className="font-bold text-primary underline">
                  Política de Privacidade
                </Link>
                .
              </span>
            </label>

            <TurnstileWidget action="cadastro" onTokenChange={atualizarToken} />

            <button
              type="submit"
              disabled={enviando || !turnstileToken || !aceitouTermos}
              className="ff-btn-primary w-full"
            >
              {enviando ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <p className="mt-6 border-t border-border pt-5 text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link to="/login" className="font-bold text-primary">
              Entrar
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

function SecurityLine({ text }: { text: string }) {
  return <p className="border-b border-border py-2.5 last:border-b-0">{text}</p>;
}
