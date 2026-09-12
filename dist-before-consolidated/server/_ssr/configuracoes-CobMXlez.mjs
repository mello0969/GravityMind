import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Switch$1, a as SwitchThumb } from "../_libs/radix-ui__react-switch.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { u as useSiteSettings, S as STORAGE_PREFIX, s as storageKey } from "./router-BiedwaEF.mjs";
import { u as useStudyProfile } from "./use-study-profile-uZPxI3Vs.mjs";

import "../_libs/seroval.mjs";
import { h as Minus, P as Plus } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/motion.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/unenv.mjs";


import "./server-DwUI_Cux.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




import "./schemas-Dga4YmnR.mjs";
import "../_libs/zod.mjs";
import "./study-profile.server-BL4XQx6e.mjs";
const Switch = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Switch$1,
  {
    className: cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      SwitchThumb,
      {
        className: cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = Switch$1.displayName;
const themeOptions = [{
  id: "light",
  label: "Claro"
}, {
  id: "dark",
  label: "Escuro"
}, {
  id: "system",
  label: "Sistema"
}];
function ConfiguracoesPage() {
  const settings = useSiteSettings();
  const {
    profile,
    updateDailyGoal
  } = useStudyProfile();
  const dailyGoal = profile?.dailyGoal ?? 5;
  const exportarDados = reactExports.useCallback(() => {
    const data = {};
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (!key?.startsWith(STORAGE_PREFIX)) continue;
      try {
        data[key] = JSON.parse(window.localStorage.getItem(key) ?? "null");
      } catch {
        data[key] = window.localStorage.getItem(key);
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `gravitymind-dados-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "ff-page overflow-x-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ff-shell", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "max-w-3xl border-b border-border pb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Preferências do estudo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 text-4xl md:text-5xl", children: "Um ambiente que respeita seu ritmo." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground", children: "Ajustes visuais ficam neste aparelho. O modo foco reduz distrações durante as sessões de questões, sem limitar o conteúdo." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-12 py-10 lg:grid-cols-[15rem_minmax(0,1fr)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "focus-optional lg:sticky lg:top-24 lg:self-start", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { "aria-label": "Seções das preferências", className: "grid gap-1 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#aparencia", className: "border-b-2 border-primary px-1 py-2 font-semibold", children: "Aparência" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#foco", className: "border-b border-border px-1 py-2 text-muted-foreground", children: "Apoio ao foco" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#dados", className: "border-b border-border px-1 py-2 text-muted-foreground", children: "Meus dados" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "aparencia", "aria-labelledby": "titulo-aparencia", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "titulo-aparencia", className: "text-2xl", children: "Aparência e leitura" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ff-divider-list mt-5 border-b border-t border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { title: "Tema", description: "Escolha uma superfície clara, escura ou igual ao sistema.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "sr-only", children: "Tema" }),
              themeOptions.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", "aria-pressed": settings.theme === option.id, onClick: () => settings.setTheme(option.id), className: `flex min-h-11 items-center gap-2 border px-3 py-2 text-sm font-semibold ${settings.theme === option.id ? "border-primary text-primary" : "border-border text-muted-foreground"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeSwatch, { theme: option.id }),
                option.label
              ] }, option.id))
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { title: "Texto maior", description: "Aumenta a escala tipográfica de toda a interface, incluindo títulos, controles e textos de leitura.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { "aria-label": "Usar texto maior", checked: settings.reading === "large", onCheckedChange: (checked) => settings.setReading(checked ? "large" : "standard") }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { title: "Movimento reduzido", description: "Desliga animações de rolagem e transições longas.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { "aria-label": "Reduzir movimento", checked: settings.motion === "reduced", onCheckedChange: (checked) => settings.setMotion(checked ? "reduced" : "full") }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "foco", "aria-labelledby": "titulo-foco", className: "pt-16", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "titulo-foco", className: "text-2xl", children: "Apoio ao foco" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground", children: "Sessões curtas, uma tarefa de cada vez, progresso visível e pausas sugeridas. Esse ajuste pode ajudar quem se distrai com facilidade, com ou sem diagnóstico de TDAH." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ff-divider-list mt-5 border-b border-t border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { title: "Modo foco", description: "Simplifica a navegação e prioriza a questão atual.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { "aria-label": "Ativar modo foco", checked: settings.focusMode, onCheckedChange: settings.setFocusMode }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { title: "Duração da sessão", description: "Define quando sugerir uma pausa.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "flex", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "sr-only", children: "Duração da sessão" }),
              [5, 10, 15].map((minutes) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", "aria-pressed": settings.sessionMinutes === minutes, onClick: () => settings.setSessionMinutes(minutes), className: `min-h-11 border px-4 text-sm font-semibold first:border-r-0 last:border-l-0 ${settings.sessionMinutes === minutes ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"}`, children: [
                minutes,
                " min"
              ] }, minutes))
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { title: "Meta diária", description: "Define quantas questões formam o objetivo do dia. Em uma conta, a meta fica salva no D1.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[2.75rem_5.5rem_2.75rem] border border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => void updateDailyGoal(Math.max(1, dailyGoal - 1)), disabled: dailyGoal <= 1, className: "grid h-11 place-items-center border-r border-border disabled:opacity-40", "aria-label": "Diminuir meta diária", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-4 w-4", "aria-hidden": "true" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("output", { className: "grid h-11 place-items-center font-mono text-sm font-bold", children: [
                dailyGoal,
                " questões"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => void updateDailyGoal(Math.min(40, dailyGoal + 1)), disabled: dailyGoal >= 40, className: "grid h-11 place-items-center border-l border-border disabled:opacity-40", "aria-label": "Aumentar meta diária", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4", "aria-hidden": "true" }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { title: "Lembrete de pausa", description: "Sugere levantar, beber água ou respirar ao fim da sessão.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { "aria-label": "Lembrar de fazer pausas", checked: settings.breakReminders, onCheckedChange: settings.setBreakReminders }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { title: "Mostrar cronômetro", description: "Deixe desligado se contar o tempo causar pressão.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { "aria-label": "Mostrar cronômetro", checked: settings.showTimer, onCheckedChange: settings.setShowTimer }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "dados", "aria-labelledby": "titulo-dados", className: "pt-16", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "titulo-dados", className: "text-2xl", children: "Meus dados" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ff-divider-list mt-5 border-b border-t border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { title: "Exportar dados deste aparelho", description: "Baixa notas, progresso e respostas em formato JSON.", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ff-btn-outline", onClick: exportarDados, children: "Exportar" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { title: "Privacidade", description: "Veja quais dados são usados e como são protegidos.", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/privacidade", className: "ff-btn-outline", children: "Ler política" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SettingRow, { title: "Preferência de cookies", description: "Apague sua escolha para revisar o consentimento no rodapé.", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ff-btn-outline", onClick: () => {
              window.localStorage.removeItem(storageKey("cookie-consent"));
              window.location.reload();
            }, children: "Rever escolha" }) })
          ] })
        ] })
      ] })
    ] })
  ] }) });
}
function ThemeSwatch({
  theme
}) {
  if (theme === "system") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex h-5 w-5 overflow-hidden border border-border", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-full w-1/2 bg-[#ECEFEA]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-full w-1/2 bg-[#17221E]" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-5 w-5 border border-border ${theme === "light" ? "bg-[#ECEFEA]" : "bg-[#17221E]"}`, "aria-hidden": "true" });
}
function SettingRow({
  title,
  description,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-5 py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground", children: description })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "justify-self-start sm:justify-self-end", children })
  ] });
}
export {
  ConfiguracoesPage as component
};
