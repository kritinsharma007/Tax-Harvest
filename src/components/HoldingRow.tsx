import type { Holding } from "../types";
import { formatINRCompact, formatQuantity, formatPrice } from "../utils/format";

interface HoldingRowProps {
  holding: Holding;
  selected: boolean;
  onToggle: (id: string) => void;
}

function GainCell({ gain, balance }: { gain: number; balance: number }) {
  const tone = gain > 0 ? "text-gold-400" : gain < 0 ? "text-wine-400" : "text-husk-400";
  return (
    <td className="whitespace-nowrap px-4 py-4 text-right">
      <div className={`font-mono text-sm tabular ${tone}`}>{formatINRCompact(gain)}</div>
      <div className="mt-0.5 font-mono text-[11px] tabular text-husk-500">{formatQuantity(balance)}</div>
    </td>
  );
}

export function HoldingRow({ holding, selected, onToggle }: HoldingRowProps) {
  return (
    <tr
      className={[
        "border-b border-husk-800 transition-colors last:border-b-0",
        selected ? "bg-gold-500/[0.07]" : "hover:bg-husk-900/60",
      ].join(" ")}
    >
      <td className="w-12 px-4 py-4 align-middle">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle(holding.id)}
          aria-label={`Select ${holding.coinName} for harvesting`}
          className="h-4 w-4 cursor-pointer rounded border-husk-500 bg-transparent text-gold-500 accent-gold-500 focus-visible:outline-gold-500"
        />
      </td>

      <td className="min-w-[190px] px-4 py-4 align-middle">
        <div className="flex items-center gap-3">
          <img
            src={holding.logo}
            alt=""
            className="h-7 w-7 shrink-0 rounded-full bg-husk-800 object-cover"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
            }}
          />
          <div className="min-w-0">
            <p className="truncate font-body text-sm font-medium text-husk-100">{holding.coin}</p>
            <p className="truncate font-body text-xs text-husk-400">{holding.coinName}</p>
          </div>
        </div>
      </td>

      <td className="whitespace-nowrap px-4 py-4 text-right align-middle">
        <div className="font-mono text-sm tabular text-husk-100">
          {formatQuantity(holding.totalHolding)} <span className="text-husk-400">{holding.coin}</span>
        </div>
        <div className="mt-0.5 font-mono text-[11px] tabular text-husk-500">
          {formatPrice(holding.averageBuyPrice)}/{holding.coin}
        </div>
      </td>

      <td className="whitespace-nowrap px-4 py-4 text-right align-middle font-mono text-sm tabular text-husk-100">
        {formatPrice(holding.currentPrice)}
      </td>

      <GainCell gain={holding.stcg.gain} balance={holding.stcg.balance} />
      <GainCell gain={holding.ltcg.gain} balance={holding.ltcg.balance} />

      <td className="whitespace-nowrap px-4 py-4 text-right align-middle">
        {selected ? (
          <span className="font-mono text-sm tabular text-sage-400">
            {formatQuantity(holding.totalHolding)} {holding.coin}
          </span>
        ) : (
          <span className="font-mono text-sm text-husk-600">—</span>
        )}
      </td>
    </tr>
  );
}
