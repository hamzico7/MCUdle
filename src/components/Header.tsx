import { BarChart3, CircleHelp, Timer } from "lucide-react";
import Logo from "./Logo";

interface Props {
  onHelp: () => void;
  onCountdown: () => void;
  onStats: () => void;
}

function HudButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="tile group relative grid size-10 place-items-center bg-deep/80 text-holo shadow-[inset_0_0_0_1px_rgb(127_232_255/0.35)] transition hover:bg-holo/15 hover:text-white hover:shadow-[inset_0_0_0_1px_rgb(127_232_255/0.9),0_0_16px_rgb(127_232_255/0.35)] active:scale-95"
    >
      {children}
    </button>
  );
}

export default function Header({ onHelp, onCountdown, onStats }: Props) {
  return (
    <header className="flex items-center justify-between gap-3 pt-5 pb-5">
      <HudButton label="How to play" onClick={onHelp}>
        <CircleHelp size={19} strokeWidth={1.75} />
      </HudButton>

      <h1 className="m-0">
        <Logo height={40} />
      </h1>

      <div className="flex gap-2">
        <HudButton label="Next character countdown" onClick={onCountdown}>
          <Timer size={19} strokeWidth={1.75} />
        </HudButton>
        <HudButton label="Statistics" onClick={onStats}>
          <BarChart3 size={19} strokeWidth={1.75} />
        </HudButton>
      </div>
    </header>
  );
}
