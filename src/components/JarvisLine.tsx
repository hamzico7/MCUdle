import { useEffect, useState } from "react";

const reducedMotion = () => !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** J.A.R.V.I.S. status line that types itself out — the HUD's "voice". Remount (key) to retype. */
export default function JarvisLine({ text, tone = "holo" }: { text: string; tone?: "holo" | "amber" | "hit" }) {
  const [count, setCount] = useState(() => (reducedMotion() ? text.length : 0));

  useEffect(() => {
    if (count >= text.length) return;
    const t = setTimeout(() => setCount((c) => c + 1), 18);
    return () => clearTimeout(t);
  }, [count, text.length]);

  const color = tone === "amber" ? "text-amber" : tone === "hit" ? "text-hit-glow" : "text-holo";

  return (
    <p className={`m-0 flex min-h-5 items-start gap-2 font-mono text-[12.5px] leading-snug ${color}`} aria-live="polite">
      <span className="shrink-0 opacity-60">J.A.R.V.I.S. &gt;</span>
      <span>
        {text.slice(0, count)}
        <span className="caret ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-current" />
      </span>
    </p>
  );
}
