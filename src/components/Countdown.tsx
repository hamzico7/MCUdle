import { useEffect, useState } from "react";
import { formatCountdown, msUntilReset } from "../lib/daily";

/** Live HH:MM:SS until the next midnight in Swiss time. */
export default function Countdown({ className = "" }: { className?: string }) {
  const [ms, setMs] = useState(() => msUntilReset());
  useEffect(() => {
    const t = setInterval(() => setMs(msUntilReset()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className={`tabular-nums ${className}`} aria-live="off">
      {formatCountdown(ms)}
    </span>
  );
}
