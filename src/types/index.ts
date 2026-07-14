/** A gain/loss figure tied to a specific holding period bucket. */
export interface GainBucket {
  /** Quantity of the coin that falls into this bucket. */
  balance: number;
  /** Net gain (positive) or loss (negative) for that quantity, in INR. */
  gain: number;
}

/** A single wallet holding, as returned by the Holdings API. */
export interface Holding {
  /** Stable client-side identity, assigned once when the API response is
   * first read. Two holdings can legitimately share a `coin` symbol (e.g.
   * native USDC vs. bridged USDC), so `coin` alone is not a safe key. */
  id: string;
  coin: string;
  coinName: string;
  logo: string;
  currentPrice: number;
  totalHolding: number;
  averageBuyPrice: number;
  stcg: GainBucket;
  ltcg: GainBucket;
}

/** Aggregate profit/loss totals for one holding-period bucket. */
export interface GainLossTotals {
  profits: number;
  losses: number;
}

/** Shape returned by the Capital Gains API. */
export interface CapitalGains {
  stcg: GainLossTotals;
  ltcg: GainLossTotals;
}

/** Derived, ready-to-render totals for a capital gains card. */
export interface NetGains {
  netShortTerm: number;
  netLongTerm: number;
  /** netShortTerm + netLongTerm */
  realised: number;
}

export type AsyncStatus = "idle" | "loading" | "success" | "error";
