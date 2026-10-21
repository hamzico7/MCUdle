import { motion } from "framer-motion";
import { BUCKETS, type Bucket, type Stats } from "../lib/storage";
import Countdown from "./Countdown";
import Modal from "./Modal";

interface Props {
  open: boolean;
  onClose: () => void;
  stats: Stats;
  todayBucket: Bucket | null; // highlight today's bar after a win
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="tile tile-neutral px-1 py-2.5 text-center">
      <div className="font-hud text-[22px] leading-none text-ice">{value}</div>
      <div className="mt-1.5 font-mono text-[10px] leading-tight text-holo/70 uppercase">{label}</div>
    </div>
  );
}

export default function StatsModal({ open, onClose, stats, todayBucket }: Props) {
  const winPct = stats.played ? Math.round((stats.wins / stats.played) * 100) : 0;

  return (
    <Modal open={open} title="Diagnostics" code="PILOT PERFORMANCE // LOCAL" onClose={onClose}>
      <div className="grid grid-cols-4 gap-1.5">
        <Stat value={stats.played} label="Played" />
        <Stat value={winPct} label="Win %" />
        <Stat value={stats.currentStreak} label="Streak" />
        <Stat value={stats.maxStreak} label="Best" />
      </div>

      <div className="label mt-6 mb-3">Guesses to win</div>
      <div className="space-y-2">
        {BUCKETS.map((b, i) => {
          const count = stats.distribution[b];
          // bar length relative to total wins; small minimum so the count always fits
          const pct = stats.wins ? (count / stats.wins) * 100 : 0;
          const isToday = b === todayBucket;
          return (
            <div key={b} className="flex items-center gap-2.5">
              <span className="w-6 text-right font-hud text-[11px] text-ice">{b}</span>
              <div className="relative h-6 flex-1 bg-holo/5 shadow-[inset_0_0_0_1px_rgb(127_232_255/0.12)]">
                <motion.div
                  className={`absolute inset-y-0 left-0 flex items-center justify-end px-2 font-mono text-[12px] ${
                    isToday ? "bg-amber text-void" : count ? "bg-holo/80 text-void" : "text-holo/50"
                  }`}
                  style={{
                    boxShadow: isToday ? "0 0 14px rgb(255 181 71 / 0.6)" : count ? "0 0 10px rgb(127 232 255 / 0.35)" : undefined,
                    backgroundImage: count ? "repeating-linear-gradient(90deg, transparent 0 6px, rgb(0 0 0 / 0.18) 6px 7px)" : undefined,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(pct, 9)}%` }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.6, ease: "easeOut" }}
                >
                  {count}
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-holo/15 pt-4">
        <span className="label">Next target</span>
        <Countdown className="font-hud text-xl text-amber" />
      </div>
    </Modal>
  );
}
