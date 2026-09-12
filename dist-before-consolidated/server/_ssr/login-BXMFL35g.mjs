import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { T as TurnstileWidget, s as sincronizarAposLogin } from "./sync-sZuCbtJ-.mjs";
import { d as useAuth } from "./router-BiedwaEF.mjs";

import "../_libs/seroval.mjs";
import { d as Mail, L as Lock, E as EyeOff, e as Eye } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "./engine-calculo-D3VYcpGG.mjs";
import "./server-DwUI_Cux.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/unenv.mjs";


import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




import "./schemas-Dga4YmnR.mjs";
import "../_libs/zod.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/motion.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function LoginPage() {
  const [mostrarSenha, setMostrarSenha] = reactExports.useState(false);
  const [email, setEmail] = reactExports.useState("");
  const [senha, setSenha] = reactExports.useState("");
  const [website, setWebsite] = reactExports.useState("");
  const [turnstileToken, setTurnstileToken] = reactExports.useState("");
  const [erro, setErro] = reactExports.useState(null);
  const [enviando, setEnviando] = reactExports.useState(false);
  const formularioIniciadoEm = reactExports.useRef(Date.now());
  const {
    entrar
  } = useAuth();
  const navigate = useNavigate();
  const atualizarToken = reactExports.useCallback((token) => setTurnstileToken(token), []);
  async function handleSubmit(evento) {
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
        formularioIniciadoEm: formularioIniciadoEm.current
      });
      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }
      await sincronizarAposLogin();
      await navigate({
        to: "/dashboard"
      });
    } catch {
      setErro("Não foi possível entrar agora. Tente novamente em instantes.");
    } finally {
      setEnviando(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "ff-page", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ff-shell grid gap-10 md:grid-cols-[minmax(0,0.8fr)_minmax(20rem,1.2fr)] md:items-start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-sm md:sticky md:top-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Conta do estudante" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 text-4xl", children: "Entrar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "reading-copy mt-4 text-muted-foreground", children: "A conta sincroniza respostas, progresso e anotações entre sessões." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 border-y border-border py-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SecurityLine, { text: "Senha armazenada apenas como hash" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SecurityLine, { text: "Sessão em cookie inacessível ao JavaScript" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SecurityLine, { text: "Tentativas limitadas no servidor" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "ff-card max-w-xl p-5 sm:p-8", "aria-labelledby": "login-form-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "login-form-title", className: "text-2xl", children: "Seus dados" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "mt-7 space-y-5", onSubmit: handleSubmit, noValidate: true, children: [
        erro && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "alert", className: "border-l-2 border-destructive bg-destructive/8 px-4 py-3 text-sm text-destructive", children: erro }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sr-only", "aria-hidden": "true", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "login-website", children: "Website" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "login-website", name: "website", value: website, onChange: (evento) => setWebsite(evento.target.value), autoComplete: "off", tabIndex: -1 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-2 block text-sm font-bold", htmlFor: "login-email", children: "E-mail" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ff-input-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { "aria-hidden": "true" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "login-email", name: "email", type: "email", value: email, onChange: (evento) => setEmail(evento.target.value.slice(0, 254)), autoComplete: "email", inputMode: "email", maxLength: 254, className: "ff-input", required: true })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-2 block text-sm font-bold", htmlFor: "login-senha", children: "Senha" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ff-input-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { "aria-hidden": "true" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "login-senha", name: "senha", type: mostrarSenha ? "text" : "password", value: senha, onChange: (evento) => setSenha(evento.target.value.slice(0, 128)), autoComplete: "current-password", maxLength: 128, className: "ff-input pr-12", required: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMostrarSenha((valor) => !valor), className: "absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center text-muted-foreground hover:text-foreground", "aria-label": mostrarSenha ? "Ocultar senha" : "Mostrar senha", children: mostrarSenha ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TurnstileWidget, { action: "login", onTokenChange: atualizarToken }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: enviando || !turnstileToken, className: "ff-btn-primary w-full", children: enviando ? "Verificando..." : "Entrar" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 border-t border-border pt-5 text-sm text-muted-foreground", children: [
        "Ainda não tem conta?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/cadastro", className: "font-bold text-primary", children: "Criar conta" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-xs text-muted-foreground", children: [
        "Ao entrar, aplicam-se os",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/termos", className: "underline", children: "Termos de Uso" }),
        " ",
        "e a",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/privacidade", className: "underline", children: "Política de Privacidade" }),
        "."
      ] })
    ] })
  ] }) });
}
function SecurityLine({
  text
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "border-b border-border py-2.5 last:border-b-0", children: text });
}
export {
  LoginPage as component
};
