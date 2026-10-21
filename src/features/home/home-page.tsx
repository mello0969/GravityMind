import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { StaggeredText } from "@/components/staggered-text";
import { useAuth } from "@/lib/auth/use-auth";
import { useSiteSettings } from "@/lib/settings/use-site-settings";

const areas = [
  {
    to: "/aulas",
    title: "Conheça as aulas",
    description: "Conteúdo organizado, com diferentes formas de aprender.",
    detail: "Aulas e simulações",
  },
  {
    to: "/questoes",
    title: "Encontre seu ritmo",
    description: "Prática adaptativa e revisão para avançar com mais confiança.",
    detail: "Questões e revisão",
  },
  {
    to: "/quadro",
    title: "Dê espaço às ideias",
    description: "Quadro, calculadora e anotações para pensar por conta própria.",
    detail: "Ferramentas de estudo",
  },
  {
    to: "/tutor",
    title: "Converse sobre suas dúvidas",
    description: "Um Tutor para orientar seu raciocínio, com acesso pela sua conta.",
    detail: "Tutor de Física",
  },
] as const;

export function HomePage() {
  const { usuario } = useAuth();
  const { motion } = useSiteSettings();
  return (
    <main className="gm-welcome">
      <section className="gm-welcome-hero" aria-labelledby="home-title">
        <img
          src="/assets/gravitymind-prism.png"
          alt=""
          width="1536"
          height="1024"
          fetchPriority="high"
          className="gm-welcome-image"
        />
        <div className="gm-shell gm-welcome-content">
          <h1 id="home-title" translate="no">
            GRAVITYMIND
          </h1>
          <p className="gm-welcome-statement">
            <StaggeredText reducedMotion={motion === "reduced"}>Sua curiosidade</StaggeredText>
            <br />
            <StaggeredText reducedMotion={motion === "reduced"}>vai mais longe.</StaggeredText>
          </p>
          <p className="gm-welcome-description">
            Física para entender o mundo.
            <br />
            Um espaço para aprender no seu ritmo.
          </p>
          <Link to="/aulas" className="ff-btn-primary gm-welcome-cta">
            Explorar as aulas
          </Link>
        </div>
      </section>

      <section className="gm-shell gm-welcome-explore" aria-labelledby="explore-title">
        <header className="gm-welcome-intro">
          <h2 id="explore-title">
            Um lugar para
            <br />
            seguir aprendendo.
          </h2>
          <p>
            Comece por uma aula, retome uma dúvida ou organize suas ideias. O próximo passo é seu.
          </p>
        </header>
        <div className="gm-welcome-areas">
          {areas.map((area) => (
            <Link key={area.to} to={area.to} className="gm-welcome-area">
              <div>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
                <span>{area.detail}</span>
              </div>
              <ArrowUpRight size={21} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="gm-welcome-account">
        <div className="gm-shell">
          <div>
            <h2>{usuario ? "Seu caminho continua aqui." : "Seu estudo, com continuidade."}</h2>
            <p>
              {usuario
                ? "Retome suas aulas e acompanhe o que já aprendeu."
                : "Crie uma conta gratuita para acompanhar seu progresso entre sessões."}
            </p>
          </div>
          <Link to={usuario ? "/dashboard" : "/cadastro"} className="ff-btn-primary">
            {usuario ? "Ver meu progresso" : "Criar conta gratuita"}
          </Link>
        </div>
      </section>
    </main>
  );
}
