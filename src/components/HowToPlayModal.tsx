import { ChevronsDown, ChevronsUp } from "lucide-react";
import Modal from "./Modal";

const Swatch = ({ className, children }: { className: string; children?: React.ReactNode }) => (
  <span className={`tile inline-grid size-7 shrink-0 place-items-center text-white ${className}`}>{children}</span>
);

const COLUMNS: [string, string][] = [
  ["Gender", "The character's gender."],
  ["Species", "What they are, by birth or by origin."],
  ["Status", "Alive, dead or unknown, as of the latest MCU release."],
  ["Power", "Where their abilities come from."],
  ["Team", "The group or faction they belong to."],
  ["Debut", "The MCU phase of their first Marvel Studios appearance."],
];

export default function HowToPlayModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} title="Briefing" code="PROTOCOL // DAILY IDENTIFICATION" onClose={onClose}>
      <div className="flex flex-col gap-5 text-[15px] leading-snug text-ice/85">
        <p className="m-0">
          Identify today's secret <b className="text-white">MCU character</b>. Every guess is scanned and compared to the
          target. Unlimited guesses.
        </p>

        <div className="space-y-2">
          <div className="label mb-2">Readout</div>
          <div className="flex items-center gap-3"><Swatch className="tile-correct" />Exact match</div>
          <div className="flex items-center gap-3"><Swatch className="tile-partial" />Partial match — some of it is right</div>
          <div className="flex items-center gap-3"><Swatch className="tile-wrong" />No match</div>
          <div className="flex items-center gap-3">
            <Swatch className="tile-wrong"><ChevronsUp size={16} /></Swatch>Target debuted in a later phase
          </div>
          <div className="flex items-center gap-3">
            <Swatch className="tile-wrong"><ChevronsDown size={16} /></Swatch>Target debuted in an earlier phase
          </div>
        </div>

        <div>
          <div className="label mb-2">Columns</div>
          <dl className="m-0 grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-2">
            {COLUMNS.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="font-bold tracking-wide text-holo uppercase">{k}</dt>
                <dd className="m-0">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="m-0 border-t border-holo/15 pt-4 font-mono text-[12px] text-holo/70">
          New target every day at midnight (CET). Same target for everyone.
        </p>
      </div>
    </Modal>
  );
}
