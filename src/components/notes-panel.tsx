import { FileText, History, Plus, RotateCcw, Search, Trash2, X } from "lucide-react";
import { useState } from "react";
import {
  atualizarNota,
  buscarNotas,
  criarNota,
  excluirNota,
  listarNotas,
  obterHistoricoDaNota,
  restaurarVersao,
} from "@/lib/notes/store";
import type { Nota } from "@/lib/notes/types";
import { useAutosave } from "@/lib/notes/use-autosave";
import type { Assunto } from "@/lib/questions/types";
import { ASSUNTO_LABEL } from "@/lib/questions/types";

type FiltroAssunto = Assunto | "geral" | "todas";

const FILTROS: { id: FiltroAssunto; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "geral", label: "Geral" },
  { id: "lei-1", label: "1ª Lei" },
  { id: "lei-2", label: "2ª Lei" },
  { id: "lei-3", label: "3ª Lei" },
];

function formatarData(iso: string) {
  const data = new Date(iso);
  return `${data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}, ${data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
}

export function NotesPanel({ assuntoInicial }: { assuntoInicial?: Assunto } = {}) {
  const [notas, setNotas] = useState(() => listarNotas());
  const [selecionadaId, setSelecionadaId] = useState<string | null>(notas[0]?.id ?? null);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<FiltroAssunto>(assuntoInicial ?? "todas");
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  // `notas` mantém o componente sincronizado com o armazenamento após cada operação.
  const notasFiltradas = buscarNotas(busca, filtro === "todas" ? undefined : filtro);
  const notaSelecionada = notas.find((nota) => nota.id === selecionadaId) ?? null;

  function recarregar() {
    setNotas(listarNotas());
  }

  function criar() {
    const nova = criarNota(filtro === "todas" ? "geral" : filtro);
    recarregar();
    setSelecionadaId(nova.id);
    setMostrarHistorico(false);
  }

  function excluir(id: string) {
    excluirNota(id);
    const restantes = listarNotas();
    setNotas(restantes);
    if (selecionadaId === id) setSelecionadaId(restantes[0]?.id ?? null);
  }

  return (
    <div className="grid min-h-[36rem] overflow-hidden border border-border bg-card md:grid-cols-[18rem_minmax(0,1fr)]">
      <aside className="border-b border-border p-4 md:border-b-0 md:border-r">
        <div className="ff-input-wrap">
          <Search aria-hidden="true" />
          <input
            type="search"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value.slice(0, 120))}
            maxLength={120}
            placeholder="Buscar anotações"
            className="ff-input"
          />
        </div>

        <fieldset className="mt-3 flex flex-wrap gap-1">
          <legend className="sr-only">Filtrar anotações</legend>
          {FILTROS.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setFiltro(item.id)}
              aria-pressed={filtro === item.id}
              className={`min-h-9 border px-2.5 text-xs font-semibold ${
                filtro === item.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </fieldset>

        <button type="button" onClick={criar} className="ff-btn-primary mt-4 w-full">
          <Plus className="h-4 w-4" aria-hidden="true" /> Nova anotação
        </button>

        <div className="mt-4 max-h-[23rem] overflow-y-auto border-y border-border md:max-h-[28rem]">
          {notasFiltradas.length === 0 && (
            <p className="px-2 py-7 text-center text-sm text-muted-foreground">
              Nenhuma anotação neste recorte.
            </p>
          )}
          {notasFiltradas.map((nota) => (
            <button
              type="button"
              key={nota.id}
              onClick={() => {
                setSelecionadaId(nota.id);
                setMostrarHistorico(false);
              }}
              className={`block w-full border-b border-border px-2 py-3 text-left last:border-b-0 ${
                selecionadaId === nota.id ? "bg-secondary" : "hover:bg-secondary/55"
              }`}
            >
              <strong className="block truncate text-sm">{nota.titulo || "Sem título"}</strong>
              <span className="mt-1 block truncate text-xs text-muted-foreground">
                {nota.conteudo || "Nota vazia"}
              </span>
              <span className="mt-1 block text-[11px] text-muted-foreground">
                {formatarData(nota.atualizadaEm)}
              </span>
            </button>
          ))}
        </div>
      </aside>

      <section className="min-w-0 p-4 sm:p-6">
        {notaSelecionada ? (
          mostrarHistorico ? (
            <HistoricoNota
              nota={notaSelecionada}
              onFechar={() => setMostrarHistorico(false)}
              onRestaurado={() => {
                recarregar();
                setMostrarHistorico(false);
              }}
            />
          ) : (
            <EditorNota
              key={notaSelecionada.id}
              nota={notaSelecionada}
              onAtualizar={recarregar}
              onExcluir={() => excluir(notaSelecionada.id)}
              onAbrirHistorico={() => setMostrarHistorico(true)}
            />
          )
        ) : (
          <div className="flex min-h-[24rem] flex-col items-center justify-center text-center text-muted-foreground">
            <FileText className="h-8 w-8" aria-hidden="true" />
            <p className="mt-3 text-sm font-semibold">Crie uma anotação para começar.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function EditorNota({
  nota,
  onAtualizar,
  onExcluir,
  onAbrirHistorico,
}: {
  nota: Nota;
  onAtualizar: () => void;
  onExcluir: () => void;
  onAbrirHistorico: () => void;
}) {
  const [titulo, setTitulo] = useState(nota.titulo);
  const [conteudo, setConteudo] = useState(nota.conteudo);
  const [assunto, setAssunto] = useState<Nota["assunto"]>(nota.assunto);
  const status = useAutosave({ titulo, conteudo, assunto }, (dados) => {
    atualizarNota(nota.id, dados);
    onAtualizar();
  });
  const statusLabel = {
    ocioso: "",
    digitando: "Alterações locais",
    salvando: "Salvando",
    salvo: "Salvo automaticamente",
  }[status];

  return (
    <div className="flex h-full min-h-[31rem] flex-col">
      <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
        <input
          value={titulo}
          onChange={(evento) => setTitulo(evento.target.value.slice(0, 160))}
          maxLength={160}
          placeholder="Título da anotação"
          className="min-w-0 flex-1 border-0 bg-transparent text-xl font-bold text-foreground outline-none"
        />
        <div className="flex shrink-0 gap-1">
          <IconButton label="Ver histórico" icon={History} onClick={onAbrirHistorico} />
          <IconButton label="Excluir anotação" icon={Trash2} onClick={onExcluir} destructive />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {(["geral", "lei-1", "lei-2", "lei-3"] as const).map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => setAssunto(item)}
            aria-pressed={assunto === item}
            className={`min-h-8 border px-2 text-xs font-semibold ${
              assunto === item
                ? "border-primary text-primary"
                : "border-border text-muted-foreground"
            }`}
          >
            {item === "geral" ? "Geral" : ASSUNTO_LABEL[item]}
          </button>
        ))}
      </div>

      <textarea
        value={conteudo}
        onChange={(evento) => setConteudo(evento.target.value.slice(0, 40_000))}
        maxLength={40_000}
        placeholder="Registre o raciocínio, uma dúvida ou um exemplo"
        className="mt-4 min-h-[22rem] flex-1 resize-y border border-border bg-background p-4 leading-relaxed text-foreground outline-none focus:border-primary"
      />
      <div
        className="mt-3 flex justify-between gap-3 text-xs text-muted-foreground"
        aria-live="polite"
      >
        <span>{statusLabel}</span>
        <span>{conteudo.length.toLocaleString("pt-BR")} / 40.000</span>
      </div>
    </div>
  );
}

function HistoricoNota({
  nota,
  onFechar,
  onRestaurado,
}: {
  nota: Nota;
  onFechar: () => void;
  onRestaurado: () => void;
}) {
  const versoes = obterHistoricoDaNota(nota.id);
  return (
    <div>
      <div className="flex items-start justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="ff-kicker">Histórico</p>
          <h2 className="mt-2 text-xl">{nota.titulo}</h2>
        </div>
        <IconButton label="Fechar histórico" icon={X} onClick={onFechar} />
      </div>
      <div className="ff-divider-list mt-4 border-y border-border">
        {versoes.length === 0 && (
          <p className="py-7 text-sm text-muted-foreground">Ainda não há versões anteriores.</p>
        )}
        {versoes.map((versao) => (
          <article key={versao.salvoEm} className="py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <time className="text-xs text-muted-foreground">{formatarData(versao.salvoEm)}</time>
              <button
                type="button"
                onClick={() => {
                  restaurarVersao(nota.id, versao.conteudoAnterior);
                  onRestaurado();
                }}
                className="inline-flex min-h-9 items-center gap-2 text-xs font-bold text-primary"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" /> Restaurar
              </button>
            </div>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {versao.conteudoAnterior}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

function IconButton({
  label,
  icon: Icon,
  onClick,
  destructive = false,
}: {
  label: string;
  icon: typeof History;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`grid h-9 w-9 place-items-center ${
        destructive
          ? "text-destructive hover:bg-destructive/8"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
