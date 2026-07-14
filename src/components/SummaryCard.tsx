import type { CapitalGains, NetGains } from "../types";
import { formatINR } from "../utils/format";

interface SummaryCardProps {
  variant: "before" | "after";
  heading: string;
  eyebrow: string;
  capitalGains: CapitalGains;
  totals: NetGains;
  totalLabel: string;
  helperText?: string;
}

function gainTone(value: number): string {
  if (value > 0) return "text-gold-400";
  if (value < 0) return "text-wine-400";
  return "text-husk-200";
}

function Row({
  label,
  shortTerm,
  longTerm,
  emphasis = false,
}: {
  label: string;
  shortTerm: number;
  longTerm: number;
  emphasis?: boolean;
}) {
  return (
    <>
      <span className={`self-center font-body text-sm ${emphasis ? "font-medium text-husk-100" : "text-husk-300"}`}>
        {label}
      </span>
      <span
        className={`text-right font-mono text-sm tabular ${
          emphasis ? `font-semibold ${gainTone(shortTerm)}` : "text-husk-100"
        }`}
      >
        {formatINR(shortTerm)}
      </span>
      <span
        className={`text-right font-mono text-sm tabular ${
          emphasis ? `font-semibold ${gainTone(longTerm)}` : "text-husk-100"
        }`}
      >
        {formatINR(longTerm)}
      </span>
    </>
  );
}

export function SummaryCard({
  variant,
  heading,
  eyebrow,
  capitalGains,
  totals,
  totalLabel,
  helperText,
}: SummaryCardProps) {
  const isAfter = variant === "after";

  return (
    <section
      className={[
        "relative flex h-full flex-col rounded-2xl border p-6 shadow-card sm:p-7",
        isAfter ? "border-sage-600/40 bg-after-card" : "border-husk-700 bg-before-card",
      ].join(" ")}
    >
      {isAfter && (
        <span className="absolute right-6 top-6 flex items-center gap-1.5 rounded-full border border-sage-400/30 bg-sage-900/60 px-2.5 py-1 font-body text-[10px] font-medium uppercase tracking-wide text-sage-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sage-400" />
          updates live
        </span>
      )}

      <p className="font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-husk-400">{eyebrow}</p>
      <h3 className="mt-1 font-display text-2xl font-medium text-husk-50">{heading}</h3>

      <div className="mt-6 grid grid-cols-[1fr,auto,auto] items-center gap-x-4 gap-y-3 sm:gap-x-6">
        <span />
        <span className="text-right font-body text-xs font-medium text-husk-400">Short-term</span>
        <span className="text-right font-body text-xs font-medium text-husk-400">Long-term</span>

        <Row label="Profits" shortTerm={capitalGains.stcg.profits} longTerm={capitalGains.ltcg.profits} />
        <Row label="Losses" shortTerm={-capitalGains.stcg.losses} longTerm={-capitalGains.ltcg.losses} />

        <div className="col-span-3 h-px bg-husk-700/70" />

        <Row
          label="Net capital gain"
          shortTerm={totals.netShortTerm}
          longTerm={totals.netLongTerm}
          emphasis
        />
      </div>

      {helperText && <p className="mt-6 font-body text-xs text-husk-500">{helperText}</p>}

      <div className="mt-auto pt-6">
        <div className="h-px w-full bg-husk-700" />
        <div className="mt-5 flex items-baseline justify-between">
          <span className="font-body text-sm font-medium text-husk-200">{totalLabel}</span>
          <span className={`font-mono text-2xl font-semibold tabular ${gainTone(totals.realised)}`}>
            {formatINR(totals.realised)}
          </span>
        </div>
      </div>
    </section>
  );
}
