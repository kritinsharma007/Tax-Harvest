import type { Holding } from "../types";
import { HOLDINGS_FIXTURE } from "./holdings-fixture";

const SIMULATED_LATENCY_MS = 900;

/**
 * Stand-in for `GET /api/holdings`.
 *
 * Mocked with a `Promise` + `setTimeout` rather than a real server, per the
 * assignment's own suggestion. A stable `id` is assigned here, once, at the
 * network boundary — the UI is free to re-sort or paginate the list without
 * ever losing track of which row a checkbox belongs to.
 *
 * Pass `simulateError` to exercise the UI's error/retry path on demand
 * (wired up to the "Simulate a failed request" control in the footer).
 */
export function fetchHoldings(options?: { simulateError?: boolean }): Promise<Holding[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (options?.simulateError) {
        reject(new Error("Could not load your holdings. The portfolio service timed out."));
        return;
      }
      const withIds: Holding[] = HOLDINGS_FIXTURE.map((holding, index) => ({
        ...holding,
        id: `${holding.coin}-${index}`,
      }));
      resolve(withIds);
    }, SIMULATED_LATENCY_MS);
  });
}
