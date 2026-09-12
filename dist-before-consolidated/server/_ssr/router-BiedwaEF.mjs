import process from "node:process";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent, d as useLocation, e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { m as motion } from "../_libs/motion.mjs";
import { c as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-DwUI_Cux.mjs";
import { g as getD1, c as cadastroSchema, l as loginSchema, a as gravityInputSchema } from "./schemas-Dga4YmnR.mjs";
import { C as ChevronDown, X, M as Menu, a as Maximize2, B as Bot, b as CircleAlert, R as RotateCcw, S as Send } from "../_libs/lucide-react.mjs";
import { A as AnimatePresence } from "../_libs/framer-motion.mjs";
import { o as objectType, e as enumType } from "../_libs/zod.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";


import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";

import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";




import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const cadastrarServerFn = createServerFn({
  method: "POST"
}).validator((input) => cadastroSchema.parse(input)).handler(createSsrRpc("a93c7d29dc73b777b0f0ea26ab5e37520976feae5ad4155eb490f502cfdf9929"));
const entrarServerFn = createServerFn({
  method: "POST"
}).validator((input) => loginSchema.parse(input)).handler(createSsrRpc("a2a7e09df68aa418c09c5c47b442b3c43a8053e189d416aa45576dac89578b26"));
const sairServerFn = createServerFn({
  method: "POST"
}).handler(createSsrRpc("401636db0da1d1ecefedee10ff54763b1d7d2df898f1ccd84fd75e96ada87c80"));
const usuarioAtualServerFn = createServerFn({
  method: "GET"
}).handler(createSsrRpc("6ae29343e7713fd303a6449ca2798cb3ea2a9cfe734a51dc0a2706bdc8a32083"));
let ouvintes = [];
let estadoGlobal = { usuario: null, carregando: true };
function emitir(novoEstado) {
  estadoGlobal = novoEstado;
  ouvintes.forEach((fn) => {
    fn(estadoGlobal);
  });
}
async function carregarUsuarioAtual() {
  try {
    const usuario = await usuarioAtualServerFn();
    emitir({ usuario, carregando: false });
  } catch {
    emitir({ usuario: null, carregando: false });
  }
}
let carregamentoIniciado = false;
function useAuth() {
  const [estado, setEstado] = reactExports.useState(estadoGlobal);
  reactExports.useEffect(() => {
    ouvintes.push(setEstado);
    if (!carregamentoIniciado) {
      carregamentoIniciado = true;
      carregarUsuarioAtual();
    }
    return () => {
      ouvintes = ouvintes.filter((fn) => fn !== setEstado);
    };
  }, []);
  const cadastrar = reactExports.useCallback(
    async (nome, email, senha, prova) => {
      const resultado = await cadastrarServerFn({
        data: { nome, email, senha, ...prova }
      });
      if (resultado.usuario) emitir({ usuario: resultado.usuario, carregando: false });
      return resultado;
    },
    []
  );
  const entrar = reactExports.useCallback(async (email, senha, prova) => {
    const resultado = await entrarServerFn({
      data: { email, senha, ...prova }
    });
    if (resultado.usuario) emitir({ usuario: resultado.usuario, carregando: false });
    return resultado;
  }, []);
  const sair = reactExports.useCallback(async () => {
    await sairServerFn();
    emitir({ usuario: null, carregando: false });
  }, []);
  return { ...estado, cadastrar, entrar, sair };
}
const gravityServerFn = createServerFn({
  method: "POST"
}).validator((input) => gravityInputSchema.parse(input)).handler(createSsrRpc("4648a823917bfe278603c24645dd2778b3d17c4a0301415d852c173b25081a49"));
class GravityError extends Error {
}
async function enviarMensagemGravity(historico, context) {
  let resultado;
  try {
    resultado = await gravityServerFn({ data: { historico, context } });
  } catch {
    throw new GravityError("Não consegui me conectar. Verifique sua internet e tente de novo.");
  }
  if (resultado.erro) {
    throw new GravityError(resultado.erro);
  }
  if (!resultado.texto) {
    throw new GravityError(
      "O Gravity não conseguiu formular uma resposta. Tente reformular sua pergunta."
    );
  }
  return resultado.texto;
}
const SUGESTOES_PADRAO = [
  "Por que a inércia depende da massa?",
  "Dê um exemplo cotidiano da 3ª Lei",
  "Ajude a interpretar F = m · a"
];
function GravityChat({
  context,
  sugestoes = SUGESTOES_PADRAO,
  alturaMensagens = "360px"
}) {
  const { usuario, carregando: carregandoAuth } = useAuth();
  const [mensagens, setMensagens] = reactExports.useState([]);
  const [input, setInput] = reactExports.useState("");
  const [carregando, setCarregando] = reactExports.useState(false);
  const [erro, setErro] = reactExports.useState(null);
  const scrollRef = reactExports.useRef(null);
  const scrollSignal = mensagens.at(-1)?.id ?? (carregando ? "loading" : "empty");
  reactExports.useEffect(() => {
    if (scrollSignal === "empty") return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: document.documentElement.dataset.motion === "reduced" ? "auto" : "smooth"
    });
  }, [scrollSignal]);
  async function enviar(texto) {
    const textoLimpo = texto.trim().slice(0, 1500);
    if (!textoLimpo || carregando) return;
    const novoHistorico = [
      ...mensagens,
      { id: crypto.randomUUID(), role: "user", content: textoLimpo }
    ];
    setMensagens(novoHistorico);
    setInput("");
    setErro(null);
    setCarregando(true);
    try {
      const historicoDaApi = novoHistorico.map(({ role, content }) => ({ role, content }));
      const resposta = await enviarMensagemGravity(historicoDaApi, context);
      setMensagens((atuais) => [
        ...atuais,
        { id: crypto.randomUUID(), role: "assistant", content: resposta }
      ]);
    } catch (error) {
      setErro(
        error instanceof GravityError ? error.message : "Não foi possível consultar o tutor agora."
      );
    } finally {
      setCarregando(false);
    }
  }
  if (!carregandoAuth && !usuario) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-64 flex-col justify-center border-y border-border py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold", children: "O tutor usa uma sessão autenticada" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted-foreground", children: "Entre para proteger o limite de uso e vincular apenas o resumo necessário do seu progresso." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "ff-btn-primary mt-5 w-fit", children: "Entrar para conversar" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        ref: scrollRef,
        className: "space-y-3 overflow-y-auto",
        style: { height: alturaMensagens },
        children: [
          mensagens.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold", children: "Comece com uma dúvida específica" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs leading-relaxed text-muted-foreground", children: "Não envie senhas, documentos ou outros dados pessoais." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid gap-2", children: sugestoes.map((sugestao) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => void enviar(sugestao),
                className: "min-h-10 border border-border px-3 py-2 text-left text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground",
                children: sugestao
              },
              sugestao
            )) })
          ] }),
          mensagens.map((mensagem) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: mensagem.role === "user" ? "flex justify-end" : "flex justify-start",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `max-w-[88%] whitespace-pre-wrap border px-3 py-2.5 text-sm leading-relaxed ${mensagem.role === "user" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-secondary text-foreground"}`,
                  children: mensagem.content
                }
              )
            },
            mensagem.id
          )),
          carregando && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "max-w-[70%] border border-border bg-secondary p-3",
              role: "status",
              "aria-label": "Tutor respondendo",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ff-skeleton h-3 w-4/5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ff-skeleton mt-2 h-3 w-3/5" })
              ]
            }
          ),
          erro && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              role: "alert",
              className: "flex items-start gap-2 border-l-2 border-destructive bg-destructive/8 px-3 py-2.5 text-xs text-destructive",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "mt-0.5 h-4 w-4 shrink-0", "aria-hidden": "true" }),
                " ",
                erro
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2 border-t border-border pt-3", children: [
      mensagens.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            setMensagens([]);
            setErro(null);
          },
          title: "Reiniciar conversa",
          "aria-label": "Reiniciar conversa",
          className: "grid h-10 w-10 shrink-0 place-items-center border border-border text-muted-foreground hover:bg-secondary hover:text-foreground",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4", "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          value: input,
          onChange: (evento) => setInput(evento.target.value.slice(0, 1500)),
          onKeyDown: (evento) => {
            if (evento.key === "Enter" && !evento.shiftKey) {
              evento.preventDefault();
              void enviar(input);
            }
          },
          maxLength: 1500,
          placeholder: "Pergunte sobre Física",
          disabled: carregando,
          className: "ff-input flex-1"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => void enviar(input),
          disabled: carregando || !input.trim(),
          className: "grid h-11 w-11 shrink-0 place-items-center bg-primary text-primary-foreground disabled:opacity-40",
          "aria-label": "Enviar pergunta",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4", "aria-hidden": "true" })
        }
      )
    ] })
  ] });
}
const BRAND_NAME = "GRAVITYMIND";
const STORAGE_PREFIX = "gravitymind:";
const LEGACY_STORAGE_PREFIX = "fisicafacil:";
const PROGRESS_EVENT = "gravitymind:progress-updated";
function storageKey(suffix) {
  return `${STORAGE_PREFIX}${suffix}`;
}
function migrateLegacyStorage() {
  if (typeof window === "undefined") return;
  const legacyKeys = [];
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (key?.startsWith(LEGACY_STORAGE_PREFIX)) legacyKeys.push(key);
  }
  for (const legacyKey of legacyKeys) {
    const nextKey = legacyKey.replace(LEGACY_STORAGE_PREFIX, STORAGE_PREFIX);
    if (window.localStorage.getItem(nextKey) !== null) continue;
    const value = window.localStorage.getItem(legacyKey);
    if (value !== null) window.localStorage.setItem(nextKey, value);
  }
}
function emitProgressUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(PROGRESS_EVENT));
}
const NOTAS_KEY = storageKey("notas");
const HISTORICO_KEY = storageKey("notas-historico");
const MAX_VERSOES_POR_NOTA = 10;
function gerarId() {
  return `nota-${crypto.randomUUID()}`;
}
function notaValida(valor) {
  if (!valor || typeof valor !== "object") return false;
  const nota = valor;
  return typeof nota.id === "string" && nota.id.length <= 96 && typeof nota.titulo === "string" && nota.titulo.length <= 160 && typeof nota.conteudo === "string" && nota.conteudo.length <= 4e4 && ["geral", "lei-1", "lei-2", "lei-3"].includes(nota.assunto ?? "") && typeof nota.criadaEm === "string" && !Number.isNaN(Date.parse(nota.criadaEm)) && typeof nota.atualizadaEm === "string" && !Number.isNaN(Date.parse(nota.atualizadaEm));
}
function ler(key, padrao) {
  if (typeof window === "undefined") return padrao;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : padrao;
  } catch {
    return padrao;
  }
}
function salvar(key, valor) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(valor));
  emitProgressUpdated();
}
function listarNotas() {
  const bruto = ler(NOTAS_KEY, []);
  const notas = Array.isArray(bruto) ? bruto.filter(notaValida) : [];
  return notas.sort((a, b) => b.atualizadaEm.localeCompare(a.atualizadaEm));
}
function criarNota(assunto = "geral") {
  const agora = (/* @__PURE__ */ new Date()).toISOString();
  const nova = {
    id: gerarId(),
    titulo: "Nova anotação",
    conteudo: "",
    assunto,
    criadaEm: agora,
    atualizadaEm: agora
  };
  const notas = listarNotas();
  notas.push(nova);
  salvar(NOTAS_KEY, notas);
  return nova;
}
function atualizarNota(id, dados) {
  const notas = listarNotas();
  const idx = notas.findIndex((n) => n.id === id);
  if (idx === -1) return null;
  const anterior = notas[idx];
  if (dados.conteudo !== void 0 && dados.conteudo !== anterior.conteudo) {
    registrarVersaoAnterior(id, anterior.conteudo);
  }
  const atualizada = {
    ...anterior,
    ...dados.titulo !== void 0 ? { titulo: dados.titulo.trim().slice(0, 160) || "Sem título" } : {},
    ...dados.conteudo !== void 0 ? { conteudo: dados.conteudo.slice(0, 4e4) } : {},
    ...dados.assunto && ["geral", "lei-1", "lei-2", "lei-3"].includes(dados.assunto) ? { assunto: dados.assunto } : {},
    atualizadaEm: (/* @__PURE__ */ new Date()).toISOString()
  };
  notas[idx] = atualizada;
  salvar(NOTAS_KEY, notas);
  return atualizada;
}
function excluirNota(id) {
  const notas = listarNotas().filter((n) => n.id !== id);
  salvar(NOTAS_KEY, notas);
  const historico = ler(HISTORICO_KEY, []).filter((h) => h.notaId !== id);
  salvar(HISTORICO_KEY, historico);
}
function buscarNotas(termo, assunto) {
  const termoNormalizado = termo.trim().toLowerCase();
  return listarNotas().filter((n) => {
    const passaAssunto = assunto ? n.assunto === assunto : true;
    const passaBusca = termoNormalizado.length === 0 || n.titulo.toLowerCase().includes(termoNormalizado) || n.conteudo.toLowerCase().includes(termoNormalizado);
    return passaAssunto && passaBusca;
  });
}
function registrarVersaoAnterior(notaId, conteudoAnterior) {
  if (conteudoAnterior.trim().length === 0) return;
  const historico = ler(HISTORICO_KEY, []);
  historico.push({
    notaId,
    conteudoAnterior,
    salvoEm: (/* @__PURE__ */ new Date()).toISOString()
  });
  const dessaNota = historico.filter((h) => h.notaId === notaId);
  if (dessaNota.length > MAX_VERSOES_POR_NOTA) {
    const excedente = dessaNota.length - MAX_VERSOES_POR_NOTA;
    const idsParaRemover = new Set(dessaNota.slice(0, excedente).map((h) => h.salvoEm));
    const filtrado = historico.filter(
      (h) => !(h.notaId === notaId && idsParaRemover.has(h.salvoEm))
    );
    salvar(HISTORICO_KEY, filtrado);
  } else {
    salvar(HISTORICO_KEY, historico);
  }
}
function obterHistoricoDaNota(notaId) {
  return ler(HISTORICO_KEY, []).filter((h) => h.notaId === notaId).sort((a, b) => b.salvoEm.localeCompare(a.salvoEm));
}
function restaurarVersao(notaId, conteudoParaRestaurar) {
  return atualizarNota(notaId, { conteudo: conteudoParaRestaurar });
}
const MARCOS_ATIVOS = ["texto", "resumo", "visual", "animacao"];
const STORAGE_KEY$2 = storageKey("progresso-licoes");
const TODOS_MARCOS = ["texto", "narracao", "video", "resumo", "visual", "animacao"];
function lerEstado() {
  const padrao = { "lei-1": [], "lei-2": [], "lei-3": [] };
  if (typeof window === "undefined") return padrao;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY$2);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return padrao;
    }
    const valores = parsed;
    for (const assunto of Object.keys(padrao)) {
      const marcos = valores[assunto];
      if (!Array.isArray(marcos)) continue;
      padrao[assunto] = [
        ...new Set(
          marcos.filter(
            (marco) => typeof marco === "string" && TODOS_MARCOS.includes(marco)
          )
        )
      ];
    }
    return padrao;
  } catch {
    return padrao;
  }
}
function salvarEstado(estado) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY$2, JSON.stringify(estado));
  emitProgressUpdated();
}
function marcarConcluido(assunto, marco) {
  const estado = lerEstado();
  if (!estado[assunto].includes(marco)) {
    estado[assunto] = [...estado[assunto], marco];
    salvarEstado(estado);
  }
}
function marcosConcluidos(assunto) {
  return lerEstado()[assunto];
}
function percentualLicao(assunto) {
  const concluidos = marcosConcluidos(assunto).filter((marco) => MARCOS_ATIVOS.includes(marco));
  return Math.round(concluidos.length / MARCOS_ATIVOS.length * 100);
}
function todasLicoes() {
  const assuntos = ["lei-1", "lei-2", "lei-3"];
  return assuntos.map((assunto) => {
    const percentual = percentualLicao(assunto);
    return { assunto, percentual, concluida: percentual === 100 };
  });
}
const QUESTOES = [
  // ───────────────────────── 1ª LEI, FÁCIL ─────────────────────────
  {
    id: "lei1-f-01",
    assunto: "lei-1",
    subassunto: "Conceito de inércia",
    dificuldade: "facil",
    tags: ["inércia", "repouso", "conceito"],
    enunciado: "Um livro está em repouso sobre uma mesa, e nenhuma força horizontal atua sobre ele. De acordo com a 1ª Lei de Newton, o que acontece com o livro?",
    alternativas: [
      {
        letra: "A",
        texto: "Ele permanece em repouso indefinidamente.",
        explicacao: "Correto. O Princípio da Inércia diz que um corpo em repouso permanece em repouso a menos que uma força resultante atue sobre ele. Como não há força horizontal resultante, o livro não tem motivo para sair do lugar, ele simplesmente continua parado."
      },
      {
        letra: "B",
        texto: "Ele começa a se mover sozinho, pois todo corpo tende a se mover.",
        explicacao: "Errado. Essa é exatamente a inversão da 1ª Lei: o corpo tende a manter seu ESTADO atual, e o estado dele é repouso. Não existe uma tendência universal ao movimento, o que existe é a tendência a continuar fazendo o que já estava fazendo."
      },
      {
        letra: "C",
        texto: "Ele acelera lentamente por causa do seu próprio peso.",
        explicacao: "Errado. O peso é uma força vertical, equilibrada pela força normal da mesa. Essa confusão mistura forças verticais (que já estão em equilíbrio) com a ausência de força horizontal, que é o que de fato garante o repouso aqui."
      },
      {
        letra: "D",
        texto: "Ele permanece em repouso apenas enquanto alguém o observa.",
        explicacao: "Errado. A Física não depende de observação para acontecer. Esse erro confunde um conceito de física clássica com ideias (equivocadas, neste contexto) de mecânica quântica sobre observação, que não se aplicam aqui."
      }
    ],
    correta: "A"
  },
  {
    id: "lei1-f-02",
    assunto: "lei-1",
    subassunto: "Identificação de exemplos",
    dificuldade: "facil",
    tags: ["inércia", "cotidiano"],
    enunciado: "Em qual situação a inércia do corpo é o motivo direto do que ocorre?",
    alternativas: [
      {
        letra: "A",
        texto: "Um carrinho de compras fica mais difícil de empurrar quando carregado de itens pesados.",
        explicacao: "Errado. Essa situação envolve principalmente a relação entre força e massa para produzir aceleração (2ª Lei), não a tendência de manter o estado de movimento sem força aplicada."
      },
      {
        letra: "B",
        texto: "Ao puxar rapidamente uma toalha de baixo de copos parados, os copos quase não se movem.",
        explicacao: "Correto. Os copos estavam em repouso e, como a força de atrito atua por um tempo muito curto durante a puxada rápida, eles tendem a permanecer parados, é a inércia se manifestando como resistência à mudança do estado de repouso."
      },
      {
        letra: "C",
        texto: "Uma bola lançada para cima desce de volta ao solo.",
        explicacao: "Errado. Esse movimento é causado pela força peso (gravidade) atuando continuamente sobre a bola, mudando sua velocidade, isso é justamente o OPOSTO de inércia, é a presença de uma força resultante não nula."
      },
      {
        letra: "D",
        texto: "Dois patinadores se empurram e saem em direções opostas.",
        explicacao: "Errado. Essa é uma aplicação clássica da 3ª Lei de Newton (ação e reação), não da 1ª. O par de forças mútuas é o ponto central aqui, não a tendência a manter o estado de movimento."
      }
    ],
    correta: "B"
  },
  // ───────────────────────── 1ª LEI, MÉDIO ─────────────────────────
  {
    id: "lei1-m-01",
    assunto: "lei-1",
    subassunto: "Equilíbrio de forças",
    dificuldade: "medio",
    tags: ["inércia", "equilíbrio", "força resultante"],
    enunciado: "Um bloco se move em linha reta sobre uma superfície horizontal com velocidade constante de 4 m/s. O que se pode concluir sobre a força resultante sobre o bloco?",
    formula: "ΣF = 0",
    alternativas: [
      {
        letra: "A",
        texto: "A força resultante é nula, pois a velocidade é constante.",
        explicacao: "Correto. Pela 1ª Lei, um corpo só mantém velocidade constante (em módulo, direção e sentido) quando a força resultante sobre ele é zero. Isso não significa ausência de forças individuais, significa que elas se cancelam (ex: força motora e atrito se equilibram)."
      },
      {
        letra: "B",
        texto: "A força resultante aumenta proporcionalmente à velocidade.",
        explicacao: "Errado. Esse raciocínio confunde força com velocidade. Pela 2ª Lei, força resultante se relaciona com ACELERAÇÃO (F = m·a), não com velocidade diretamente. Velocidade constante implica aceleração zero, e portanto força resultante zero, o oposto do que a alternativa afirma."
      },
      {
        letra: "C",
        texto: "Não existe nenhuma força atuando sobre o bloco.",
        explicacao: "Errado. Forças individuais (como peso, normal, atrito, força motora) podem perfeitamente existir e atuar sobre o bloco. O que a 1ª Lei garante é que a SOMA vetorial delas é zero, não que elas estejam ausentes."
      },
      {
        letra: "D",
        texto: "A força resultante é constante e igual ao peso do bloco.",
        explicacao: "Errado. O peso é apenas uma das forças verticais, equilibrada pela normal. Ele não determina a força resultante HORIZONTAL, que é a relevante para o movimento retilíneo descrito. A força resultante total continua sendo zero."
      }
    ],
    correta: "A"
  },
  {
    id: "lei1-m-02",
    assunto: "lei-1",
    subassunto: "Inércia e massa",
    dificuldade: "medio",
    tags: ["inércia", "massa"],
    enunciado: "Por que é mais difícil mudar a direção do movimento de um caminhão carregado do que de uma motocicleta, mesmo que ambos estejam à mesma velocidade?",
    alternativas: [
      {
        letra: "A",
        texto: "Porque o caminhão tem mais massa, e por isso tem maior inércia.",
        explicacao: "Correto. A inércia é diretamente proporcional à massa: quanto maior a massa, maior a resistência do corpo a qualquer mudança no seu estado de movimento (seja em módulo, direção ou sentido da velocidade). Mais massa exige mais força para produzir a mesma mudança."
      },
      {
        letra: "B",
        texto: "Porque o caminhão tem motor mais potente.",
        explicacao: "Errado. A potência do motor influencia a capacidade de ACELERAR o veículo, mas a dificuldade de MUDAR a direção do movimento já em curso é uma propriedade do próprio corpo (sua massa/inércia), não do motor que o impulsiona."
      },
      {
        letra: "C",
        texto: "Porque o caminhão tem pneus maiores, que geram mais atrito com o solo.",
        explicacao: "Errado. O atrito dos pneus influencia a capacidade de FRENAGEM e tração, mas não é a causa da resistência à mudança de direção descrita aqui, essa resistência vem da inércia, ligada à massa do veículo."
      },
      {
        letra: "D",
        texto: "Porque a velocidade do caminhão é sempre maior.",
        explicacao: "Errado. O enunciado já estabelece que ambos estão na mesma velocidade. A dificuldade de mudar de direção não depende da velocidade ser maior ou menor, ela depende da massa do corpo, que determina sua inércia."
      }
    ],
    correta: "A"
  },
  // ───────────────────────── 1ª LEI, DIFÍCIL ─────────────────────────
  {
    id: "lei1-d-01",
    assunto: "lei-1",
    subassunto: "Referenciais inerciais",
    dificuldade: "dificil",
    tags: ["inércia", "referencial", "conceito avançado"],
    enunciado: "Um passageiro em pé dentro de um ônibus sente seu corpo ser 'lançado' para frente quando o ônibus freia bruscamente. Do ponto de vista da 1ª Lei de Newton, qual é a explicação correta para essa sensação?",
    alternativas: [
      {
        letra: "A",
        texto: "O corpo do passageiro tende a manter seu estado de movimento retilíneo uniforme, enquanto o ônibus (e o chão sob seus pés) desacelera; o efeito percebido é a continuação da inércia do passageiro em relação ao referencial do ônibus, que deixou de ser inercial durante a freada.",
        explicacao: "Correto. Antes da freada, passageiro e ônibus se moviam juntos com a mesma velocidade. Quando o ônibus desacelera, atua sobre ele uma força (do freio/atrito), mas essa força não atua diretamente sobre o corpo do passageiro (exceto pelo contato dos pés e eventual cinto). Por inércia, o passageiro tende a continuar com a velocidade anterior, e por isso parece 'avançar' em relação ao ônibus, que agora está mais lento. O referencial do ônibus, ao desacelerar, deixa de ser inercial, é por isso que dentro dele parece haver uma força 'empurrando' o passageiro para frente, quando na realidade é apenas a inércia do passageiro mantendo seu movimento original."
      },
      {
        letra: "B",
        texto: "Uma força para frente é gerada pela freada e empurra o passageiro.",
        explicacao: "Errado. A freada gera uma força de atrito que desacelera o ônibus, e essa força atua no sentido contrário ao movimento (para trás), não para frente. Não existe uma força real 'para frente' agindo sobre o passageiro, a sensação de ser empurrado para frente é resultado da inércia do corpo dele, não de uma força nova sendo criada."
      },
      {
        letra: "C",
        texto: "O passageiro perde a inércia no momento da freada.",
        explicacao: "Errado. A inércia não é algo que se 'perde', ela é uma propriedade permanente da matéria, ligada à massa do corpo. O que muda na freada não é a inércia do passageiro, e sim a velocidade do ônibus em relação a ele, que segue tentando manter seu movimento anterior."
      },
      {
        letra: "D",
        texto: "A 1ª Lei não se aplica dentro de veículos em movimento.",
        explicacao: "Errado. A 1ª Lei se aplica normalmente em qualquer referencial inercial (que se move com velocidade constante). O que acontece aqui é justamente que o referencial do ônibus, ao FREAR, deixa de ser inercial temporariamente, e é essa mudança de referencial que faz a inércia do passageiro parecer uma força extra, fenômeno estudado como 'força fictícia' ou 'pseudo-força'."
      }
    ],
    correta: "A"
  },
  // ───────────────────────── 2ª LEI, FÁCIL ─────────────────────────
  {
    id: "lei2-f-01",
    assunto: "lei-2",
    subassunto: "Fórmula F = m·a",
    dificuldade: "facil",
    tags: ["força", "massa", "aceleração", "fórmula"],
    enunciado: "Qual é a expressão matemática correta da 2ª Lei de Newton?",
    formula: "F = m·a",
    alternativas: [
      {
        letra: "A",
        texto: "F = m · a",
        explicacao: "Correto. A força resultante (F) sobre um corpo é igual ao produto da sua massa (m) pela aceleração (a) que ela produz. É a relação central da dinâmica: para uma mesma força, corpos com mais massa aceleram menos."
      },
      {
        letra: "B",
        texto: "F = m + a",
        explicacao: "Errado. Força não é uma soma de massa e aceleração, essas grandezas têm unidades diferentes (kg e m/s²) e não podem ser somadas diretamente. A relação correta entre elas é de multiplicação, não de adição."
      },
      {
        letra: "C",
        texto: "F = a / m",
        explicacao: "Errado. Essa fórmula inverteria a relação: diria que, para uma mesma aceleração, quanto MAIOR a massa, MENOR a força, o que é o contrário do que a física observa. Na realidade, para produzir a mesma aceleração em um corpo de maior massa, é preciso MAIS força, não menos."
      },
      {
        letra: "D",
        texto: "F = m² · a",
        explicacao: "Errado. Não há elevação ao quadrado na relação entre massa e força. A 2ª Lei estabelece uma proporcionalidade direta e simples (linear) entre massa e força para uma dada aceleração."
      }
    ],
    correta: "A"
  },
  {
    id: "lei2-f-02",
    assunto: "lei-2",
    subassunto: "Cálculo direto",
    dificuldade: "facil",
    tags: ["força", "cálculo"],
    enunciado: "Uma força resultante de 20 N é aplicada sobre um corpo de massa 4 kg. Qual é a aceleração produzida?",
    formula: "a = F / m",
    alternativas: [
      {
        letra: "A",
        texto: "5 m/s²",
        explicacao: "Correto. Usando F = m·a, isolamos a = F/m = 20/4 = 5 m/s². Esse é exatamente o tipo de substituição direta que a 2ª Lei permite fazer."
      },
      {
        letra: "B",
        texto: "80 m/s²",
        explicacao: "Errado. Esse valor vem de multiplicar F por m (20 × 4 = 80) em vez de dividir. A fórmula correta isola a aceleração como a = F/m, não como F × m."
      },
      {
        letra: "C",
        texto: "24 m/s²",
        explicacao: "Errado. Esse valor vem de somar força e massa (20 + 4 = 24), uma operação que não tem sentido físico aqui, força e massa têm unidades diferentes e a relação entre elas na 2ª Lei é de divisão, não de soma."
      },
      {
        letra: "D",
        texto: "0,2 m/s²",
        explicacao: "Errado. Esse valor inverte a divisão (4/20 em vez de 20/4). A fórmula é a = F/m: a força vai no numerador, a massa no denominador."
      }
    ],
    correta: "A"
  },
  // ───────────────────────── 2ª LEI, MÉDIO ─────────────────────────
  {
    id: "lei2-m-01",
    assunto: "lei-2",
    subassunto: "Proporcionalidade",
    dificuldade: "medio",
    tags: ["força", "massa", "proporcionalidade"],
    enunciado: "Se a massa de um corpo é dobrada e a força resultante aplicada sobre ele permanece a mesma, o que ocorre com sua aceleração?",
    formula: "a = F / m",
    alternativas: [
      {
        letra: "A",
        texto: "A aceleração é reduzida à metade.",
        explicacao: "Correto. Como a = F/m, e a força (F) é constante, dobrar a massa (m) no denominador reduz a aceleração resultante à metade. Essa é a relação de proporcionalidade inversa entre massa e aceleração, para força constante."
      },
      {
        letra: "B",
        texto: "A aceleração dobra também.",
        explicacao: "Errado. Esse seria o comportamento se a relação entre massa e aceleração fosse diretamente proporcional, mas na 2ª Lei, para força CONSTANTE, a relação entre massa e aceleração é inversamente proporcional: aumentar a massa diminui a aceleração."
      },
      {
        letra: "C",
        texto: "A aceleração permanece igual, pois a força não mudou.",
        explicacao: "Errado. A força sozinha não determina a aceleração, é a relação entre força E massa que determina (a = F/m). Mesmo com a força fixa, mudar a massa muda necessariamente a aceleração resultante."
      },
      {
        letra: "D",
        texto: "A aceleração se torna nula.",
        explicacao: "Errado. A aceleração só seria nula se a força resultante fosse zero. Dobrar a massa reduz a aceleração, mas não a zera, ela continua existindo, só que com metade do valor anterior."
      }
    ],
    correta: "A"
  },
  // ───────────────────────── 2ª LEI, DIFÍCIL ─────────────────────────
  {
    id: "lei2-d-01",
    assunto: "lei-2",
    subassunto: "Sistemas com múltiplas forças",
    dificuldade: "dificil",
    tags: ["força resultante", "atrito", "plano inclinado"],
    enunciado: "Um bloco de 10 kg é empurrado horizontalmente por uma força de 50 N. A força de atrito que se opõe ao movimento é de 30 N. Qual é a aceleração do bloco?",
    formula: "a = (F − Fat) / m",
    alternativas: [
      {
        letra: "A",
        texto: "2 m/s²",
        explicacao: "Correto. A força resultante é a soma vetorial das forças horizontais: F_res = 50 − 30 = 20 N (o atrito age no sentido contrário ao movimento). Aplicando a 2ª Lei: a = F_res/m = 20/10 = 2 m/s²."
      },
      {
        letra: "B",
        texto: "5 m/s², usando apenas a força aplicada de 50 N.",
        explicacao: "Errado. Esse cálculo (50/10) ignora completamente a força de atrito. A 2ª Lei exige usar a força RESULTANTE, ou seja, a soma de TODAS as forças que atuam na direção do movimento, não apenas a força que foi aplicada pela pessoa."
      },
      {
        letra: "C",
        texto: "8 m/s², somando as duas forças (50 + 30 = 80, dividido por 10).",
        explicacao: "Errado. O atrito se opõe ao movimento, então ele deve ser SUBTRAÍDO da força aplicada, não somado a ela. Somar as duas forças trataria o atrito como se ele estivesse ajudando o movimento, quando na verdade ele o dificulta."
      },
      {
        letra: "D",
        texto: "3 m/s², usando apenas a força de atrito de 30 N.",
        explicacao: "Errado. Esse cálculo (30/10) usa só o atrito e ignora a força aplicada que está movendo o bloco. É preciso considerar AMBAS as forças horizontais e calcular sua resultante antes de aplicar F = m·a."
      }
    ],
    correta: "A"
  },
  // ───────────────────────── 3ª LEI, FÁCIL ─────────────────────────
  {
    id: "lei3-f-01",
    assunto: "lei-3",
    subassunto: "Conceito de ação e reação",
    dificuldade: "facil",
    tags: ["ação e reação", "conceito"],
    enunciado: "Segundo a 3ª Lei de Newton, quando um corpo A exerce uma força sobre um corpo B, o que ocorre?",
    alternativas: [
      {
        letra: "A",
        texto: "B exerce sobre A uma força de mesma intensidade, mesma direção e sentido oposto.",
        explicacao: "Correto. Esse é exatamente o Princípio da Ação e Reação: as forças sempre aparecem em pares, atuando em corpos diferentes, com mesma intensidade e direção, mas sentidos opostos. Elas nunca se cancelam entre si porque atuam em corpos distintos."
      },
      {
        letra: "B",
        texto: "B exerce sobre A uma força menor, pois parte da força se 'perde' no processo.",
        explicacao: "Errado. Não existe perda de força no par ação-reação, as duas forças têm exatamente a MESMA intensidade. A ideia de força 'se perdendo' não tem respaldo na 3ª Lei; é uma confusão com situações de atrito ou dissipação de energia, que são fenômenos diferentes."
      },
      {
        letra: "C",
        texto: "B fica impedido de se mover até que A pare de agir.",
        explicacao: "Errado. A 3ª Lei trata do par de forças entre os corpos, não do movimento resultante de cada um, o movimento depende também da massa de cada corpo e de outras forças envolvidas (2ª Lei). B pode perfeitamente se mover enquanto A continua agindo."
      },
      {
        letra: "D",
        texto: "Apenas A sofre o efeito da força, pois B é o corpo passivo.",
        explicacao: "Errado. Essa alternativa nega o próprio princípio: na 3ª Lei, AMBOS os corpos exercem força um sobre o outro simultaneamente. Não existe corpo 'passivo' que só recebe força sem também exercê-la de volta."
      }
    ],
    correta: "A"
  },
  {
    id: "lei3-f-02",
    assunto: "lei-3",
    subassunto: "Identificação de pares",
    dificuldade: "facil",
    tags: ["ação e reação", "cotidiano"],
    enunciado: "Uma pessoa empurra uma parede com as mãos. Qual é a reação a essa força, segundo a 3ª Lei?",
    alternativas: [
      {
        letra: "A",
        texto: "A parede empurra a pessoa de volta, com a mesma intensidade.",
        explicacao: "Correto. A força que a pessoa exerce na parede (ação) e a força que a parede exerce na pessoa (reação) formam exatamente o par previsto pela 3ª Lei: mesma intensidade, mesma direção, sentidos opostos."
      },
      {
        letra: "B",
        texto: "O peso da pessoa aumenta.",
        explicacao: "Errado. O peso é a força gravitacional sobre a pessoa e não tem relação com a força horizontal aplicada na parede. Essa alternativa confunde duas forças completamente independentes."
      },
      {
        letra: "C",
        texto: "A pessoa não sente nenhuma força de volta, pois a parede é fixa.",
        explicacao: "Errado. O fato de a parede ser fixa (não se mover) não significa que ela não exerce força, ela exerce, sim, e com a mesma intensidade da força recebida. 'Não se mover' está relacionado à 2ª Lei (massa enorme e estrutura fixa resultam em aceleração desprezível), não à ausência de força de reação."
      },
      {
        letra: "D",
        texto: "A força se transforma em calor e desaparece.",
        explicacao: "Errado. Embora possa haver alguma dissipação de energia em forma de calor por atrito nas mãos, isso é irrelevante para o par ação-reação da 3ª Lei, que continua existindo entre pessoa e parede independentemente disso."
      }
    ],
    correta: "A"
  },
  // ───────────────────────── 3ª LEI, MÉDIO ─────────────────────────
  {
    id: "lei3-m-01",
    assunto: "lei-3",
    subassunto: "Ação e reação não se cancelam",
    dificuldade: "medio",
    tags: ["ação e reação", "equilíbrio", "erro comum"],
    enunciado: "Um cavalo puxa uma carroça. Pela 3ª Lei, a carroça puxa o cavalo de volta com força igual e oposta. Por que, então, o conjunto consegue se mover para frente?",
    alternativas: [
      {
        letra: "A",
        texto: "Porque o par ação-reação entre cavalo e carroça atua em corpos diferentes e não se cancela; o movimento depende da força resultante sobre CADA corpo, incluindo o atrito do cavalo com o solo.",
        explicacao: "Correto. As forças de ação e reação da 3ª Lei nunca se cancelam, pois atuam em corpos DIFERENTES (cavalo e carroça), não no mesmo corpo. Para saber se o conjunto se move, é preciso analisar a força resultante sobre cada corpo separadamente: o cavalo empurra o solo para trás e recebe uma reação para frente (atrito), e essa força extra é o que faz o conjunto avançar, superando a tração da carroça."
      },
      {
        letra: "B",
        texto: "Porque a força do cavalo é, na prática, maior que a da carroça, apesar do que a 3ª Lei diz.",
        explicacao: "Errado. Isso contradiz a própria 3ª Lei: as forças do par ação-reação têm SEMPRE a mesma intensidade, sem exceção. Não é uma questão de uma força ser 'um pouco maior', elas são rigorosamente iguais. A explicação do movimento está em outro lugar (no atrito com o solo), não numa violação da 3ª Lei."
      },
      {
        letra: "C",
        texto: "Porque as forças se cancelam, mas a inércia do cavalo continua o movimento.",
        explicacao: "Errado. Isso reintroduz a 1ª Lei (inércia) onde não se aplica: se as forças realmente se cancelassem completamente para o sistema cavalo-carroça, o conjunto continuaria com velocidade constante, mas não haveria como ele ACELERAR a partir do repouso. O erro é ignorar a força externa essencial: o atrito entre os pés do cavalo e o solo."
      },
      {
        letra: "D",
        texto: "Porque a 3ª Lei só vale para objetos em repouso, não em movimento.",
        explicacao: "Errado. A 3ª Lei vale sempre, independentemente de os corpos estarem em repouso ou em movimento, ela descreve uma propriedade das interações entre corpos, não do estado de movimento deles."
      }
    ],
    correta: "A"
  },
  // ───────────────────────── 3ª LEI, DIFÍCIL ─────────────────────────
  {
    id: "lei3-d-01",
    assunto: "lei-3",
    subassunto: "Integração das três leis",
    dificuldade: "dificil",
    tags: ["ação e reação", "integração", "foguete"],
    enunciado: "Um foguete no espaço (sem atrito com nenhum meio externo) expele gases de combustão para trás a alta velocidade. Usando as três Leis de Newton em conjunto, explique por que o foguete acelera para frente.",
    alternativas: [
      {
        letra: "A",
        texto: "O foguete exerce força sobre os gases para expeli-los para trás (ação); pela 3ª Lei, os gases exercem força de mesma intensidade e sentido oposto sobre o foguete (reação), empurrando-o para frente; como essa é a força resultante sobre o foguete, pela 2ª Lei ele acelera, e essa aceleração mantém-se enquanto não houver outra força (1ª Lei) cancelando-a.",
        explicacao: "Correto. Esse raciocínio integra as três leis corretamente: (3ª) o par ação-reação entre foguete e gases expelidos é o que gera a força propulsora, sem precisar de nenhum meio externo (ar, solo) para 'empurrar contra', diferente do que muita gente imagina; (2ª) essa força resultante sobre o foguete, dividida por sua massa, determina sua aceleração; (1ª) no vácuo do espaço, sem forças de atrito ou resistência, essa aceleração resultante de fato muda o estado de movimento do foguete, e ele mantém a nova velocidade até a próxima força atuar."
      },
      {
        letra: "B",
        texto: "O foguete empurra o ar atrás dele, e o ar o impulsiona para frente, como uma hélice.",
        explicacao: "Errado. Esse é um erro conceitual muito comum: foguetes funcionam mesmo no vácuo do espaço, onde não há ar para 'empurrar contra'. A propulsão vem do par ação-reação entre o foguete e os PRÓPRIOS GASES que ele expele, não de uma interação com o meio externo."
      },
      {
        letra: "C",
        texto: "A força da explosão se distribui igualmente em todas as direções, e o foguete vai para onde há menos resistência.",
        explicacao: "Errado. A combustão é direcionada propositalmente para trás (pelo bocal do motor), e é justamente essa direção específica que define, pela 3ª Lei, a direção oposta da reação sobre o foguete. Não é uma questão de 'menor resistência', mas de uma força de reação bem definida e direcionada."
      },
      {
        letra: "D",
        texto: "O foguete acelera porque perde massa ao expelir combustível, e menos massa significa mais velocidade automaticamente.",
        explicacao: "Errado. Embora a perda de massa realmente facilite a aceleração futura (pois a = F/m, e m diminui), essa não é a CAUSA da aceleração, é apenas um fator que a intensifica ao longo do tempo. A causa fundamental do impulso é a força de reação dos gases expelidos (3ª Lei), que existe mesmo no primeiro instante, antes de qualquer perda significativa de massa."
      }
    ],
    correta: "A"
  },
  {
    id: "mec-f-01",
    assunto: "lei-1",
    subassunto: "Diagrama de corpo livre",
    dificuldade: "facil",
    tags: ["mecânica", "forças", "diagrama"],
    enunciado: "Uma caixa está parada sobre um piso horizontal. Quais forças devem aparecer no diagrama de corpo livre da caixa?",
    alternativas: [
      {
        letra: "A",
        texto: "O peso para baixo e a força normal do piso para cima.",
        explicacao: "Correto. O peso representa a atração gravitacional da Terra e a normal representa o contato do piso. Como a caixa permanece em repouso, essas forças verticais têm módulos iguais."
      },
      {
        letra: "B",
        texto: "Somente o peso, porque a caixa não está em movimento.",
        explicacao: "Movimento não determina se uma força existe. Sem a normal do piso, o peso produziria aceleração para baixo e a caixa atravessaria a superfície."
      },
      {
        letra: "C",
        texto: "Peso, normal e uma força de movimento para a direita.",
        explicacao: "Não existe uma força de movimento. Velocidade não é força e, neste caso, a caixa está parada sem ação horizontal descrita."
      },
      {
        letra: "D",
        texto: "Apenas a normal, porque o piso sustenta a caixa.",
        explicacao: "A normal só é necessária porque a gravidade puxa a caixa para baixo. Retirar o peso do diagrama impede explicar o equilíbrio vertical."
      }
    ],
    correta: "A",
    dicas: [
      "Liste apenas as interações que agem sobre a caixa, não as forças que ela exerce em outros corpos.",
      "Há uma interação à distância com a Terra e uma interação de contato com o piso."
    ]
  },
  {
    id: "mec-f-02",
    assunto: "lei-2",
    subassunto: "Grandezas vetoriais",
    dificuldade: "facil",
    tags: ["mecânica", "vetores", "aceleração"],
    enunciado: "Um carrinho faz uma curva mantendo 6 m/s no velocímetro. É correto afirmar que sua aceleração é nula?",
    alternativas: [
      {
        letra: "A",
        texto: "Não. A direção da velocidade muda, então existe aceleração.",
        explicacao: "Correto. A velocidade é vetorial. Mesmo com módulo constante, mudar a direção significa variar a velocidade e, portanto, ter aceleração."
      },
      {
        letra: "B",
        texto: "Sim. Aceleração só existe quando o velocímetro aumenta.",
        explicacao: "O velocímetro mostra o módulo da velocidade. Aceleração também pode mudar sua direção, como acontece em uma curva."
      },
      {
        letra: "C",
        texto: "Sim. Toda curva feita em velocidade constante é equilíbrio.",
        explicacao: "Equilíbrio exige velocidade vetorial constante. Em uma curva, a direção varia continuamente, então a resultante não é nula."
      },
      {
        letra: "D",
        texto: "Não, porque a massa do carrinho aumenta durante a curva.",
        explicacao: "A massa não aumenta por causa da curva. A aceleração surge da mudança da direção do vetor velocidade."
      }
    ],
    correta: "A",
    dicas: [
      "Compare módulo e direção da velocidade antes e depois de um pequeno trecho da curva.",
      "Uma grandeza vetorial pode variar mesmo quando o número mostrado no velocímetro não muda."
    ]
  },
  {
    id: "mec-m-01",
    assunto: "lei-2",
    subassunto: "Resultante em duas direções",
    dificuldade: "medio",
    tags: ["mecânica", "vetores", "força resultante"],
    formula: "|Fᵣ| = √(Fₓ² + Fᵧ²)",
    enunciado: "Duas forças perpendiculares de 6 N e 8 N atuam sobre o mesmo ponto de um corpo. Qual é o módulo da força resultante?",
    alternativas: [
      {
        letra: "A",
        texto: "10 N",
        explicacao: "Correto. Como as forças são perpendiculares, elas formam os catetos de um triângulo retângulo: √(6² + 8²) = √100 = 10 N."
      },
      {
        letra: "B",
        texto: "14 N",
        explicacao: "Somar 6 e 8 diretamente só seria correto se as forças tivessem a mesma direção e o mesmo sentido."
      },
      {
        letra: "C",
        texto: "2 N",
        explicacao: "Subtrair os módulos só representa forças colineares em sentidos opostos. Aqui elas são perpendiculares."
      },
      {
        letra: "D",
        texto: "48 N",
        explicacao: "Multiplicar os módulos não produz uma força resultante e ainda gera uma relação dimensional sem significado neste problema."
      }
    ],
    correta: "A",
    dicas: [
      "Desenhe as duas forças como os lados perpendiculares de um retângulo.",
      "A diagonal é a resultante. Use o teorema de Pitágoras nos módulos 6 e 8."
    ]
  },
  {
    id: "mec-m-02",
    assunto: "lei-1",
    subassunto: "Atrito estático",
    dificuldade: "medio",
    tags: ["mecânica", "atrito", "equilíbrio"],
    enunciado: "Uma pessoa empurra uma caixa com 30 N, mas ela não se move. O que o atrito estático faz nessa situação?",
    alternativas: [
      {
        letra: "A",
        texto: "Ajusta-se para 30 N no sentido oposto, mantendo a resultante nula.",
        explicacao: "Correto. Antes do limite máximo, o atrito estático acompanha a força aplicada. Com 30 N opostos, a resultante horizontal é zero."
      },
      {
        letra: "B",
        texto: "É sempre igual ao seu valor máximo, mesmo com forças pequenas.",
        explicacao: "O atrito estático tem um valor máximo, mas não atua sempre nesse máximo. Ele se ajusta ao necessário para impedir o deslizamento."
      },
      {
        letra: "C",
        texto: "É zero porque não existe movimento.",
        explicacao: "O atrito estático existe justamente antes do movimento. Sem ele, a força de 30 N aceleraria a caixa."
      },
      {
        letra: "D",
        texto: "Atua no mesmo sentido do empurrão e dobra a força resultante.",
        explicacao: "Nesta situação, a tendência de deslizamento é no sentido do empurrão. O atrito se opõe a essa tendência."
      }
    ],
    correta: "A",
    dicas: [
      "Se a caixa continua parada, qual deve ser o valor da força resultante horizontal?",
      "Antes do deslizamento, o atrito estático assume o módulo necessário até alcançar seu limite."
    ]
  },
  {
    id: "mec-d-01",
    assunto: "lei-2",
    subassunto: "Peso aparente",
    dificuldade: "dificil",
    tags: ["mecânica", "elevador", "força normal"],
    formula: "N − mg = ma",
    enunciado: "Uma estudante de 60 kg está sobre uma balança em um elevador que acelera para cima a 2 m/s². Adote g = 10 m/s². Qual leitura a balança indica?",
    alternativas: [
      {
        letra: "A",
        texto: "720 N",
        explicacao: "Correto. Para cima positivo: N − mg = ma. Logo N = m(g + a) = 60(10 + 2) = 720 N. A balança mede a normal, não a massa diretamente."
      },
      {
        letra: "B",
        texto: "600 N",
        explicacao: "600 N é apenas o peso mg. Como há aceleração para cima, a normal precisa superar o peso para produzir a resultante."
      },
      {
        letra: "C",
        texto: "480 N",
        explicacao: "Subtrair a aceleração corresponde ao caso de aceleração para baixo. O enunciado informa aceleração para cima."
      },
      {
        letra: "D",
        texto: "120 N",
        explicacao: "120 N é ma, a força resultante. A leitura da balança é a normal, que também precisa equilibrar o peso."
      }
    ],
    correta: "A",
    dicas: [
      "A balança mede a força normal. Desenhe normal para cima e peso para baixo.",
      "Como a aceleração aponta para cima, N deve ser maior que mg por uma diferença igual a ma."
    ]
  },
  {
    id: "mec-d-02",
    assunto: "lei-3",
    subassunto: "Sistema de dois blocos",
    dificuldade: "dificil",
    tags: ["mecânica", "sistemas", "ação e reação"],
    enunciado: "Dois blocos encostados, A de 2 kg e B de 3 kg, são empurrados por 20 N em uma superfície sem atrito. Qual força A exerce sobre B?",
    formula: "a = F/(mA + mB)",
    alternativas: [
      {
        letra: "A",
        texto: "12 N",
        explicacao: "Correto. O conjunto acelera a 20/(2 + 3) = 4 m/s². Em B, a força de contato exercida por A é a resultante: 3 · 4 = 12 N."
      },
      {
        letra: "B",
        texto: "20 N",
        explicacao: "Os 20 N aceleram o sistema inteiro. A força de contato precisa acelerar apenas o bloco B, por isso é menor."
      },
      {
        letra: "C",
        texto: "8 N",
        explicacao: "8 N é o valor mA·a associado à resultante sobre A, não a força que A aplica em B."
      },
      {
        letra: "D",
        texto: "4 N",
        explicacao: "4 é a aceleração em m/s². Confundir aceleração com força elimina a massa de B do cálculo."
      }
    ],
    correta: "A",
    dicas: [
      "Primeiro trate os dois blocos como um único sistema para encontrar a aceleração comum.",
      "Depois isole apenas B. Na horizontal, a força de A sobre B é a resultante que acelera seus 3 kg."
    ]
  }
];
const QUESTOES_CALCULO = [
  // ═══════════════════════ 1ª LEI ═══════════════════════
  {
    id: "calc-lei1-f-01",
    assunto: "lei-1",
    subassunto: "Força resultante nula",
    dificuldade: "facil",
    tags: ["equilíbrio", "força resultante", "1ª Lei"],
    enunciado: "Um bloco está em repouso sobre uma mesa horizontal. O peso do bloco é de 30 N. Qual é o módulo da força normal que a mesa exerce sobre o bloco?",
    dados: [{ simbolo: "P", valor: "30 N" }],
    formula: "N = P (equilíbrio vertical)",
    passos: [
      {
        descricao: "Identificar as forças verticais atuando no bloco",
        calculo: "Peso (↓) e Normal (↑)"
      },
      {
        descricao: "Aplicar a 1ª Lei: como o bloco está em repouso, a força resultante é zero",
        calculo: "ΣFy = N − P = 0"
      },
      {
        descricao: "Isolar N",
        calculo: "N = P = 30 N"
      }
    ],
    valorCorreto: 30,
    unidade: "N",
    toleranciaPercent: 2,
    explicacaoFinal: "Como o bloco está em repouso, a 1ª Lei garante que a força resultante é nula. As únicas forças verticais são o peso (30 N para baixo) e a força normal (N para cima). Para que a resultante seja zero, N deve ser igual e oposta ao peso: N = 30 N.",
    faixasErro: [
      {
        min: 0,
        max: 1,
        diagnostico: "Você digitou zero ou um valor muito pequeno. A força normal não é nula, ela deve equilibrar o peso do bloco (30 N) para mantê-lo em repouso."
      },
      {
        min: 15,
        max: 20,
        diagnostico: "Parece que você dividiu o peso por 2 (N = P/2). A força normal equilibra o peso inteiro, não metade dele, N = P = 30 N."
      },
      {
        min: 60,
        max: 70,
        diagnostico: "Parece que você somou o peso com ele mesmo (N = 2P = 60 N). A força normal é igual ao peso, não o dobro."
      }
    ]
  },
  {
    id: "calc-lei1-m-01",
    assunto: "lei-1",
    subassunto: "Equilíbrio com múltiplas forças",
    dificuldade: "medio",
    tags: ["equilíbrio", "força resultante", "horizontal"],
    enunciado: "Um caixote é puxado para a direita com uma força de 80 N. Para mantê-lo em repouso, uma segunda pessoa empurra para a esquerda. Além disso, há uma força de atrito estático de 20 N agindo também para a esquerda. Qual deve ser o módulo da força que a segunda pessoa aplica?",
    dados: [
      { simbolo: "F₁", valor: "80 N (→)" },
      { simbolo: "Fat", valor: "20 N (←)" }
    ],
    formula: "ΣF = 0 → F₂ = F₁ − Fat",
    passos: [
      {
        descricao: "Definir sentido positivo: direita = positivo",
        calculo: "+80 N − F₂ − 20 N = 0"
      },
      {
        descricao: "Isolar F₂",
        calculo: "F₂ = 80 − 20 = 60 N"
      }
    ],
    valorCorreto: 60,
    unidade: "N",
    toleranciaPercent: 2,
    explicacaoFinal: "Para o caixote estar em equilíbrio (1ª Lei), a soma de todas as forças horizontais deve ser zero. Para a direita: +80 N. Para a esquerda: F₂ + 20 N. Logo: 80 = F₂ + 20 → F₂ = 60 N.",
    faixasErro: [
      {
        min: 78,
        max: 82,
        diagnostico: "Você digitou ~80 N, que é a força da primeira pessoa. Mas o atrito (20 N) também age para a esquerda, a segunda pessoa só precisa complementar: F₂ = 80 − 20 = 60 N."
      },
      {
        min: 98,
        max: 102,
        diagnostico: "Você somou as duas forças (80 + 20 = 100 N) em vez de subtrair. O atrito já ajuda a equilibrar a força de 80 N, a segunda pessoa só precisa fornecer a diferença."
      },
      {
        min: 18,
        max: 22,
        diagnostico: "Você digitou apenas o valor do atrito (20 N). Mas 20 N não é suficiente para equilibrar os 80 N da outra pessoa, faltam mais 40 N."
      }
    ]
  },
  {
    id: "calc-lei1-d-01",
    assunto: "lei-1",
    subassunto: "Equilíbrio em plano inclinado",
    dificuldade: "dificil",
    tags: ["equilíbrio", "plano inclinado", "componentes"],
    enunciado: "Um bloco de 10 kg repousa sobre um plano inclinado de 30°. Considere g = 10 m/s². Qual é o módulo da força de atrito necessária para manter o bloco em equilíbrio? (Dica: a componente do peso paralela ao plano é P·sen30°)",
    dados: [
      { simbolo: "m", valor: "10 kg" },
      { simbolo: "g", valor: "10 m/s²" },
      { simbolo: "θ", valor: "30°" },
      { simbolo: "sen 30°", valor: "0,5" }
    ],
    formula: "Fat = P · sen θ = m · g · sen θ",
    passos: [
      {
        descricao: "Calcular o peso",
        calculo: "P = m · g = 10 × 10 = 100 N"
      },
      {
        descricao: "Calcular a componente do peso paralela ao plano (que tende a deslizar o bloco)",
        calculo: "P‖ = P · sen 30° = 100 × 0,5 = 50 N"
      },
      {
        descricao: "Para equilíbrio, o atrito deve ser igual e oposto à componente paralela",
        calculo: "Fat = P‖ = 50 N"
      }
    ],
    valorCorreto: 50,
    unidade: "N",
    toleranciaPercent: 2,
    explicacaoFinal: "No plano inclinado, o peso se decompõe em duas componentes: paralela ao plano (P·sen30° = 50 N, que tende a deslizar o bloco) e perpendicular (P·cos30°, equilibrada pela normal). Para equilíbrio, a força de atrito deve igualar a componente paralela: Fat = 50 N.",
    faixasErro: [
      {
        min: 98,
        max: 102,
        diagnostico: "Você digitou 100 N, que é o peso total. No plano inclinado, só a componente paralela ao plano (P·sen30° = 50 N) tende a deslizar o bloco, não o peso inteiro."
      },
      {
        min: 84,
        max: 88,
        diagnostico: "Você usou cos30° (≈0,87) em vez de sen30° (0,5). A componente que tende a deslizar o bloco ao longo do plano é P·senθ, não P·cosθ."
      },
      {
        min: 28,
        max: 32,
        diagnostico: "Você pode ter usado o ângulo em vez do seno (Fat = P × 30° = 3000 N / 100 ≈ 30 N). O cálculo correto usa o sen do ângulo: sen30° = 0,5."
      }
    ]
  },
  // ═══════════════════════ 2ª LEI ═══════════════════════
  {
    id: "calc-lei2-f-01",
    assunto: "lei-2",
    subassunto: "Cálculo direto de aceleração",
    dificuldade: "facil",
    tags: ["F = ma", "aceleração", "cálculo direto"],
    enunciado: "Uma força resultante de 36 N é aplicada sobre um corpo de massa 4 kg. Qual é a aceleração produzida?",
    dados: [
      { simbolo: "F", valor: "36 N" },
      { simbolo: "m", valor: "4 kg" }
    ],
    formula: "a = F / m",
    passos: [
      {
        descricao: "Aplicar a 2ª Lei de Newton",
        calculo: "F = m · a → a = F / m"
      },
      {
        descricao: "Substituir os valores",
        calculo: "a = 36 / 4 = 9 m/s²"
      }
    ],
    valorCorreto: 9,
    unidade: "m/s²",
    toleranciaPercent: 2,
    explicacaoFinal: "Pela 2ª Lei (F = m·a), isolamos a aceleração: a = F/m = 36/4 = 9 m/s². Note que a aceleração tem a mesma direção e sentido da força resultante.",
    faixasErro: [
      {
        min: 143,
        max: 145,
        diagnostico: "Você multiplicou F × m (36 × 4 = 144) em vez de dividir. A fórmula é a = F ÷ m, não F × m."
      },
      {
        min: 0.1,
        max: 0.12,
        diagnostico: "Você inverteu a divisão (m/F = 4/36 ≈ 0,11). A aceleração é a = F/m, com a força no numerador e a massa no denominador."
      },
      {
        min: 40,
        max: 40,
        diagnostico: "Você somou F + m (36 + 4 = 40). Força e massa têm unidades diferentes (N e kg) e não podem ser somadas, a relação entre elas é a = F/m."
      }
    ]
  },
  {
    id: "calc-lei2-m-01",
    assunto: "lei-2",
    subassunto: "Força resultante com atrito",
    dificuldade: "medio",
    tags: ["F = ma", "atrito", "força resultante"],
    enunciado: "Um bloco de 5 kg é empurrado horizontalmente com uma força de 30 N. A força de atrito cinético é de 10 N. Calcule a aceleração do bloco.",
    dados: [
      { simbolo: "m", valor: "5 kg" },
      { simbolo: "Fapl", valor: "30 N" },
      { simbolo: "Fat", valor: "10 N (oposta ao movimento)" }
    ],
    formula: "a = (Fapl − Fat) / m",
    passos: [
      {
        descricao: "Calcular a força resultante horizontal",
        calculo: "Fres = 30 − 10 = 20 N"
      },
      {
        descricao: "Aplicar a 2ª Lei",
        calculo: "a = Fres / m = 20 / 5 = 4 m/s²"
      }
    ],
    valorCorreto: 4,
    unidade: "m/s²",
    toleranciaPercent: 2,
    explicacaoFinal: "A força resultante é a soma vetorial de todas as forças horizontais: Fres = 30 − 10 = 20 N (o atrito opõe-se ao movimento, então é subtraído). Pela 2ª Lei: a = Fres/m = 20/5 = 4 m/s².",
    faixasErro: [
      {
        min: 5.9,
        max: 6.1,
        diagnostico: "Você dividiu a força aplicada pelo quociente errado (30/5 = 6). Você ignorou o atrito, a força RESULTANTE é 30 − 10 = 20 N, não 30 N."
      },
      {
        min: 7.9,
        max: 8.1,
        diagnostico: "Você somou as forças em vez de subtrair (30 + 10 = 40, 40/5 = 8). O atrito se opõe ao movimento, deve ser subtraído da força aplicada."
      },
      {
        min: 1.9,
        max: 2.1,
        diagnostico: "Você usou só a força de atrito dividida pela massa (10/5 = 2). O atrito não é a força resultante, a resultante é a diferença entre a força aplicada e o atrito."
      }
    ]
  },
  {
    id: "calc-lei2-d-01",
    assunto: "lei-2",
    subassunto: "Sistema com duas massas",
    dificuldade: "dificil",
    tags: ["sistema", "F = ma", "massa total"],
    enunciado: "Dois blocos, A (3 kg) e B (2 kg), estão ligados por um fio e puxados horizontalmente por uma força F = 25 N. Não há atrito. Calcule a aceleração do sistema.",
    dados: [
      { simbolo: "mA", valor: "3 kg" },
      { simbolo: "mB", valor: "2 kg" },
      { simbolo: "F", valor: "25 N" }
    ],
    formula: "a = F / (mA + mB)",
    passos: [
      {
        descricao: "Calcular a massa total do sistema",
        calculo: "mtotal = 3 + 2 = 5 kg"
      },
      {
        descricao: "Aplicar a 2ª Lei ao sistema inteiro",
        calculo: "a = F / mtotal = 25 / 5 = 5 m/s²"
      }
    ],
    valorCorreto: 5,
    unidade: "m/s²",
    toleranciaPercent: 2,
    explicacaoFinal: "Como os blocos estão ligados e se movem juntos, trata-se de um único sistema com massa total mA + mB = 5 kg. A força externa é F = 25 N. Pela 2ª Lei: a = F/mtotal = 25/5 = 5 m/s².",
    faixasErro: [
      {
        min: 8.2,
        max: 8.5,
        diagnostico: "Você dividiu F pela massa apenas do bloco A (25/3 ≈ 8,3). Quando dois corpos se movem juntos, a 2ª Lei se aplica à massa TOTAL do sistema: mA + mB = 5 kg."
      },
      {
        min: 12.4,
        max: 12.6,
        diagnostico: "Você dividiu F pela massa apenas do bloco B (25/2 = 12,5). Os dois blocos se movem juntos, use a massa total: 3 + 2 = 5 kg."
      },
      {
        min: 1,
        max: 1.1,
        diagnostico: "Você pode ter multiplicado as massas (3 × 2 = 6) ou feito outro cálculo errado. A massa do sistema é a SOMA das massas: 3 + 2 = 5 kg."
      }
    ]
  },
  // ═══════════════════════ 3ª LEI ═══════════════════════
  {
    id: "calc-lei3-f-01",
    assunto: "lei-3",
    subassunto: "Par ação-reação, módulo da reação",
    dificuldade: "facil",
    tags: ["ação e reação", "par de forças"],
    enunciado: "Uma pessoa empurra uma parede com uma força de 150 N. Qual é o módulo da força que a parede exerce de volta sobre a pessoa?",
    dados: [{ simbolo: "Fação", valor: "150 N" }],
    formula: "|Freação| = |Fação|",
    passos: [
      {
        descricao: "Pela 3ª Lei de Newton, a força de reação tem o mesmo módulo da ação",
        calculo: "|Freação| = |Fação| = 150 N"
      }
    ],
    valorCorreto: 150,
    unidade: "N",
    toleranciaPercent: 2,
    explicacaoFinal: "A 3ª Lei estabelece que toda ação tem uma reação de igual módulo, mesma direção e sentido oposto. A pessoa empurra a parede com 150 N → a parede empurra a pessoa de volta com 150 N. O fato de a parede não se mover não muda a força que ela exerce.",
    faixasErro: [
      {
        min: 0,
        max: 1,
        diagnostico: "Você digitou zero, como se a parede não exercesse força. A 3ª Lei diz que toda ação gera uma reação de igual módulo, a parede imóvel ainda exerce 150 N sobre a pessoa."
      },
      {
        min: 74,
        max: 76,
        diagnostico: "Você dividiu a força por 2 (75 N). A força de reação tem o MESMO módulo da ação, não metade."
      },
      {
        min: 298,
        max: 302,
        diagnostico: "Você dobrou a força (300 N). A reação é igual à ação em módulo (150 N), não o dobro."
      }
    ]
  },
  {
    id: "calc-lei3-m-01",
    assunto: "lei-3",
    subassunto: "Aceleração com par ação-reação e massas diferentes",
    dificuldade: "medio",
    tags: ["ação e reação", "aceleração", "massas diferentes"],
    enunciado: "Dois patinadores, A (60 kg) e B (40 kg), se empurram mutuamente. A força de interação entre eles é de 120 N. Calcule a aceleração do patinador B.",
    dados: [
      { simbolo: "mB", valor: "40 kg" },
      { simbolo: "F", valor: "120 N" }
    ],
    formula: "aB = F / mB",
    passos: [
      {
        descricao: "Pela 3ª Lei, a força sobre B tem módulo igual à força de interação",
        calculo: "FB = 120 N"
      },
      {
        descricao: "Aplicar a 2ª Lei a B",
        calculo: "aB = FB / mB = 120 / 40 = 3 m/s²"
      }
    ],
    valorCorreto: 3,
    unidade: "m/s²",
    toleranciaPercent: 2,
    explicacaoFinal: "A força sobre B é 120 N (pela 3ª Lei, igual em módulo à força de interação). Aplicando a 2ª Lei apenas ao patinador B: aB = 120/40 = 3 m/s². Note que a aceleração do patinador A seria diferente: aA = 120/60 = 2 m/s², pares ação-reação iguais produzem acelerações diferentes quando as massas diferem.",
    faixasErro: [
      {
        min: 1.9,
        max: 2.1,
        diagnostico: "Você calculou a aceleração do patinador A (120/60 = 2 m/s²). A questão pede a aceleração de B, cuja massa é 40 kg: aB = 120/40 = 3 m/s²."
      },
      {
        min: 1.19,
        max: 1.21,
        diagnostico: "Você dividiu a força pela massa TOTAL (120/100 = 1,2). Para a aceleração de B, use só a massa de B (40 kg), não a soma das massas."
      }
    ]
  },
  {
    id: "calc-lei3-d-01",
    assunto: "lei-3",
    subassunto: "Propulsão por reação",
    dificuldade: "dificil",
    tags: ["ação e reação", "propulsão", "foguete"],
    enunciado: "Um foguete de 800 kg expele gases com uma força de reação de 16.000 N. Desconsidere a gravidade e o atrito. Qual é a aceleração inicial do foguete?",
    dados: [
      { simbolo: "m", valor: "800 kg" },
      { simbolo: "Freação", valor: "16.000 N" }
    ],
    formula: "a = F / m",
    passos: [
      {
        descricao: "A força que impulsiona o foguete é a força de reação dos gases expelidos (3ª Lei)",
        calculo: "F = 16.000 N"
      },
      {
        descricao: "Aplicar a 2ª Lei ao foguete",
        calculo: "a = F / m = 16.000 / 800 = 20 m/s²"
      }
    ],
    valorCorreto: 20,
    unidade: "m/s²",
    toleranciaPercent: 2,
    explicacaoFinal: "O foguete expele gases para trás (ação) e recebe uma força de reação para frente de 16.000 N (3ª Lei). Aplicando a 2ª Lei ao foguete: a = F/m = 16.000/800 = 20 m/s². Note que desconsideramos a gravidade para simplificar, num problema real, a força resultante seria F − Peso.",
    faixasErro: [
      {
        min: 12.799,
        max: 12.801,
        diagnostico: "Você pode ter usado uma massa diferente. Verifique: m = 800 kg, F = 16.000 N → a = 16.000 / 800 = 20 m/s²."
      },
      {
        min: 19.9,
        max: 20.1,
        diagnostico: "Correto! Sua resposta está dentro da margem de tolerância."
      },
      {
        min: 0.049,
        max: 0.051,
        diagnostico: "Você inverteu a divisão (800/16.000 = 0,05). A fórmula é a = F/m, com a força no numerador."
      }
    ]
  }
];
const STORAGE_KEY$1 = storageKey("respostas");
const DIFICULDADE_KEY = storageKey("dificuldade-adaptativa");
const ADAPTACAO_META_KEY = storageKey("adaptacao-meta");
const ASSUNTOS = ["lei-1", "lei-2", "lei-3"];
const DIFICULDADES = ["facil", "medio", "dificil"];
function armazenamentoDisponivel() {
  return typeof window !== "undefined";
}
function ehResposta(valor) {
  if (!valor || typeof valor !== "object") return false;
  const resposta = valor;
  return typeof resposta.questaoId === "string" && resposta.questaoId.length > 0 && resposta.questaoId.length <= 80 && ["A", "B", "C", "D", "CALC"].includes(resposta.letraEscolhida ?? "") && typeof resposta.correta === "boolean" && typeof resposta.tempoSegundos === "number" && Number.isFinite(resposta.tempoSegundos) && resposta.tempoSegundos >= 0 && resposta.tempoSegundos <= 7200 && typeof resposta.respondidoEm === "string" && !Number.isNaN(Date.parse(resposta.respondidoEm)) && (resposta.confianca === void 0 || ["baixa", "media", "alta"].includes(resposta.confianca)) && (resposta.corrigida === void 0 || typeof resposta.corrigida === "boolean");
}
function lerJSON(chave, padrao) {
  if (!armazenamentoDisponivel()) return padrao;
  try {
    const valor = window.localStorage.getItem(chave);
    return valor ? JSON.parse(valor) : padrao;
  } catch {
    return padrao;
  }
}
function salvarHistorico(historico) {
  if (!armazenamentoDisponivel()) return;
  window.localStorage.setItem(STORAGE_KEY$1, JSON.stringify(historico.slice(-2e3)));
  emitProgressUpdated();
}
function assuntoDaQuestao(questaoId) {
  const questao = [...QUESTOES, ...QUESTOES_CALCULO].find((item) => item.id === questaoId);
  return questao?.assunto ?? null;
}
function nivelPadrao() {
  return { "lei-1": "facil", "lei-2": "facil", "lei-3": "facil" };
}
function lerDificuldades() {
  const salvas = lerJSON(DIFICULDADE_KEY, {});
  const resultado = nivelPadrao();
  for (const assunto of ASSUNTOS) {
    const dificuldadeSalva = salvas[assunto];
    if (dificuldadeSalva && DIFICULDADES.includes(dificuldadeSalva)) {
      resultado[assunto] = dificuldadeSalva;
    }
  }
  return resultado;
}
function salvarDificuldades(niveis) {
  if (!armazenamentoDisponivel()) return;
  window.localStorage.setItem(DIFICULDADE_KEY, JSON.stringify(niveis));
}
function lerMetaAdaptacao() {
  const padrao = {
    "lei-1": { respostasAvaliadas: 0 },
    "lei-2": { respostasAvaliadas: 0 },
    "lei-3": { respostasAvaliadas: 0 }
  };
  const valor = lerJSON(ADAPTACAO_META_KEY, {});
  for (const assunto of ASSUNTOS) {
    const contagem = valor[assunto]?.respostasAvaliadas;
    if (typeof contagem === "number" && Number.isInteger(contagem) && contagem >= 0) {
      padrao[assunto].respostasAvaliadas = contagem;
    }
  }
  return padrao;
}
function salvarMetaAdaptacao(meta) {
  if (!armazenamentoDisponivel()) return;
  window.localStorage.setItem(ADAPTACAO_META_KEY, JSON.stringify(meta));
}
function obterHistorico() {
  const bruto = lerJSON(STORAGE_KEY$1, []);
  if (!Array.isArray(bruto)) return [];
  return bruto.filter(ehResposta).slice(-2e3);
}
function registrarResposta(resposta) {
  if (!ehResposta(resposta)) return;
  salvarHistorico([...obterHistorico(), resposta]);
}
function marcarRespostaCorrigida(questaoId) {
  const historico = obterHistorico();
  for (let indice = historico.length - 1; indice >= 0; indice -= 1) {
    const resposta = historico[indice];
    if (resposta.questaoId === questaoId && !resposta.correta && !resposta.corrigida) {
      historico[indice] = { ...resposta, corrigida: true };
      salvarHistorico(historico);
      return true;
    }
  }
  return false;
}
function limparHistorico() {
  if (!armazenamentoDisponivel()) return;
  window.localStorage.removeItem(STORAGE_KEY$1);
  window.localStorage.removeItem(DIFICULDADE_KEY);
  window.localStorage.removeItem(ADAPTACAO_META_KEY);
  emitProgressUpdated();
}
function obterQuestoesPorAssunto(assunto, dificuldade) {
  return QUESTOES.filter(
    (questao) => questao.assunto === assunto && (dificuldade === void 0 || questao.dificuldade === dificuldade)
  );
}
function ultimaRespostaPorQuestao(historico) {
  const mapa = /* @__PURE__ */ new Map();
  for (const resposta of historico) mapa.set(resposta.questaoId, resposta);
  return mapa;
}
function pontuarQuestao(questao, historico, agora) {
  const respostasQuestao = historico.filter((resposta) => resposta.questaoId === questao.id);
  if (respostasQuestao.length === 0) return 120;
  const ultima = respostasQuestao.at(-1);
  if (!ultima) return 120;
  const diasDesdeResposta = Math.max(
    0,
    Math.floor((agora - Date.parse(ultima.respondidoEm)) / 864e5)
  );
  let pontos = Math.min(45, diasDesdeResposta * 5);
  if (!ultima.correta && !ultima.corrigida) pontos += 150;
  if (ultima.corrigida) pontos += Math.min(35, diasDesdeResposta * 7);
  if (ultima.correta) pontos -= 20;
  if (ultima.confianca === "baixa") pontos += 20;
  if (ultima.confianca === "alta" && !ultima.correta) pontos += 15;
  const questoesMesmoSubassunto = new Set(
    QUESTOES.filter((item) => item.subassunto === questao.subassunto).map((item) => item.id)
  );
  const respostasSubassunto = historico.filter(
    (resposta) => questoesMesmoSubassunto.has(resposta.questaoId)
  );
  if (respostasSubassunto.length >= 2) {
    const taxa = respostasSubassunto.filter((resposta) => resposta.correta || resposta.corrigida).length / respostasSubassunto.length;
    pontos += Math.round((1 - taxa) * 40);
  }
  return pontos;
}
function escolherProximaQuestao(assunto, dificuldade, excluirIds = []) {
  const historico = obterHistorico();
  const assuntoEfetivo = assunto === "misto" ? escolherAssuntoAdaptativo() : assunto;
  const doNivel = obterQuestoesPorAssunto(assuntoEfetivo, dificuldade);
  const todasDoAssunto = obterQuestoesPorAssunto(assuntoEfetivo);
  const base = doNivel.length > 0 ? doNivel : todasDoAssunto;
  const semRepetir = base.filter((questao) => !excluirIds.includes(questao.id));
  const candidatas = semRepetir.length > 0 ? semRepetir : base;
  const agora = Date.now();
  return [...candidatas].sort((a, b) => {
    const diferenca = pontuarQuestao(b, historico, agora) - pontuarQuestao(a, historico, agora);
    return diferenca || a.id.localeCompare(b.id);
  })[0] ?? null;
}
function escolherProximaQuestaoMecanica(dificuldade, excluirIds = []) {
  const historico = obterHistorico();
  const mecanica = QUESTOES.filter(
    (questao) => questao.tags.includes("mecânica") && questao.dificuldade === dificuldade
  );
  const todas = QUESTOES.filter((questao) => questao.tags.includes("mecânica"));
  const base = mecanica.length > 0 ? mecanica : todas;
  const semRepetir = base.filter((questao) => !excluirIds.includes(questao.id));
  const candidatas = semRepetir.length > 0 ? semRepetir : base;
  const agora = Date.now();
  return [...candidatas].sort((a, b) => {
    const diferenca = pontuarQuestao(b, historico, agora) - pontuarQuestao(a, historico, agora);
    return diferenca || a.id.localeCompare(b.id);
  })[0] ?? null;
}
function obterDicasQuestao(questao) {
  if (questao.dicas) return questao.dicas;
  return [
    `Comece identificando ${questao.tags.slice(0, 2).join(" e ")} na situação.`,
    questao.formula ? `Escreva ${questao.formula} e confira quais grandezas do enunciado entram nela.` : "Separe as forças por corpo e verifique se existe aceleração ou equilíbrio."
  ];
}
function contarRevisoesPendentes(assunto) {
  const historico = obterHistorico().filter(
    (resposta) => !assunto || assuntoDaQuestao(resposta.questaoId) === assunto
  );
  const ultimas = ultimaRespostaPorQuestao(historico);
  return [...ultimas.values()].filter((resposta) => !resposta.correta && !resposta.corrigida).length;
}
function escolherAssuntoAdaptativo() {
  const historico = obterHistorico();
  const pendencias = ASSUNTOS.map((assunto) => ({
    assunto,
    pendentes: contarRevisoesPendentes(assunto)
  })).sort((a, b) => b.pendentes - a.pendentes);
  if (pendencias[0].pendentes > 0) return pendencias[0].assunto;
  const desempenho = calcularDesempenhoPorAssunto();
  const semPratica = desempenho.find((item) => item.totalRespostas === 0);
  if (semPratica) return semPratica.assunto;
  return [...desempenho].sort((a, b) => {
    if (a.taxaAcerto !== b.taxaAcerto) return a.taxaAcerto - b.taxaAcerto;
    const ultimaA = historico.filter((resposta) => assuntoDaQuestao(resposta.questaoId) === a.assunto).at(-1)?.respondidoEm;
    const ultimaB = historico.filter((resposta) => assuntoDaQuestao(resposta.questaoId) === b.assunto).at(-1)?.respondidoEm;
    return Date.parse(ultimaA ?? "1970-01-01") - Date.parse(ultimaB ?? "1970-01-01");
  })[0].assunto;
}
function calcularDesempenhoPorAssunto() {
  const historico = obterHistorico();
  return ASSUNTOS.map((assunto) => {
    const respostas = historico.filter(
      (resposta) => assuntoDaQuestao(resposta.questaoId) === assunto
    );
    const acertos = respostas.filter((resposta) => resposta.correta).length;
    const totalRespostas = respostas.length;
    return {
      assunto,
      totalRespostas,
      acertos,
      taxaAcerto: totalRespostas > 0 ? Math.round(acertos / totalRespostas * 100) : 0,
      tempoMedioSegundos: totalRespostas > 0 ? Math.round(
        respostas.reduce((total, resposta) => total + resposta.tempoSegundos, 0) / totalRespostas
      ) : 0
    };
  });
}
function identificarPontosFortesEFracos() {
  const desempenho = calcularDesempenhoPorAssunto();
  return {
    desempenho,
    dominados: desempenho.filter((item) => item.totalRespostas >= 4 && item.taxaAcerto >= 75),
    precisamRevisao: desempenho.filter((item) => item.totalRespostas >= 3 && item.taxaAcerto < 60)
  };
}
function obterDificuldadeAtual(assunto) {
  return lerDificuldades()[assunto];
}
function atualizarDificuldadeAdaptativa(assunto) {
  const niveis = lerDificuldades();
  const nivelAnterior = niveis[assunto];
  const respostas = obterHistorico().filter(
    (resposta) => assuntoDaQuestao(resposta.questaoId) === assunto
  );
  const meta = lerMetaAdaptacao();
  if (respostas.length < 5 || respostas.length - meta[assunto].respostasAvaliadas < 5) {
    return { mudou: false, nivelAnterior, nivelNovo: nivelAnterior };
  }
  const janela = respostas.slice(-8);
  const acertos = janela.filter((resposta) => resposta.correta).length;
  const taxa = acertos / janela.length;
  const tempoMedio = janela.reduce((total, resposta) => total + resposta.tempoSegundos, 0) / janela.length;
  let nivelNovo = nivelAnterior;
  if (nivelAnterior === "facil" && taxa >= 0.8 && tempoMedio <= 120) nivelNovo = "medio";
  if (nivelAnterior === "medio" && taxa >= 0.75 && tempoMedio <= 150) nivelNovo = "dificil";
  if (nivelAnterior === "medio" && taxa < 0.45) nivelNovo = "facil";
  if (nivelAnterior === "dificil" && taxa < 0.5) nivelNovo = "medio";
  meta[assunto].respostasAvaliadas = respostas.length;
  salvarMetaAdaptacao(meta);
  if (nivelNovo !== nivelAnterior) {
    niveis[assunto] = nivelNovo;
    salvarDificuldades(niveis);
  }
  return { mudou: nivelNovo !== nivelAnterior, nivelAnterior, nivelNovo };
}
const ASSUNTO_LABEL = {
  "lei-1": "1ª Lei de Newton",
  "lei-2": "2ª Lei de Newton",
  "lei-3": "3ª Lei de Newton"
};
function tempoTotalEstudoSegundos() {
  return obterHistorico().reduce((soma, r) => soma + r.tempoSegundos, 0);
}
function formatarDuracao(segundos) {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.round(segundos % 3600 / 60);
  if (horas === 0 && minutos === 0) return "0min";
  if (horas === 0) return `${minutos}min`;
  return `${horas}h ${minutos}min`;
}
function diaISO(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}
function diasComAtividade() {
  const dias = /* @__PURE__ */ new Set();
  for (const r of obterHistorico()) {
    dias.add(diaISO(new Date(r.respondidoEm)));
  }
  return dias;
}
function calcularStreak() {
  const dias = diasComAtividade();
  if (dias.size === 0) return { atual: 0, recorde: 0 };
  let atual = 0;
  const cursor = /* @__PURE__ */ new Date();
  if (!dias.has(diaISO(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (dias.has(diaISO(cursor))) {
    atual += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  const ordenados = Array.from(dias).sort();
  let recorde = 0;
  let sequenciaAtual = 0;
  let anterior = null;
  for (const diaStr of ordenados) {
    const dia = /* @__PURE__ */ new Date(`${diaStr}T12:00:00`);
    if (anterior) {
      const diffDias = Math.round((dia.getTime() - anterior.getTime()) / 864e5);
      sequenciaAtual = diffDias === 1 ? sequenciaAtual + 1 : 1;
    } else {
      sequenciaAtual = 1;
    }
    recorde = Math.max(recorde, sequenciaAtual);
    anterior = dia;
  }
  return { atual, recorde: Math.max(recorde, atual) };
}
function atividadeUltimos7Dias() {
  const historico = obterHistorico();
  const porDia = /* @__PURE__ */ new Map();
  for (const r of historico) {
    const dia = diaISO(new Date(r.respondidoEm));
    const lista = porDia.get(dia) ?? [];
    lista.push(r);
    porDia.set(dia, lista);
  }
  const labels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const resultado = [];
  for (let i = 6; i >= 0; i--) {
    const data = /* @__PURE__ */ new Date();
    data.setDate(data.getDate() - i);
    const diaStr = diaISO(data);
    const respostasDoDia = porDia.get(diaStr) ?? [];
    resultado.push({
      label: labels[data.getDay()],
      data: diaStr,
      respostas: respostasDoDia.length,
      acertos: respostasDoDia.filter((r) => r.correta).length
    });
  }
  return resultado;
}
function gerarRecomendacao() {
  const { precisamRevisao } = identificarPontosFortesEFracos();
  const licoes = todasLicoes();
  if (precisamRevisao.length > 0) {
    const pior = [...precisamRevisao].sort((a, b) => a.taxaAcerto - b.taxaAcerto)[0];
    return {
      tipo: "revisar",
      assunto: pior.assunto,
      motivo: `Sua taxa de acerto em ${ASSUNTO_LABEL[pior.assunto]} está em ${pior.taxaAcerto}%. Vale revisar antes de seguir.`,
      to: "/questoes"
    };
  }
  const licaoIncompleta = [...licoes].sort((a, b) => a.percentual - b.percentual)[0];
  if (licaoIncompleta && licaoIncompleta.percentual < 100) {
    return {
      tipo: "continuar-licao",
      assunto: licaoIncompleta.assunto,
      motivo: `Você está com ${licaoIncompleta.percentual}% da lição de ${ASSUNTO_LABEL[licaoIncompleta.assunto]}. Continue de onde parou.`,
      to: `/${licaoIncompleta.assunto}`
    };
  }
  const desempenho = calcularDesempenhoPorAssunto();
  const semHistorico = desempenho.every((d) => d.totalRespostas === 0);
  if (semHistorico) {
    return {
      tipo: "comecar",
      assunto: "lei-1",
      motivo: "Você ainda não praticou nenhuma questão. Que tal começar pela 1ª Lei?",
      to: "/questoes"
    };
  }
  const melhor = [...desempenho].sort((a, b) => b.taxaAcerto - a.taxaAcerto)[0];
  return {
    tipo: "avancar-dificuldade",
    assunto: melhor.assunto,
    motivo: `Seu desempenho em ${ASSUNTO_LABEL[melhor.assunto]} está ótimo (${melhor.taxaAcerto}%). Hora de subir o nível.`,
    to: "/questoes"
  };
}
function montarPerfilAprendizagem() {
  const { dominados, precisamRevisao, desempenho } = identificarPontosFortesEFracos();
  const licoes = todasLicoes();
  const progressoGeralLicoes = Math.round(
    licoes.reduce((soma, l) => soma + l.percentual, 0) / licoes.length
  );
  return {
    streak: calcularStreak(),
    tempoTotalSegundos: tempoTotalEstudoSegundos(),
    totalRespostas: obterHistorico().length,
    totalNotas: listarNotas().length,
    progressoGeralLicoes,
    licoes,
    dominados,
    precisamRevisao,
    desempenho,
    recomendacao: gerarRecomendacao(),
    atividade7Dias: atividadeUltimos7Dias()
  };
}
function gerarResumoPerfilParaGravity() {
  const perfil = montarPerfilAprendizagem();
  if (perfil.totalRespostas === 0) {
    return "O aluno ainda não respondeu nenhuma questão na plataforma.";
  }
  const partes = [];
  if (perfil.dominados.length > 0) {
    const lista = perfil.dominados.map(
      (d) => `${ASSUNTO_LABEL[d.assunto]} (${d.taxaAcerto}% de acerto)`
    ).join(", ");
    partes.push(`domina bem: ${lista}`);
  }
  if (perfil.precisamRevisao.length > 0) {
    const lista = perfil.precisamRevisao.map(
      (d) => `${ASSUNTO_LABEL[d.assunto]} (${d.taxaAcerto}% de acerto)`
    ).join(", ");
    partes.push(`tem dificuldade em: ${lista}`);
  }
  if (partes.length === 0) {
    return `O aluno já respondeu ${perfil.totalRespostas} questões, mas ainda não há dados suficientes por assunto para identificar pontos fortes/fracos.`;
  }
  return `O aluno já respondeu ${perfil.totalRespostas} questões. Com base nisso, ${partes.join("; ")}.`;
}
const STORAGE_KEY = storageKey("settings");
const DEFAULT_SETTINGS = {
  theme: "system",
  motion: "full",
  reading: "standard",
  focusMode: false,
  sessionMinutes: 10,
  breakReminders: true,
  showTimer: false
};
const SiteSettingsContext = reactExports.createContext(null);
function isTheme(value) {
  return value === "light" || value === "dark" || value === "system";
}
function isMotion(value) {
  return value === "full" || value === "reduced";
}
function isReading(value) {
  return value === "standard" || value === "large";
}
function isSessionMinutes(value) {
  return value === 5 || value === 10 || value === 15;
}
function readSettings() {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
    return {
      theme: isTheme(parsed.theme) ? parsed.theme : DEFAULT_SETTINGS.theme,
      motion: isMotion(parsed.motion) ? parsed.motion : window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : "full",
      reading: isReading(parsed.reading) ? parsed.reading : DEFAULT_SETTINGS.reading,
      focusMode: typeof parsed.focusMode === "boolean" ? parsed.focusMode : DEFAULT_SETTINGS.focusMode,
      sessionMinutes: isSessionMinutes(parsed.sessionMinutes) ? parsed.sessionMinutes : DEFAULT_SETTINGS.sessionMinutes,
      breakReminders: typeof parsed.breakReminders === "boolean" ? parsed.breakReminders : DEFAULT_SETTINGS.breakReminders,
      showTimer: typeof parsed.showTimer === "boolean" ? parsed.showTimer : DEFAULT_SETTINGS.showTimer
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}
function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = reactExports.useState(DEFAULT_SETTINGS);
  const [systemTheme, setSystemTheme] = reactExports.useState("light");
  const [initialized, setInitialized] = reactExports.useState(false);
  reactExports.useEffect(() => {
    migrateLegacyStorage();
    setSettings(readSettings());
    setSystemTheme(getSystemTheme());
    setInitialized(true);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setSystemTheme(media.matches ? "dark" : "light");
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);
  const resolvedTheme = settings.theme === "system" ? systemTheme : settings.theme;
  reactExports.useEffect(() => {
    if (!initialized) return;
    const root = document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.dataset.motion = settings.motion;
    root.dataset.reading = settings.reading;
    root.dataset.appReady = "true";
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [initialized, settings, resolvedTheme]);
  const value = reactExports.useMemo(
    () => ({
      ...settings,
      resolvedTheme,
      setTheme: (theme) => setSettings((current) => ({ ...current, theme })),
      setMotion: (motion2) => setSettings((current) => ({ ...current, motion: motion2 })),
      setReading: (reading) => setSettings((current) => ({ ...current, reading })),
      setFocusMode: (focusMode) => setSettings((current) => ({ ...current, focusMode })),
      setSessionMinutes: (sessionMinutes) => setSettings((current) => ({ ...current, sessionMinutes })),
      setBreakReminders: (breakReminders) => setSettings((current) => ({ ...current, breakReminders })),
      setShowTimer: (showTimer) => setSettings((current) => ({ ...current, showTimer }))
    }),
    [settings, resolvedTheme]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SiteSettingsContext.Provider, { value, children });
}
function useSiteSettings() {
  const context = reactExports.useContext(SiteSettingsContext);
  if (!context) throw new Error("useSiteSettings precisa estar dentro de SiteSettingsProvider.");
  return context;
}
function GravityWidget() {
  const location = useLocation();
  const [aberto, setAberto] = reactExports.useState(false);
  const { motion: motionPreference } = useSiteSettings();
  const movimentoReduzido = motionPreference === "reduced";
  reactExports.useEffect(() => {
    if (!aberto) return;
    const fecharComEscape = (evento) => {
      if (evento.key === "Escape") setAberto(false);
    };
    window.addEventListener("keydown", fecharComEscape);
    return () => window.removeEventListener("keydown", fecharComEscape);
  }, [aberto]);
  if (location.pathname.startsWith("/tutor")) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "focus-optional", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: aberto && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.aside,
      {
        initial: movimentoReduzido ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: movimentoReduzido ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 },
        transition: { duration: movimentoReduzido ? 0 : 0.18 },
        role: "dialog",
        "aria-label": "Tutor Gravity",
        className: "fixed bottom-20 right-4 z-50 w-[min(400px,calc(100vw-2rem))] border border-border-strong bg-card p-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-start justify-between border-b border-border pb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold", children: "Gravity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs text-muted-foreground", children: "Tutor contextual de Física" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/tutor",
                  className: "grid h-9 w-9 place-items-center text-muted-foreground hover:bg-secondary hover:text-foreground",
                  "aria-label": "Abrir tutor em tela inteira",
                  title: "Abrir em tela inteira",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { className: "h-4 w-4", "aria-hidden": "true" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setAberto(false),
                  className: "grid h-9 w-9 place-items-center text-muted-foreground hover:bg-secondary hover:text-foreground",
                  "aria-label": "Fechar tutor",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4", "aria-hidden": "true" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            GravityChat,
            {
              context: { resumoPerfil: gerarResumoPerfilParaGravity() },
              alturaMensagens: "320px"
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setAberto((valor) => !valor),
        "aria-label": aberto ? "Fechar tutor Gravity" : "Abrir tutor Gravity",
        "aria-expanded": aberto,
        className: "fixed bottom-4 right-4 z-50 grid h-12 w-12 place-items-center border border-primary bg-primary text-primary-foreground hover:bg-[var(--primary-hover)]",
        children: aberto ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5", "aria-hidden": "true" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "h-5 w-5", "aria-hidden": "true" })
      }
    )
  ] });
}
const CONSENT_KEY = storageKey("cookie-consent");
const COOKIE_CONSENT_EVENT = "gravitymind:cookie-consent";
function CookieConsent() {
  const [visible, setVisible] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setVisible(window.localStorage.getItem(CONSENT_KEY) === null);
  }, []);
  function choose(choice) {
    window.localStorage.setItem(CONSENT_KEY, choice);
    document.documentElement.dataset.cookieConsent = choice;
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: choice }));
    setVisible(false);
  }
  if (!visible) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      className: "fixed inset-x-0 bottom-0 z-50 border-t border-border-strong bg-card",
      "aria-label": "Preferências de cookies",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ff-shell flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "max-w-3xl text-sm leading-relaxed text-muted-foreground", children: [
          "Cookies essenciais mantêm sua sessão e preferências. Métricas de erro só serão ativadas com sua escolha. Leia a nossa",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/privacidade",
              className: "font-semibold text-foreground underline underline-offset-4",
              children: "Política de Privacidade"
            }
          ),
          "."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ff-btn-outline", onClick: () => choose("essential"), children: "Somente essenciais" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ff-btn-primary", onClick: () => choose("metrics"), children: "Permitir métricas" })
        ] })
      ] })
    }
  );
}
async function initializeClientObservability() {
  return null;
}
async function captureClientError(error) {
  const Sentry = await initializeClientObservability();
  Sentry?.captureException(error);
}
function ObservabilityBridge() {
  reactExports.useEffect(() => {
    void initializeClientObservability();
    const handleConsent = () => void initializeClientObservability();
    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsent);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsent);
  }, []);
  return null;
}
function GravityMark({ className = "h-8 w-8" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 40 40", "aria-hidden": "true", className, fill: "none", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "20", cy: "20", r: "11.5", stroke: "currentColor", strokeWidth: "1.8" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M20 2v36", stroke: "currentColor", strokeWidth: "1.8" })
  ] });
}
function BrandLockup({
  compact = false,
  mark = true
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-3", children: [
    mark && /* @__PURE__ */ jsxRuntimeExports.jsx(GravityMark, { className: compact ? "h-7 w-7" : "h-8 w-8" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: `${compact ? "text-[1.02rem]" : "text-base"} whitespace-nowrap font-medium tracking-[0.27em] text-current`,
        children: BRAND_NAME
      }
    )
  ] });
}
const primaryLinks = [
  { to: "/", label: "Estudar" },
  { to: "/questoes", label: "Prática" },
  { to: "/flashcards", label: "Flash Cards" },
  { to: "/calculo", label: "Cálculo" },
  { to: "/quadro", label: "Explorar" }
];
const mobileLinks = [
  ...primaryLinks,
  { to: "/tutor", label: "Tutor" },
  { to: "/plus", label: "Plus" },
  { to: "/dashboard", label: "Progresso" },
  { to: "/configuracoes", label: "Configurações" }
];
function pathActive(pathname, to) {
  if (to === "/") {
    return pathname === "/" || pathname.startsWith("/lei-") || pathname.startsWith("/tutor") || pathname.startsWith("/plus");
  }
  return pathname.startsWith(to);
}
function SiteHeader() {
  const [mobileOpen, setMobileOpen] = reactExports.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, carregando, sair } = useAuth();
  const { motion: motionPreference } = useSiteSettings();
  const reducedMotion = motionPreference === "reduced";
  async function handleLogout() {
    await sair();
    setMobileOpen(false);
    await navigate({ to: "/" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "gm-site-header sticky top-0 z-40 border-b border-[#294038] bg-[#08150f] text-[#eef3ef]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "gm-shell flex h-[5.5rem] items-center gap-7", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "shrink-0 text-[#f2f5f2]", "aria-label": "GRAVITYMIND, início", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BrandLockup, { compact: true, mark: false }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden h-10 w-px bg-[#344a41] md:block", "aria-hidden": "true" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "hidden whitespace-nowrap font-mono text-[0.67rem] font-medium tracking-[0.26em] text-[#9aaba3] md:block", children: "ESTUDE FÍSICA. PENSE MAIS LONGE." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "nav",
        {
          className: "ml-auto hidden h-full items-center gap-9 xl:flex",
          "aria-label": "Navegação principal",
          children: [
            primaryLinks.map((item) => {
              const active = pathActive(location.pathname, item.to);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: item.to,
                  className: `relative flex h-full items-center whitespace-nowrap text-[0.9rem] font-normal ${active ? "text-[#9de7cb]" : "text-[#a8b5af] hover:text-[#eef3ef]"}`,
                  children: [
                    item.label,
                    active && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      motion.span,
                      {
                        layoutId: "site-nav-active",
                        className: "absolute inset-x-0 bottom-3 h-0.5 bg-[#9de7cb]",
                        transition: reducedMotion ? { duration: 0 } : { duration: 0.22 }
                      }
                    )
                  ]
                },
                item.to
              );
            }),
            !carregando && usuario && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: handleLogout,
                className: "flex items-center gap-2 border-l border-[#344a41] pl-7 text-[#c7d2cc]",
                "aria-label": "Sair da conta",
                title: "Sair da conta",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-10 w-10 place-items-center rounded-full border border-[#63766d] text-sm", children: usuario.nome.trim().slice(0, 2).toUpperCase() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4", "aria-hidden": "true" })
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "ml-auto grid h-11 w-11 place-items-center border border-[#40544b] text-[#eef3ef] xl:hidden",
          onClick: () => setMobileOpen((open) => !open),
          "aria-expanded": mobileOpen,
          "aria-controls": "mobile-menu",
          "aria-label": mobileOpen ? "Fechar menu" : "Abrir menu",
          children: mobileOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5", "aria-hidden": "true" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5", "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: mobileOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        id: "mobile-menu",
        initial: reducedMotion ? false : { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        exit: reducedMotion ? void 0 : { opacity: 0, y: -8 },
        transition: { duration: reducedMotion ? 0 : 0.18 },
        className: "border-t border-[#294038] bg-[#08150f] xl:hidden",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "gm-shell grid py-2", "aria-label": "Navegação móvel", children: [
          mobileLinks.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: item.to,
              onClick: () => setMobileOpen(false),
              className: `border-b border-[#294038] py-3 text-base ${pathActive(location.pathname, item.to) ? "text-[#9de7cb]" : "text-[#dce5e0]"}`,
              children: item.label
            },
            item.to
          )),
          !carregando && (usuario ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleLogout, className: "py-3 text-left text-base", children: "Sair da conta" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/login",
              onClick: () => setMobileOpen(false),
              className: "py-3 text-base text-[#9de7cb]",
              children: "Entrar"
            }
          ))
        ] })
      }
    ) })
  ] });
}
function SiteFooter() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "site-footer border-t border-[#294038] bg-[#08150f] text-[#c7d2cc]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "gm-shell flex flex-col gap-5 py-6 text-xs md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BrandLockup, { compact: true, mark: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden h-6 w-px bg-[#344a41] sm:block", "aria-hidden": "true" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[0.58rem] tracking-[0.24em] text-[#8e9d96]", children: "ESTUDE FÍSICA. PENSE MAIS LONGE." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "nav",
        {
          className: "flex flex-wrap gap-x-6 gap-y-2 text-[#93a39b]",
          "aria-label": "Links institucionais",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/sobre", className: "hover:text-[#eef3ef]", children: "Sobre" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/privacidade", className: "hover:text-[#eef3ef]", children: "Privacidade" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/termos", className: "hover:text-[#eef3ef]", children: "Termos" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contato", className: "hover:text-[#eef3ef]", children: "Ajuda" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "hover:text-[#eef3ef]", children: "Entrar" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CookieConsent, {})
  ] });
}
const appCss = "/assets/styles-CYejATda.css";
const INITIAL_PREFERENCES_SCRIPT = "try{var p='fisicafacil:',q='gravitymind:',a=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf(p)===0)a.push(k)}for(var j=0;j<a.length;j++){var n=a[j].replace(p,q);if(localStorage.getItem(n)===null)localStorage.setItem(n,localStorage.getItem(a[j]))}var s=JSON.parse(localStorage.getItem(q+'settings')||'{}');var d=s.theme==='dark'||(s.theme!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);var m=s.motion==='reduced'||(s.motion!=='full'&&matchMedia('(prefers-reduced-motion: reduce)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.dataset.motion=m?'reduced':'full';document.documentElement.dataset.reading=s.reading==='large'?'large':'standard';document.documentElement.dataset.cookieConsent=localStorage.getItem(q+'cookie-consent')||'unset'}catch(e){}";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-[70vh] flex-col items-center justify-center px-4 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm font-bold text-primary", children: "ERRO 404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-2xl font-bold", children: "Página não encontrada" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "A página que você procura não existe." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "ff-btn-primary mt-8", children: "Ir para o início" })
  ] });
}
function ErrorComponent({ error, reset }) {
  const router2 = useRouter();
  console.error(error);
  reactExports.useEffect(() => {
    void captureClientError(error);
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-[70vh] flex-col items-center justify-center px-4 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-3 font-mono text-sm font-bold text-destructive", children: "ERRO" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold", children: "Algo deu errado" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Tente novamente ou volte ao início." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "ff-btn-primary",
          children: "Tentar novamente"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", className: "ff-btn-outline", children: "Início" })
    ] })
  ] });
}
const Route$k = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${BRAND_NAME} | Estudo ativo de Física` },
      {
        name: "description",
        content: "Plataforma de Física para ensino médio com estudo guiado, questões adaptativas e quadro de resolução."
      },
      { property: "og:type", content: "website" },
      { name: "theme-color", content: "#12201a" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous"
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "pt-BR", suppressHydrationWarning: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("head", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("script", { children: INITIAL_PREFERENCES_SCRIPT })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$k.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SiteSettingsProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ObservabilityBridge, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#main-content", className: "skip-link", children: "Pular para o conteúdo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "main-content", tabIndex: -1, className: "flex-1 outline-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SiteFooter, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(GravityWidget, {})
    ] })
  ] }) });
}
const $$splitComponentImporter$i = () => import("./index-Z22OExd6.mjs");
const Route$j = createFileRoute()({
  head: () => ({
    meta: [{
      title: `${BRAND_NAME} | Física com prática adaptativa`
    }, {
      name: "description",
      content: "Estude Mecânica e as Leis de Newton com questões adaptativas, correção guiada, Flash Cards e quadro de resolução."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./anotacoes-Bc_2uxYT.mjs");
const Route$i = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Minhas anotações | GRAVITYMIND"
    }, {
      name: "description",
      content: "Crie e organize anotações pessoais de Física com salvamento automático."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./cadastro-DbVgyra9.mjs");
const Route$h = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Criar conta | GRAVITYMIND"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./calculo-DDHGomt2.mjs");
const Route$g = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Cálculo | GRAVITYMIND"
    }, {
      name: "description",
      content: "Calculadora científica e questões numéricas aplicadas às Leis de Newton."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./configuracoes-CobMXlez.mjs");
const Route$f = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Preferências | GRAVITYMIND"
    }, {
      name: "description",
      content: "Ajustes de aparência, leitura, movimento e apoio ao foco."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./contato-tnCoIkJN.mjs");
const Route$e = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Contato | GRAVITYMIND"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./dashboard-D4dCzpuw.mjs");
const Route$d = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Meu progresso | GRAVITYMIND"
    }, {
      name: "description",
      content: "Veja seu progresso real, revisões pendentes e a próxima ação de estudo."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./flashcards-DqIf8yYK.mjs");
const Route$c = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Flash Cards | GRAVITYMIND"
    }, {
      name: "description",
      content: "Recupere conceitos de Mecânica e das Leis de Newton em um deck sem distrações."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./lei-1-BmXZNxXG.mjs");
const Route$b = createFileRoute()({
  head: () => ({
    meta: [{
      title: "1ª Lei de Newton, Inércia | GRAVITYMIND"
    }, {
      name: "description",
      content: "Aprenda a 1ª Lei de Newton (Princípio da Inércia) com texto narrado em áudio e vídeo-aula."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./lei-2-y0uUgNDB.mjs");
const Route$a = createFileRoute()({
  head: () => ({
    meta: [{
      title: "2ª Lei de Newton, F = m·a | GRAVITYMIND"
    }, {
      name: "description",
      content: "Aprenda a 2ª Lei de Newton com texto narrado em áudio e vídeo-aula."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./lei-3-B1nlKhcW.mjs");
const Route$9 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "3ª Lei de Newton, Ação e Reação | GRAVITYMIND"
    }, {
      name: "description",
      content: "Aprenda a 3ª Lei de Newton com texto narrado em áudio e vídeo-aula."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./login-BXMFL35g.mjs");
const Route$8 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Entrar | GRAVITYMIND"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./plus-sOrOQmJ1.mjs");
const searchSchema$1 = objectType({
  checkout: enumType(["success", "canceled"]).optional()
});
const Route$7 = createFileRoute()({
  validateSearch: (search) => searchSchema$1.parse(search),
  head: () => ({
    meta: [{
      title: "Plano Plus | GRAVITYMIND"
    }, {
      name: "description",
      content: "Compare o plano gratuito e o GRAVITYMIND Plus e continue no checkout hospedado do Stripe."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./privacidade-DZmVaHL_.mjs");
const Route$6 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Política de privacidade | GRAVITYMIND"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./quadro-rZyXVLoy.mjs");
const Route$5 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Quadro de resolução | GRAVITYMIND"
    }, {
      name: "description",
      content: "Resolva exercícios de física desenhando livremente com lápis, formas, texto, imagens e exportação em PNG."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./questoes-COXFi-Xt.mjs");
const searchSchema = objectType({
  assunto: enumType(["misto", "mecanica", "lei-1", "lei-2", "lei-3"]).optional(),
  modo: enumType(["adaptativo", "facil", "medio", "dificil"]).optional()
});
const Route$4 = createFileRoute()({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [{
      title: "Prática adaptativa | GRAVITYMIND"
    }, {
      name: "description",
      content: "Pratique as Leis de Newton com revisão de erros, recuperação ativa e dificuldade adaptativa."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./sobre-D2NzJvIM.mjs");
const Route$3 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Sobre o projeto | GRAVITYMIND"
    }, {
      name: "description",
      content: "Conheça as decisões pedagógicas e técnicas do projeto GRAVITYMIND."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./termos-Cslc3LHu.mjs");
const Route$2 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Termos de uso | GRAVITYMIND"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./tutor-zBB9afvq.mjs");
const Route$1 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Tutor Gravity | GRAVITYMIND"
    }, {
      name: "description",
      content: "Organize seu raciocínio de Física com perguntas guiadas, contexto e fórmulas das Leis de Newton."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
function hex(bytes) {
  return [...new Uint8Array(bytes)].map((value) => value.toString(16).padStart(2, "0")).join("");
}
function constantTimeEqual(left, right) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}
async function validStripeSignature(payload, signatureHeader, secret) {
  const parts = signatureHeader.split(",");
  const timestamp = parts.find((part) => part.startsWith("t="))?.slice(2);
  const signatures = parts.filter((part) => part.startsWith("v1=")).map((part) => part.slice(3));
  if (!timestamp || signatures.length === 0 || !/^\d{10,13}$/.test(timestamp)) {
    return false;
  }
  if (Math.abs(Date.now() / 1e3 - Number(timestamp)) > 300) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const digest = hex(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${payload}`))
  );
  return signatures.some((signature) => constantTimeEqual(digest, signature));
}
function stringId(value) {
  if (typeof value === "string") return value;
  return value?.id ?? null;
}
function subscriptionState(status) {
  if (status === "active" || status === "trialing") return "active";
  if (status === "past_due" || status === "unpaid") return "past_due";
  if (status === "canceled" || status === "incomplete_expired") return "canceled";
  return "inactive";
}
async function processEvent(event) {
  const object = event.data?.object;
  if (!object || !event.type) return;
  const db = getD1();
  if (event.type === "checkout.session.completed") {
    const userId = object.metadata?.user_id ?? object.client_reference_id;
    const subscriptionId = stringId(object.subscription);
    if (!userId || !subscriptionId) return;
    await db.prepare(
      `INSERT INTO assinaturas
         (user_id, plano, status, provider_customer_id, provider_subscription_id, atualizado_em)
         VALUES (?, 'plus', 'active', ?, ?, datetime('now'))
         ON CONFLICT(user_id) DO UPDATE SET
           plano = 'plus', status = 'active',
           provider_customer_id = excluded.provider_customer_id,
           provider_subscription_id = excluded.provider_subscription_id,
           atualizado_em = datetime('now')`
    ).bind(userId, stringId(object.customer), subscriptionId).run();
    return;
  }
  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscriptionId = object.id;
    if (!subscriptionId) return;
    let userId = object.metadata?.user_id ?? null;
    if (!userId) {
      const existing = await db.prepare(
        `SELECT user_id FROM assinaturas
           WHERE provider_subscription_id = ? LIMIT 1`
      ).bind(subscriptionId).first();
      userId = existing?.user_id ?? null;
    }
    if (!userId) return;
    const status = event.type === "customer.subscription.deleted" ? "canceled" : subscriptionState(object.status);
    const validUntil = object.current_period_end ? new Date(object.current_period_end * 1e3).toISOString() : null;
    await db.prepare(
      `INSERT INTO assinaturas
         (user_id, plano, status, provider_customer_id, provider_subscription_id, valida_ate, atualizado_em)
         VALUES (?, 'plus', ?, ?, ?, ?, datetime('now'))
         ON CONFLICT(user_id) DO UPDATE SET
           plano = 'plus', status = excluded.status,
           provider_customer_id = COALESCE(excluded.provider_customer_id, assinaturas.provider_customer_id),
           provider_subscription_id = excluded.provider_subscription_id,
           valida_ate = excluded.valida_ate,
           atualizado_em = datetime('now')`
    ).bind(userId, status, stringId(object.customer), subscriptionId, validUntil).run();
  }
}
const Route = createFileRoute()({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.STRIPE_WEBHOOK_SECRET;
        const signature = request.headers.get("stripe-signature");
        const contentLength = Number(request.headers.get("content-length") ?? 0);
        if (!secret || !signature || contentLength > 262144) {
          return new Response("Invalid webhook", { status: 400 });
        }
        const payload = await request.text();
        if (payload.length > 262144) {
          return new Response("Payload too large", { status: 413 });
        }
        if (!await validStripeSignature(payload, signature, secret)) {
          return new Response("Invalid signature", { status: 400 });
        }
        try {
          const event = JSON.parse(payload);
          await processEvent(event);
          return new Response("ok", {
            status: 200,
            headers: { "cache-control": "no-store" }
          });
        } catch (error) {
          console.error("Falha ao processar webhook Stripe", error);
          return new Response("Webhook processing failed", { status: 500 });
        }
      }
    }
  }
});
const IndexRoute = Route$j.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$k
});
const AnotacoesRoute = Route$i.update({
  id: "/anotacoes",
  path: "/anotacoes",
  getParentRoute: () => Route$k
});
const CadastroRoute = Route$h.update({
  id: "/cadastro",
  path: "/cadastro",
  getParentRoute: () => Route$k
});
const CalculoRoute = Route$g.update({
  id: "/calculo",
  path: "/calculo",
  getParentRoute: () => Route$k
});
const ConfiguracoesRoute = Route$f.update({
  id: "/configuracoes",
  path: "/configuracoes",
  getParentRoute: () => Route$k
});
const ContatoRoute = Route$e.update({
  id: "/contato",
  path: "/contato",
  getParentRoute: () => Route$k
});
const DashboardRoute = Route$d.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => Route$k
});
const FlashcardsRoute = Route$c.update({
  id: "/flashcards",
  path: "/flashcards",
  getParentRoute: () => Route$k
});
const Lei1Route = Route$b.update({
  id: "/lei-1",
  path: "/lei-1",
  getParentRoute: () => Route$k
});
const Lei2Route = Route$a.update({
  id: "/lei-2",
  path: "/lei-2",
  getParentRoute: () => Route$k
});
const Lei3Route = Route$9.update({
  id: "/lei-3",
  path: "/lei-3",
  getParentRoute: () => Route$k
});
const LoginRoute = Route$8.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$k
});
const PlusRoute = Route$7.update({
  id: "/plus",
  path: "/plus",
  getParentRoute: () => Route$k
});
const PrivacidadeRoute = Route$6.update({
  id: "/privacidade",
  path: "/privacidade",
  getParentRoute: () => Route$k
});
const QuadroRoute = Route$5.update({
  id: "/quadro",
  path: "/quadro",
  getParentRoute: () => Route$k
});
const QuestoesRoute = Route$4.update({
  id: "/questoes",
  path: "/questoes",
  getParentRoute: () => Route$k
});
const SobreRoute = Route$3.update({
  id: "/sobre",
  path: "/sobre",
  getParentRoute: () => Route$k
});
const TermosRoute = Route$2.update({
  id: "/termos",
  path: "/termos",
  getParentRoute: () => Route$k
});
const TutorRoute = Route$1.update({
  id: "/tutor",
  path: "/tutor",
  getParentRoute: () => Route$k
});
const ApiStripeWebhookRoute = Route.update({
  id: "/api/stripe-webhook",
  path: "/api/stripe-webhook",
  getParentRoute: () => Route$k
});
const rootRouteChildren = {
  IndexRoute,
  AnotacoesRoute,
  CadastroRoute,
  CalculoRoute,
  ConfiguracoesRoute,
  ContatoRoute,
  DashboardRoute,
  FlashcardsRoute,
  Lei1Route,
  Lei2Route,
  Lei3Route,
  LoginRoute,
  PlusRoute,
  PrivacidadeRoute,
  QuadroRoute,
  QuestoesRoute,
  SobreRoute,
  TermosRoute,
  TutorRoute,
  ApiStripeWebhookRoute
};
const routeTree = Route$k._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  ASSUNTO_LABEL as A,
  obterDicasQuestao as B,
  escolherAssuntoAdaptativo as C,
  atualizarDificuldadeAdaptativa as D,
  Route$4 as E,
  limparHistorico as F,
  GravityChat as G,
  router as H,
  MARCOS_ATIVOS as M,
  PROGRESS_EVENT as P,
  QUESTOES_CALCULO as Q,
  Route$7 as R,
  STORAGE_PREFIX as S,
  atualizarNota as a,
  buscarNotas as b,
  criarNota as c,
  useAuth as d,
  excluirNota as e,
  contarRevisoesPendentes as f,
  formatarDuracao as g,
  marcosConcluidos as h,
  gerarResumoPerfilParaGravity as i,
  marcarConcluido as j,
  createSsrRpc as k,
  listarNotas as l,
  montarPerfilAprendizagem as m,
  obterHistorico as n,
  obterHistoricoDaNota as o,
  percentualLicao as p,
  obterDificuldadeAtual as q,
  restaurarVersao as r,
  storageKey as s,
  emitProgressUpdated as t,
  useSiteSettings as u,
  calcularDesempenhoPorAssunto as v,
  escolherProximaQuestaoMecanica as w,
  escolherProximaQuestao as x,
  registrarResposta as y,
  marcarRespostaCorrigida as z
};
