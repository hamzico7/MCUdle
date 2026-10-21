import { motion } from "framer-motion";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { TileResult } from "../types";

interface Props {
  result?: TileResult; // undefined = neutral (portrait tile)
  children: React.ReactNode;
  index: number; // column, for the stagger
  animate: boolean; // only the newest row flips
  label: string; // for screen readers
  bare?: boolean; // render children edge-to-edge (portrait tile)
}

const COLORS: Record<TileResult, string> = {
  correct: "bg-hit border-green-400/40",
  wrong: "bg-miss border-red-400/30",
  higher: "bg-miss border-red-400/30",
  lower: "bg-miss border-red-400/30",
};

export const TILE_STAGGER = 0.28;

export default function Tile({ result, children, index, animate, label, bare }: Props) {
  const color = result ? COLORS[result] : "bg-panel-2 border-line";

  return (
    <motion.div
      aria-label={label}
      initial={animate ? { rotateX: -90, opacity: 0 } : false}
      animate={{ rotateX: 0, opacity: 1 }}
      transition={{ delay: animate ? index * TILE_STAGGER : 0, duration: 0.42, ease: [0.2, 0.7, 0.3, 1] }}
      style={{ transformPerspective: 600 }}
      className={`tile-face tile-size tile-text relative grid shrink-0 place-items-center overflow-hidden rounded-lg border text-center font-semibold leading-tight text-white shadow-[inset_0_-3px_0_rgb(0_0_0/0.25)] sm:rounded-xl ${bare ? "p-0" : "p-0.5"} ${color}`}
    >
      {(result === "higher" || result === "lower") && (
        <span aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center text-white/20">
          {result === "higher" ? (
            <ArrowUp className="size-[85%]" strokeWidth={3} />
          ) : (
            <ArrowDown className="size-[85%]" strokeWidth={3} />
          )}
        </span>
      )}
      {bare ? children : <span className="relative break-words hyphens-auto">{children}</span>}
    </motion.div>
  );
}
