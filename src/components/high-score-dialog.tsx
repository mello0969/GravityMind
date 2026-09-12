import * as Dialog from "@radix-ui/react-dialog";
import { Trophy, X } from "lucide-react";
import { motion } from "motion/react";

export function HighScoreDialog({
  open,
  onOpenChange,
  correct,
  total,
  xp,
  reducedMotion,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  correct: number;
  total: number;
  xp: number;
  reducedMotion: boolean;
}) {
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#0d1713]/82" />
        <Dialog.Content asChild>
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reducedMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 z-50 w-[min(31rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 border border-border-strong bg-card p-6 sm:p-8"
          >
            <Dialog.Close
              className="absolute right-3 top-3 grid h-10 w-10 place-items-center text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Fechar resultado"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Dialog.Close>
            <Trophy className="h-7 w-7 text-accent" aria-hidden="true" />
            <Dialog.Title className="mt-5 text-3xl font-bold">
              Sessão muito bem resolvida
            </Dialog.Title>
            <Dialog.Description className="reading-copy mt-3 leading-relaxed text-muted-foreground">
              Você acertou {correct} de {total} questões e encerrou a meta com {percentage}% de
              aproveitamento.
            </Dialog.Description>
            <dl className="mt-6 grid grid-cols-2 border-y border-border py-4">
              <div className="border-r border-border pr-4">
                <dt className="text-xs font-semibold text-muted-foreground">Aproveitamento</dt>
                <dd className="mt-1 text-2xl font-bold">{percentage}%</dd>
              </div>
              <div className="pl-4">
                <dt className="text-xs font-semibold text-muted-foreground">XP da sessão</dt>
                <dd className="mt-1 text-2xl font-bold text-primary">+{xp}</dd>
              </div>
            </dl>
            <Dialog.Close asChild>
              <button type="button" className="ff-btn-primary mt-6 w-full">
                Continuar estudando
              </button>
            </Dialog.Close>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
