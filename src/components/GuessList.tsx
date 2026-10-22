import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { characterById } from "../data/characters";
import Portrait from "./Portrait";

/** Simple guess list for modes without attribute tiles (Quote, Emoji): green = right, red = wrong, newest on top. */
export default function GuessList({ guesses, answerId, newestId }: { guesses: string[]; answerId: string; newestId: string | null }) {
  const rows = [...guesses].reverse();
  return (
    <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
      <AnimatePresence initial={false}>
        {rows.map((id) => {
          const c = characterById.get(id);
          if (!c) return null;
          const hit = id === answerId;
          return (
            <motion.li
              key={id}
              layout
              initial={id === newestId ? { opacity: 0, x: -16 } : false}
              animate={{ opacity: 1, x: 0 }}
              className={`tile flex items-center gap-3 py-1.5 pr-3 pl-1.5 text-white ${hit ? "tile-correct" : "tile-wrong"}`}
              aria-label={`${c.name}: ${hit ? "correct" : "wrong"}`}
            >
              <span className="tile size-10 shrink-0 overflow-hidden">
                <Portrait character={c} fill />
              </span>
              <span className="min-w-0 flex-1 truncate font-semibold tracking-wide uppercase">{c.name}</span>
              {hit ? <Check size={18} /> : <X size={18} />}
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
