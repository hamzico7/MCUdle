import { BarChart3, CircleHelp, House, Timer } from "lucide-react";
import Logo from "./Logo";

interface Props {
  onHome: () => void;
  onHelp: () => void;
  onCountdown?: () => void;
  onStats?: () => void;
}

export function HudButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="tile group relative grid size-9 shrink-0 place-items-center sm:size-10 bg-deep/80 text-holo shadow-[inset_0_0_0_1px_rgb(127_232_255/0.35)] transition hover:bg-holo/15 hover:text-white hover:shadow-[inset_0_0_0_1px_rgb(127_232_255/0.9),0_0_16px_rgb(127_232_255/0.35)] active:scale-95"
    >
      {children}
    </button>
  );
}

/** Top bar inside a game mode: home on the left, logo in the middle, tools on the right. */
export default function Header({ onHome, onHelp, onCountdown, onStats }: Props) {
  return (
    <header className="flex items-center justify-between gap-2 pt-5 pb-5">
      <div className="flex w-[7.5rem] gap-1.5 sm:w-[8.5rem] sm:gap-2">
        <HudButton label="Home" onClick={onHome}>
          <House size={19} strokeWidth={1.75} />
        </HudButton>
      </div>

      <button type="button" onClick={onHome} aria-label="Back to home" className="m-0 cursor-pointer">
        <Logo height={30} />
      </button>

      <div className="flex w-[7.5rem] justify-end gap-1.5 sm:w-[8.5rem] sm:gap-2">
        <HudButton label="How to play" onClick={onHelp}>
          <CircleHelp size={19} strokeWidth={1.75} />
        </HudButton>
        {onCountdown && (
          <HudButton label="Next character countdown" onClick={onCountdown}>
            <Timer size={19} strokeWidth={1.75} />
          </HudButton>
        )}
        {onStats && (
          <HudButton label="Statistics" onClick={onStats}>
            <BarChart3 size={19} strokeWidth={1.75} />
          </HudButton>
        )}
      </div>
    </header>
  );
}
