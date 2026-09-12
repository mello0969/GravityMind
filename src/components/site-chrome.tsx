import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Menu, Settings, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { BrandLockup } from "@/components/brand-mark";
import { CookieConsent } from "@/components/cookie-consent";
import { useAuth } from "@/lib/auth/use-auth";
import { useSiteSettings } from "@/lib/settings/use-site-settings";

type AppRoute =
  | "/"
  | "/lei-1"
  | "/questoes"
  | "/flashcards"
  | "/calculo"
  | "/quadro"
  | "/tutor"
  | "/dashboard"
  | "/configuracoes"
  | "/plus"
  | "/login"
  | "/cadastro"
  | "/sobre"
  | "/contato"
  | "/privacidade"
  | "/termos";

const primaryLinks: ReadonlyArray<{ to: AppRoute; label: string }> = [
  { to: "/", label: "Estudar" },
  { to: "/questoes", label: "Prática" },
  { to: "/flashcards", label: "Flash Cards" },
  { to: "/calculo", label: "Cálculo" },
  { to: "/quadro", label: "Explorar" },
  { to: "/plus", label: "Plus" },
];

const mobileLinks: ReadonlyArray<{ to: AppRoute; label: string }> = [
  ...primaryLinks,
  { to: "/tutor", label: "Tutor" },
  { to: "/dashboard", label: "Progresso" },
  { to: "/configuracoes", label: "Configurações" },
];

function pathActive(pathname: string, to: AppRoute) {
  if (to === "/") {
    return pathname === "/" || pathname.startsWith("/lei-") || pathname.startsWith("/tutor");
  }
  return pathname.startsWith(to);
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, sair } = useAuth();
  const { motion: motionPreference } = useSiteSettings();
  const reducedMotion = motionPreference === "reduced";

  async function handleLogout() {
    await sair();
    setMobileOpen(false);
    await navigate({ to: "/" });
  }

  return (
    <header className="gm-site-header sticky top-0 z-40 border-b border-[#294038] bg-[#08150f] text-[#eef3ef]">
      <div className="gm-shell flex min-h-[5.5rem] flex-wrap items-center gap-x-5 gap-y-2 py-3">
        <Link to="/" className="shrink-0 text-[#f2f5f2]" aria-label="GRAVITYMIND, início">
          <BrandLockup compact />
        </Link>

        <span className="hidden h-10 w-px bg-[#344a41] 2xl:block" aria-hidden="true" />
        <p className="hidden max-w-44 font-mono text-[0.67rem] font-medium leading-relaxed text-[#9aaba3] 2xl:block">
          ESTUDE FÍSICA. PENSE MAIS LONGE.
        </p>

        <nav
          className="ml-auto hidden h-12 items-center gap-5 xl:flex"
          aria-label="Navegação principal"
        >
          {primaryLinks.map((item) => {
            const active = pathActive(location.pathname, item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={`relative flex h-full items-center whitespace-nowrap text-[0.9rem] font-normal ${
                  active ? "text-[#9de7cb]" : "text-[#a8b5af] hover:text-[#eef3ef]"
                }`}
              >
                {item.label}
                {active && (
                  <motion.span
                    layoutId="site-nav-active"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-[#9de7cb]"
                    transition={reducedMotion ? { duration: 0 } : { duration: 0.22 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3 xl:ml-0">
          <Link
            to="/configuracoes"
            className="ff-icon-btn"
            aria-label="Configurações"
            title="Configurações"
          >
            <Settings className="h-5 w-5" aria-hidden="true" />
          </Link>
          {usuario ? (
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-[#c7d2cc]"
              aria-label="Sair da conta"
              title="Sair da conta"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full border border-[#63766d] text-sm">
                {usuario.nome.trim().slice(0, 2).toUpperCase()}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="py-2 text-sm text-foreground">
                Entrar
              </Link>
              <Link to="/cadastro" className="ff-btn-primary !min-h-10 !px-3 !py-2 !text-sm">
                Criar conta
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center border border-[#40544b] text-[#eef3ef] xl:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={reducedMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: reducedMotion ? 0 : 0.18 }}
            className="border-t border-[#294038] bg-[#08150f] xl:hidden"
          >
            <nav className="gm-shell grid py-2" aria-label="Navegação móvel">
              {mobileLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`border-b border-[#294038] py-3 text-base ${
                    pathActive(location.pathname, item.to) ? "text-[#9de7cb]" : "text-[#dce5e0]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {usuario ? (
                <button type="button" onClick={handleLogout} className="py-3 text-left text-base">
                  Sair da conta
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-base text-[#9de7cb]"
                >
                  Entrar
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer border-t border-[#294038] bg-[#08150f] text-[#c7d2cc]">
      <div className="gm-shell flex flex-col gap-5 py-6 text-xs md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-5">
          <BrandLockup compact />
          <span className="hidden h-6 w-px bg-[#344a41] sm:block" aria-hidden="true" />
          <span className="font-mono text-[0.58rem] tracking-[0.24em] text-[#8e9d96]">
            ESTUDE FÍSICA. PENSE MAIS LONGE.
          </span>
        </div>
        <nav
          className="flex flex-wrap gap-x-6 gap-y-2 text-[#93a39b]"
          aria-label="Links institucionais"
        >
          <Link to="/sobre" className="hover:text-[#eef3ef]">
            Sobre
          </Link>
          <Link to="/privacidade" className="hover:text-[#eef3ef]">
            Privacidade
          </Link>
          <Link to="/termos" className="hover:text-[#eef3ef]">
            Termos
          </Link>
          <Link to="/contato" className="hover:text-[#eef3ef]">
            Ajuda
          </Link>
          <Link to="/login" className="hover:text-[#eef3ef]">
            Entrar
          </Link>
        </nav>
      </div>
      <div className="gm-shell flex flex-wrap justify-between gap-4 border-t border-border py-5 text-xs leading-relaxed text-muted-foreground">
        <p>
          Escola Técnica Estadual Monteiro Lobato · CIMOL
          <br />
          Taquara, Rio Grande do Sul
        </p>
        <nav className="flex flex-wrap items-center gap-5" aria-label="Recursos de estudo">
          <Link to="/lei-1">Aulas</Link>
          <Link to="/dashboard">Progresso</Link>
          <Link to="/tutor">Tutor Virtual</Link>
          <Link to="/plus">GRAVITYMIND Plus</Link>
        </nav>
      </div>
      <CookieConsent />
    </footer>
  );
}
