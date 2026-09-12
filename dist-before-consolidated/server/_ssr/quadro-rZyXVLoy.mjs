import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { W as Whiteboard } from "./whiteboard-C4Bt4Yil.mjs";
import { u as useSiteSettings } from "./router-BiedwaEF.mjs";

import "../_libs/seroval.mjs";
import { X, u as Focus } from "../_libs/lucide-react.mjs";

import "../_libs/radix-ui__react-slider.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/isbot.mjs";
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
function QuadroPage() {
  const settings = useSiteSettings();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "ff-page study-focus-shell", "data-focus": settings.focusMode ? "true" : "false", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ff-shell relative", children: [
    settings.focusMode && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "ff-btn-outline absolute right-0 top-0 z-10", onClick: () => settings.setFocusMode(false), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4", "aria-hidden": "true" }),
      "Sair do foco"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "focus-optional grid gap-6 border-b border-border pb-7 md:grid-cols-[1fr_auto] md:items-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "ff-kicker", children: "Ferramenta de estudo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 text-3xl sm:text-4xl", children: "Quadro de resolução" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "reading-copy mt-3 text-muted-foreground", children: "Desenhe diagramas de força, escreva cálculos e exporte a resolução. Imagens ficam limitadas a formatos e dimensões seguros." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "ff-btn-outline w-fit", onClick: () => settings.setFocusMode(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Focus, { className: "h-4 w-4", "aria-hidden": "true" }),
        "Entrar no modo foco"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "study-focus-surface mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Whiteboard, {}) })
  ] }) });
}
export {
  QuadroPage as component
};
