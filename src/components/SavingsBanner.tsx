import { formatINR } from "../utils/format";

interface SavingsBannerProps {
  show: boolean;
  amount: number;
  hasSelection: boolean;
}

export function SavingsBanner({ show, amount, hasSelection }: SavingsBannerProps) {
  if (show) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-gold-500/30 bg-gold-500/10 px-5 py-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-gold-400">
          ↓
        </span>
        <p className="font-body text-sm text-husk-100">
          <span className="font-semibold text-gold-400">You're set to save {formatINR(amount)}</span> in taxable
          gains with this selection.
        </p>
      </div>
    );
  }

  if (hasSelection) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-husk-700 bg-husk-900/50 px-5 py-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-husk-800 text-husk-400">
          i
        </span>
        <p className="font-body text-sm text-husk-300">
          This selection doesn't lower your taxable gains yet — try adding a holding that's currently at a loss.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-dashed border-husk-700 px-5 py-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-husk-800 text-husk-400">
        ＋
      </span>
      <p className="font-body text-sm text-husk-400">
        Check a holding below to see how it moves your effective capital gains.
      </p>
    </div>
  );
}
