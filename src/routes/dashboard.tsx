import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeading } from "@/components/page-heading";
import { PROGRESS_EVENT } from "@/lib/brand";
import {
  formatarDuracao,
  montarPerfilAprendizagem,
  type PerfilAprendizagem,
} from "@/lib/profile/engine";
import type { StudyProfile } from "@/lib/profile/study-profile.server";
import { useStudyProfile } from "@/lib/profile/use-study-profile";
import { contarRevisoesPendentes } from "@/lib/questions/engine";
import type { Assunto } from "@/lib/questions/types";
import { ASSUNTO_LABEL } from "@/lib/questions/types";
import {
  calcularRecompensas,
  listarMarcosReais,
  type MarcoRecompensa,
  type RecompensaResumo,
} from "@/lib/rewards/engine";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Meu progresso | GRAVITYMIND" },
      {
        name: "description",
        content: "Veja seu progresso real, revisões pendentes e a próxima ação de estudo.",
      },
    ],
  }),
  component: DashboardPage,
});

type DadosPainel = {
  perfil: PerfilAprendizagem;
  recompensas: RecompensaResumo;
  marcos: MarcoRecompensa[];
  revisoes: number;
  studyProfile: StudyProfile;
};

function DashboardPage() {
  const [dados, setDados] = useState<DadosPainel | null>(null);
  const { profile: studyProfile } = useStudyProfile();

  useEffect(() => {
    const atualizar = () => {
      setDados({
        perfil: montarPerfilAprendizagem(),
        recompensas: calcularRecompensas(),
        marcos: listarMarcosReais(),
        revisoes: contarRevisoesPendentes(),
        studyProfile: studyProfile ?? {
          dailyGoal: 5,
          currentStreakDays: 0,
          correctStreak: 0,
          bestCorrectStreak: 0,
          totalXp: 0,
          todayAnswers: 0,
          todayCorrect: 0,
          plan: "free",
        },
      });
    };
    atualizar();
    window.addEventListener(PROGRESS_EVENT, atualizar);
    return () => window.removeEventListener(PROGRESS_EVENT, atualizar);
  }, [studyProfile]);

  if (!dados) return <DashboardSkeleton />;
  return <DashboardContent {...dados} />;
}

function DashboardSkeleton() {
  return (
    <main className="ff-page" aria-label="Carregando painel">
      <div className="ff-shell">
        <div className="ff-skeleton h-4 w-28" />
        <div className="ff-skeleton mt-4 h-11 w-full max-w-lg" />
        <div className="mt-9 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-24 bg-card p-5">
              <div className="ff-skeleton h-3 w-20" />
              <div className="ff-skeleton mt-4 h-7 w-14" />
            </div>
          ))}
        </div>
        <div className="ff-skeleton mt-10 h-72 w-full" />
      </div>
    </main>
  );
}

