import { Link, useRouter } from "@tanstack/react-router";

import { useEffect } from "react";

import { captureClientError } from "@/lib/observability/client";

export function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-sm font-bold text-primary">ERRO 404</p>
      <h2 className="mt-4 text-2xl font-bold">Página não encontrada</h2>
      <p className="mt-2 text-sm text-muted-foreground">A página que você procura não existe.</p>
      <Link to="/" className="ff-btn-primary mt-8">
        Ir para o início
      </Link>
    </div>
  );
}

export function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
    void captureClientError(error);
  }, [error]);
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="mb-3 font-mono text-sm font-bold text-destructive">ERRO</p>
      <h1 className="text-xl font-bold">Algo deu errado</h1>
      <p className="mt-2 text-sm text-muted-foreground">Tente novamente ou volte ao início.</p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="ff-btn-primary"
        >
          Tentar novamente
        </button>
        <a href="/" className="ff-btn-outline">
          Início
        </a>
      </div>
    </div>
  );
}
