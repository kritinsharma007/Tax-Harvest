interface HeaderProps {
  taxYear: string;
}

export function Header({ taxYear }: HeaderProps) {
  return (
    <header className="mx-auto max-w-6xl px-4 pb-10 pt-12 sm:px-6 sm:pt-16">
      <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-500/90">
        Portfolio · {taxYear}
      </p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl font-medium leading-tight text-husk-50 sm:text-5xl">
        Harvest your losses, <span className="italic text-gold-400">keep more gains.</span>
      </h1>
      <p className="mt-4 max-w-xl font-body text-sm leading-relaxed text-husk-300 sm:text-base">
        Check off the holdings you'd sell today and watch your taxable gains move in real time — before you place a
        single order.
      </p>
    </header>
  );
}
