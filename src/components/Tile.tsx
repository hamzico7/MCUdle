import { motion } from "framer-motion";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import type { TileResult } from "../types";

interface Props {
  result?: TileResult; // undefined = neutral (portrait tile)
  children: React.ReactNode;
  index: number; // column, for the stagger
  animate: boolean; // only the newest row flips in
  label: string; // for screen readers
  bare?: boolean; // render children edge-to-edge (portrait tile)
}

const CLASS: Record<TileResult, string> = {
  correct: "tile-correct",
  partial: "tile-partial",
  wrong: "tile-wrong",
  higher: "tile-wrong",
  lower: "tile-wrong",
};

export const TILE_STAGGER = 0.26;

export default function Tile({ result, children, index, animate, label, bare }: Props) {
  return (
    <motion.div
      aria-label={label}
      initial={animate ? { rotateX: -90, opacity: 0, scale: 1.15, filter: "blur(6px) brightness(2)" } : false}
      animate={{ rotateX: 0, opacity: 1, scale: 1, filter: "blur(0px) brightness(1)" }}
      transition={{ delay: animate ? index * TILE_STAGGER : 0, duration: 0.45, ease: [0.2, 0.7, 0.3, 1] }}
      style={{ transformPerspective: 600 }}
      className={`tile tile-size tile-text relative grid shrink-0 place-items-center overflow-hidden text-center leading-[1.05] font-bold tracking-wide text-white uppercase ${
        bare ? "p-0" : "p-1"
      } ${result ? CLASS[result] : "tile-neutral"}`}
    >
      {(result === "higher" || result === "lower") && (
        <span aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center text-white/15">
          {result === "higher" ? (
            <ChevronsUp className="size-[95%]" strokeWidth={2.5} />
          ) : (
            <ChevronsDown className="size-[95%]" strokeWidth={2.5} />
          )}
        </span>
      )}
      {bare ? children : <span className="relative break-words hyphens-auto">{children}</span>}
    </motion.div>
  );
}
