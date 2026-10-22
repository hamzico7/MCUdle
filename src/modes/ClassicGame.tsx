import { useCallback, useEffect, useMemo, useState } from "react";
import CountdownModal from "../components/CountdownModal";
import GiveUp from "../components/GiveUp";
import GuessGrid from "../components/GuessGrid";
import Header from "../components/Header";
import HowToPlayModal from "../components/HowToPlayModal";
import JarvisLine from "../components/JarvisLine";
import Panel from "../components/Panel";
import SearchBar from "../components/SearchBar";
import StatsModal from "../components/StatsModal";
import WinCard from "../components/WinCard";
import { characterById, characters } from "../data/characters";
import { compare, emojiRow } from "../lib/compare";
import { characterForDate, dateKey, dayNumber, shiftKey } from "../lib/daily";
import { FLIP_TIME, jarvisReport } from "../lib/jarvis";
import {
  bucketFor,
  hasSeenHelp,
  loadDay,
  loadStats,
  markHelpSeen,
  recordGiveUp,
  recordPlayed,
  recordWin,
  saveDay,
  type DayState,
  type Stats,
} from "../lib/storage";

type ModalName = "help" | "stats" | "countdown" | null;

export default function ClassicGame({ onHome }: { onHome: () => void }) {
  const [today, setToday] = useState(() => dateKey());
  const [day, setDay] = useState<DayState>(() => loadDay(today));
  const [stats, setStats] = useState<Stats>(() => loadStats(today));
  const [newestId, setNewestId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalName>(null);

  const answer = useMemo(() => characterForDate(today), [today]);
  const yesterday = useMemo(() => characterForDate(shiftKey(today, -1)), [today]);
  const guessed = useMemo(() => new Set(day.guesses), [day.guesses]);

  // first visit: open the briefing after the boot sequence
  useEffect(() => {
    if (hasSeenHelp()) return;
    const t = setTimeout(() => setModal("help"), 600);
    return () => clearTimeout(t);
  }, []);

  // the real current date; differs from `today` while you finish a board you started before midnight
  const [liveKey, setLiveKey] = useState(today);
  const stale = liveKey !== today;

  const loadKey = useCallback((k: string) => {
    setToday(k);
    setDay(loadDay(k));
    setStats(loadStats(k));
    setNewestId(null);
  }, []);

  // Midnight (CET/CEST) rollover while the tab is open. An untouched board switches to the new
  // target right away; a board you already guessed on stays on its target until you switch,
  // so the clues never silently start pointing at a different character.
  useEffect(() => {
    const t = setInterval(() => {
      const k = dateKey();
      if (k === liveKey) return;
      setLiveKey(k);
      if (day.guesses.length === 0) loadKey(k);
    }, 1000);
    return () => clearInterval(t);
  }, [liveKey, day.guesses.length, loadKey]);

  const onGuess = useCallback(
    (id: string) => {
      if (day.won || day.gaveUp || day.guesses.includes(id)) return;
      const guesses = [...day.guesses, id];
      const won = id === answer.id;
      const next: DayState = { date: today, guesses, won };

      let s = stats;
      if (day.guesses.length === 0) s = recordPlayed(s);
      if (won) {
        s = recordWin(s, today, guesses.length);
        setTimeout(() => setModal("stats"), (FLIP_TIME + 1.6) * 1000);
      }
      setStats(s);
      setDay(next);
      saveDay(next);
      setNewestId(id);
    },
    [day, answer.id, today, stats],
  );

  const onGiveUp = useCallback(() => {
    if (day.won || day.gaveUp) return;
    const next: DayState = { ...day, gaveUp: true };
    setStats(recordGiveUp(stats));
    setDay(next);
    saveDay(next);
    setNewestId(null);
  }, [day, stats]);

  const closeModal = useCallback(() => {
    if (modal === "help") markHelpSeen();
    setModal(null);
  }, [modal]);

  const jarvis = useMemo(() => {
    if (day.won) return { text: `Identity confirmed: ${answer.name}. Well done, sir.`, tone: "hit" as const };
    if (day.gaveUp) return { text: `Target was ${answer.name}. Streak reset. New target at midnight, sir.`, tone: "amber" as const };
    const last = day.guesses.at(-1);
    if (!last) return { text: "Daily target acquired. Awaiting your first identification, sir.", tone: "holo" as const };
    const g = characterById.get(last)!;
    return jarvisReport(g.name, compare(g, answer));
  }, [day, answer]);

  const shareText = useMemo(() => {
    const rows = day.guesses.map((id) => emojiRow(compare(characterById.get(id)!, answer)));
    const shown = rows.length > 8 ? [...rows.slice(0, 7), `…+${rows.length - 7} more`] : rows;
    const url = typeof location !== "undefined" ? location.origin : "";
    const result = day.gaveUp ? `gave up after ${day.guesses.length}` : `${day.guesses.length} ${day.guesses.length === 1 ? "guess" : "guesses"}`;
    return `MCUDLE #${dayNumber(today)} — ${result}\n${shown.join("\n")}\n${url}`;
  }, [day.guesses, day.gaveUp, answer, today]);

  const over = day.won || !!day.gaveUp;

  return (
    <>
      <div className="mx-auto flex min-h-dvh max-w-[34rem] flex-col px-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-4">
        <Header onHome={onHome} onHelp={() => setModal("help")} onCountdown={() => setModal("countdown")} onStats={() => setModal("stats")} />

        {/* status strip: real data only */}
        <div className="mb-3 flex items-center justify-between gap-2 border-y border-holo/15 px-1 py-1.5 font-mono text-[10.5px] text-holo/70">
          <span>DAY {String(dayNumber(today)).padStart(3, "0")}</span>
          <span className="hidden sm:inline">{today}</span>
          <span>SCANS {String(day.guesses.length).padStart(2, "0")}</span>
          <span className={stats.currentStreak ? "text-amber" : ""}>STREAK {String(stats.currentStreak).padStart(2, "0")}</span>
        </div>

        <main className="flex flex-1 flex-col gap-4">
          {stale && (
            <div role="status" className="tile flex items-center justify-between gap-3 bg-amber/10 px-3 py-2.5 shadow-[inset_0_0_0_1px_rgb(255_181_71/0.5)]">
              <div className="min-w-0 text-[13px] leading-snug text-ice/85">
                <span className="block font-hud text-[9px] tracking-[0.2em] text-amber">NEW TARGET LIVE</span>
                {over ? "Day " + dayNumber(liveKey) + " has started." : "Midnight passed. This board is still on yesterday's target."}
              </div>
              <button
                type="button"
                onClick={() => loadKey(liveKey)}
                className="tile h-9 shrink-0 bg-amber px-3 font-hud text-[9px] tracking-[0.18em] text-void transition hover:bg-white active:scale-95"
              >
                {over ? "PLAY" : "SWITCH"}
              </button>
            </div>
          )}

          <Panel label="Target identification" right={`${characters.length} PROFILES`} className="z-20">
            <SearchBar guessed={guessed} disabled={over} disabledText={day.won ? "Target identified" : "Target revealed"} onGuess={onGuess} />
            <div className="mt-3 flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <JarvisLine key={jarvis.text} text={jarvis.text} tone={jarvis.tone} />
              </div>
              {!over && <GiveUp wrong={day.guesses.length} onGiveUp={onGiveUp} />}
            </div>
          </Panel>

          {over && (
            <WinCard
              answer={answer}
              guessCount={day.guesses.length}
              shareText={shareText}
              title={day.won ? "Identity confirmed" : "Target revealed"}
              reticle={day.won}
              delay={day.won && newestId ? FLIP_TIME : 0}
              nextLive={stale}
            />
          )}

          <GuessGrid guesses={day.guesses} answer={answer} newestId={newestId} />
        </main>

        <footer className="mt-10 text-center font-mono text-[10px] leading-relaxed text-holo/40">
          MCUDLE // FAN-MADE // NOT AFFILIATED WITH MARVEL OR DISNEY
        </footer>
      </div>

      <HowToPlayModal open={modal === "help"} onClose={closeModal} />
      <StatsModal open={modal === "stats"} onClose={closeModal} stats={stats} todayBucket={day.won ? bucketFor(day.guesses.length) : null} />
      <CountdownModal open={modal === "countdown"} onClose={closeModal} yesterday={yesterday} />
    </>
  );
}
