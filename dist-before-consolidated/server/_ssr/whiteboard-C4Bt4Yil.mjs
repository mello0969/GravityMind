import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { S as Slider$1, a as SliderTrack, b as SliderRange, c as SliderThumb } from "../_libs/radix-ui__react-slider.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { I as ImagePlus, v as Download, w as PenLine, x as Highlighter, y as Eraser, z as Slash, m as Square, G as Circle, J as Type, h as Minus, X, K as Undo2, N as Redo2, T as Trash2 } from "../_libs/lucide-react.mjs";
const Slider = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Slider$1,
  {
    ref,
    className: cn(
      "relative flex w-full touch-none select-none items-center",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SliderTrack, { className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SliderRange, { className: "absolute h-full bg-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SliderThumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })
    ]
  }
));
Slider.displayName = Slider$1.displayName;
const CORES = ["#F4F1E8", "#17211D", "#B84C3E", "#4B78A8", "#5D966F", "#D29A43"];
const MAX_ARQUIVO_BYTES = 5 * 1024 * 1024;
const MAX_DIMENSAO = 4096;
const MAX_PIXELS = 12e6;
const FUNDOS = {
  ardosia: {
    label: "Lousa",
    surface: "#1C2B26",
    pattern: "none",
    border: "#43554E"
  },
  papel: {
    label: "Papel",
    surface: "#F5F1E7",
    pattern: "none",
    border: "#C8C2B3"
  },
  grade: {
    label: "Grade",
    surface: "#EEF1EC",
    pattern: "linear-gradient(rgba(36,92,80,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(36,92,80,0.12) 1px, transparent 1px)",
    border: "#BCC5BD"
  }
};
const FERRAMENTAS = [
  { id: "lapis", label: "Lápis", icon: PenLine },
  { id: "marcador", label: "Marca-texto", icon: Highlighter },
  { id: "borracha", label: "Borracha quadrada", icon: Eraser },
  { id: "linha", label: "Linha", icon: Slash },
  { id: "retangulo", label: "Retângulo", icon: Square },
  { id: "elipse", label: "Elipse", icon: Circle },
  { id: "texto", label: "Texto", icon: Type }
];
function assinaturaValida(bytes, tipo) {
  if (tipo === "image/png") {
    return [137, 80, 78, 71, 13, 10, 26, 10].every(
      (valor, indice) => bytes[indice] === valor
    );
  }
  if (tipo === "image/jpeg") return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (tipo === "image/webp") {
    return String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  }
  return false;
}
function Whiteboard({ compact = false }) {
  const canvasRef = reactExports.useRef(null);
  const containerRef = reactExports.useRef(null);
  const inputArquivoRef = reactExports.useRef(null);
  const ctxRef = reactExports.useRef(null);
  const desenhandoRef = reactExports.useRef(false);
  const inicioDesenhoRef = reactExports.useRef(null);
  const historicoRef = reactExports.useRef([]);
  const indiceHistoricoRef = reactExports.useRef(-1);
  const [ferramenta, setFerramenta] = reactExports.useState("lapis");
  const [cor, setCor] = reactExports.useState(CORES[0]);
  const [espessura, setEspessura] = reactExports.useState(5);
  const [planoDeFundo, setPlanoDeFundo] = reactExports.useState("ardosia");
  const [podeDesfazer, setPodeDesfazer] = reactExports.useState(false);
  const [podeRefazer, setPodeRefazer] = reactExports.useState(false);
  const [caixasTexto, setCaixasTexto] = reactExports.useState([]);
  const [editandoTextoId, setEditandoTextoId] = reactExports.useState(null);
  const [erroArquivo, setErroArquivo] = reactExports.useState(null);
  const [cursorBorracha, setCursorBorracha] = reactExports.useState({
    x: 0,
    y: 0,
    visivel: false
  });
  const fundoAtual = FUNDOS[planoDeFundo];
  const tamanhoBorracha = Math.max(14, espessura * 3);
  const atualizarFlagsHistorico = reactExports.useCallback(() => {
    setPodeDesfazer(indiceHistoricoRef.current > 0);
    setPodeRefazer(indiceHistoricoRef.current < historicoRef.current.length - 1);
  }, []);
  const salvarEstado = reactExports.useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx || canvas.width === 0 || canvas.height === 0) return;
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const historico = historicoRef.current.slice(0, indiceHistoricoRef.current + 1);
    historico.push(snapshot);
    if (historico.length > 35) historico.splice(0, historico.length - 35);
    historicoRef.current = historico;
    indiceHistoricoRef.current = historico.length - 1;
    atualizarFlagsHistorico();
  }, [atualizarFlagsHistorico]);
  const restaurarEstado = reactExports.useCallback((indice) => {
    const ctx = ctxRef.current;
    const snapshot = historicoRef.current[indice];
    if (ctx && snapshot) ctx.putImageData(snapshot, 0, 0);
  }, []);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ajustarTamanho = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const conteudoAnterior = canvas.width > 0 ? canvas.toDataURL("image/png") : null;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctxRef.current = ctx;
      if (conteudoAnterior) {
        const imagem = new Image();
        imagem.onload = () => ctx.drawImage(imagem, 0, 0, rect.width, rect.height);
        imagem.src = conteudoAnterior;
      } else {
        requestAnimationFrame(() => salvarEstado());
      }
    };
    ajustarTamanho();
    const observer = new ResizeObserver(ajustarTamanho);
    observer.observe(container);
    return () => observer.disconnect();
  }, [salvarEstado]);
  function obterPosicao(evento) {
    const rect = evento.currentTarget.getBoundingClientRect();
    return { x: evento.clientX - rect.left, y: evento.clientY - rect.top };
  }
  function configurarTraco(ctx, modo = ferramenta) {
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = modo === "marcador" ? 0.34 : 1;
    ctx.strokeStyle = cor;
    ctx.lineWidth = modo === "marcador" ? espessura * 3 : espessura;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }
  function apagarQuadrado(ctx, posicao) {
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.clearRect(
      posicao.x - tamanhoBorracha / 2,
      posicao.y - tamanhoBorracha / 2,
      tamanhoBorracha,
      tamanhoBorracha
    );
    ctx.restore();
  }
  function desenharForma(ctx, inicio, fim, modo = ferramenta) {
    configurarTraco(ctx, modo);
    ctx.beginPath();
    if (modo === "linha") {
      ctx.moveTo(inicio.x, inicio.y);
      ctx.lineTo(fim.x, fim.y);
      ctx.stroke();
    } else if (modo === "retangulo") {
      ctx.strokeRect(inicio.x, inicio.y, fim.x - inicio.x, fim.y - inicio.y);
    } else if (modo === "elipse") {
      const raioX = Math.abs(fim.x - inicio.x) / 2;
      const raioY = Math.abs(fim.y - inicio.y) / 2;
      ctx.ellipse(
        inicio.x + (fim.x - inicio.x) / 2,
        inicio.y + (fim.y - inicio.y) / 2,
        raioX,
        raioY,
        0,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  function handlePointerDown(evento) {
    if (evento.button !== 0) return;
    const posicao = obterPosicao(evento);
    if (ferramenta === "texto") {
      const novaCaixa = {
        id: `txt-${typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`}`,
        x: Math.min(posicao.x, Math.max(12, evento.currentTarget.clientWidth - 190)),
        y: Math.min(posicao.y, Math.max(12, evento.currentTarget.clientHeight - 90)),
        texto: "",
        cor
      };
      setCaixasTexto((atuais) => [...atuais, novaCaixa]);
      setEditandoTextoId(novaCaixa.id);
      return;
    }
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    desenhandoRef.current = true;
    inicioDesenhoRef.current = {
      ...posicao,
      snapshot: ctx.getImageData(0, 0, canvas.width, canvas.height)
    };
    evento.currentTarget.setPointerCapture(evento.pointerId);
    if (ferramenta === "borracha") {
      apagarQuadrado(ctx, posicao);
    } else if (ferramenta === "lapis" || ferramenta === "marcador") {
      configurarTraco(ctx);
      ctx.beginPath();
      ctx.moveTo(posicao.x, posicao.y);
    }
  }
  function handlePointerMove(evento) {
    const posicao = obterPosicao(evento);
    if (ferramenta === "borracha") {
      setCursorBorracha({ ...posicao, visivel: true });
    }
    if (!desenhandoRef.current) return;
    const ctx = ctxRef.current;
    const inicio = inicioDesenhoRef.current;
    if (!ctx || !inicio) return;
    if (ferramenta === "borracha") {
      apagarQuadrado(ctx, posicao);
    } else if (ferramenta === "lapis" || ferramenta === "marcador") {
      ctx.lineTo(posicao.x, posicao.y);
      ctx.stroke();
      ctx.globalAlpha = 1;
    } else {
      if (inicio.snapshot) ctx.putImageData(inicio.snapshot, 0, 0);
      desenharForma(ctx, inicio, posicao);
    }
  }
  function handlePointerUp(evento) {
    if (!desenhandoRef.current) return;
    const ctx = ctxRef.current;
    const inicio = inicioDesenhoRef.current;
    if (ctx && inicio && ferramenta !== "lapis" && ferramenta !== "marcador" && ferramenta !== "borracha") {
      if (inicio.snapshot) ctx.putImageData(inicio.snapshot, 0, 0);
      desenharForma(ctx, inicio, obterPosicao(evento));
    }
    desenhandoRef.current = false;
    inicioDesenhoRef.current = null;
    salvarEstado();
  }
  function desfazer() {
    if (indiceHistoricoRef.current <= 0) return;
    indiceHistoricoRef.current -= 1;
    restaurarEstado(indiceHistoricoRef.current);
    atualizarFlagsHistorico();
  }
  function refazer() {
    if (indiceHistoricoRef.current >= historicoRef.current.length - 1) return;
    indiceHistoricoRef.current += 1;
    restaurarEstado(indiceHistoricoRef.current);
    atualizarFlagsHistorico();
  }
  function limparQuadro() {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    setCaixasTexto([]);
    salvarEstado();
  }
  function concluirEdicaoTexto(id) {
    setEditandoTextoId(null);
    setCaixasTexto((atuais) => atuais.filter((caixa) => caixa.id !== id || caixa.texto.trim()));
  }
  async function importarArquivo(file) {
    setErroArquivo(null);
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!file || !canvas || !ctx) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setErroArquivo("Use uma imagem PNG, JPEG ou WebP.");
      return;
    }
    if (file.size > MAX_ARQUIVO_BYTES) {
      setErroArquivo("A imagem deve ter no máximo 5 MB.");
      return;
    }
    try {
      const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
      if (!assinaturaValida(bytes, file.type)) {
        setErroArquivo("O conteúdo do arquivo não corresponde ao formato informado.");
        return;
      }
      const imagem = await createImageBitmap(file);
      if (imagem.width > MAX_DIMENSAO || imagem.height > MAX_DIMENSAO || imagem.width * imagem.height > MAX_PIXELS) {
        imagem.close();
        setErroArquivo("A imagem excede 4096 px ou 12 milhões de pixels.");
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const escala = Math.min(rect.width / imagem.width, rect.height / imagem.height, 1);
      const largura = imagem.width * escala;
      const altura = imagem.height * escala;
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.drawImage(
        imagem,
        (rect.width - largura) / 2,
        (rect.height - altura) / 2,
        largura,
        altura
      );
      ctx.restore();
      imagem.close();
      salvarEstado();
    } catch {
      setErroArquivo("Não foi possível abrir essa imagem.");
    }
  }
  function handleArquivoChange(evento) {
    void importarArquivo(evento.target.files?.[0]);
    evento.currentTarget.value = "";
  }
  function pintarFundoExportacao(ctx, largura, altura) {
    ctx.fillStyle = fundoAtual.surface;
    ctx.fillRect(0, 0, largura, altura);
    if (planoDeFundo !== "grade") return;
    ctx.strokeStyle = "rgba(36,92,80,0.12)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= largura; x += 28) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, altura);
      ctx.stroke();
    }
    for (let y = 0; y <= altura; y += 28) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(largura, y);
      ctx.stroke();
    }
  }
  function exportarPng() {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const rect = container.getBoundingClientRect();
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = Math.floor(rect.width * 2);
    exportCanvas.height = Math.floor(rect.height * 2);
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(2, 2);
    pintarFundoExportacao(ctx, rect.width, rect.height);
    ctx.drawImage(canvas, 0, 0, rect.width, rect.height);
    ctx.font = "600 18px Outfit, system-ui, sans-serif";
    ctx.textBaseline = "top";
    for (const caixa of caixasTexto) {
      ctx.fillStyle = caixa.cor;
      caixa.texto.split("\n").forEach((linha, indice) => {
        ctx.fillText(linha, caixa.x, caixa.y + indice * 22);
      });
    }
    const link = document.createElement("a");
    link.download = `gravitymind-quadro-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.png`;
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "overflow-hidden border border-border bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: inputArquivoRef,
        type: "file",
        accept: "image/png,image/jpeg,image/webp",
        className: "hidden",
        onChange: handleArquivoChange
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 border-b border-border px-3 py-3 lg:flex-row lg:items-center lg:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base", children: "Quadro de resolução" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "A borracha remove o desenho e revela o fundo original." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => inputArquivoRef.current?.click(),
            className: "ff-btn-outline",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "h-4 w-4", "aria-hidden": "true" }),
              " Imagem"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: exportarPng, className: "ff-btn-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4", "aria-hidden": "true" }),
          " Exportar PNG"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 border-b border-border p-3 xl:grid-cols-[1fr_auto_auto] xl:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", role: "toolbar", "aria-label": "Ferramentas de desenho", children: FERRAMENTAS.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        ToolButton,
        {
          ativo: ferramenta === item.id,
          onClick: () => setFerramenta(item.id),
          title: item.label,
          icon: item.icon
        },
        item.id
      )) }),
      ferramenta !== "borracha" && /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "flex flex-wrap items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "sr-only", children: "Cores" }),
        CORES.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setCor(item),
            "aria-label": `Usar cor ${item}`,
            className: "h-8 w-8 border",
            style: {
              background: item,
              borderColor: cor === item ? "var(--foreground)" : "var(--border)",
              outline: cor === item ? "2px solid var(--card)" : "none",
              outlineOffset: "-3px"
            }
          },
          item
        ))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid min-w-44 grid-cols-[auto_1fr_auto] items-center gap-2 border border-border px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-4 w-4 text-muted-foreground", "aria-hidden": "true" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Slider,
            {
              value: [espessura],
              min: 2,
              max: 24,
              step: 1,
              onValueChange: ([valor]) => setEspessura(valor ?? 5)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
            espessura,
            "px"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "flex border border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "sr-only", children: "Fundo do quadro" }),
          Object.keys(FUNDOS).map((fundo) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setPlanoDeFundo(fundo),
              className: `min-h-10 border-r border-border px-3 text-xs font-bold last:border-r-0 ${planoDeFundo === fundo ? "bg-primary text-primary-foreground" : "bg-transparent text-muted-foreground"}`,
              children: FUNDOS[fundo].label
            },
            fundo
          ))
        ] })
      ] })
    ] }),
    erroArquivo && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        role: "alert",
        className: "border-b border-destructive/40 bg-destructive/8 px-4 py-3 text-sm text-destructive",
        children: erroArquivo
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col-reverse gap-3 bg-secondary/45 p-3 lg:grid lg:grid-cols-[1fr_auto]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "section",
        {
          ref: containerRef,
          className: "relative w-full overflow-hidden border",
          "aria-label": "Área do quadro, também aceita uma imagem arrastada",
          onDragOver: (evento) => evento.preventDefault(),
          onDrop: (evento) => {
            evento.preventDefault();
            if (evento.dataTransfer.files.length !== 1) {
              setErroArquivo("Adicione uma imagem por vez.");
              return;
            }
            void importarArquivo(evento.dataTransfer.files[0]);
          },
          style: {
            backgroundColor: fundoAtual.surface,
            backgroundImage: fundoAtual.pattern,
            backgroundSize: "28px 28px",
            borderColor: fundoAtual.border,
            height: compact ? "330px" : "min(680px, 70vh)",
            touchAction: "none"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "canvas",
              {
                ref: canvasRef,
                onPointerDown: handlePointerDown,
                onPointerMove: handlePointerMove,
                onPointerUp: handlePointerUp,
                onPointerCancel: handlePointerUp,
                onPointerEnter: (evento) => {
                  if (ferramenta === "borracha") {
                    const posicao = obterPosicao(evento);
                    setCursorBorracha({ ...posicao, visivel: true });
                  }
                },
                onPointerLeave: () => setCursorBorracha((atual) => ({ ...atual, visivel: false })),
                className: "absolute inset-0 z-10",
                style: {
                  cursor: ferramenta === "texto" ? "text" : ferramenta === "borracha" ? "none" : "crosshair"
                }
              }
            ),
            ferramenta === "borracha" && cursorBorracha.visivel && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "pointer-events-none absolute z-30 border border-foreground bg-card/20",
                style: {
                  width: tamanhoBorracha,
                  height: tamanhoBorracha,
                  left: cursorBorracha.x - tamanhoBorracha / 2,
                  top: cursorBorracha.y - tamanhoBorracha / 2
                }
              }
            ),
            caixasTexto.map((caixa) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "group absolute z-20",
                style: {
                  left: caixa.x,
                  top: caixa.y,
                  maxWidth: "min(280px, 70%)"
                },
                children: editandoTextoId === caixa.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CaixaDeTextoEditavel,
                  {
                    texto: caixa.texto,
                    cor: caixa.cor,
                    onChange: (texto) => setCaixasTexto(
                      (atuais) => atuais.map((item) => item.id === caixa.id ? { ...item, texto } : item)
                    ),
                    onConcluir: () => concluirEdicaoTexto(caixa.id)
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setEditandoTextoId(caixa.id),
                      className: "block max-w-full cursor-text whitespace-pre-wrap border border-transparent px-2 py-1.5 text-left text-base font-semibold leading-snug hover:border-foreground/30",
                      style: { color: caixa.cor },
                      children: caixa.texto
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: (evento) => {
                        evento.stopPropagation();
                        setCaixasTexto((atuais) => atuais.filter((item) => item.id !== caixa.id));
                      },
                      className: "absolute -right-7 top-0 hidden h-7 w-7 place-items-center bg-destructive text-destructive-foreground group-hover:grid group-focus-within:grid",
                      "aria-label": "Remover texto",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4", "aria-hidden": "true" })
                    }
                  )
                ] })
              },
              caixa.id
            ))
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "grid gap-2 sm:grid-cols-3 lg:w-36 lg:grid-cols-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SideAction, { icon: Undo2, label: "Desfazer", onClick: desfazer, disabled: !podeDesfazer }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SideAction, { icon: Redo2, label: "Refazer", onClick: refazer, disabled: !podeRefazer }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SideAction, { icon: Trash2, label: "Limpar", onClick: limparQuadro, destructive: true })
      ] })
    ] })
  ] });
}
function CaixaDeTextoEditavel({
  texto,
  cor,
  onChange,
  onConcluir
}) {
  const textareaRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const id = requestAnimationFrame(() => textareaRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, []);
  function handleKeyDown(evento) {
    if (evento.key === "Escape" || evento.key === "Enter" && (evento.ctrlKey || evento.metaKey)) {
      evento.preventDefault();
      onConcluir();
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "textarea",
    {
      ref: textareaRef,
      value: texto,
      onChange: (evento) => onChange(evento.target.value.slice(0, 500)),
      onBlur: onConcluir,
      onKeyDown: handleKeyDown,
      placeholder: "Digite o texto",
      rows: 2,
      maxLength: 500,
      className: "min-w-44 resize border-2 border-primary bg-card p-2 text-base font-semibold leading-snug text-foreground outline-none",
      style: { color: cor }
    }
  );
}
function ToolButton({
  ativo,
  onClick,
  title,
  icon: Icon
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick,
      title,
      "aria-label": title,
      "aria-pressed": ativo,
      className: `grid h-10 w-10 place-items-center border ${ativo ? "border-primary bg-primary text-primary-foreground" : "border-border bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-[18px] w-[18px]", "aria-hidden": "true" })
    }
  );
}
function SideAction({
  icon: Icon,
  label,
  onClick,
  disabled,
  destructive
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      disabled,
      className: `inline-flex min-h-11 items-center justify-center gap-2 border px-3 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-40 ${destructive ? "border-destructive/45 text-destructive hover:bg-destructive/8" : "border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4", "aria-hidden": "true" }),
        " ",
        label
      ]
    }
  );
}
export {
  Whiteboard as W
};
