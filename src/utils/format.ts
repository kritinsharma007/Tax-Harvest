const inrFull = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

/**
 * Renders the decimal part of a sub-1 rupee amount with enough precision to
 * stay meaningful (several fixture prices/gains — e.g. GONE, PIG, TITAN —
 * are worth a fraction of a paisa, and would otherwise all read as "0.00").
 */
function smallAmountString(absValue: number): string {
  if (absValue === 0) return "0.00";
  if (absValue >= 0.01) return absValue.toFixed(2);
  if (absValue >= 0.0001) return absValue.toFixed(6);
  return absValue.toFixed(8);
}

/** Full, non-abbreviated rupee formatting — used for headline totals. */
export function formatINR(value: number): string {
  const abs = Math.abs(value);
  if (abs > 0 && abs < 1) {
    return `${value < 0 ? "-" : ""}₹${smallAmountString(abs)}`;
  }
  return inrFull.format(value);
}

/**
 * Compact rupee formatting using Indian numbering (K / L / Cr).
 *
 * Deliberately hand-rolled rather than `Intl.NumberFormat(..., { notation:
 * "compact" })`: that API renders en-IN thousands as "T" in some browser
 * engines (Chromium) and "K" in others (Node), and "T" reads as "trillion"
 * to virtually every user — a real mislabelling risk for a tax tool. Manual
 * suffixes are consistent everywhere.
 */
export function formatINRCompact(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (abs < 1000) return formatINR(value);
  if (abs < 100000) return `${sign}₹${(abs / 1000).toFixed(2)}K`;
  if (abs < 10000000) return `${sign}₹${(abs / 100000).toFixed(2)}L`;
  return `${sign}₹${(abs / 10000000).toFixed(2)}Cr`;
}

/** Formats a coin quantity, trimming noise from floating point holdings
 * (e.g. 3.469446951953614e-17) down to a readable number of decimals. */
export function formatQuantity(value: number): string {
  if (value === 0) return "0";
  const abs = Math.abs(value);

  if (abs < 0.0001) {
    return value.toExponential(2);
  }

  const decimals = abs >= 1 ? 4 : 6;
  const fixed = value.toFixed(decimals);
  // strip trailing zeros but keep at least one decimal digit
  return fixed.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
}

/** Prices span from ~1e-7 (dust tokens) to ~2 lakh (ETH) in the fixture, so
 * this routes big and small prices to whichever formatter keeps them legible. */
export function formatPrice(value: number): string {
  if (Math.abs(value) >= 1000) return formatINRCompact(value);
  return formatINR(value);
}
