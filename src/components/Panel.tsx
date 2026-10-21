/** Glass HUD panel with cut corners, corner brackets and an optional label tab. */
export default function Panel({
  label,
  right,
  children,
  className = "",
}: {
  label?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`hud-frame ${className}`}>
      <span aria-hidden className="hud-bg">
        <span className="glass" />
        <span className="brackets" />
      </span>
      {(label || right) && (
        <div className="flex items-center justify-between gap-3 border-b border-holo/15 px-4 pt-2.5 pb-2">
          {label && (
            <span className="label flex items-center gap-2">
              <span className="inline-block size-1.5 bg-holo glow-line" />
              {label}
            </span>
          )}
          {right && <span className="font-mono text-[11px] text-holo/70">{right}</span>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}
