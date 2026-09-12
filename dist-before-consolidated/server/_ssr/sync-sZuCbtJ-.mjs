import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { k as createSsrRpc, l as listarNotas, n as obterHistorico, h as marcosConcluidos, q as obterDificuldadeAtual, t as emitProgressUpdated, s as storageKey } from "./router-BiedwaEF.mjs";
import { o as obterHistoricoCalculo } from "./engine-calculo-D3VYcpGG.mjs";
import { c as createServerFn } from "./server-DwUI_Cux.mjs";
import { f as fotoDadosLocaisSchema } from "./schemas-Dga4YmnR.mjs";
const TEST_SITE_KEY = "1x00000000000000000000AA";
const SCRIPT_ID = "cloudflare-turnstile-script";
function TurnstileWidget({
  action,
  onTokenChange
}) {
  const reactId = reactExports.useId();
  const containerRef = reactExports.useRef(null);
  const widgetRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    let cancelled = false;
    const render = () => {
      if (cancelled || !containerRef.current || !window.turnstile || widgetRef.current) return;
      const local = ["localhost", "127.0.0.1"].includes(window.location.hostname);
      const sitekey = local ? TEST_SITE_KEY : "";
      if (!sitekey) return;
      widgetRef.current = window.turnstile.render(containerRef.current, {
        sitekey,
        action,
        theme: "auto",
        size: "flexible",
        callback: onTokenChange,
        "expired-callback": () => onTokenChange(""),
        "error-callback": () => onTokenChange("")
      });
    };
    const existing = document.getElementById(SCRIPT_ID);
    if (window.turnstile) {
      render();
    } else if (existing) {
      existing.addEventListener("load", render, { once: true });
    } else {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.addEventListener("load", render, { once: true });
      document.head.appendChild(script);
    }
    return () => {
      cancelled = true;
      if (widgetRef.current && window.turnstile) {
        window.turnstile.remove(widgetRef.current);
        widgetRef.current = null;
      }
    };
  }, [action, onTokenChange]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref: containerRef,
      id: `turnstile-${reactId.replace(/:/g, "")}`,
      className: "min-h-[65px] w-full"
    }
  );
}
const enviarParaNuvemServerFn = createServerFn({
  method: "POST"
}).validator((input) => fotoDadosLocaisSchema.parse(input)).handler(createSsrRpc("711e049ff0720a86f8de5989c35fd8e1cac25147a55ae90c18941dd321b285c3"));
const baixarDaNuvemServerFn = createServerFn({
  method: "GET"
}).handler(createSsrRpc("280ebd4d74a30ab688edb3f9adbed4e9cf745eb1a249d53adbb1fc01b6b146eb"));
const CHAVES = {
  respostas: storageKey("respostas"),
  respostasCalculo: storageKey("respostas-calculo"),
  dificuldade: storageKey("dificuldade-adaptativa"),
  progresso: storageKey("progresso-licoes"),
  notas: storageKey("notas")
};
const ASSUNTOS = ["lei-1", "lei-2", "lei-3"];
function selecionarPorOrcamento(itens, limiteItens, limiteCaracteres) {
  const selecionados = [];
  let caracteres = 2;
  for (const item of itens.slice(0, limiteItens)) {
    const tamanho = JSON.stringify(item).length + 1;
    if (caracteres + tamanho > limiteCaracteres) continue;
    selecionados.push(item);
    caracteres += tamanho;
  }
  return selecionados;
}
function montarFotoLocal() {
  const respostas = obterHistorico();
  const respostasCalculo = obterHistoricoCalculo();
  const notas = listarNotas();
  const progressoLicoes = [];
  for (const assunto of ASSUNTOS) {
    for (const marco of marcosConcluidos(assunto)) {
      progressoLicoes.push({
        assunto,
        marco,
        concluidoEm: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  }
  const dificuldadeAdaptativa = ASSUNTOS.map(
    (assunto) => ({
      assunto,
      nivel: obterDificuldadeAtual(assunto)
    })
  );
  const notasParaEnvio = notas.map((nota) => ({
    id: nota.id,
    titulo: nota.titulo,
    conteudo: nota.conteudo,
    assunto: nota.assunto,
    criadaEm: nota.criadaEm,
    atualizadaEm: nota.atualizadaEm
  }));
  const respostasParaEnvio = [...respostas].reverse().map((resposta) => ({
    questaoId: resposta.questaoId,
    letraEscolhida: resposta.letraEscolhida,
    correta: resposta.correta,
    tempoSegundos: resposta.tempoSegundos,
    respondidoEm: resposta.respondidoEm,
    confianca: resposta.confianca,
    corrigida: resposta.corrigida
  }));
  const calculosParaEnvio = [...respostasCalculo].reverse().map((resposta) => ({
    questaoId: resposta.questaoId,
    valorDigitado: resposta.valorDigitado,
    correta: resposta.correta,
    diagnostico: resposta.diagnostico,
    tempoSegundos: resposta.tempoSegundos,
    respondidoEm: resposta.respondidoEm
  }));
  return {
    notas: selecionarPorOrcamento(notasParaEnvio, 200, 43e4),
    respostasQuestoes: selecionarPorOrcamento(respostasParaEnvio, 500, 18e4),
    respostasCalculo: selecionarPorOrcamento(calculosParaEnvio, 300, 18e4),
    progressoLicoes,
    dificuldadeAdaptativa,
    quizResultados: []
    // não há armazenamento local de tentativas de quiz hoje
  };
}
function aplicarFotoNoLocal(foto) {
  const notasLocais = listarNotas();
  const notasPorId = new Map(notasLocais.map((n) => [n.id, n]));
  for (const n of foto.notas) {
    const local = notasPorId.get(n.id);
    if (!local || n.atualizadaEm > local.atualizadaEm) {
      notasPorId.set(n.id, {
        id: n.id,
        titulo: n.titulo,
        conteudo: n.conteudo,
        assunto: n.assunto,
        criadaEm: n.criadaEm,
        atualizadaEm: n.atualizadaEm
      });
    }
  }
  window.localStorage.setItem(CHAVES.notas, JSON.stringify([...notasPorId.values()]));
  const respostasLocais = obterHistorico();
  const chaveResp = (r) => `${r.questaoId}|${r.respondidoEm}`;
  const respostasPorEvento = new Map(
    respostasLocais.map((resposta) => [chaveResp(resposta), resposta])
  );
  for (const resposta of foto.respostasQuestoes) {
    const chave = chaveResp(resposta);
    const local = respostasPorEvento.get(chave);
    const remota = {
      questaoId: resposta.questaoId,
      letraEscolhida: resposta.letraEscolhida,
      correta: resposta.correta,
      tempoSegundos: resposta.tempoSegundos,
      respondidoEm: resposta.respondidoEm,
      confianca: resposta.confianca,
      corrigida: resposta.corrigida
    };
    respostasPorEvento.set(
      chave,
      local ? {
        ...local,
        confianca: remota.confianca ?? local.confianca,
        corrigida: Boolean(local.corrigida || remota.corrigida)
      } : remota
    );
  }
  const respostasMescladas = [...respostasPorEvento.values()].sort((a, b) => a.respondidoEm.localeCompare(b.respondidoEm)).slice(-2e3);
  window.localStorage.setItem(CHAVES.respostas, JSON.stringify(respostasMescladas));
  const calculosPorEvento = new Map(
    obterHistoricoCalculo().map((resposta) => [chaveResp(resposta), resposta])
  );
  for (const resposta of foto.respostasCalculo) {
    calculosPorEvento.set(chaveResp(resposta), resposta);
  }
  const calculosMesclados = [...calculosPorEvento.values()].sort((a, b) => a.respondidoEm.localeCompare(b.respondidoEm)).slice(-1e3);
  window.localStorage.setItem(CHAVES.respostasCalculo, JSON.stringify(calculosMesclados));
  const progressoLocal = {
    "lei-1": marcosConcluidos("lei-1"),
    "lei-2": marcosConcluidos("lei-2"),
    "lei-3": marcosConcluidos("lei-3")
  };
  for (const p of foto.progressoLicoes) {
    const assunto = p.assunto;
    const marco = p.marco;
    if (!progressoLocal[assunto]) progressoLocal[assunto] = [];
    if (!progressoLocal[assunto].includes(marco)) progressoLocal[assunto].push(marco);
  }
  window.localStorage.setItem(CHAVES.progresso, JSON.stringify(progressoLocal));
  const dificuldadeLocal = {
    "lei-1": obterDificuldadeAtual("lei-1"),
    "lei-2": obterDificuldadeAtual("lei-2"),
    "lei-3": obterDificuldadeAtual("lei-3")
  };
  for (const d of foto.dificuldadeAdaptativa) {
    const assunto = d.assunto;
    if (!dificuldadeLocal[assunto] || dificuldadeLocal[assunto] === "facil") {
      dificuldadeLocal[assunto] = d.nivel;
    }
  }
  window.localStorage.setItem(CHAVES.dificuldade, JSON.stringify(dificuldadeLocal));
  emitProgressUpdated();
}
async function sincronizarAposLogin() {
  if (typeof window === "undefined") return { ok: false, mensagem: "Ambiente sem navegador." };
  try {
    const daNuvem = await baixarDaNuvemServerFn();
    if ("erro" in daNuvem) return { ok: false, mensagem: daNuvem.erro };
    aplicarFotoNoLocal(daNuvem);
    const foto = montarFotoLocal();
    const envio = await enviarParaNuvemServerFn({ data: foto });
    if (!envio.ok) return { ok: false, mensagem: envio.erro ?? "Falha ao sincronizar." };
    return { ok: true, mensagem: "Dados sincronizados com sucesso." };
  } catch {
    return { ok: false, mensagem: "Não foi possível sincronizar agora." };
  }
}
export {
  TurnstileWidget as T,
  sincronizarAposLogin as s
};
