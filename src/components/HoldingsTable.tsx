import { useMemo, useRef, useState, useEffect } from "react";
import type { Holding } from "../types";
import { HoldingRow } from "./HoldingRow";

interface HoldingsTableProps {
  holdings: Holding[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  allSelected: boolean;
  someSelected: boolean;
}

const COLLAPSED_ROW_COUNT = 6;

export function HoldingsTable({
  holdings,
  selectedIds,
  onToggle,
  onToggleAll,
  allSelected,
  someSelected,
}: HoldingsTableProps) {
  const [expanded, setExpanded] = useState(false);
  const selectAllRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  // Logical default ordering: biggest-magnitude combined gain/loss first, so
  // the assets most worth reviewing for harvesting surface at the top.
  const sorted = useMemo(() => {
    return [...holdings].sort((a, b) => {
      const magA = Math.abs(a.stcg.gain) + Math.abs(a.ltcg.gain);
      const magB = Math.abs(b.stcg.gain) + Math.abs(b.ltcg.gain);
      return magB - magA;
    });
  }, [holdings]);

  const visible = expanded ? sorted : sorted.slice(0, COLLAPSED_ROW_COUNT);
  const hiddenCount = sorted.length - COLLAPSED_ROW_COUNT;

  return (
    <section className="rounded-2xl border border-husk-700 bg-husk-900/40">
      <div className="flex items-center justify-between border-b border-husk-700 px-6 py-5">
        <div>
          <h3 className="font-display text-xl font-medium text-husk-50">Holdings</h3>
          <p className="mt-0.5 font-body text-xs text-husk-400">
            {selectedIds.size > 0
              ? `${selectedIds.size} of ${holdings.length} selected for harvesting`
              : `${holdings.length} assets in this wallet`}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] border-collapse">
          <thead>
            <tr className="border-b border-husk-700 bg-husk-900/80">
              <th className="w-12 px-4 py-3.5 text-left">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleAll}
                  aria-label="Select all holdings"
                  className="h-4 w-4 cursor-pointer rounded border-husk-500 bg-transparent accent-gold-500"
                />
              </th>
              <th className="px-4 py-3.5 text-left font-body text-xs font-medium uppercase tracking-wide text-husk-400">
                Asset
              </th>
              <th className="px-4 py-3.5 text-right font-body text-xs font-medium uppercase tracking-wide text-husk-400">
                Holdings
                <span className="block font-normal normal-case text-husk-500">Avg. buy price</span>
              </th>
              <th className="px-4 py-3.5 text-right font-body text-xs font-medium uppercase tracking-wide text-husk-400">
                Current price
              </th>
              <th className="px-4 py-3.5 text-right font-body text-xs font-medium uppercase tracking-wide text-husk-400">
                Short-term
              </th>
              <th className="px-4 py-3.5 text-right font-body text-xs font-medium uppercase tracking-wide text-husk-400">
                Long-term
              </th>
              <th className="px-4 py-3.5 text-right font-body text-xs font-medium uppercase tracking-wide text-husk-400">
                Amount to sell
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((holding) => (
              <HoldingRow
                key={holding.id}
                holding={holding}
                selected={selectedIds.has(holding.id)}
                onToggle={onToggle}
              />
            ))}
          </tbody>
        </table>
      </div>

      {hiddenCount > 0 && (
        <div className="border-t border-husk-700 px-6 py-4">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="font-body text-sm font-medium text-gold-400 underline decoration-gold-500/40 underline-offset-4 transition-colors hover:text-gold-300"
          >
            {expanded ? "Show less" : `View all ${sorted.length} holdings`}
          </button>
        </div>
      )}
    </section>
  );
}
