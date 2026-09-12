import { useState } from "react";

const RESTING_TRANSFORM = "perspective(900px) rotateX(5deg) rotateY(-9deg) rotateZ(-4deg)";

export function CreditCardPreview({ holderName }: { holderName: string }) {
  const [transform, setTransform] = useState(RESTING_TRANSFORM);

  return (
    <div className="mx-auto w-full max-w-[23rem] [perspective:900px]">
      <div
        role="img"
        className="relative aspect-[1.586/1] overflow-hidden border border-[#5d756a] bg-[#10211a] p-6 text-[#edf2ed] shadow-[0_18px_38px_rgb(0_0_0/35%)] transition-transform duration-150 ease-out"
        style={{ transform }}
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          setTransform(
            `perspective(900px) rotateX(${5 - y * 8}deg) rotateY(${-9 + x * 10}deg) rotateZ(-4deg)`,
          );
        }}
        onPointerLeave={() => setTransform(RESTING_TRANSFORM)}
        aria-label="Prévia visual de cartão. Nenhum dado bancário é solicitado nesta tela."
      >
        <svg
          className="absolute inset-0 h-full w-full opacity-35"
          viewBox="0 0 500 315"
          aria-hidden="true"
        >
          <g fill="none" strokeWidth="1">
            <path d="M-20 62c90-68 153 42 241-6s120-71 209-16 95-13 111-24" stroke="#42725e" />
            <path d="M-30 92c93-65 159 46 247-3s118-70 206-14 100-14 128-30" stroke="#355f50" />
            <path d="M-18 130c84-55 149 44 236 4s126-75 214-17 92-12 120-35" stroke="#315545" />
            <path d="M-30 211c92-62 163 43 252 0s127-70 216-11 91-9 119-32" stroke="#355f50" />
            <path d="M-18 250c88-64 158 44 247 1s122-67 210-9 93-7 118-26" stroke="#8d392d" />
            <path d="M14 286c78-55 145 35 226-4s113-58 195-8 84 0 112-17" stroke="#9d4132" />
          </g>
        </svg>
        <span className="relative font-mono text-[0.62rem] tracking-[0.24em] text-[#dbe5df]">
          GRAVITYMIND
        </span>
        <div className="absolute inset-x-6 bottom-6">
          <p className="font-mono text-xl font-medium tracking-[0.08em]">
            •••• &nbsp;•••• &nbsp;•••• &nbsp;4821
          </p>
          <div className="mt-4 flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate font-mono text-xs uppercase text-[#dce5e0]">
                {holderName.trim() || "ESTUDANTE GRAVITYMIND"}
              </p>
            </div>
            <p className="font-mono text-sm">04/28</p>
          </div>
        </div>
      </div>
    </div>
  );
}
