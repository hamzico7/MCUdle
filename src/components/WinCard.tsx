import { motion } from "framer-motion";
import { Check, Share2 } from "lucide-react";
import { useState } from "react";
import type { Character } from "../types";
import Countdown from "./Countdown";
import Portrait from "./Portrait";

interface Props {
  answer: Character;
  guessCount: number;
  shareText: string;
  delay: number; // wait for the tiles to finish flipping
  nextLive?: boolean; // midnight already passed, the next target is out
}

/** Target-lock reticle that snaps onto the portrait. */
function LockReticle() {
  return (
    <motion.svg
      viewBox="-60 -60 120 120"
      className="pointer-events-none absolute -inset-3 size-[calc(100%+1.5rem)]"
      initial={{ scale: 1.6, opacity: 0, rotate: -45 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 16 }}
    >
      <g fill="none" stroke="var(--color-amber)" strokeWidth={2.5} style={{ filter: "drop-shadow(0 0 4px rgb(255 181 71 / 0.8))" }}>
        <path d="M -56 -36 V -56 H -36" />
        <path d="M 36 -56 H 56 V -36" />
        <path d="M 56 36 V 56 H 36" />
        <path d="M -36 56 H -56 V 36" />
      </g>
      <circle r={57} fill="none" stroke="var(--color-amber)" strokeOpacity={0.35} strokeDasharray="2 6" className="spin-fast" />
    </motion.svg>
  );
}

export default function WinCard({ answer, guessCount, shareText, delay, nextLive }: Props) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    try {
      if (navigator.share && /Android|iPhone|iPad/i.test(navigator.userAgent)) {
        await navigator.share({ text: shareText });
        return;
      }
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* user cancelled or clipboard blocked */
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ delay, duration: 0.45 }}
      className="hud-panel"
      style={{ borderColor: "rgb(255 181 71 / 0.45)" }}
    >
      <span className="brackets" style={{ ["--b" as string]: "var(--color-amber)" }} />
      <div className="flex items-center justify-between border-b border-amber/25 px-4 pt-2.5 pb-2">
        <span className="label flex items-center gap-2 text-amber">
          <span className="inline-block size-1.5 bg-amber" />
          Identity confirmed
        </span>
        <span className="font-mono text-[11px] text-amber/80">{guessCount} {guessCount === 1 ? "SCAN" : "SCANS"}</span>
      </div>

      <div className="flex items-center gap-5 p-4 pl-6">
        <div className="relative size-20 shrink-0">
          <span className="tile block size-full overflow-hidden">
            <Portrait character={answer} fill />
          </span>
          <LockReticle />
        </div>
        <div className="min-w-0">
          <div className="truncate font-hud text-[17px] leading-tight tracking-wider text-white uppercase">{answer.name}</div>
          {answer.alias && <div className="mt-1 truncate font-mono text-[12px] text-holo/70">{answer.alias}</div>}
          <div className="mt-1.5 text-[13px] text-ice/70">First seen in {answer.debut}</div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-amber/20 px-4 py-3">
        <div className="font-mono text-[12px] text-holo/70">
          {nextLive ? <span className="text-amber">NEXT TARGET LIVE</span> : <>NEXT TARGET <Countdown className="text-amber" /></>}
        </div>
        <button
          type="button"
          onClick={share}
          className="tile flex h-10 items-center gap-2 bg-amber px-4 font-hud text-[10px] tracking-[0.2em] text-void transition hover:bg-white hover:shadow-[0_0_20px_rgb(255_181_71/0.6)] active:scale-95"
        >
          {copied ? <Check size={15} /> : <Share2 size={15} />}
          {copied ? "COPIED" : "SHARE"}
        </button>
      </div>
    </motion.section>
  );
}
