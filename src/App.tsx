import { useState } from "react";
import { Header } from "./components/Header";
import { SummaryCard } from "./components/SummaryCard";
import { SavingsBanner } from "./components/SavingsBanner";
import { HoldingsTable } from "./components/HoldingsTable";
import { Loader } from "./components/Loader";
import { ErrorState } from "./components/ErrorState";
import { HarvestingProvider, useHarvesting } from "./context/HarvestingContext";

const BASE_CAPITAL_GAINS = { stcg: { profits: 70200.88, losses: 1548.53 }, ltcg: { profits: 5020, losses: 3050 } };

function Disclosure() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-8 rounded-xl border border-husk-700 bg-husk-900/40">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2.5 font-body text-sm font-medium text-husk-200">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-husk-500 text-[11px] text-husk-400">
            i
          </span>
          Notes &amp; assumptions
        </span>
        <span className={`text-husk-400 transition-transform ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>
      {open && (
        <div className="border-t border-husk-700 px-5 py-4">
          <ul className="list-disc space-y-2 pl-4 font-body text-xs leading-relaxed text-husk-400">
            <li>Figures are simulated from mock APIs for this preview — nothing here is placed as a real order.</li>
            <li>
              "Amount to sell" reflects a full exit from a holding once it's checked; the tool doesn't yet support
              partial-quantity selection.
            </li>
            <li>
              The savings figure is the drop in realised capital gains between the two cards, shown as rupees — it
              isn't a tax-slab calculation.
            </li>
            <li>Holdings are ordered by the size of their combined gain or loss, largest first.</li>
          </ul>
        </div>
      )}
    </div>
  );
}

function DevTools() {
  const { reload, isDevErrorSimActive } = useHarvesting();
  return (
    <div className="mx-auto flex max-w-6xl justify-center px-4 pb-16 pt-4 sm:px-6">
      <button
        onClick={() => reload({ simulateError: !isDevErrorSimActive })}
        className="font-body text-[11px] text-husk-600 underline decoration-dotted underline-offset-4 transition-colors hover:text-husk-400"
      >
        {isDevErrorSimActive ? "Reload with mock data" : "Simulate a failed request"}
      </button>
    </div>
  );
}

function HarvestingScreen() {
  const {
    status,
    errorMessage,
    holdings,
    selectedIds,
    toggleHolding,
    toggleAll,
    allSelected,
    someSelected,
    preHarvest,
    postHarvest,
    postCapitalGains,
    taxesSaved,
    showSavings,
    reload,
  } = useHarvesting();

  return (
    <main className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
      <Disclosure />

      {status === "loading" && <Loader />}

      {status === "error" && <ErrorState message={errorMessage ?? "Unknown error."} onRetry={() => reload()} />}

      {status === "success" && (
        <div className="flex flex-col gap-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <SummaryCard
              variant="before"
              eyebrow="Before"
              heading="Before harvesting"
              capitalGains={BASE_CAPITAL_GAINS}
              totals={preHarvest}
              totalLabel="Realised capital gains"
              helperText="Your position today, with no changes made."
            />
            <SummaryCard
              variant="after"
              eyebrow="After"
              heading="After harvesting"
              capitalGains={postCapitalGains ?? BASE_CAPITAL_GAINS}
              totals={postHarvest}
              totalLabel="Effective capital gains"
              helperText="Recalculated the moment you check a holding below."
            />
          </div>

          <SavingsBanner show={showSavings} amount={taxesSaved} hasSelection={selectedIds.size > 0} />

          <HoldingsTable
            holdings={holdings}
            selectedIds={selectedIds}
            onToggle={toggleHolding}
            onToggleAll={toggleAll}
            allSelected={allSelected}
            someSelected={someSelected}
          />
        </div>
      )}
    </main>
  );
}

export default function App() {
  return (
    <HarvestingProvider>
      <div className="min-h-screen">
        <Header taxYear="FY 2025-26" />
        <HarvestingScreen />
        <DevTools />
      </div>
    </HarvestingProvider>
  );
}
