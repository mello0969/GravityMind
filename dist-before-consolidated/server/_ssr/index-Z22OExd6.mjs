import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useGSAP } from "../_libs/gsap__react.mjs";
import { g as gsapWithCSS } from "../_libs/gsap.mjs";
import { u as useSiteSettings } from "./router-BiedwaEF.mjs";

import "../_libs/seroval.mjs";
import { A as ArrowRight } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
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
function StaggeredText({
  children,
  className,
  reducedMotion
}) {
  const rootRef = reactExports.useRef(null);
  const words = Array.from(children.matchAll(/\S+/g), (match) => ({
    key: `${match.index}-${match[0]}`,
    value: match[0]
  }));
  useGSAP(
    () => {
      if (reducedMotion) return;
      gsapWithCSS.fromTo(
        "[data-stagger-word]",
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.68,
          stagger: 0.045,
          ease: "power3.out",
          clearProps: "opacity,transform"
        }
      );
    },
    { scope: rootRef, dependencies: [reducedMotion] }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { ref: rootRef, className, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: words.map((word) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "data-stagger-word": true, className: "mr-[0.24em] inline-block", children: word.value }, word.key)) })
  ] });
}
const AppleHeroScene = reactExports.lazy(() => import("./apple-hero-scene-CEXA8ohg.mjs").then((module) => ({
  default: module.AppleHeroScene
})));
function HomePage() {
  const settings = useSiteSettings();
  const reducedMotion = settings.motion === "reduced";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "gm-reference-page overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative isolate h-[38.5rem] min-h-[34rem] overflow-hidden border-b border-[#273c33]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[#08150f]" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppleHeroScene, { reducedMotion }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(OrbitField, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-5 pt-24 text-center sm:pt-32", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-[3rem] font-semibold leading-[1.02] text-[#f3f5f2] sm:text-[3.8rem] lg:text-[4.45rem]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block sm:whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StaggeredText, { reducedMotion, children: "Entenda a força." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block sm:whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StaggeredText, { reducedMotion, children: "Treine o raciocínio." }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-auto mt-9 flex w-full max-w-[33rem] flex-col gap-3 sm:flex-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/questoes", className: "flex min-h-14 flex-1 items-center justify-center gap-4 border border-[#9de7cb] bg-[#9de7cb] px-6 text-base font-semibold text-[#07130e] hover:bg-[#b0efd8]", children: [
            "Começar uma sessão",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-5 w-5", "aria-hidden": "true" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/lei-1", className: "flex min-h-14 flex-1 items-center justify-center border border-[#799087] bg-[#08150f]/80 px-6 text-base font-medium text-[#edf2ee] hover:bg-[#13241d]", children: "Explorar as leis" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "gm-shell grid min-h-[22rem] border-t border-[#294038] lg:grid-cols-[38.2rem_minmax(0,1fr)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-12 lg:pr-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[0.68rem] font-medium tracking-[0.22em] text-[#9bb0a6]", children: "PRÁTICA ADAPTATIVA" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px w-32 bg-[#536960]", "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-7 max-w-[12ch] text-4xl font-semibold leading-[1.08] text-[#f1f4f1]", children: "Questões que se adaptam a você." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-lg leading-relaxed text-[#9eaaa4]", children: [
          "Mesmo assunto. Novos desafios.",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "No seu ritmo."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PracticePreview, {})
    ] })
  ] });
}
function OrbitField() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-none absolute inset-0 z-10", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "h-full w-full", viewBox: "0 0 1536 616", preserveAspectRatio: "xMidYMid slice", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Órbitas de ideias ao redor da maçã" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "768", cy: "305", rx: "544", ry: "165", fill: "none", stroke: "#698077", strokeWidth: "1.2", opacity: "0.72" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "760", cy: "319", rx: "477", ry: "140", fill: "none", stroke: "#53675f", strokeWidth: "1", opacity: "0.55", transform: "rotate(-9 760 319)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "760", cy: "305", rx: "462", ry: "191", fill: "none", stroke: "#8ba096", strokeDasharray: "9 10", strokeWidth: "1.1", opacity: "0.65", transform: "rotate(-22 760 305)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { fill: "#88b9a6", stroke: "#b9d6ca", strokeWidth: "1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "289", cy: "350", r: "10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "411", cy: "191", r: "9" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "1184", cy: "206", r: "11" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "1139", cy: "438", r: "7" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "392", cy: "520", r: "8" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M347 151 405 195", stroke: "#879c93", strokeWidth: "1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "m1213 221 52-34", stroke: "#879c93", strokeWidth: "1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "m1162 443 63 42", stroke: "#879c93", strokeWidth: "1" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-[15%] top-[14%] hidden font-serif text-[1.1rem] italic text-[#b2c3bb] md:block", children: [
      "F = G ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-grid align-middle text-center leading-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "border-b border-[#b2c3bb] px-1", children: "m₁m₂" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pt-1", children: "r²" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "absolute right-[9.5%] top-[24%] hidden font-mono text-[0.66rem] leading-loose tracking-[0.28em] text-[#9aaba3] lg:block", children: [
      "IDEIAS",
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
      "EM ÓRBITA"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "absolute bottom-[17%] right-[11%] hidden font-mono text-[0.66rem] leading-loose tracking-[0.28em] text-[#9aaba3] lg:block", children: [
      "CONHECIMENTO",
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
      "ATRAI"
    ] })
  ] });
}
function PracticePreview() {
  const options = ["7,0 m/s", "9,8 m/s", "10,0 m/s", "14,0 m/s"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "relative -mt-5 w-full max-w-[39rem] self-start border border-[#31483e] bg-[#0a1812]/92 p-4 shadow-[0_14px_34px_rgb(0_0_0/18%)] sm:p-7", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[0.65rem] text-[#91a39a]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Questão 1 de 5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Nível adaptativo" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid gap-7 md:grid-cols-[minmax(0,1fr)_9rem]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-md text-sm leading-relaxed text-[#edf2ee]", children: "Um objeto de 2,0 kg é solto do repouso de uma altura de 5,0 m. Desprezando a resistência do ar, qual é a sua velocidade ao atingir o solo?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid gap-2", children: options.map((option, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex min-h-9 items-center gap-4 border px-3 text-xs ${index === 1 ? "border-[#9de7cb] text-[#b4ead5]" : "border-[#2c453a] text-[#a4b2ab]"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: String.fromCharCode(65 + index) }),
          index === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2.5 w-2.5 rounded-full border-[3px] border-[#9de7cb]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: option })
        ] }, option)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 140 190", className: "mx-auto h-44 w-32 text-[#9cb8aa]", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M66 25c0-12 20-12 20 0 0 12-4 17-10 17s-10-5-10-17Z", fill: "none", stroke: "#e35e62", strokeWidth: "2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M76 25V12", stroke: "#e35e62", strokeWidth: "2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M76 48v105", stroke: "currentColor", strokeDasharray: "6 7" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "m71 143 5 8 5-8", fill: "none", stroke: "currentColor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M26 164h98M32 164l-9 9m22-9-9 9m22-9-9 9m22-9-9 9m22-9-9 9m22-9-9 9", fill: "none", stroke: "currentColor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M112 52v112m-6-112h12m-12 112h12", fill: "none", stroke: "currentColor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "119", y: "112", fill: "currentColor", fontSize: "13", children: "5,0 m" })
      ] })
    ] })
  ] });
}
export {
  HomePage as component
};
