import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AsyncStatus, CapitalGains, Holding, NetGains } from "../types";
import { fetchCapitalGains } from "../api/capitalGainsApi";
import { fetchHoldings } from "../api/holdingsApi";
import { applyHarvestSelection, computeNetGains } from "../utils/calculations";

interface HarvestingContextValue {
  status: AsyncStatus;
  errorMessage: string | null;
  holdings: Holding[];
  selectedIds: Set<string>;
  toggleHolding: (id: string) => void;
  toggleAll: () => void;
  allSelected: boolean;
  someSelected: boolean;
  preHarvest: NetGains;
  postHarvest: NetGains;
  postCapitalGains: CapitalGains | null;
  taxesSaved: number;
  showSavings: boolean;
  reload: (opts?: { simulateError?: boolean }) => void;
  isDevErrorSimActive: boolean;
}

const HarvestingContext = createContext<HarvestingContextValue | null>(null);

export function HarvestingProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AsyncStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [baseCapitalGains, setBaseCapitalGains] = useState<CapitalGains | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDevErrorSimActive, setIsDevErrorSimActive] = useState(false);

  const load = useCallback((opts?: { simulateError?: boolean }) => {
    setStatus("loading");
    setErrorMessage(null);
    setIsDevErrorSimActive(Boolean(opts?.simulateError));

    Promise.all([
      fetchHoldings({ simulateError: opts?.simulateError }),
      fetchCapitalGains({ simulateError: opts?.simulateError }),
    ])
      .then(([holdingsRes, capitalGainsRes]) => {
        setHoldings(holdingsRes);
        setBaseCapitalGains(capitalGainsRes);
        setSelectedIds(new Set());
        setStatus("success");
      })
      .catch((err: Error) => {
        setErrorMessage(err.message || "Something went wrong while loading your portfolio.");
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleHolding = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === holdings.length) return new Set();
      return new Set(holdings.map((h) => h.id));
    });
  }, [holdings]);

  const postCapitalGains = useMemo(() => {
    if (!baseCapitalGains) return null;
    return applyHarvestSelection(baseCapitalGains, holdings, selectedIds);
  }, [baseCapitalGains, holdings, selectedIds]);

  const preHarvest = useMemo<NetGains>(
    () => (baseCapitalGains ? computeNetGains(baseCapitalGains) : { netShortTerm: 0, netLongTerm: 0, realised: 0 }),
    [baseCapitalGains]
  );

  const postHarvest = useMemo<NetGains>(
    () => (postCapitalGains ? computeNetGains(postCapitalGains) : { netShortTerm: 0, netLongTerm: 0, realised: 0 }),
    [postCapitalGains]
  );

  const showSavings = status === "success" && preHarvest.realised > postHarvest.realised;
  const taxesSaved = showSavings ? preHarvest.realised - postHarvest.realised : 0;

  const value: HarvestingContextValue = {
    status,
    errorMessage,
    holdings,
    selectedIds,
    toggleHolding,
    toggleAll,
    allSelected: holdings.length > 0 && selectedIds.size === holdings.length,
    someSelected: selectedIds.size > 0 && selectedIds.size < holdings.length,
    preHarvest,
    postHarvest,
    postCapitalGains,
    taxesSaved,
    showSavings,
    reload: load,
    isDevErrorSimActive,
  };

  return <HarvestingContext.Provider value={value}>{children}</HarvestingContext.Provider>;
}

export function useHarvesting(): HarvestingContextValue {
  const ctx = useContext(HarvestingContext);
  if (!ctx) throw new Error("useHarvesting must be used within a HarvestingProvider");
  return ctx;
}
