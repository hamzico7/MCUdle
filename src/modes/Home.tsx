import { motion } from "framer-motion";
import { ChevronRight, Infinity as InfinityIcon, Lock, MessageSquareQuote, ScanFace, Smile } from "lucide-react";
import Countdown from "../components/Countdown";
import JarvisLine from "../components/JarvisLine";
import Logo from "../components/Logo";
import { characters } from "../data/characters";
import { dateKey, dayNumber } from "../lib/daily";
import { loadEndless } from "../lib/endless";
import { loadDay, loadStats, type DayState } from "../lib/storage";
import type { Route } from "../lib/route";

interface Mode {
  id: string;
  route?: Route; // undefined = not built yet
  title: string;
  blurb: string;
  icon: React.ReactNode;
  status?: React.ReactNode;
}

function ModeCard({ mode, index, onOpen }: { mode: Mode; index: number; onOpen: (r: Route) => void }) {
  const locked = !mode.route;
  return (
    <motion.button
      type="button"
      disabled={locked}
      onClick={() => mode.route && onOpen(mode.route)}
      initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: 0.15 + index * 0.08, duration: 0.4 }}
      className={`hud-frame group w-full text-left transition ${locked ? "cursor-not-allowed opacity-55" : "cursor-pointer hover:-translate-y-0.5"}`}
    >
      <span aria-hidden className="hud-bg">
        <span className={`glass ${locked ? "" : "group-hover:!bg-holo/10"}`} />
        <span className="brackets" />
      </span>
      <span className="flex items-center gap-4 p-4">
        <span
          className={`tile grid size-14 shrink-0 place-items-center ${
            locked ? "bg-deep text-holo/50" : "bg-holo/10 text-holo shadow-[inset_0_0_0_1px_rgb(127_232_255/0.5)] group-hover:bg-holo group-hover:text-void"
          } transition`}
        >
          {mode.icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="font-hud text-[13px] tracking-[0.18em] text-ice uppercase">{mode.title}</span>
            {locked && (
              <span className="flex items-center gap-1 font-mono text-[10px] text-amber/80">
                <Lock size={11} /> SOON
              </span>
            )}
          </span>
          <span className="mt-1 block text-[14px] leading-snug text-ice/70">{mode.blurb}</span>
          {mode.status && <span className="mt-1.5 block font-mono text-[11px] text-holo/80">{mode.status}</span>}
        </span>
        {!locked && <ChevronRight className="shrink-0 text-holo/60 transition group-hover:translate-x-0.5 group-hover:text-holo" size={20} />}
      </span>
    </motion.button>
  );
}

export default function Home({ onOpen }: { onOpen: (r: Route) => void }) {
  const today = dateKey();
  const day = loadDay(today);
  const stats = loadStats(today);

  /** Status line for a daily mode card (Classic, Quote). */
  const dailyStatus = (d: DayState, fresh: string) =>
    d.won ? (
      <span className="text-hit-glow">
        SOLVED IN {d.guesses.length} · NEXT IN <Countdown />
      </span>
    ) : d.gaveUp ? (
      <span className="text-amber">
        REVEALED · NEXT IN <Countdown />
      </span>
    ) : d.guesses.length ? (
      <span className="text-amber">IN PROGRESS · {d.guesses.length} {d.guesses.length === 1 ? "SCAN" : "SCANS"}</span>
    ) : (
      <span>{fresh}</span>
    );
  const classicStatus = dailyStatus(day, `NEW TARGET AVAILABLE · DAY ${dayNumber(today)}`);
  const quoteStatus = dailyStatus(loadDay(today, "quote"), `NEW QUOTE AVAILABLE · #${dayNumber(today)}`);

  const endless = loadEndless();
  const endlessStatus = endless.solved || endless.guesses.length ? (
    <span>
      <span className={endless.streak ? "text-amber" : ""}>STREAK {endless.streak}</span> · BEST {endless.bestStreak}
    </span>
  ) : (
    <span>UNLIMITED ROUNDS · NO WAITING</span>
  );

  const modes: Mode[] = [
    { id: "classic", route: "classic", title: "Classic", blurb: "Guess today's MCU character.", icon: <ScanFace size={26} strokeWidth={1.6} />, status: classicStatus },
    { id: "endless", route: "endless", title: "Endless", blurb: "Unlimited rounds, a new character every time.", icon: <InfinityIcon size={26} strokeWidth={1.6} />, status: endlessStatus },
    { id: "quote", route: "quote", title: "Quote", blurb: "Who said it? A new MCU quote every day.", icon: <MessageSquareQuote size={26} strokeWidth={1.6} />, status: quoteStatus },
    { id: "emoji", title: "Emoji", blurb: "Guess the character from emojis.", icon: <Smile size={26} strokeWidth={1.6} /> },
  ];

  const greeting = day.won
    ? "Today's target is identified. Well done, sir."
    : `Welcome back, sir. ${characters.length} profiles loaded. Select a protocol.`;

  return (
    <div className="mx-auto flex min-h-dvh max-w-[34rem] flex-col px-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-4">
      <header className="flex flex-col items-center pt-12 pb-8">
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <Logo height={64} />
        </motion.div>
        <div className="label mt-4 text-[8.5px] text-holo/70">Daily MCU character game</div>
      </header>

      <div className="mb-5 px-1">
        <JarvisLine key={greeting} text={greeting} />
      </div>

      <main className="flex flex-col gap-3">
        {modes.map((m, i) => (
          <ModeCard key={m.id} mode={m} index={i} onOpen={onOpen} />
        ))}
      </main>

      <div className="mt-6 flex items-center justify-between gap-2 border-y border-holo/15 px-1 py-1.5 font-mono text-[10.5px] text-holo/70">
        <span>PLAYED {String(stats.played).padStart(2, "0")}</span>
        <span>WINS {String(stats.wins).padStart(2, "0")}</span>
        <span className={stats.currentStreak ? "text-amber" : ""}>STREAK {String(stats.currentStreak).padStart(2, "0")}</span>
        <span>BEST {String(stats.maxStreak).padStart(2, "0")}</span>
      </div>

      <footer className="mt-auto pt-10 text-center font-mono text-[10px] leading-relaxed text-holo/40">
        MCUDLE // FAN-MADE // NOT AFFILIATED WITH MARVEL OR DISNEY
      </footer>
    </div>
  );
}
