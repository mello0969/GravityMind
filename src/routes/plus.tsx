import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Minus } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { CreditCardPreview } from "@/components/credit-card-preview";
import { ShaderPlanSurface } from "@/components/shader-plan-surface";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth/use-auth";
import { createPlusCheckoutServerFn } from "@/lib/billing/checkout.server";
import { useStudyProfile } from "@/lib/profile/use-study-profile";

const searchSchema = z.object({
  checkout: z.enum(["success", "canceled"]).optional(),
});

export const Route = createFileRoute("/plus")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Plano Plus | GRAVITYMIND" },
      {
        name: "description",
        content:
          "Compare o plano gratuito e o GRAVITYMIND Plus e continue no checkout hospedado do Stripe.",
      },
    ],
  }),
  component: PlusPage,
});

const essentialFeatures = [
  ["Flash Cards e prática", true],
  ["Acompanhamento de progresso", true],
  ["Tutor completo", false],
  ["Decks avançados", false],
  ["Metas sincronizadas", false],
] as const;

const plusFeatures = [
  "Flash Cards e prática",
  "Acompanhamento de progresso",
  "Tutor completo",
  "Decks avançados",
  "Metas sincronizadas",
];

function PlusPage() {
  const { checkout } = Route.useSearch();
  const { usuario, carregando } = useAuth();
  const { profile } = useStudyProfile();
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [holderName, setHolderName] = useState(usuario?.nome ?? "");

  async function startCheckout(event: React.FormEvent) {
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
        data: { plan: "plus", acceptedRecurringCharge: true },
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

  return (
    <main className="gm-reference-page py-6">
      <div className="mx-auto w-[calc(100%-2rem)] max-w-[77rem] sm:w-[calc(100%-3rem)]">
        <header>
          <h1 className="text-4xl font-semibold sm:text-[2.75rem]">GRAVITYMIND Plus</h1>
          <p className="mt-1 text-2xl text-muted-foreground">Mais recursos para ir além.</p>
        </header>

        {checkout && (
          <div className="mt-5 border-l-2 border-primary px-4 py-2 text-sm" role="status">
            {checkout === "success"
              ? "Checkout concluído. O acesso é liberado após a confirmação assinada do Stripe."
              : "Checkout cancelado. Nenhuma alteração foi feita no seu plano."}
          </div>
        )}

        <section className="mt-5 grid gap-6 lg:grid-cols-2" aria-label="Comparação de planos">
          <article className="border border-border-strong px-10 py-6">
            <h2 className="text-3xl font-semibold">Essencial</h2>
            <p className="mt-1 max-w-[14rem] text-base leading-snug text-[#d8dfdb]">
              O essencial para sua jornada de estudos.
            </p>
            <ul className="mt-3 border-t border-border pt-3">
              {essentialFeatures.map(([feature, available]) => (
                <PlanFeature key={feature} available={available}>
                  {feature}
                </PlanFeature>
              ))}
            </ul>
          </article>

          <article className="relative isolate overflow-hidden border border-primary px-10 py-6">
            <ShaderPlanSurface />
            <div className="relative z-10 grid h-full sm:grid-cols-[1fr_10.5rem]">
              <div>
                <h2 className="text-3xl font-semibold">Plus</h2>
                <p className="mt-1 max-w-xs text-base leading-snug text-[#d8dfdb]">
                  A experiência completa para estudar sem limites.
                </p>
                <ul className="mt-3 border-t border-[#476158] pt-3">
                  {plusFeatures.map((feature) => (
                    <PlanFeature key={feature} available>
                      {feature}
                    </PlanFeature>
                  ))}
                </ul>
              </div>
              <div className="mt-6 flex items-center border-t border-[#6f8b7f] pt-5 text-center sm:mt-0 sm:border-l sm:border-t-0 sm:pl-8">
                <p className="text-base leading-snug">Valor exibido no checkout</p>
              </div>
              {profile?.plan === "plus" && (
                <span className="absolute right-0 top-0 border border-primary px-3 py-1 text-xs text-primary">
                  Plano ativo
                </span>
              )}
            </div>
          </article>
        </section>

        <section
          className="mt-6 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(21rem,0.72fr)]"
          aria-labelledby="billing-title"
        >
          <div>
            <h2 id="billing-title" className="text-2xl font-semibold">
              Seus dados de cobrança
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Você será redirecionado para um provedor de pagamento seguro.
            </p>

            <form className="mt-4 grid gap-3" onSubmit={startCheckout}>
              <label className="grid gap-1 text-sm" htmlFor="checkout-name">
                Nome no cartão
                <input
                  id="checkout-name"
                  name="cardholderName"
                  className="ff-input"
                  value={holderName}
                  onChange={(event) => setHolderName(event.target.value.slice(0, 80))}
                  autoComplete="name"
                  placeholder="Ex.: Ana Silva"
                />
              </label>
              <label className="grid gap-1 text-sm" htmlFor="checkout-email">
                E-mail
                <input
                  id="checkout-email"
                  name="email"
                  className="ff-input"
                  value={usuario?.email ?? ""}
                  readOnly
                  autoComplete="email"
                  placeholder="seu@email.com"
                />
              </label>
              <label className="grid gap-1 text-sm" htmlFor="checkout-country">
                País
                <select id="checkout-country" name="country" className="ff-input" defaultValue="BR">
                  <option value="BR">Brasil</option>
                </select>
              </label>

              <label
                htmlFor="checkout-recorrencia"
                className="flex items-start gap-3 text-xs text-muted-foreground"
              >
                <Checkbox
                  id="checkout-recorrencia"
                  checked={accepted}
                  onCheckedChange={(value) => setAccepted(value === true)}
                  className="mt-0.5 h-5 w-5 rounded-sm"
                />
                <span>
                  Entendo que valor e recorrência serão mostrados antes da confirmação no Stripe.
                </span>
              </label>

              {error && (
                <p
                  className="border-l-2 border-destructive px-3 text-sm text-destructive"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="ff-btn-primary min-h-14 w-full text-base"
                disabled={!accepted || submitting}
              >
                {submitting ? "Abrindo checkout…" : "Continuar no pagamento seguro"}
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
              <p className="text-xs leading-relaxed text-muted-foreground">
                O número do cartão não passa pelo GRAVITYMIND. Esta tela não pede número, validade
                ou CVC; você será redirecionado para um provedor de pagamento seguro.
              </p>
              {!carregando && !usuario && (
                <Link
                  to="/login"
                  className="text-sm font-semibold text-primary underline underline-offset-4"
                >
                  Entrar antes de continuar
                </Link>
              )}
            </form>
          </div>

          <div className="pt-1">
            <h2 className="text-2xl font-semibold">Prévia visual</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Ilustração interativa. Dados reais são inseridos no checkout seguro.
            </p>
            <div className="mt-6">
              <CreditCardPreview holderName={holderName || usuario?.nome || "ANA SILVA"} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function PlanFeature({ available, children }: { available: boolean; children: React.ReactNode }) {
  const Icon = available ? Check : Minus;
  return (
    <li
      className={`flex items-center gap-4 py-1 text-sm ${available ? "text-[#e2e9e5]" : "text-[#74847c]"}`}
    >
      <span
        className={`grid h-6 w-6 place-items-center rounded-full ${available ? "bg-primary text-primary-foreground" : "bg-[#43534c] text-[#14251e]"}`}
      >
        <Icon className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
      </span>
      {children}
    </li>
  );
}
