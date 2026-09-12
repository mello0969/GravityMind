import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { lazy, Suspense } from "react";
import { StaggeredText } from "@/components/staggered-text";
import { BRAND_NAME } from "@/lib/brand";
import { useSiteSettings } from "@/lib/settings/use-site-settings";

const AppleHeroScene = lazy(() =>
  import("@/components/apple-hero-scene").then((module) => ({
    default: module.AppleHeroScene,
  })),
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${BRAND_NAME} | Física com prática adaptativa` },
      {
        name: "description",
        content:
          "Estude Mecânica e as Leis de Newton com questões adaptativas, correção guiada, Flash Cards e quadro de resolução.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const settings = useSiteSettings();
  const reducedMotion = settings.motion === "reduced";

  return (
    <main className="gm-reference-page overflow-hidden">
      <section className="relative isolate h-[38.5rem] min-h-[34rem] overflow-hidden border-b border-[#273c33]">
        <Suspense fallback={<div className="absolute inset-0 bg-[#08150f]" />}>
          <AppleHeroScene reducedMotion={reducedMotion} />
        </Suspense>

        <OrbitField />

        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-5 pt-24 text-center sm:pt-32">
          <h1 className="text-[3rem] font-semibold leading-[1.02] text-[#f3f5f2] sm:text-[3.8rem] lg:text-[4.45rem]">
            <span className="block sm:whitespace-nowrap">
              <StaggeredText reducedMotion={reducedMotion}>Entenda a força.</StaggeredText>
            </span>
            <span className="block sm:whitespace-nowrap">
              <StaggeredText reducedMotion={reducedMotion}>Treine o raciocínio.</StaggeredText>
            </span>
          </h1>

          <div className="pointer-events-auto mt-9 flex w-full max-w-[33rem] flex-col gap-3 sm:flex-row">
            <Link
              to="/questoes"
              className="flex min-h-14 flex-1 items-center justify-center gap-4 border border-[#9de7cb] bg-[#9de7cb] px-6 text-base font-semibold text-[#07130e] hover:bg-[#b0efd8]"
            >
              Começar uma sessão
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              to="/lei-1"
              className="flex min-h-14 flex-1 items-center justify-center border border-[#799087] bg-[#08150f]/80 px-6 text-base font-medium text-[#edf2ee] hover:bg-[#13241d]"
            >
              Explorar as leis
            </Link>
          </div>
        </div>
      </section>

      <section className="gm-shell grid min-h-[22rem] border-t border-[#294038] lg:grid-cols-[38.2rem_minmax(0,1fr)]">
        <div className="py-12 lg:pr-16">
          <div className="flex items-center gap-5">
            <p className="font-mono text-[0.68rem] font-medium tracking-[0.22em] text-[#9bb0a6]">
              PRÁTICA ADAPTATIVA
            </p>
            <span className="h-px w-32 bg-[#536960]" aria-hidden="true" />
          </div>
          <h2 className="mt-7 max-w-[12ch] text-4xl font-semibold leading-[1.08] text-[#f1f4f1]">
            Questões que se adaptam a você.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-[#9eaaa4]">
            Mesmo assunto. Novos desafios.
            <br />
            No seu ritmo.
          </p>
        </div>

        <PracticePreview />
      </section>
    </main>
  );
}

function OrbitField() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 1536 616" preserveAspectRatio="xMidYMid slice">
        <title>Órbitas de ideias ao redor da maçã</title>
        <ellipse
          cx="768"
          cy="305"
          rx="544"
          ry="165"
          fill="none"
          stroke="#698077"
          strokeWidth="1.2"
          opacity="0.72"
        />
        <ellipse
          cx="760"
          cy="319"
          rx="477"
          ry="140"
          fill="none"
          stroke="#53675f"
          strokeWidth="1"
          opacity="0.55"
          transform="rotate(-9 760 319)"
        />
        <ellipse
          cx="760"
          cy="305"
          rx="462"
          ry="191"
          fill="none"
          stroke="#8ba096"
          strokeDasharray="9 10"
          strokeWidth="1.1"
          opacity="0.65"
          transform="rotate(-22 760 305)"
        />
        <g fill="#88b9a6" stroke="#b9d6ca" strokeWidth="1">
          <circle cx="289" cy="350" r="10" />
          <circle cx="411" cy="191" r="9" />
          <circle cx="1184" cy="206" r="11" />
          <circle cx="1139" cy="438" r="7" />
          <circle cx="392" cy="520" r="8" />
        </g>
        <path d="M347 151 405 195" stroke="#879c93" strokeWidth="1" />
        <path d="m1213 221 52-34" stroke="#879c93" strokeWidth="1" />
        <path d="m1162 443 63 42" stroke="#879c93" strokeWidth="1" />
      </svg>

      <div className="absolute left-[15%] top-[14%] hidden font-serif text-[1.1rem] italic text-[#b2c3bb] md:block">
        F = G&nbsp;
        <span className="inline-grid align-middle text-center leading-none">
          <span className="border-b border-[#b2c3bb] px-1">m₁m₂</span>
          <span className="pt-1">r²</span>
        </span>
      </div>
      <p className="absolute right-[9.5%] top-[24%] hidden font-mono text-[0.66rem] leading-loose tracking-[0.28em] text-[#9aaba3] lg:block">
        IDEIAS
        <br />
        EM ÓRBITA
      </p>
      <p className="absolute bottom-[17%] right-[11%] hidden font-mono text-[0.66rem] leading-loose tracking-[0.28em] text-[#9aaba3] lg:block">
        CONHECIMENTO
        <br />
        ATRAI
      </p>
    </div>
  );
}

function PracticePreview() {
  const options = ["7,0 m/s", "9,8 m/s", "10,0 m/s", "14,0 m/s"];

  return (
    <article className="relative -mt-5 w-full max-w-[39rem] self-start border border-[#31483e] bg-[#0a1812]/92 p-4 shadow-[0_14px_34px_rgb(0_0_0/18%)] sm:p-7">
      <div className="flex items-center justify-between text-[0.65rem] text-[#91a39a]">
        <span>Questão 1 de 5</span>
        <span>Nível adaptativo</span>
      </div>
      <div className="mt-4 grid gap-7 md:grid-cols-[minmax(0,1fr)_9rem]">
        <div>
          <p className="max-w-md text-sm leading-relaxed text-[#edf2ee]">
            Um objeto de 2,0 kg é solto do repouso de uma altura de 5,0 m. Desprezando a resistência
            do ar, qual é a sua velocidade ao atingir o solo?
          </p>
          <div className="mt-4 grid gap-2">
            {options.map((option, index) => (
              <div
                key={option}
                className={`flex min-h-9 items-center gap-4 border px-3 text-xs ${
                  index === 1
                    ? "border-[#9de7cb] text-[#b4ead5]"
                    : "border-[#2c453a] text-[#a4b2ab]"
                }`}
              >
                <span>{String.fromCharCode(65 + index)}</span>
                {index === 1 && (
                  <span className="h-2.5 w-2.5 rounded-full border-[3px] border-[#9de7cb]" />
                )}
                <span>{option}</span>
              </div>
            ))}
          </div>
        </div>
        <svg viewBox="0 0 140 190" className="mx-auto h-44 w-32 text-[#9cb8aa]" aria-hidden="true">
          <path
            d="M66 25c0-12 20-12 20 0 0 12-4 17-10 17s-10-5-10-17Z"
            fill="none"
            stroke="#e35e62"
            strokeWidth="2"
          />
          <path d="M76 25V12" stroke="#e35e62" strokeWidth="2" />
          <path d="M76 48v105" stroke="currentColor" strokeDasharray="6 7" />
          <path d="m71 143 5 8 5-8" fill="none" stroke="currentColor" />
          <path
            d="M26 164h98M32 164l-9 9m22-9-9 9m22-9-9 9m22-9-9 9m22-9-9 9m22-9-9 9"
            fill="none"
            stroke="currentColor"
          />
          <path d="M112 52v112m-6-112h12m-12 112h12" fill="none" stroke="currentColor" />
          <text x="119" y="112" fill="currentColor" fontSize="13">
            5,0 m
          </text>
        </svg>
      </div>
    </article>
  );
}
