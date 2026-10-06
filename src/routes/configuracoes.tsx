import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { useCallback } from "react";
import { PageHeading } from "@/components/page-heading";
import { Switch } from "@/components/ui/switch";
import { isCurrentStorageKey, storageKey } from "@/lib/brand";
import { useStudyProfile } from "@/lib/profile/use-study-profile";
import { type SessionMinutes, useSiteSettings } from "@/lib/settings/use-site-settings";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Preferências | GRAVITYMIND" },
      {
        name: "description",
        content: "Ajustes de aparência, leitura, movimento e apoio ao foco.",
      },
    ],
  }),
  component: ConfiguracoesPage,
});

function ConfiguracoesPage() {
  const settings = useSiteSettings();
  const { profile, updateDailyGoal } = useStudyProfile();
  const dailyGoal = profile?.dailyGoal ?? 5;

  const exportarDados = useCallback(() => {
    const data: Record<string, unknown> = {};
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (!key || !isCurrentStorageKey(key)) continue;
      try {
        data[key] = JSON.parse(window.localStorage.getItem(key) ?? "null");
      } catch {
        data[key] = window.localStorage.getItem(key);
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `gravitymind-dados-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <main className="ff-page overflow-x-hidden">
      <div className="ff-shell">
        <PageHeading title="Configurações" description="Um espaço de estudo no seu ritmo." />

        <div className="grid gap-12 py-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <aside className="focus-optional lg:sticky lg:top-24 lg:self-start">
            <nav aria-label="Seções das preferências" className="grid gap-1 text-sm">
              <a href="#aparencia" className="border-b-2 border-primary px-1 py-2 font-semibold">
                Aparência
              </a>
              <a href="#foco" className="border-b border-border px-1 py-2 text-muted-foreground">
                Apoio ao foco
              </a>
              <a href="#dados" className="border-b border-border px-1 py-2 text-muted-foreground">
                Meus dados
              </a>
            </nav>
          </aside>

          <div className="min-w-0">
            <section id="aparencia" aria-labelledby="titulo-aparencia">
              <h2 id="titulo-aparencia" className="text-2xl">
                Aparência e leitura
              </h2>
              <div className="ff-divider-list mt-5 border-b border-t border-border">
                <SettingRow
                  title="Tema"
                  description="Escolha uma aparência ou acompanhe o tema do aparelho."
                >
                  <fieldset className="flex flex-wrap">
                    <legend className="sr-only">Tema do site</legend>
                    {(
                      [
                        ["light", "Claro"],
                        ["dark", "Escuro"],
                        ["system", "Sistema"],
                      ] as const
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={settings.theme === value}
                        onClick={() => settings.setTheme(value)}
                        className={`min-h-11 border px-4 text-sm ${settings.theme === value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}
                      >
                        {label}
                      </button>
                    ))}
                  </fieldset>
                </SettingRow>
                <SettingRow
                  title="Texto maior"
                  description="Aumenta a escala tipográfica de toda a interface, incluindo títulos, controles e textos de leitura."
                >
                  <Switch
                    aria-label="Usar texto maior"
                    checked={settings.reading === "large"}
                    onCheckedChange={(checked) =>
                      settings.setReading(checked ? "large" : "standard")
                    }
                  />
                </SettingRow>

                <SettingRow
                  title="Movimento reduzido"
                  description="Desliga animações de rolagem e transições longas."
                >
                  <Switch
                    aria-label="Reduzir movimento"
                    checked={settings.motion === "reduced"}
                    onCheckedChange={(checked) => settings.setMotion(checked ? "reduced" : "full")}
                  />
                </SettingRow>
              </div>
            </section>

            <section id="foco" aria-labelledby="titulo-foco" className="pt-16">
              <h2 id="titulo-foco" className="text-2xl">
                Apoio ao foco
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Sessões curtas, uma tarefa de cada vez, progresso visível e pausas sugeridas. Esse
                ajuste pode ajudar quem se distrai com facilidade, com ou sem diagnóstico de TDAH.
              </p>

              <div className="ff-divider-list mt-5 border-b border-t border-border">
                <SettingRow
                  title="Modo foco"
                  description="Simplifica a navegação e prioriza a questão atual."
                >
                  <Switch
                    aria-label="Ativar modo foco"
                    checked={settings.focusMode}
                    onCheckedChange={settings.setFocusMode}
                  />
                </SettingRow>

                <SettingRow
                  title="Duração da sessão"
                  description="Define quando sugerir uma pausa."
                >
                  <fieldset className="flex">
                    <legend className="sr-only">Duração da sessão</legend>
                    {([5, 10, 15] as SessionMinutes[]).map((minutes) => (
                      <button
                        key={minutes}
                        type="button"
                        aria-pressed={settings.sessionMinutes === minutes}
                        onClick={() => settings.setSessionMinutes(minutes)}
                        className={`min-h-11 border px-4 text-sm font-semibold first:border-r-0 last:border-l-0 ${
                          settings.sessionMinutes === minutes
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-muted-foreground"
                        }`}
                      >
                        {minutes} min
                      </button>
                    ))}
                  </fieldset>
                </SettingRow>

                <SettingRow
                  title="Meta diária"
                  description="Define quantas questões formam o objetivo do dia. Em uma conta, a meta fica salva no Supabase."
                >
                  <div className="grid grid-cols-[2.75rem_5.5rem_2.75rem] border border-border">
                    <button
                      type="button"
                      onClick={() => void updateDailyGoal(Math.max(1, dailyGoal - 1))}
                      disabled={dailyGoal <= 1}
                      className="grid h-11 place-items-center border-r border-border disabled:opacity-40"
                      aria-label="Diminuir meta diária"
                    >
                      <Minus className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <output className="grid h-11 place-items-center font-mono text-sm font-bold">
                      {dailyGoal} questões
                    </output>
                    <button
                      type="button"
                      onClick={() => void updateDailyGoal(Math.min(40, dailyGoal + 1))}
                      disabled={dailyGoal >= 40}
                      className="grid h-11 place-items-center border-l border-border disabled:opacity-40"
                      aria-label="Aumentar meta diária"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </SettingRow>

                <SettingRow
                  title="Lembrete de pausa"
                  description="Sugere levantar, beber água ou respirar ao fim da sessão."
                >
                  <Switch
                    aria-label="Lembrar de fazer pausas"
                    checked={settings.breakReminders}
                    onCheckedChange={settings.setBreakReminders}
                  />
                </SettingRow>

                <SettingRow
                  title="Mostrar cronômetro"
                  description="Deixe desligado se contar o tempo causar pressão."
                >
                  <Switch
                    aria-label="Mostrar cronômetro"
                    checked={settings.showTimer}
                    onCheckedChange={settings.setShowTimer}
                  />
                </SettingRow>
              </div>
            </section>

            <section id="dados" aria-labelledby="titulo-dados" className="pt-16">
              <h2 id="titulo-dados" className="text-2xl">
                Meus dados
              </h2>
              <div className="ff-divider-list mt-5 border-b border-t border-border">
                <SettingRow
                  title="Exportar dados deste aparelho"
                  description="Baixa notas, progresso e respostas em formato JSON."
                >
                  <button type="button" className="ff-btn-outline" onClick={exportarDados}>
                    Exportar
                  </button>
                </SettingRow>
                <SettingRow
                  title="Privacidade"
                  description="Veja quais dados são usados e como são protegidos."
                >
                  <Link to="/privacidade" className="ff-btn-outline">
                    Ler política
                  </Link>
                </SettingRow>
                <SettingRow
                  title="Preferência de cookies"
                  description="Apague sua escolha para revisar o consentimento no rodapé."
                >
                  <button
                    type="button"
                    className="ff-btn-outline"
                    onClick={() => {
                      window.localStorage.removeItem(storageKey("cookie-consent"));
                      window.location.reload();
                    }}
                  >
                    Rever escolha
                  </button>
                </SettingRow>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-5 py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <div className="justify-self-start sm:justify-self-end">{children}</div>
    </div>
  );
}
