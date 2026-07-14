export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-husk-700 bg-husk-900/60 py-24 text-center">
      <span
        className="h-9 w-9 animate-spin rounded-full border-2 border-husk-600 border-t-gold-500"
        role="status"
        aria-label="Loading"
      />
      <div>
        <p className="font-body text-sm font-medium text-husk-100">Gathering your holdings</p>
        <p className="mt-1 font-body text-xs text-husk-400">Pulling live prices and cost basis…</p>
      </div>
    </div>
  );
}
