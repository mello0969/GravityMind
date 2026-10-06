import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, MapPin } from "lucide-react";

export const Route = createFileRoute("/contato")({
  head: () => ({ meta: [{ title: "Contato | GRAVITYMIND" }] }),
  component: ContatoPage,
});

function ContatoPage() {
  return (
    <main className="ff-page">
      <div className="ff-shell max-w-4xl">
        <header className="max-w-2xl border-b border-border pb-9">
          <p className="ff-kicker">Contato</p>
          <h1 className="mt-3 text-4xl ">Fale com o projeto pelo CIMOL</h1>
          <p className="reading-copy mt-5 text-muted-foreground">
            Para não simular um canal de atendimento que ainda não existe, esta página direciona aos
            meios oficiais da escola responsável pelo contexto do projeto.
          </p>
        </header>

        <section className="grid gap-8 py-10 md:grid-cols-[13rem_1fr]">
          <div className="flex items-start gap-3 text-primary">
            <MapPin className="mt-0.5 h-5 w-5" aria-hidden="true" />
            <span className="font-mono text-xs font-bold uppercase">Taquara, RS</span>
          </div>
          <div>
            <h2 className="text-2xl">Escola Técnica Estadual Monteiro Lobato</h2>
            <p className="reading-copy mt-3 max-w-xl text-muted-foreground">
              Consulte endereço, telefone, e-mail e horários diretamente no site oficial. Assim, as
              informações permanecem atualizadas e verificáveis.
            </p>
            <a
              href="https://cimol.g12.br/"
              target="_blank"
              rel="noreferrer"
              className="ff-btn-primary mt-6"
            >
              Abrir site oficial <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="border-t border-border pt-9">
          <h2 className="text-xl">Sobre conteúdo e privacidade</h2>
          <p className="reading-copy mt-3 max-w-2xl text-sm text-muted-foreground">
            O tutor não deve receber senhas, documentos ou outros dados pessoais. Para entender o
            tratamento de informações no site, consulte a Política de Privacidade no rodapé.
          </p>
        </section>
      </div>
    </main>
  );
}
