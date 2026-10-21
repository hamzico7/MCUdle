import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const LINES = ["J.A.R.V.I.S. ONLINE", "LOADING MCU ARCHIVE", "DAILY TARGET LOCKED"];

/** Short suit-up boot beat on load — the "Iron Man has arrived" moment. Skippable by tap. */
export default function BootSequence({ count }: { count: number }) {
  const [done, setDone] = useState(() => !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => setDone(true), 1700);
    return () => clearTimeout(t);
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-void"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45 } }}
          onClick={() => setDone(true)}
        >
          <div className="relative grid size-80 place-items-center">
            <svg viewBox="-100 -100 200 200" className="absolute inset-0 size-full">
              <motion.circle
                r={92}
                fill="none"
                stroke="var(--color-holo)"
                strokeWidth={1}
                initial={{ pathLength: 0, opacity: 0.2 }}
                animate={{ pathLength: 1, opacity: 0.8 }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
              />
              <motion.circle
                r={80}
                fill="none"
                stroke="var(--color-holo)"
                strokeWidth={3}
                strokeDasharray="4 6"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 90, opacity: 0.5 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <motion.path
                d="M 0 -68 A 68 68 0 0 1 58.9 34"
                fill="none"
                stroke="var(--color-amber)"
                strokeWidth={2}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, delay: 0.3 }}
              />
            </svg>
            <div className="text-center">
              {LINES.map((l, i) => (
                <motion.div
                  key={l}
                  className="label my-1.5 text-[8.5px]"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.35 }}
                >
                  {l}
                </motion.div>
              ))}
              <motion.div
                className="mt-2 font-mono text-[11px] text-holo/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                {count} PROFILES
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
