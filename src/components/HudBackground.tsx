import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

/** Arc with tick marks, the core shape of the Stark HUD reticles. */
function TickRing({ r, ticks, long = 6, opacity = 0.4, gap = 0 }: { r: number; ticks: number; long?: number; opacity?: number; gap?: number }) {
  const lines = [];
  for (let i = 0; i < ticks; i++) {
    const a = (i / ticks) * Math.PI * 2;
    if (gap && i % gap === 0) continue;
    const len = i % 5 === 0 ? long : long / 2.2;
    const x1 = Math.cos(a) * r;
    const y1 = Math.sin(a) * r;
    const x2 = Math.cos(a) * (r - len);
    const y2 = Math.sin(a) * (r - len);
    lines.push(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />);
  }
  return (
    <g stroke="var(--color-holo)" strokeWidth={1} opacity={opacity}>
      {lines}
    </g>
  );
}

function Arc({ r, from, to, width = 1.5, opacity = 0.6, color = "var(--color-holo)" }: { r: number; from: number; to: number; width?: number; opacity?: number; color?: string }) {
  const p = (deg: number) => [Math.cos((deg * Math.PI) / 180) * r, Math.sin((deg * Math.PI) / 180) * r];
  const [x1, y1] = p(from);
  const [x2, y2] = p(to);
  const large = to - from > 180 ? 1 : 0;
  return <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`} fill="none" stroke={color} strokeWidth={width} opacity={opacity} />;
}

/**
 * Layered reticle rings behind the interface. Each layer sits on its own depth plane and
 * drifts with the pointer by a different amount (parallax), like the HUD layers around Tony's head.
 */
export default function HudBackground() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 18 });
  const sy = useSpring(my, { stiffness: 40, damping: 18 });
  const far = { x: useTransform(sx, (v) => v * 6), y: useTransform(sy, (v) => v * 6) };
  const mid = { x: useTransform(sx, (v) => v * 14), y: useTransform(sy, (v) => v * 14) };
  const near = { x: useTransform(sx, (v) => v * 26), y: useTransform(sy, (v) => v * 26) };

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, mx, my]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* deep blue atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_18%,#0b2a40_0%,#04101c_55%,#02060b_100%)]" />

      {/* far layer: big slow rings */}
      <motion.div style={far} className="absolute top-[-34vmax] left-1/2 -ml-[60vmax] size-[120vmax]">
        <svg viewBox="-500 -500 1000 1000" className="spin-slow size-full">
          <TickRing r={490} ticks={180} long={10} opacity={0.18} />
          <circle r={440} fill="none" stroke="var(--color-holo)" strokeOpacity={0.07} />
          <Arc r={470} from={200} to={250} width={2} opacity={0.25} />
          <Arc r={470} from={290} to={300} width={6} opacity={0.18} />
        </svg>
      </motion.div>

      {/* mid layer */}
      <motion.div style={mid} className="absolute top-[-22vmax] left-1/2 -ml-[40vmax] size-[80vmax]">
        <svg viewBox="-500 -500 1000 1000" className="spin-rev size-full">
          <TickRing r={470} ticks={120} gap={12} opacity={0.22} />
          <Arc r={420} from={-20} to={60} width={1} opacity={0.35} />
          <Arc r={420} from={160} to={175} width={4} opacity={0.4} color="var(--color-amber)" />
          <circle r={380} fill="none" stroke="var(--color-holo)" strokeOpacity={0.1} strokeDasharray="2 10" />
        </svg>
      </motion.div>

      {/* near layer: small fast segment ring */}
      <motion.div style={near} className="absolute top-[3vmax] left-1/2 -ml-[22vmax] size-[44vmax] opacity-60">
        <svg viewBox="-500 -500 1000 1000" className="spin-fast size-full">
          <Arc r={460} from={0} to={40} width={3} opacity={0.35} />
          <Arc r={460} from={120} to={135} width={3} opacity={0.35} />
          <Arc r={460} from={240} to={300} width={3} opacity={0.25} />
        </svg>
      </motion.div>

      {/* faint perspective grid at the bottom, like a floor plane */}
      <div
        className="absolute inset-x-0 bottom-0 h-[38vh] opacity-40"
        style={{
          background:
            "linear-gradient(rgb(127 232 255 / 0.10) 1px, transparent 1px) 0 0 / 100% 28px, linear-gradient(90deg, rgb(127 232 255 / 0.08) 1px, transparent 1px) 50% 0 / 48px 100%",
          transform: "perspective(400px) rotateX(58deg)",
          transformOrigin: "bottom",
          maskImage: "linear-gradient(transparent, black 70%)",
        }}
      />

      <div className="scanlines absolute inset-0" />
      <div className="sweep absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-holo/[0.04] to-transparent" />
      <div className="vignette absolute inset-0" />
    </div>
  );
}
