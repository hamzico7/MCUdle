import { Clapperboard, Lock, MessageCircle, Quote as QuoteIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import CountdownModal from "../components/CountdownModal";
import GiveUp from "../components/GiveUp";
import GuessList from "../components/GuessList";
import Header from "../components/Header";
import JarvisLine from "../components/JarvisLine";
import Modal from "../components/Modal";
import Panel from "../components/Panel";
import SearchBar from "../components/SearchBar";
import StatsModal from "../components/StatsModal";
import WinCard from "../components/WinCard";
import { characterById } from "../data/characters";
import { dateKey, dayNumber, shiftKey } from "../lib/daily";
import { quoteForDate } from "../lib/quote";
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

const MODE = "quote" as const;
/** Wrong guesses before each hint unlocks. */
const HINT_SOURCE = 3;
const HINT_TO = 6;

type ModalName = "help" | "stats" | "countdown" | null;

/** One hint chip: locked with a countdown, or open with its text. */
function Hint({ icon, label, value, unlockAt, wrong }: { icon: React.ReactNode; label: string; value: string; unlockAt: number; wrong: number }) {
  const open = wrong >= unlockAt;
  return (
    <div className={`tile flex min-w-0 flex-1 items-center gap-2 px-2.5 py-2 ${open ? "bg-amber/10 shadow-[inset_0_0_0_1px_rgb(255_181_71/0.5)]" : "bg-deep/70 shadow-[inset_0_0_0_1px_rgb(127_232_255/0.2)]"}`}>
      <span className={open ? "text-amber" : "text-holo/40"}>{open ? icon : <Lock size={14} />}</span>
      <span className="min-w-0">
        <span className={`block font-mono text-[9.5px] tracking-wider ${open ? "text-amber/80" : "text-holo/45"}`}>{label}</span>
        <span className={`line-clamp-2 block text-[13px] leading-tight ${open ? "text-ice" : "text-holo/45"}`}>
          {open ? value : `in ${unlockAt - wrong} ${unlockAt - wrong === 1 ? "guess" : "guesses"}`}
        </span>
      </span>
    </div>
  );
}

function QuoteHelp({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} title="Briefing" code="PROTOCOL // VOICE IDENTIFICATION" onClose={onClose}>
      <div className="flex flex-col gap-4 text-[15px] leading-snug text-ice/85">
        <p className="m-0">
          Read today's <b className="text-white">MCU quote</b> and guess which character said it. Unlimited guesses.
        </p>
        <div className="space-y-2">
          <div className="label mb-2">Hints</div>
          <div className="flex items-center gap-3">
            <Clapperboard size={18} className="shrink-0 text-amber" /> After {HINT_SOURCE} wrong guesses: the movie or show it's from.
          </div>
          <div className="flex items-center gap-3">
            <MessageCircle size={18} className="shrink-0 text-amber" /> After {HINT_TO} wrong guesses: who they were talking to.
          </div>
        </div>
        <p className="m-0 border-t border-holo/15 pt-4 font-mono text-[12px] text-holo/70">
          New quote every day at midnight (CET). Same quote for everyone.
        </p>
      </div>
    </Modal>
  );
}

