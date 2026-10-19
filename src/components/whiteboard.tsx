import type { LucideIcon } from "lucide-react";
import {
  Circle,
  Download,
  Eraser,
  Highlighter,
  ImagePlus,
  Minus,
  PenLine,
  Redo2,
  Slash,
  Square,
  Trash2,
  Type,
  Undo2,
  X,
} from "lucide-react";
import type { ChangeEvent, KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";

type Ferramenta = "lapis" | "marcador" | "borracha" | "linha" | "retangulo" | "elipse" | "texto";
type PlanoDeFundo = "ardosia" | "papel" | "grade";

const CORES = ["#F4F1E8", "#17211D", "#B84C3E", "#4B78A8", "#5D966F", "#D29A43"];
const MAX_ARQUIVO_BYTES = 5 * 1024 * 1024;
const MAX_DIMENSAO = 4_096;
const MAX_PIXELS = 12_000_000;

const FUNDOS: Record<
  PlanoDeFundo,
  { label: string; surface: string; pattern: string; border: string }
> = {
  ardosia: {
    label: "Lousa",
    surface: "#1C2B26",
    pattern: "none",
    border: "#43554E",
  },
  papel: {
    label: "Papel",
    surface: "#F5F1E7",
    pattern: "none",
    border: "#C8C2B3",
  },
  grade: {
    label: "Grade",
    surface: "#EEF1EC",
    pattern:
      "linear-gradient(rgba(36,92,80,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(36,92,80,0.12) 1px, transparent 1px)",
    border: "#BCC5BD",
  },
};

const FERRAMENTAS: Array<{ id: Ferramenta; label: string; icon: LucideIcon }> = [
  { id: "lapis", label: "Lápis", icon: PenLine },
  { id: "marcador", label: "Marca-texto", icon: Highlighter },
  { id: "borracha", label: "Borracha quadrada", icon: Eraser },
  { id: "linha", label: "Linha", icon: Slash },
  { id: "retangulo", label: "Retângulo", icon: Square },
  { id: "elipse", label: "Elipse", icon: Circle },
  { id: "texto", label: "Texto", icon: Type },
];

type CaixaTexto = {
  id: string;
  x: number;
  y: number;
  texto: string;
  cor: string;
};
type InicioDesenho = { x: number; y: number; snapshot: ImageData | null };
type CursorBorracha = { x: number; y: number; visivel: boolean };

function assinaturaValida(bytes: Uint8Array, tipo: string) {
  if (tipo === "image/png") {
    return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every(
      (valor, indice) => bytes[indice] === valor,
    );
  }
  if (tipo === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (tipo === "image/webp") {
    return (
      String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
    );
  }
  return false;
}

export function Whiteboard({ compact = false }: { compact?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputArquivoRef = useRef<HTMLInputElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const desenhandoRef = useRef(false);
  const inicioDesenhoRef = useRef<InicioDesenho | null>(null);
  const historicoRef = useRef<ImageData[]>([]);
  const indiceHistoricoRef = useRef(-1);

  const [ferramenta, setFerramenta] = useState<Ferramenta>("lapis");
  const [cor, setCor] = useState(CORES[0]);
  const [espessura, setEspessura] = useState(5);
  const [planoDeFundo, setPlanoDeFundo] = useState<PlanoDeFundo>("ardosia");
  const [podeDesfazer, setPodeDesfazer] = useState(false);
  const [podeRefazer, setPodeRefazer] = useState(false);
  const [caixasTexto, setCaixasTexto] = useState<CaixaTexto[]>([]);
  const [editandoTextoId, setEditandoTextoId] = useState<string | null>(null);
  const [erroArquivo, setErroArquivo] = useState<string | null>(null);
  const [cursorBorracha, setCursorBorracha] = useState<CursorBorracha>({
    x: 0,
    y: 0,
    visivel: false,
  });

  const fundoAtual = FUNDOS[planoDeFundo];
  const tamanhoBorracha = Math.max(14, espessura * 3);

  const atualizarFlagsHistorico = useCallback(() => {
    setPodeDesfazer(indiceHistoricoRef.current > 0);
    setPodeRefazer(indiceHistoricoRef.current < historicoRef.current.length - 1);
  }, []);

  const salvarEstado = useCallback(() => {
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

  const restaurarEstado = useCallback((indice: number) => {
    const ctx = ctxRef.current;
    const snapshot = historicoRef.current[indice];
    if (ctx && snapshot) ctx.putImageData(snapshot, 0, 0);
  }, []);

  useEffect(() => {
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

  function obterPosicao(evento: ReactPointerEvent<HTMLCanvasElement>) {
    const rect = evento.currentTarget.getBoundingClientRect();
    return { x: evento.clientX - rect.left, y: evento.clientY - rect.top };
  }

  function configurarTraco(ctx: CanvasRenderingContext2D, modo = ferramenta) {
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = modo === "marcador" ? 0.34 : 1;
    ctx.strokeStyle = cor;
    ctx.lineWidth = modo === "marcador" ? espessura * 3 : espessura;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }

  function apagarQuadrado(ctx: CanvasRenderingContext2D, posicao: { x: number; y: number }) {
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.clearRect(
      posicao.x - tamanhoBorracha / 2,
      posicao.y - tamanhoBorracha / 2,
      tamanhoBorracha,
      tamanhoBorracha,
    );
    ctx.restore();
  }

  function desenharForma(
    ctx: CanvasRenderingContext2D,
    inicio: InicioDesenho,
    fim: { x: number; y: number },
    modo = ferramenta,
  ) {
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
        Math.PI * 2,
      );
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function handlePointerDown(evento: ReactPointerEvent<HTMLCanvasElement>) {
    if (evento.button !== 0) return;
    const posicao = obterPosicao(evento);

    if (ferramenta === "texto") {
      const novaCaixa = {
        id: `txt-${typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`}`,
        x: Math.min(posicao.x, Math.max(12, evento.currentTarget.clientWidth - 190)),
        y: Math.min(posicao.y, Math.max(12, evento.currentTarget.clientHeight - 90)),
        texto: "",
        cor,
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
      snapshot: ctx.getImageData(0, 0, canvas.width, canvas.height),
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

  function handlePointerMove(evento: ReactPointerEvent<HTMLCanvasElement>) {
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

  function handlePointerUp(evento: ReactPointerEvent<HTMLCanvasElement>) {
    if (!desenhandoRef.current) return;
    const ctx = ctxRef.current;
    const inicio = inicioDesenhoRef.current;
    if (
      ctx &&
      inicio &&
      ferramenta !== "lapis" &&
      ferramenta !== "marcador" &&
      ferramenta !== "borracha"
    ) {
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

  function concluirEdicaoTexto(id: string) {
    setEditandoTextoId(null);
    setCaixasTexto((atuais) => atuais.filter((caixa) => caixa.id !== id || caixa.texto.trim()));
  }

  async function importarArquivo(file?: File) {
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
      if (
        imagem.width > MAX_DIMENSAO ||
        imagem.height > MAX_DIMENSAO ||
        imagem.width * imagem.height > MAX_PIXELS
      ) {
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
        altura,
      );
      ctx.restore();
      imagem.close();
      salvarEstado();
    } catch {
      setErroArquivo("Não foi possível abrir essa imagem.");
    }
  }

  function handleArquivoChange(evento: ChangeEvent<HTMLInputElement>) {
    void importarArquivo(evento.target.files?.[0]);
    evento.currentTarget.value = "";
  }

  function pintarFundoExportacao(ctx: CanvasRenderingContext2D, largura: number, altura: number) {
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
    link.download = `gravitymind-quadro-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
  }

  return (
    <section className="overflow-hidden border border-border bg-card">
      <input
        ref={inputArquivoRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleArquivoChange}
      />

      <div className="flex flex-col gap-3 border-b border-border px-3 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-base">Quadro de resolução</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputArquivoRef.current?.click()}
            className="ff-btn-outline"
          >
            <ImagePlus className="h-4 w-4" aria-hidden="true" /> Imagem
          </button>
          <button type="button" onClick={exportarPng} className="ff-btn-primary">
            <Download className="h-4 w-4" aria-hidden="true" /> Exportar PNG
          </button>
        </div>
      </div>

      <div className="grid gap-3 border-b border-border p-3 xl:grid-cols-[1fr_auto_auto] xl:items-center">
        <div className="flex flex-wrap gap-1.5" role="toolbar" aria-label="Ferramentas de desenho">
          {FERRAMENTAS.map((item) => (
            <ToolButton
              key={item.id}
              ativo={ferramenta === item.id}
              onClick={() => setFerramenta(item.id)}
              title={item.label}
              icon={item.icon}
            />
          ))}
        </div>

        {ferramenta !== "borracha" && (
          <fieldset className="flex flex-wrap items-center gap-1.5">
            <legend className="sr-only">Cores</legend>
            {CORES.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setCor(item)}
                aria-label={`Usar cor ${item}`}
                className="h-8 w-8 border"
                style={{
                  background: item,
                  borderColor: cor === item ? "var(--foreground)" : "var(--border)",
                  outline: cor === item ? "2px solid var(--card)" : "none",
                  outlineOffset: "-3px",
                }}
              />
            ))}
          </fieldset>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <div className="grid min-w-44 grid-cols-[auto_1fr_auto] items-center gap-2 border border-border px-3 py-2">
            <Minus className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Slider
              value={[espessura]}
              min={2}
              max={24}
              step={1}
              onValueChange={([valor]) => setEspessura(valor ?? 5)}
            />
            <span className="font-mono text-xs text-muted-foreground">{espessura}px</span>
          </div>
          <fieldset className="flex border border-border">
            <legend className="sr-only">Fundo do quadro</legend>
            {(Object.keys(FUNDOS) as PlanoDeFundo[]).map((fundo) => (
              <button
                type="button"
                key={fundo}
                onClick={() => setPlanoDeFundo(fundo)}
                className={`min-h-10 border-r border-border px-3 text-xs font-bold last:border-r-0 ${
                  planoDeFundo === fundo
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-muted-foreground"
                }`}
              >
                {FUNDOS[fundo].label}
              </button>
            ))}
          </fieldset>
        </div>
      </div>

      {erroArquivo && (
        <div
          role="alert"
          className="border-b border-destructive/40 bg-destructive/8 px-4 py-3 text-sm text-destructive"
        >
          {erroArquivo}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 bg-secondary/45 p-3 lg:grid lg:grid-cols-[1fr_auto]">
        <section
          ref={containerRef}
          className="relative w-full overflow-hidden border"
          aria-label="Área do quadro, também aceita uma imagem arrastada"
          onDragOver={(evento) => evento.preventDefault()}
          onDrop={(evento) => {
            evento.preventDefault();
            if (evento.dataTransfer.files.length !== 1) {
              setErroArquivo("Adicione uma imagem por vez.");
              return;
            }
            void importarArquivo(evento.dataTransfer.files[0]);
          }}
          style={{
            backgroundColor: fundoAtual.surface,
            backgroundImage: fundoAtual.pattern,
            backgroundSize: "28px 28px",
            borderColor: fundoAtual.border,
            height: compact ? "330px" : "min(680px, 70vh)",
            touchAction: "none",
          }}
        >
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerEnter={(evento) => {
              if (ferramenta === "borracha") {
                const posicao = obterPosicao(evento);
                setCursorBorracha({ ...posicao, visivel: true });
              }
            }}
            onPointerLeave={() => setCursorBorracha((atual) => ({ ...atual, visivel: false }))}
            className="absolute inset-0 z-10"
            style={{
              cursor:
                ferramenta === "texto" ? "text" : ferramenta === "borracha" ? "none" : "crosshair",
            }}
          />

          {ferramenta === "borracha" && cursorBorracha.visivel && (
            <div
              className="pointer-events-none absolute z-30 border border-foreground bg-card/20"
              style={{
                width: tamanhoBorracha,
                height: tamanhoBorracha,
                left: cursorBorracha.x - tamanhoBorracha / 2,
                top: cursorBorracha.y - tamanhoBorracha / 2,
              }}
            />
          )}

          {caixasTexto.map((caixa) => (
            <div
              key={caixa.id}
              className="group absolute z-20"
              style={{
                left: caixa.x,
                top: caixa.y,
                maxWidth: "min(280px, 70%)",
              }}
            >
              {editandoTextoId === caixa.id ? (
                <CaixaDeTextoEditavel
                  texto={caixa.texto}
                  cor={caixa.cor}
                  onChange={(texto) =>
                    setCaixasTexto((atuais) =>
                      atuais.map((item) => (item.id === caixa.id ? { ...item, texto } : item)),
                    )
                  }
                  onConcluir={() => concluirEdicaoTexto(caixa.id)}
                />
              ) : (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setEditandoTextoId(caixa.id)}
                    className="block max-w-full cursor-text whitespace-pre-wrap border border-transparent px-2 py-1.5 text-left text-base font-semibold leading-snug hover:border-foreground/30"
                    style={{ color: caixa.cor }}
                  >
                    {caixa.texto}
                  </button>
                  <button
                    type="button"
                    onClick={(evento) => {
                      evento.stopPropagation();
                      setCaixasTexto((atuais) => atuais.filter((item) => item.id !== caixa.id));
                    }}
                    className="absolute -right-7 top-0 hidden h-7 w-7 place-items-center bg-destructive text-destructive-foreground group-hover:grid group-focus-within:grid"
                    aria-label="Remover texto"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </section>

        <aside className="grid gap-2 sm:grid-cols-3 lg:w-36 lg:grid-cols-1">
          <SideAction icon={Undo2} label="Desfazer" onClick={desfazer} disabled={!podeDesfazer} />
          <SideAction icon={Redo2} label="Refazer" onClick={refazer} disabled={!podeRefazer} />
          <SideAction icon={Trash2} label="Limpar" onClick={limparQuadro} destructive />
        </aside>
      </div>
    </section>
  );
}

function CaixaDeTextoEditavel({
  texto,
  cor,
  onChange,
  onConcluir,
}: {
  texto: string;
  cor: string;
  onChange: (texto: string) => void;
  onConcluir: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const id = requestAnimationFrame(() => textareaRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, []);

  function handleKeyDown(evento: KeyboardEvent<HTMLTextAreaElement>) {
    if (evento.key === "Escape" || (evento.key === "Enter" && (evento.ctrlKey || evento.metaKey))) {
      evento.preventDefault();
      onConcluir();
    }
  }

  return (
    <textarea
      ref={textareaRef}
      value={texto}
      onChange={(evento) => onChange(evento.target.value.slice(0, 500))}
      onBlur={onConcluir}
      onKeyDown={handleKeyDown}
      placeholder="Digite o texto"
      rows={2}
      maxLength={500}
      className="min-w-44 resize border-2 border-primary bg-card p-2 text-base font-semibold leading-snug text-foreground outline-none"
      style={{ color: cor }}
    />
  );
}

function ToolButton({
  ativo,
  onClick,
  title,
  icon: Icon,
}: {
  ativo: boolean;
  onClick: () => void;
  title: string;
  icon: LucideIcon;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      aria-pressed={ativo}
      className={`grid h-10 w-10 place-items-center border ${
        ativo
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
    </button>
  );
}

function SideAction({
  icon: Icon,
  label,
  onClick,
  disabled,
  destructive,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-11 items-center justify-center gap-2 border px-3 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-40 ${
        destructive
          ? "border-destructive/45 text-destructive hover:bg-destructive/8"
          : "border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" /> {label}
    </button>
  );
}
