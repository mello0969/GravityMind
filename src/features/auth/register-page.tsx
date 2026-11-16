import { Link } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { TurnstileWidget } from "@/components/turnstile-widget";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthForm } from "./use-auth-form";

export function CadastroPage() {
  const {
    mostrarSenha,
    setMostrarSenha,
    nome,
    setNome,
    email,
    setEmail,
    senha,
    setSenha,
    confirmacaoSenha,
    setConfirmacaoSenha,
    setConfirmacaoVisitada,
    mostrarConfirmacao,
    setMostrarConfirmacao,
    erroConfirmacao,
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
  } = useAuthForm("cadastro");

  return (
    <main className="ff-page">
      <div className="gm-shell gm-auth-layout">
        <section className="gm-auth-intro">
          <Link to="/" className="gm-text-link">
            Voltar ao estudo
          </Link>
          <h1 className="mt-3 text-4xl">Criar conta</h1>
          <p className="reading-copy mt-4 text-muted-foreground">
            O cadastro guarda seu progresso no banco para que você possa retomar em outra sessão.
          </p>
          <p className="gm-auth-formula" aria-hidden="true">
            F = m · a
          </p>
        </section>

        <section className="pt-2" aria-labelledby="cadastro-form-title">
          <h2 id="cadastro-form-title" className="sr-only">
            Dados da conta
          </h2>
          <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
            {erro && (
              <div role="alert" className="border border-border px-4 py-3 text-sm text-destructive">
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
                  autoCapitalize="none"
                  spellCheck={false}
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
                  aria-pressed={mostrarSenha}
                >
                  {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p id="senha-ajuda" className="mt-2 text-xs text-muted-foreground">
                Use entre 10 e 128 caracteres. Uma frase longa costuma ser mais fácil de lembrar.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold" htmlFor="cadastro-confirmacao">
                Confirmar senha
              </label>
              <div className="ff-input-wrap">
                <Lock aria-hidden="true" />
                <input
                  id="cadastro-confirmacao"
                  name="confirmacaoSenha"
                  type={mostrarConfirmacao ? "text" : "password"}
                  value={confirmacaoSenha}
                  onChange={(evento) => setConfirmacaoSenha(evento.target.value)}
                  onBlur={() => setConfirmacaoVisitada(true)}
                  autoComplete="new-password"
                  autoCapitalize="none"
                  spellCheck={false}
                  minLength={10}
                  maxLength={128}
                  className="ff-input pr-12 aria-[invalid=true]:border-destructive"
                  aria-invalid={!!erroConfirmacao}
                  aria-describedby="confirmacao-ajuda"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarConfirmacao((valor) => !valor)}
                  className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center text-muted-foreground hover:text-foreground"
                  aria-label={
                    mostrarConfirmacao
                      ? "Ocultar confirmação da senha"
                      : "Mostrar confirmação da senha"
                  }
                  aria-pressed={mostrarConfirmacao}
                >
                  {mostrarConfirmacao ? (
                    <EyeOff aria-hidden="true" className="h-4 w-4" />
                  ) : (
                    <Eye aria-hidden="true" className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p
                id="confirmacao-ajuda"
                aria-live="polite"
                className={`mt-2 text-xs ${erroConfirmacao ? "text-destructive" : "text-muted-foreground"}`}
              >
                {erroConfirmacao ||
                  (confirmacaoSenha && confirmacaoSenha === senha
                    ? "As senhas coincidem."
                    : "Digite a mesma senha novamente.")}
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

            <TurnstileWidget
              key={verificationAttempt}
              action="cadastro"
              onTokenChange={atualizarToken}
            />

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