export default function QuoteGame({ onHome }: { onHome: () => void }) {
  const [today, setToday] = useState(() => dateKey());
  const [day, setDay] = useState<DayState>(() => loadDay(today, MODE));
  const [stats, setStats] = useState<Stats>(() => loadStats(today, MODE));
  const [newestId, setNewestId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalName>(null);

  const quote = useMemo(() => quoteForDate(today), [today]);
  const answer = characterById.get(quote.characterId)!;
  const yesterday = useMemo(() => characterById.get(quoteForDate(shiftKey(today, -1)).characterId)!, [today]);
  const guessed = useMemo(() => new Set(day.guesses), [day.guesses]);
  const over = day.won || !!day.gaveUp;
  const wrong = day.guesses.filter((id) => id !== answer.id).length;

  // first visit: open the briefing after the boot sequence
  useEffect(() => {
    if (hasSeenHelp(MODE)) return;
    const t = setTimeout(() => setModal("help"), 600);
    return () => clearTimeout(t);
  }, []);

  // midnight rollover, same as Classic: an untouched board switches, a started one waits for you
  const [liveKey, setLiveKey] = useState(today);
  const stale = liveKey !== today;
  const loadKey = useCallback((k: string) => {
    setToday(k);
    setDay(loadDay(k, MODE));
    setStats(loadStats(k, MODE));
    setNewestId(null);
  }, []);
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
      if (over || day.guesses.includes(id)) return;
      const guesses = [...day.guesses, id];
      const won = id === answer.id;
      const next: DayState = { date: today, guesses, won };
      let s = stats;
      if (day.guesses.length === 0) s = recordPlayed(s, MODE);
      if (won) {
        s = recordWin(s, today, guesses.length, MODE);
        setTimeout(() => setModal("stats"), 2200);
      }
      setStats(s);
      setDay(next);
      saveDay(next, MODE);
      setNewestId(id);
    },
    [over, day, answer.id, today, stats],
  );

  const onGiveUp = useCallback(() => {
    if (over) return;
    const next: DayState = { ...day, gaveUp: true };
    setStats(recordGiveUp(stats, MODE));
    setDay(next);
    saveDay(next, MODE);
    setNewestId(null);
  }, [over, day, stats]);

  const closeModal = useCallback(() => {
    if (modal === "help") markHelpSeen(MODE);
    setModal(null);
  }, [modal]);

  const jarvis = useMemo(() => {
    if (day.won) return { text: `Voice match confirmed: ${answer.name}. Well done, sir.`, tone: "hit" as const };
    if (day.gaveUp) return { text: `It was ${answer.name}. Streak reset. New quote at midnight, sir.`, tone: "amber" as const };
    const last = day.guesses.at(-1);
    if (!last) return { text: "Audio fragment recovered. Whose voice is it, sir?", tone: "holo" as const };
    const name = characterById.get(last)!.name;
    if (wrong === HINT_SOURCE) return { text: `${name}: no match. Source file decrypted.`, tone: "amber" as const };
    if (wrong === HINT_TO) return { text: `${name}: no match. Recipient identified.`, tone: "amber" as const };
    return { text: `${name}: no voice match.`, tone: "holo" as const };
  }, [day, answer, wrong]);

  const shareText = useMemo(() => {
    const row = day.guesses.map((id) => (id === answer.id ? "🟩" : "🟥")).join("");
    const url = typeof location !== "undefined" ? location.origin : "";
    const result = day.gaveUp ? `gave up after ${day.guesses.length}` : `${day.guesses.length} ${day.guesses.length === 1 ? "guess" : "guesses"}`;
    return `MCUDLE Quote #${dayNumber(today)} — ${result}\n${row}\n${url}`;
  }, [day.guesses, day.gaveUp, answer.id, today]);

  const source = `${quote.source}${quote.year ? ` (${quote.year})` : ""}`;

  return (
    <>
      <div className="mx-auto flex min-h-dvh max-w-[34rem] flex-col px-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-4">
        <Header onHome={onHome} onHelp={() => setModal("help")} onCountdown={() => setModal("countdown")} onStats={() => setModal("stats")} />

        {/* status strip: real data only */}
        <div className="mb-3 flex items-center justify-between gap-2 border-y border-holo/15 px-1 py-1.5 font-mono text-[10.5px] text-holo/70">
          <span>QUOTE {String(dayNumber(today)).padStart(3, "0")}</span>
          <span className="hidden sm:inline">{today}</span>
          <span>SCANS {String(day.guesses.length).padStart(2, "0")}</span>
          <span className={stats.currentStreak ? "text-amber" : ""}>STREAK {String(stats.currentStreak).padStart(2, "0")}</span>
        </div>

        <main className="flex flex-1 flex-col gap-4">
          {stale && (
            <div role="status" className="tile flex items-center justify-between gap-3 bg-amber/10 px-3 py-2.5 shadow-[inset_0_0_0_1px_rgb(255_181_71/0.5)]">
              <div className="min-w-0 text-[13px] leading-snug text-ice/85">
                <span className="block font-hud text-[9px] tracking-[0.2em] text-amber">NEW QUOTE LIVE</span>
                {over ? "Quote " + dayNumber(liveKey) + " is out." : "Midnight passed. This board is still on yesterday's quote."}
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

          {/* the quote */}
          <Panel label="Intercepted transmission">
            <figure className="m-0">
              <QuoteIcon size={22} className="mb-2 text-holo/50" />
              <blockquote className="m-0 text-[20px] leading-snug font-semibold text-white sm:text-[22px]">"{quote.text}"</blockquote>
            </figure>
            <div className="mt-4 flex gap-2">
              <Hint icon={<Clapperboard size={14} />} label="SOURCE" value={source} unlockAt={HINT_SOURCE} wrong={over ? 99 : wrong} />
              <Hint icon={<MessageCircle size={14} />} label="SAID TO" value={quote.to ?? "Nobody in particular"} unlockAt={HINT_TO} wrong={over ? 99 : wrong} />
            </div>
          </Panel>

          <Panel label="Voice identification" className="z-20">
            <SearchBar guessed={guessed} disabled={over} disabledText={day.won ? "Voice identified" : "Speaker revealed"} onGuess={onGuess} />
            <div className="mt-3 flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <JarvisLine key={jarvis.text} text={jarvis.text} tone={jarvis.tone} />
              </div>
              {!over && <GiveUp wrong={wrong} onGiveUp={onGiveUp} />}
            </div>
          </Panel>

          {over && (
            <WinCard
              answer={answer}
              guessCount={day.guesses.length}
              shareText={shareText}
              title={day.won ? "Voice match confirmed" : "Speaker revealed"}
              reticle={day.won}
              detail={`Said in ${source}`}
              nextLabel="NEXT QUOTE"
              delay={day.won && newestId ? 0.5 : 0}
              nextLive={stale}
            />
          )}

          <GuessList guesses={day.guesses} answerId={answer.id} newestId={newestId} />
        </main>

        <footer className="mt-10 text-center font-mono text-[10px] leading-relaxed text-holo/40">
          MCUDLE // FAN-MADE // NOT AFFILIATED WITH MARVEL OR DISNEY
        </footer>
      </div>

      <QuoteHelp open={modal === "help"} onClose={closeModal} />
      <StatsModal open={modal === "stats"} onClose={closeModal} stats={stats} todayBucket={day.won ? bucketFor(day.guesses.length) : null} />
      <CountdownModal open={modal === "countdown"} onClose={closeModal} yesterday={yesterday} />
    </>
  );
}
