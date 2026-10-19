import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { type ReactNode, useId } from "react";

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  busy = false,
  confirmDisabled = false,
  destructive = false,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  busy?: boolean;
  confirmDisabled?: boolean;
  destructive?: boolean;
  children?: ReactNode;
}) {
  const descriptionId = useId();
  return (
    <Dialog.Root open={open} onOpenChange={(value) => !busy && onOpenChange(value)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/65" />
        <Dialog.Content
          aria-describedby={description ? descriptionId : undefined}
          className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] overflow-y-auto w-[min(28rem,calc(100%_-_2rem))] -translate-x-1/2 -translate-y-1/2 rounded border border-border-strong bg-card p-6"
        >
          <Dialog.Title className="pr-9 text-xl">{title}</Dialog.Title>
          {description && (
            <Dialog.Description
              id={descriptionId}
              className="mt-3 text-sm leading-relaxed text-muted-foreground"
            >
              {description}
            </Dialog.Description>
          )}
          <Dialog.Close
            disabled={busy}
            aria-label="Fechar diálogo"
            className="absolute right-3 top-3 grid h-10 w-10 place-items-center"
          >
            <X size={18} aria-hidden="true" />
          </Dialog.Close>
          {children}
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Dialog.Close className="ff-btn-outline" disabled={busy}>
              Cancelar
            </Dialog.Close>
            <button
              type="button"
              disabled={busy || confirmDisabled}
              onClick={onConfirm}
              className={
                destructive
                  ? "ff-btn-outline border-destructive text-destructive"
                  : "ff-btn-primary"
              }
            >
              {busy ? "Aguarde..." : confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
