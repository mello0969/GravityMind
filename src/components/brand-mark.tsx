import { BRAND_NAME } from "@/lib/brand";

export function GravityMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className} fill="none">
      <circle cx="20" cy="20" r="11.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 2v36" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function BrandLockup({
  compact = false,
  mark = true,
}: {
  compact?: boolean;
  mark?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-3">
      {mark && <GravityMark className={compact ? "h-7 w-7" : "h-8 w-8"} />}
      <span
        className={`${compact ? "text-[1.02rem]" : "text-base"} whitespace-nowrap font-medium tracking-[0.27em] text-current`}
      >
        {BRAND_NAME}
      </span>
    </span>
  );
}
