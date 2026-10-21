import { NotesPanel } from "@/components/notes-panel";
import { PageHeading } from "@/components/page-heading";
import { useAuth } from "@/lib/auth/use-auth";

export function AnotacoesPage({ nota }: { nota?: string }) {
  const { usuario, carregando } = useAuth();
  return (
    <main className="ff-page">
      <div className="ff-shell max-w-5xl">
        <PageHeading title="Anotações de Física" />
        <div className="mt-8">
          {carregando ? (
            <div className="ff-skeleton h-80" role="status" aria-label="Carregando anotações" />
          ) : (
            <NotesPanel key={`${usuario?.id ?? "guest"}:${nota ?? "all"}`} notaInicialId={nota} />
          )}
        </div>
      </div>
    </main>
  );
}
