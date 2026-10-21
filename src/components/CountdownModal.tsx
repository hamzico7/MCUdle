import type { Character } from "../types";
import Countdown from "./Countdown";
import Modal from "./Modal";
import Portrait from "./Portrait";

interface Props {
  open: boolean;
  onClose: () => void;
  yesterday: Character;
}

export default function CountdownModal({ open, onClose, yesterday }: Props) {
  return (
    <Modal open={open} title="Next character" onClose={onClose}>
      <div className="text-center">
        <Countdown className="block font-display text-5xl text-gold" />
        <p className="mt-2 text-sm text-muted">Resets every day at 00:00 Swiss time (CET/CEST)</p>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-xl border border-line bg-panel-2/60 p-3">
        <Portrait character={yesterday} size={48} />
        <div>
          <div className="text-xs tracking-wider text-muted uppercase">Yesterday's character</div>
          <div className="font-semibold text-white">{yesterday.name}</div>
        </div>
      </div>
    </Modal>
  );
}
