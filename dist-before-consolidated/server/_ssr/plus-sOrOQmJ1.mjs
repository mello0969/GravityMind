import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { C as Checkbox } from "./checkbox-CS0hjTwr.mjs";
import { R as Route$7, d as useAuth, k as createSsrRpc } from "./router-BiedwaEF.mjs";
import { c as createServerFn } from "./server-DwUI_Cux.mjs";
import { u as useStudyProfile } from "./use-study-profile-uZPxI3Vs.mjs";

import "../_libs/seroval.mjs";
import { A as ArrowRight, f as Check, h as Minus } from "../_libs/lucide-react.mjs";
import { o as objectType, l as literalType } from "../_libs/zod.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/motion.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/unenv.mjs";


import "./schemas-Dga4YmnR.mjs";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




import "./study-profile.server-BL4XQx6e.mjs";
const RESTING_TRANSFORM = "perspective(900px) rotateX(5deg) rotateY(-9deg) rotateZ(-4deg)";
function CreditCardPreview({ holderName }) {
  const [transform, setTransform] = reactExports.useState(RESTING_TRANSFORM);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-full max-w-[23rem] [perspective:900px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      role: "img",
      className: "relative aspect-[1.586/1] overflow-hidden border border-[#5d756a] bg-[#10211a] p-6 text-[#edf2ed] shadow-[0_18px_38px_rgb(0_0_0/35%)] transition-transform duration-150 ease-out",
      style: { transform },
      onPointerMove: (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        setTransform(
          `perspective(900px) rotateX(${5 - y * 8}deg) rotateY(${-9 + x * 10}deg) rotateZ(-4deg)`
        );
      },
      onPointerLeave: () => setTransform(RESTING_TRANSFORM),
      "aria-label": "Prévia visual de cartão. Nenhum dado bancário é solicitado nesta tela.",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "svg",
          {
            className: "absolute inset-0 h-full w-full opacity-35",
            viewBox: "0 0 500 315",
            "aria-hidden": "true",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { fill: "none", strokeWidth: "1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M-20 62c90-68 153 42 241-6s120-71 209-16 95-13 111-24", stroke: "#42725e" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M-30 92c93-65 159 46 247-3s118-70 206-14 100-14 128-30", stroke: "#355f50" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M-18 130c84-55 149 44 236 4s126-75 214-17 92-12 120-35", stroke: "#315545" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M-30 211c92-62 163 43 252 0s127-70 216-11 91-9 119-32", stroke: "#355f50" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M-18 250c88-64 158 44 247 1s122-67 210-9 93-7 118-26", stroke: "#8d392d" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M14 286c78-55 145 35 226-4s113-58 195-8 84 0 112-17", stroke: "#9d4132" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative font-mono text-[0.62rem] tracking-[0.24em] text-[#dbe5df]", children: "GRAVITYMIND" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-6 bottom-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xl font-medium tracking-[0.08em]", children: "••••  ••••  ••••  4821" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-end justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-mono text-xs uppercase text-[#dce5e0]", children: holderName.trim() || "ESTUDANTE GRAVITYMIND" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm", children: "04/28" })
          ] })
        ] })
      ]
    }
  ) });
}
const VERTEX_SHADER = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;
const FRAGMENT_SHADER = `
precision mediump float;
uniform vec2 resolution;
uniform vec2 pointer;

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
  vec2 focus = (pointer * 2.0 - 1.0) * vec2(0.55, -0.45);
  float radius = length(uv - focus);
  float ringA = smoothstep(0.035, 0.0, abs(radius - 0.52));
  float ringB = smoothstep(0.025, 0.0, abs(radius - 0.82));
  float axis = smoothstep(0.018, 0.0, abs(uv.y + uv.x * 0.23));
  vec3 graphite = vec3(0.045, 0.085, 0.068);
  vec3 mineral = vec3(0.34, 0.58, 0.47);
  vec3 apple = vec3(0.56, 0.12, 0.11);
  vec3 color = graphite + mineral * ringA * 0.44 + mineral * ringB * 0.2 + apple * axis * 0.14;
  gl_FragColor = vec4(color, 1.0);
}`;
function compile(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}
function ShaderPlanSurface() {
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power"
    });
    if (!canvas || !gl) return;
    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    const selectProgram = gl.useProgram.bind(gl);
    selectProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, "resolution");
    const pointer = gl.getUniformLocation(program, "pointer");
    const cursor = { x: 0.67, y: 0.4 };
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolution, width, height);
      gl.uniform2f(pointer, cursor.x, cursor.y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    const handlePointer = (event) => {
      const rect = canvas.getBoundingClientRect();
      cursor.x = (event.clientX - rect.left) / rect.width;
      cursor.y = (event.clientY - rect.top) / rect.height;
      draw();
    };
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    canvas.addEventListener("pointermove", handlePointer, { passive: true });
    draw();
    return () => {
      observer.disconnect();
      canvas.removeEventListener("pointermove", handlePointer);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, className: "absolute inset-0 h-full w-full" });
}
const checkoutSchema = objectType({
  plan: literalType("plus"),
  acceptedRecurringCharge: literalType(true)
}).strict();
const createPlusCheckoutServerFn = createServerFn({
  method: "POST"
}).validator((input) => checkoutSchema.parse(input)).handler(createSsrRpc("83ca8cb5f515b9a8c3b32187ffcff14c02859c244b212c07f5757b7f904a54c9"));
const essentialFeatures = [["Flash Cards e prática", true], ["Acompanhamento de progresso", true], ["Tutor completo", false], ["Decks avançados", false], ["Metas sincronizadas", false]];
const plusFeatures = ["Flash Cards e prática", "Acompanhamento de progresso", "Tutor completo", "Decks avançados", "Metas sincronizadas"];
function PlusPage() {
  const {
    checkout
  } = Route$7.useSearch();
  const {
    usuario,
    carregando
  } = useAuth();
  const {
    profile
  } = useStudyProfile();
  const [accepted, setAccepted] = reactExports.useState(false);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [holderName, setHolderName] = reactExports.useState(usuario?.nome ?? "");
  async function startCheckout(event) {
    event.preventDefault();
    if (!usuario) {
      setError("Entre na sua conta para continuar no checkout seguro.");
      return;
    }
    if (!accepted || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await createPlusCheckoutServerFn({
        data: {
          plan: "plus",
          acceptedRecurringCharge: true
        }
      });
      if (result.url) {
        window.location.assign(result.url);
        return;
      }
      setError(result.error ?? "Não foi possível iniciar o checkout.");
    } catch {
      setError("Não foi possível iniciar o checkout.");
    } finally {
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "gm-reference-page py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto w-[calc(100%-2rem)] max-w-[77rem] sm:w-[calc(100%-3rem)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-semibold sm:text-[2.75rem]", children: "GRAVITYMIND Plus" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-2xl text-muted-foreground", children: "Mais recursos para ir além." })
    ] }),
    checkout && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 border-l-2 border-primary px-4 py-2 text-sm", role: "status", children: checkout === "success" ? "Checkout concluído. O acesso é liberado após a confirmação assinada do Stripe." : "Checkout cancelado. Nenhuma alteração foi feita no seu plano." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-5 grid gap-6 lg:grid-cols-2", "aria-label": "Comparação de planos", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "border border-border-strong px-10 py-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-semibold", children: "Essencial" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 max-w-[14rem] text-base leading-snug text-[#d8dfdb]", children: "O essencial para sua jornada de estudos." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 border-t border-border pt-3", children: essentialFeatures.map(([feature, available]) => /* @__PURE__ */ jsxRuntimeExports.jsx(PlanFeature, { available, children: feature }, feature)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "relative isolate overflow-hidden border border-primary px-10 py-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShaderPlanSurface, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 grid h-full sm:grid-cols-[1fr_10.5rem]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-semibold", children: "Plus" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 max-w-xs text-base leading-snug text-[#d8dfdb]", children: "A experiência completa para estudar sem limites." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 border-t border-[#476158] pt-3", children: plusFeatures.map((feature) => /* @__PURE__ */ jsxRuntimeExports.jsx(PlanFeature, { available: true, children: feature }, feature)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex items-center border-t border-[#6f8b7f] pt-5 text-center sm:mt-0 sm:border-l sm:border-t-0 sm:pl-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base leading-snug", children: "Valor exibido no checkout" }) }),
          profile?.plan === "plus" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-0 top-0 border border-primary px-3 py-1 text-xs text-primary", children: "Plano ativo" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-6 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(21rem,0.72fr)]", "aria-labelledby": "billing-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "billing-title", className: "text-2xl font-semibold", children: "Seus dados de cobrança" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Você será redirecionado para um provedor de pagamento seguro." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "mt-4 grid gap-3", onSubmit: startCheckout, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "grid gap-1 text-sm", htmlFor: "checkout-name", children: [
            "Nome no cartão",
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "checkout-name", name: "cardholderName", className: "ff-input", value: holderName, onChange: (event) => setHolderName(event.target.value.slice(0, 80)), autoComplete: "name", placeholder: "Ex.: Ana Silva" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "grid gap-1 text-sm", htmlFor: "checkout-email", children: [
            "E-mail",
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "checkout-email", name: "email", className: "ff-input", value: usuario?.email ?? "", readOnly: true, autoComplete: "email", placeholder: "seu@email.com" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "grid gap-1 text-sm", htmlFor: "checkout-country", children: [
            "País",
            /* @__PURE__ */ jsxRuntimeExports.jsx("select", { id: "checkout-country", name: "country", className: "ff-input", defaultValue: "BR", children: /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "BR", children: "Brasil" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "checkout-recorrencia", className: "flex items-start gap-3 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { id: "checkout-recorrencia", checked: accepted, onCheckedChange: (value) => setAccepted(value === true), className: "mt-0.5 h-5 w-5 rounded-sm" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Entendo que valor e recorrência serão mostrados antes da confirmação no Stripe." })
          ] }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "border-l-2 border-destructive px-3 text-sm text-destructive", role: "alert", children: error }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", className: "ff-btn-primary min-h-14 w-full text-base", disabled: !accepted || submitting, children: [
            submitting ? "Abrindo checkout…" : "Continuar no pagamento seguro",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-5 w-5", "aria-hidden": "true" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs leading-relaxed text-muted-foreground", children: "O número do cartão não passa pelo GRAVITYMIND. Esta tela não pede número, validade ou CVC; você será redirecionado para um provedor de pagamento seguro." }),
          !carregando && !usuario && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-sm font-semibold text-primary underline underline-offset-4", children: "Entrar antes de continuar" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold", children: "Prévia visual" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Ilustração interativa. Dados reais são inseridos no checkout seguro." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCardPreview, { holderName: holderName || usuario?.nome || "ANA SILVA" }) })
      ] })
    ] })
  ] }) });
}
function PlanFeature({
  available,
  children
}) {
  const Icon = available ? Check : Minus;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: `flex items-center gap-4 py-1 text-sm ${available ? "text-[#e2e9e5]" : "text-[#74847c]"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `grid h-6 w-6 place-items-center rounded-full ${available ? "bg-primary text-primary-foreground" : "bg-[#43534c] text-[#14251e]"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4", strokeWidth: 2.2, "aria-hidden": "true" }) }),
    children
  ] });
}
export {
  PlusPage as component
};
