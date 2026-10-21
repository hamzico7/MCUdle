import { ArrowDown, ArrowUp } from "lucide-react";
import Modal from "./Modal";

const Swatch = ({ className, children }: { className: string; children?: React.ReactNode }) => (
  <span className={`inline-grid size-7 shrink-0 place-items-center rounded-md text-white ${className}`}>{children}</span>
);

export default function HowToPlayModal({ open, onClose, total }: { open: boolean; onClose: () => void; total: number }) {
  return (
    <Modal open={open} title="How to play" onClose={onClose}>
      <div className="space-y-4 text-sm leading-relaxed text-[#cfd6ee]">
        <p>
          Guess today's secret <b className="text-white">MCU character</b>. Pick anyone from the list — each guess shows
          how close you are. Unlimited guesses, one character per day.
        </p>

        <div className="space-y-2 rounded-xl border border-line bg-panel-2/60 p-3">
          <div className="flex items-center gap-3"><Swatch className="bg-hit" />Exact match</div>
          <div className="flex items-center gap-3"><Swatch className="bg-miss" />Not a match</div>
          <div className="flex items-center gap-3">
            <Swatch className="bg-miss"><ArrowUp size={16} /></Swatch>Answer debuted in a <b className="text-white">later</b> phase
          </div>
          <div className="flex items-center gap-3">
            <Swatch className="bg-miss"><ArrowDown size={16} /></Swatch>Answer debuted in an <b className="text-white">earlier</b> phase
          </div>
        </div>

        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5">
          <dt className="font-semibold text-white">Gender</dt><dd>Male / Female</dd>
          <dt className="font-semibold text-white">Species</dt><dd>Human, Mutant, Asgardian, Kree, Skrull, Eternal, Alien…</dd>
          <dt className="font-semibold text-white">Status</dt><dd>Alive / Deceased / Unknown (missing, in limbo) — as of the latest release</dd>
          <dt className="font-semibold text-white">Power</dt>
          <dd>
            Technology, Super Soldier, Magic, Cosmic, Gamma, Divine, Peak Human, None — and Biological (body changed by
            a bite, a mutation, an experiment or the heart-shaped herb)
          </dd>
          <dt className="font-semibold text-white">Affiliation</dt><dd>Main team or faction</dd>
          <dt className="font-semibold text-white">Debut</dt><dd>MCU phase of their first Marvel Studios appearance</dd>
        </dl>

        <p className="text-muted">
          New character every day at <b className="text-white">midnight Swiss time</b> (CET/CEST). Same character for
          everyone. {total} characters in the pool.
        </p>
      </div>
    </Modal>
  );
}
