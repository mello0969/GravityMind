import { Link, useLocation } from "@tanstack/react-router";
import { Bot, Maximize2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { GravityChat } from "@/components/gravity-chat";
import { gerarResumoPerfilParaGravity } from "@/lib/gravity/perfil-resumo";
import { useSiteSettings } from "@/lib/settings/use-site-settings";

export function GravityWidget() {
  const location = useLocation();
  const [aberto, setAberto] = useState(false);
  const { motion: motionPreference } = useSiteSettings();
  const movimentoReduzido = motionPreference === "reduced";

  useEffect(() => {
    if (!aberto) return;
    const fecharComEscape = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setAberto(false);
    };
    window.addEventListener("keydown", fecharComEscape);
    return () => window.removeEventListener("keydown", fecharComEscape);
  }, [aberto]);

  if (location.pathname.startsWith("/tutor")) return null;

  return (
    <div className="focus-optional">
      <AnimatePresence>
        {aberto && (
          <motion.aside
            initial={movimentoReduzido ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={movimentoReduzido ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: movimentoReduzido ? 0 : 0.18 }}
            role="dialog"
            aria-label="Tutor Gravity"
            className="fixed bottom-20 right-4 z-50 w-[min(400px,calc(100vw-2rem))] border border-border-strong bg-card p-4"
          >
            <div className="mb-3 flex items-start justify-between border-b border-border pb-3">
              <div>
                <p className="text-sm font-bold">Gravity</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Tutor contextual de Física</p>
              </div>
              <div className="flex items-center">
                <Link
                  to="/tutor"
                  className="grid h-9 w-9 place-items-center text-muted-foreground hover:bg-secondary hover:text-foreground"
                  aria-label="Abrir tutor em tela inteira"
                  title="Abrir em tela inteira"
                >
                  <Maximize2 className="h-4 w-4" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={() => setAberto(false)}
                  className="grid h-9 w-9 place-items-center text-muted-foreground hover:bg-secondary hover:text-foreground"
                  aria-label="Fechar tutor"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            <GravityChat
              context={{ resumoPerfil: gerarResumoPerfilParaGravity() }}
              alturaMensagens="320px"
            />
          </motion.aside>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setAberto((valor) => !valor)}
        aria-label={aberto ? "Fechar tutor Gravity" : "Abrir tutor Gravity"}
        aria-expanded={aberto}
        className="fixed bottom-4 right-4 z-50 grid h-12 w-12 place-items-center border border-primary bg-primary text-primary-foreground hover:bg-[var(--primary-hover)]"
      >
        {aberto ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Bot className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
