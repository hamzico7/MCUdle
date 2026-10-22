import { Flag, Lock } from "lucide-react";

/** Wrong guesses needed before GIVE UP appears. */
export const GIVE_UP_AFTER = 10;
/** From this many wrong guesses on, show how many are left until GIVE UP. */
const HINT_FROM = 6;

/**
 * Small readout next to the J.A.R.V.I.S. line:
 * nothing → "GIVE UP IN 4" (from the 6th wrong guess) → GIVE UP button (from the 10th).
 */
export default function GiveUp({ wrong, onGiveUp }: { wrong: number; onGiveUp: () => void }) {
  if (wrong < HINT_FROM) return null;

  if (wrong < GIVE_UP_AFTER) {
    const left = GIVE_UP_AFTER - wrong;
    return (
      <span className="flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-holo/45" title={`Give up unlocks after ${GIVE_UP_AFTER} guesses`}>
        <Lock size={11} /> GIVE UP IN {left}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onGiveUp}
      className="tile flex h-8 shrink-0 items-center gap-1.5 bg-miss/20 px-2.5 font-mono text-[11px] text-ice shadow-[inset_0_0_0_1px_rgb(198_40_40/0.7)] transition hover:bg-miss hover:text-white active:scale-95"
    >
      <Flag size={12} /> GIVE UP
    </button>
  );
}
