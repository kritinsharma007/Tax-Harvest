interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-wine-600/50 bg-wine-500/10 py-20 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wine-500/20 text-wine-400">
        !
      </div>
      <div>
        <p className="font-body text-sm font-medium text-husk-100">Couldn't load your portfolio</p>
        <p className="mx-auto mt-1 max-w-sm font-body text-xs text-husk-300">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="mt-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-2 font-body text-xs font-semibold text-gold-400 transition-colors hover:bg-gold-500/20"
      >
        Try again
      </button>
    </div>
  );
}
