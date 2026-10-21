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
}

export default function WinCard({ answer, guessCount, shareText, delay }: Props) {
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-hit/60 bg-gradient-to-br from-hit/25 via-panel to-panel p-4"
    >
      <div className="flex items-center gap-4">
        <Portrait character={answer} size={72} rounded="rounded-xl" />
        <div className="min-w-0">
          <div className="text-xs font-semibold tracking-widest text-green-300 uppercase">You got it</div>
          <div className="truncate font-display text-2xl text-white">{answer.name}</div>
          {answer.alias && <div className="truncate text-sm text-muted">{answer.alias}</div>}
          <div className="mt-1 text-xs text-muted">First appeared in {answer.debut}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
        <div>
          <div className="text-sm text-white">
            Solved in <b>{guessCount}</b> {guessCount === 1 ? "guess" : "guesses"}
          </div>
          <div className="text-xs text-muted">
            Next in <Countdown className="font-semibold text-gold" />
          </div>
        </div>
        <button
          type="button"
          onClick={share}
          className="flex h-10 items-center gap-2 rounded-xl bg-gold px-4 font-bold text-night transition hover:brightness-110 active:scale-95"
        >
          {copied ? <Check size={18} /> : <Share2 size={18} />}
          {copied ? "Copied" : "Share"}
        </button>
      </div>
    </motion.section>
  );
}