function DashboardContent({ perfil, recompensas, marcos, revisoes, studyProfile }: DadosPainel) {
  return (
    <main className="ff-page">
      <div className="ff-shell">
        <PageHeading title="Meu progresso" description={perfil.recomendacao.motivo}>
          <RecommendationLink perfil={perfil} />
        </PageHeading>

        <section
          className="grid gap-px overflow-hidden border-x border-b border-border bg-border sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Resumo"
        >
          <Metric
            label="Meta de hoje"
            value={`${studyProfile.todayAnswers}/${studyProfile.dailyGoal}`}
          />
          <Metric
            label="Ofensiva diária"
            value={`${studyProfile.currentStreakDays} dia${studyProfile.currentStreakDays === 1 ? "" : "s"}`}
          />
          <Metric label="Sequência de acertos" value={String(studyProfile.correctStreak)} />
          <Metric label="XP acumulado" value={String(studyProfile.totalXp)} />
        </section>

        <div className="mt-12 grid gap-12 xl:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.55fr)]">
          <div className="space-y-12">
            <section aria-labelledby="leis-title">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="ff-kicker">Trilha</p>
                  <h2 id="leis-title" className="mt-2 text-2xl sm:text-3xl">
                    Leis de Newton
                  </h2>
                </div>
                <span className="text-sm font-semibold text-muted-foreground">
                  {perfil.progressoGeralLicoes}% concluído
                </span>
              </div>
              <div className="mt-5 border-y border-border">
                {(["lei-1", "lei-2", "lei-3"] as Assunto[]).map((assunto, indice) => {
                  const licao = perfil.licoes.find((item) => item.assunto === assunto);
                  const desempenho = perfil.desempenho.find((item) => item.assunto === assunto);
                  if (!licao || !desempenho) return null;
                  return (
                    <LessonProgressRow
                      key={assunto}
                      assunto={assunto}
                      numero={`${indice + 1}ª`}
                      percentual={licao.percentual}
                      taxaAcerto={desempenho.taxaAcerto}
                      tentativas={desempenho.totalRespostas}
                    />
                  );
                })}
              </div>
            </section>

            <section aria-labelledby="activity-title">
              <div>
                <p className="ff-kicker">Últimos sete dias</p>
                <h2 id="activity-title" className="mt-2 text-2xl sm:text-3xl">
                  Atividade registrada
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {perfil.totalRespostas} respostas, {revisoes} revisões pendentes e{" "}
                  {formatarDuracao(perfil.tempoTotalSegundos)} em questões.
                </p>
              </div>
              <div className="mt-6 grid h-52 grid-cols-7 items-end gap-2 border-b border-border pb-7 sm:gap-4">
                {perfil.atividade7Dias.map((dia) => {
                  const maior = Math.max(1, ...perfil.atividade7Dias.map((item) => item.respostas));
                  const altura =
                    dia.respostas === 0 ? 3 : Math.max(16, (dia.respostas / maior) * 100);
                  return (
                    <div key={dia.data} className="flex h-full flex-col justify-end text-center">
                      <span className="mb-2 text-xs font-semibold text-muted-foreground">
                        {dia.respostas || ""}
                      </span>
                      <div
                        className="mx-auto w-full max-w-10 bg-primary"
                        style={{ height: `${altura}%` }}
                        title={`${dia.respostas} respostas, ${dia.acertos} acertos`}
                      />
                      <span className="mt-2 text-[11px] font-semibold text-muted-foreground">
                        {dia.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section aria-labelledby="milestones-title">
              <div>
                <p className="ff-kicker">Marcos verificáveis</p>
                <h2 id="milestones-title" className="mt-2 text-2xl sm:text-3xl">
                  O que já aconteceu
                </h2>
              </div>
              <div className="ff-divider-list mt-5 border-y border-border">
                {marcos.map((marco) => (
                  <div
                    key={marco.id}
                    className="grid gap-2 py-4 sm:grid-cols-[1fr_1fr_auto] sm:items-center"
                  >
                    <strong className="text-sm">{marco.titulo}</strong>
                    <span className="text-sm text-muted-foreground">{marco.criterio}</span>
                    <span
                      className={`text-xs font-bold ${marco.concluido ? "text-success" : "text-muted-foreground"}`}
                    >
                      {marco.concluido ? "Concluído" : "Pendente"}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-10 xl:border-l xl:border-border xl:pl-8">
            <section aria-labelledby="credits-title">
              <p className="ff-kicker">Recompensa transparente</p>
              <h2 id="credits-title" className="mt-2 text-2xl">
                Nível {recompensas.nivel}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {recompensas.creditos} créditos acumulados
              </p>
              <div className="ff-progress-track mt-5">
                <div
                  className="ff-progress-fill"
                  style={{ width: `${recompensas.creditosNoNivel}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {recompensas.creditosNoNivel === 0 && recompensas.creditos > 0
                  ? "Novo nível alcançado"
                  : `${recompensas.creditosParaProximoNivel} para o próximo nível`}
              </p>

              <dl className="mt-6 border-y border-border py-3 text-sm">
                <CreditLine label="Questões praticadas" value={recompensas.detalhamento.pratica} />
                <CreditLine label="Questões acertadas" value={recompensas.detalhamento.acertos} />
                <CreditLine label="Erros corrigidos" value={recompensas.detalhamento.correcoes} />
                <CreditLine label="Partes de aula" value={recompensas.detalhamento.aulas} />
                <CreditLine label="Anotações" value={recompensas.detalhamento.anotacoes} />
              </dl>
            </section>

            <section className="focus-optional" aria-labelledby="tools-title">
              <p className="ff-kicker">Ferramentas</p>
              <h2 id="tools-title" className="mt-2 text-2xl">
                Apoio à resolução
              </h2>
              <nav className="mt-4 border-y border-border">
                <ToolLink to="/questoes" label="Prática adaptativa" />
                <ToolLink to="/quadro" label="Quadro negro" />
                <ToolLink to="/anotacoes" label="Anotações" />
                <ToolLink to="/configuracoes" label="Modo foco e aparência" />
              </nav>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function RecommendationLink({ perfil }: { perfil: PerfilAprendizagem }) {
  const assunto = perfil.recomendacao.assunto;
  const aula = assunto === "lei-1" ? "/lei-1" : assunto === "lei-2" ? "/lei-2" : "/lei-3";
  const destino = perfil.recomendacao.tipo === "continuar-licao" ? aula : "/questoes";
  return (
    <Link to={destino} className="ff-btn-primary shrink-0">
      {perfil.recomendacao.tipo === "revisar" ? "Abrir revisão" : "Continuar estudo"}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-h-24 bg-card p-5">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="mt-3 text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function LessonProgressRow({
  assunto,
  numero,
  percentual,
  taxaAcerto,
  tentativas,
}: {
  assunto: Assunto;
  numero: string;
  percentual: number;
  taxaAcerto: number;
  tentativas: number;
}) {
  const destino = assunto === "lei-1" ? "/lei-1" : assunto === "lei-2" ? "/lei-2" : "/lei-3";
  return (
    <div className="grid gap-4 border-b border-border py-5 last:border-b-0 md:grid-cols-[2.5rem_1fr_minmax(10rem,0.7fr)_auto] md:items-center">
      <span className="font-mono text-xs font-bold text-muted-foreground">{numero}</span>
      <div>
        <strong>{ASSUNTO_LABEL[assunto]}</strong>
        <p className="mt-1 text-xs text-muted-foreground">
          {tentativas ? `${taxaAcerto}% em ${tentativas} tentativas` : "Ainda sem prática"}
        </p>
      </div>
      <div>
        <div className="mb-1 flex justify-between text-xs text-muted-foreground">
          <span>Aula</span>
          <span>{percentual}%</span>
        </div>
        <div className="ff-progress-track">
          <div className="ff-progress-fill" style={{ width: `${percentual}%` }} />
        </div>
      </div>
      <Link to={destino} className="ff-btn-outline">
        {percentual ? "Continuar" : "Abrir"}
      </Link>
    </div>
  );
}

function CreditLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between gap-4 py-1.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-bold">+{value}</dd>
    </div>
  );
}

function ToolLink({
  to,
  label,
}: {
  to: "/questoes" | "/quadro" | "/anotacoes" | "/configuracoes";
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between border-b border-border py-3 text-sm font-semibold last:border-b-0"
    >
      {label}
      <ArrowRight className="h-4 w-4 text-primary" aria-hidden="true" />
    </Link>
  );
}
