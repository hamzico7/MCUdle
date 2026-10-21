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
    <div className="text-center">
      <div className="font-display text-3xl text-white">{value}</div>
      <div className="text-[11px] leading-tight text-muted uppercase">{label}</div>
    </div>
  );
}

export default function StatsModal({ open, onClose, stats, todayBucket }: Props) {
  const winPct = stats.played ? Math.round((stats.wins / stats.played) * 100) : 0;

  return (
    <Modal open={open} title="Statistics" onClose={onClose}>
      <div className="grid grid-cols-4 gap-2">
        <Stat value={stats.played} label="Played" />
        <Stat value={winPct} label="Win %" />
        <Stat value={stats.currentStreak} label="Current streak" />
        <Stat value={stats.maxStreak} label="Max streak" />
      </div>

      <h3 className="mt-6 mb-2 text-xs font-semibold tracking-wider text-muted uppercase">Guesses to win</h3>
      <div className="space-y-1.5">
        {BUCKETS.map((b) => {
          const count = stats.distribution[b];
          // bar length is relative to total wins (min width so the number always fits)
          const pct = stats.wins ? (count / stats.wins) * 100 : 0;
          const isToday = b === todayBucket;
          return (
            <div key={b} className="flex items-center gap-2">
              <span className="w-6 text-right text-sm font-semibold text-white">{b}</span>
              <div className="flex-1">
                <div
                  className={`flex h-6 min-w-8 items-center justify-end rounded-md px-2 text-xs font-bold transition-[width] duration-700 ${
                    isToday ? "bg-hit text-white" : count ? "bg-gold text-night" : "bg-panel-2 text-muted"
                  }`}
                  style={{ width: `${Math.max(pct, 8)}%` }}
                >
                  {count}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-line bg-panel-2/60 p-3 text-center">
        <div className="text-xs tracking-wider text-muted uppercase">Next character in</div>
        <Countdown className="font-display text-3xl text-gold" />
      </div>
    </Modal>
  );
}
