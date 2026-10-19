import { Link, useLocation } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BrandLockup } from "@/components/brand-mark";
import { CookieConsent } from "@/components/cookie-consent";
import { useAuth } from "@/lib/auth/use-auth";

const mainLinks = [
  { to: "/", label: "Início" },
  { to: "/aulas", label: "Estudar" },
  { to: "/questoes", label: "Prática" },
  { to: "/flashcards", label: "Flash Cards" },
  { to: "/tutor", label: "Tutor" },
] as const;
const tools = [
  { to: "/quadro", label: "Quadro" },
  { to: "/calculo", label: "Cálculo" },
  { to: "/dashboard", label: "Progresso" },
  { to: "/anotacoes", label: "Anotações" },
  { to: "/configuracoes", label: "Configurações" },
  { to: "/plus", label: "Plano Plus" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { usuario, sair } = useAuth();
  const more = useRef<HTMLDetailsElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const lastPath = useRef(location.pathname);
  useEffect(() => {
    if (lastPath.current === location.pathname) return;
    lastPath.current = location.pathname;
    setOpen(false);
    if (more.current) more.current.open = false;
  }, [location.pathname]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (more.current?.open) {
        more.current.open = false;
        more.current.querySelector("summary")?.focus();
      } else if (open) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);
  return (
    <header className="gm-site-header sticky top-0 z-40">
      <div className="gm-shell gm-header-inner">
        <Link to="/" aria-label="GRAVITYMIND, início" className="shrink-0">
          <BrandLockup compact />
        </Link>
        <span className="gm-brand-tagline">
          Estude Física.
          <br />
          Pense mais longe.
        </span>
        <nav aria-label="Navegação principal" className="gm-header-nav">
          {mainLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              aria-current={location.pathname === to ? "page" : undefined}
              className="gm-nav-link"
            >
              {label}
            </Link>
          ))}
          <details ref={more} className="relative">
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-1 text-sm">
              Explorar <ChevronDown size={14} aria-hidden="true" />
            </summary>
            <nav aria-label="Ferramentas" className="gm-tools-menu">
              {tools.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  aria-current={location.pathname === to ? "page" : undefined}
                  className="px-3 py-3 text-sm hover:bg-secondary"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </details>
        </nav>
        <div className="ml-auto flex items-center gap-3 lg:ml-2">
          {usuario ? (
            <button
              type="button"
              className="gm-account-link hidden sm:block"
              onClick={() => void sair()}
            >
              Sair
            </button>
          ) : (
            <Link to="/login" className="gm-account-link hidden sm:block">
              Entrar
            </Link>
          )}
          <button
            ref={toggle}
            type="button"
            className="grid h-11 w-11 place-items-center lg:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Navegação móvel"
          className="gm-shell grid max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/20 pb-5 lg:hidden"
        >
          {[...mainLinks, ...tools].map(({ to, label }) => (
            <Link key={to} to={to} className="border-b border-white/10 py-3">
              {label}
            </Link>
          ))}
          {!usuario && (
            <Link to="/login" className="py-3">
              Entrar na conta
            </Link>
          )}
          {usuario && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                void sair();
              }}
              className="py-3 text-left"
            >
              Sair da conta
            </button>
          )}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="gm-shell grid gap-8 py-10 md:grid-cols-[1fr_auto]">
        <div>
          <BrandLockup />
          <p className="mt-3 text-base">Estude Física. Pense mais longe.</p>
          <p className="gm-footer-school mt-6 text-sm leading-relaxed">
            Escola Técnica Estadual Monteiro Lobato · CIMOL
            <br />
            Taquara, Rio Grande do Sul
          </p>
        </div>
        <nav
          aria-label="Links institucionais"
          className="flex flex-wrap content-start gap-x-6 gap-y-3 text-sm"
        >
          <Link to="/sobre">O projeto</Link>
          <Link to="/contato">Contato</Link>
          <Link to="/privacidade">Privacidade</Link>
          <Link to="/termos">Termos de uso</Link>
          <Link to="/configuracoes">Preferências</Link>
        </nav>
      </div>
      <CookieConsent />
    </footer>
  );
}
