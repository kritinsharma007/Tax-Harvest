import type { CapitalGains, GainLossTotals, Holding, NetGains } from "../types";

/**
 * Net gains derivation, shared by both the "Before" and "After" cards:
 *
 *   Net Short Term Gains = stcg.profits - stcg.losses
 *   Net Long Term Gains  = ltcg.profits - ltcg.losses
 *   Realised Capital Gains = Net Short Term Gains + Net Long Term Gains
 */
export function computeNetGains(cg: CapitalGains): NetGains {
  const netShortTerm = cg.stcg.profits - cg.stcg.losses;
  const netLongTerm = cg.ltcg.profits - cg.ltcg.losses;
  return {
    netShortTerm,
    netLongTerm,
    realised: netShortTerm + netLongTerm,
  };
}

function addHoldingToBucket(bucket: GainLossTotals, gain: number): GainLossTotals {
  if (gain > 0) {
    return { ...bucket, profits: bucket.profits + gain };
  }
  if (gain < 0) {
    return { ...bucket, losses: bucket.losses + Math.abs(gain) };
  }
  return bucket;
}

/**
 * Folds every selected holding's realised gain/loss into a copy of the base
 * Capital Gains figures, per the harvesting rule:
 *   - gain > 0  -> added to that bucket's profits
 *   - gain < 0  -> its magnitude is added to that bucket's losses
 *   - gain == 0 -> no effect
 *
 * `base` (the API response) is never mutated.
 */
export function applyHarvestSelection(
  base: CapitalGains,
  holdings: Holding[],
  selectedIds: ReadonlySet<string>
): CapitalGains {
  let stcg = base.stcg;
  let ltcg = base.ltcg;

  for (const holding of holdings) {
    if (!selectedIds.has(holding.id)) continue;
    stcg = addHoldingToBucket(stcg, holding.stcg.gain);
    ltcg = addHoldingToBucket(ltcg, holding.ltcg.gain);
  }

  return { stcg, ltcg };
}
