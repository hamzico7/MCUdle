import { BarChart3, CircleHelp, Timer } from "lucide-react";

interface Props {
  onHelp: () => void;
  onCountdown: () => void;
  onStats: () => void;
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid size-10 place-items-center rounded-xl border border-line bg-panel/70 text-muted transition hover:border-gold/60 hover:text-gold active:scale-95"
    >
      {children}
    </button>
  );
}

export default function Header({ onHelp, onCountdown, onStats }: Props) {
  return (
    <header className="flex items-center justify-between gap-3 pt-5 pb-4">
      <IconButton label="How to play" onClick={onHelp}>
        <CircleHelp size={20} />
      </IconButton>

      {/* Original wordmark: italic MCU with a slanted gold bar + DLE badge */}
      <h1 className="flex items-end gap-2 select-none" aria-label="MCUDLE">
        <span className="relative font-display text-[2.6rem] leading-none italic tracking-tight text-white">
          MCU
          <span aria-hidden className="absolute -bottom-1.5 left-1 right-0 h-[5px] -skew-x-[20deg] rounded-sm bg-gold" />
        </span>
        <span className="mb-0.5 rounded-md border border-gold/50 bg-gold/10 px-2 py-0.5 text-sm font-bold tracking-[0.4em] text-gold">
          DLE
        </span>
      </h1>

      <div className="flex gap-2">
        <IconButton label="Next character countdown" onClick={onCountdown}>
          <Timer size={20} />
        </IconButton>
        <IconButton label="Statistics" onClick={onStats}>
          <BarChart3 size={20} />
        </IconButton>
      </div>
    </header>
  );
}
