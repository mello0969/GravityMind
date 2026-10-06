import { BRAND_NAME } from "@/lib/brand";

export function GravityMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className} fill="none">
      <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 2v36M20 20h12" stroke="currentColor" strokeWidth="1.5" />
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
    <span role="img" aria-label={BRAND_NAME} className="gm-brand" translate="no">
      {mark && <GravityMark className={compact ? "h-7 w-7" : "h-8 w-8"} />}
      <span
        className={`${compact ? "text-lg" : "text-xl"} whitespace-nowrap font-medium text-current`}
      >
        GRAVITYMIND
      </span>
    </span>
  );
}
