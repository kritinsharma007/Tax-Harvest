import type { CapitalGains } from "../types";

const SIMULATED_LATENCY_MS = 700;

/** Matches the "Capital Gains API" dummy response in the assignment brief. */
const CAPITAL_GAINS_FIXTURE: CapitalGains = {
  stcg: {
    profits: 70200.88,
    losses: 1548.53,
  },
  ltcg: {
    profits: 5020,
    losses: 3050,
  },
};

/**
 * Stand-in for `GET /api/capital-gains`. See `holdingsApi.ts` for the same
 * mocking approach and the `simulateError` escape hatch.
 */
export function fetchCapitalGains(options?: { simulateError?: boolean }): Promise<CapitalGains> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (options?.simulateError) {
        reject(new Error("Could not load your capital gains. Please try again."));
        return;
      }
      resolve(CAPITAL_GAINS_FIXTURE);
    }, SIMULATED_LATENCY_MS);
  });
}
