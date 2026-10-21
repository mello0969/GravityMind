import { Link } from "@tanstack/react-router";
import { PageHeading } from "@/components/page-heading";
import { PLAN_FEATURES, PlanOptions } from "@/components/plan-options";
import { usePlusCheckout } from "./use-plus-checkout";

export function PlusPage({ checkout }: { checkout?: "success" | "canceled" }) {
  const { usuario, hasPlus, accepted, setAccepted, submitting, error, startCheckout } =
    usePlusCheckout();
  return (
    <main className="gm-shell py-10">
      <PageHeading title="GRAVITYMIND Plus" description="Mais conexões. Novos desafios." />
      {checkout && (
        <p role="status" className="border-b border-border py-5">
          {checkout === "success"
            ? "Recebemos seu retorno do checkout. O plano será atualizado após a confirmação do pagamento."
            : "Checkout cancelado. Seu plano não foi alterado."}
        </p>
      )}
      <h2 className="sr-only">Escolha seu plano</h2>
      <PlanOptions />
      <div className="grid gap-12 pb-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section aria-labelledby="plan-content">
          <h2 id="plan-content" className="text-2xl">
            O que está incluído
          </h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Comparação entre os planos Essencial e Plus</caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="py-4 pr-5">
                    Recurso
                  </th>
                  <th scope="col" className="px-3 py-4">
                    Essencial
                  </th>
                  <th scope="col" className="px-3 py-4 text-primary">
                    Plus
                  </th>
                </tr>
              </thead>
              <tbody>
                {PLAN_FEATURES.map(([name, free, plus]) => (
                  <tr key={name} className="border-b border-border">
                    <th scope="row" className="py-5 pr-5 font-normal">
                      {name}
                    </th>
                    <td className="px-3 py-5 text-muted-foreground">{free}</td>
                    <td className="px-3 py-5">{plus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            Aulas e prática continuam disponíveis no Essencial. Nenhuma assinatura é necessária para
            começar.
          </p>
          <Link to="/aulas" className="mt-4 inline-block text-primary underline underline-offset-4">
            Explorar a trilha gratuita
          </Link>
        </section>
        <aside className="border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <h2 className="text-2xl">{hasPlus ? "Seu Plus está ativo" : "Continuar com Plus"}</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Consulte o valor, a periodicidade e as condições no checkout antes de confirmar. Os
            dados do cartão são inseridos somente no Stripe.
          </p>
          {!hasPlus &&
            (usuario ? (
              <form onSubmit={startCheckout} className="mt-6">
                <label className="flex items-start gap-3 text-sm leading-relaxed">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-primary"
                    checked={accepted}
                    onChange={(event) => setAccepted(event.target.checked)}
                  />
                  <span>Quero consultar as condições da assinatura recorrente.</span>
                </label>
                <button
                  type="submit"
                  disabled={!accepted || submitting}
                  className="ff-btn-primary mt-6 w-full"
                >
                  {submitting ? "Abrindo checkout…" : "Consultar assinatura"}
                </button>
              </form>
            ) : (
              <Link to="/login" className="ff-btn-primary mt-6">
                Entrar para continuar
              </Link>
            ))}
          {error && (
            <p role="alert" className="mt-5 text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="mt-8 border-t border-border pt-5 text-sm">
            <Link to="/termos" className="underline underline-offset-4">
              Termos de uso
            </Link>
            <span className="mx-3">·</span>
            <Link to="/privacidade" className="underline underline-offset-4">
              Privacidade
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
