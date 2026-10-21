import { useEffect, useState } from "react";
import { formatCountdown, msUntilReset } from "../lib/daily";
import type { Character } from "../types";
import Modal from "./Modal";
import Portrait from "./Portrait";

const DAY = 86_400_000;

/** Radial gauge: the arc shows how much of today is left until the reset. */
function ResetGauge() {
  const [ms, setMs] = useState(() => msUntilReset());
  useEffect(() => {
    const t = setInterval(() => setMs(msUntilReset()), 1000);
    return () => clearInterval(t);
  }, []);
  const r = 84;
  const c = 2 * Math.PI * r;
  const left = ms / DAY;
  const ticks = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2 - Math.PI / 2;
    const r1 = 96;
    const r2 = i % 6 === 0 ? 88 : 92;
    return <line key={i} x1={Math.cos(a) * r1} y1={Math.sin(a) * r1} x2={Math.cos(a) * r2} y2={Math.sin(a) * r2} />;
  });

  return (
    <div className="relative mx-auto grid size-56 place-items-center">
      <svg viewBox="-100 -100 200 200" className="absolute inset-0 size-full -rotate-90">
        <g stroke="var(--color-holo)" strokeOpacity={0.6} strokeWidth={1}>{ticks}</g>
        <circle r={r} fill="none" stroke="var(--color-holo)" strokeOpacity={0.12} strokeWidth={6} />
        <circle
          r={r}
          fill="none"
          stroke="var(--color-amber)"
          strokeWidth={6}
          strokeDasharray={`${c * left} ${c}`}
          style={{ filter: "drop-shadow(0 0 6px rgb(255 181 71 / 0.7))", transition: "stroke-dasharray 1s linear" }}
        />
        <circle r={70} fill="none" stroke="var(--color-holo)" strokeOpacity={0.25} strokeDasharray="1 5" />
      </svg>
      <div className="text-center">
        <div className="label text-[8px]">Time to reset</div>
        <div className="mt-1 font-hud text-[26px] tabular-nums text-ice" style={{ textShadow: "0 0 12px rgb(127 232 255 / 0.5)" }}>
          {formatCountdown(ms)}
        </div>
        <div className="mt-1 font-mono text-[10px] text-holo/60">RESETS 00:00 CET</div>
      </div>
    </div>
  );
}

export default function CountdownModal({ open, onClose, yesterday }: { open: boolean; onClose: () => void; yesterday: Character }) {
  return (
    <Modal open={open} title="Next target" code="DAILY CYCLE" onClose={onClose}>
      <ResetGauge />
      <div className="mt-5 flex items-center gap-3 border-t border-holo/15 pt-4">
        <span className="tile block size-12 shrink-0 overflow-hidden shadow-[inset_0_0_0_1px_rgb(127_232_255/0.4)]">
          <Portrait character={yesterday} fill />
        </span>
        <div>
          <div className="label text-[8px]">Yesterday's target</div>
          <div className="mt-1 text-lg font-bold tracking-wide text-ice uppercase">{yesterday.name}</div>
        </div>
      </div>
    </Modal>
  );
}
