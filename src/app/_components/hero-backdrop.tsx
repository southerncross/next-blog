export function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="hero-grid absolute inset-0" />
      <div className="hero-glow absolute -left-24 -top-24 h-[640px] w-[640px] rounded-full md:-left-16 md:-top-16" />
    </div>
  );
}
