export function PostHeaderBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="hero-grid-tight absolute inset-0" />
      <div className="hero-glow-soft absolute -left-12 -top-16 h-[420px] w-[420px] rounded-full md:-left-8 md:-top-12" />
    </div>
  );
}
