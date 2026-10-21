import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

interface Props {
  open: boolean;
  title: string;
  code?: string; // tiny readout next to the title
  onClose: () => void;
  children: React.ReactNode;
}

/** HUD window: scales in from depth with a blur, like a widget expanding toward the viewer. */
export default function Modal({ open, title, code, onClose, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-void/75 p-3 backdrop-blur-[3px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="hud-panel scroll-thin max-h-[88vh] w-full max-w-md overflow-y-auto shadow-[0_0_60px_rgb(127_232_255/0.12)]"
            initial={{ scale: 0.86, opacity: 0, filter: "blur(8px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 0.94, opacity: 0, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="brackets" />
            <div className="flex items-center justify-between border-b border-holo/20 px-5 pt-4 pb-3">
              <div>
                <h2 className="m-0 font-hud text-[13px] tracking-[0.25em] text-ice uppercase">{title}</h2>
                {code && <div className="mt-1 font-mono text-[10px] text-holo/55">{code}</div>}
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="tile grid size-9 place-items-center text-holo shadow-[inset_0_0_0_1px_rgb(127_232_255/0.3)] transition hover:bg-holo/15 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
