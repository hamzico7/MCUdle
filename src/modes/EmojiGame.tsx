import { motion } from "framer-motion";
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
import { emojiClues } from "../data/emojis";
import { dateKey, dayNumber, shiftKey } from "../lib/daily";
import { emojiCharacterForDate } from "../lib/emoji";
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

const MODE = "emoji" as const;

type ModalName = "help" | "stats" | "countdown" | null;

function EmojiHelp({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} title="Briefing" code="PROTOCOL // SYMBOL DECRYPTION" onClose={onClose}>
      <div className="flex flex-col gap-4 text-[15px] leading-snug text-ice/85">
        <p className="m-0">
          Guess today's <b className="text-white">MCU character</b> from 5 emojis. You start with one, and every wrong
          guess reveals the next. They go from vague to obvious. Unlimited guesses.
        </p>
        <p className="m-0 border-t border-holo/15 pt-4 font-mono text-[12px] text-holo/70">
          New character every day at midnight (CET). Same for everyone.
        </p>
      </div>
    </Modal>
  );
}

export default function EmojiGame({ onHome }: { onHome: () => void }) {
  const [today, setToday] = useState(() => dateKey());
  const [day, setDay] = useState<DayState>(() => loadDay(today, MODE));
  const [stats, setStats] = useState<Stats>(() => loadStats(today, MODE));
  const [newestId, setNewestId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalName>(null);

  const answer = useMemo(() => emojiCharacterForDate(today), [today]);
  const yesterday = useMemo(() => emojiCharacterForDate(shiftKey(today, -1)), [today]);
  const clues = emojiClues[answer.id];
  const guessed = useMemo(() => new Set(day.guesses), [day.guesses]);
  const over = day.won || !!day.gaveUp;
  const wrong = day.guesses.filter((id) => id !== answer.id).length;
  const shown = over ? clues.length : Math.min(clues.length, 1 + wrong);

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
    if (day.won) return { text: `Symbols decrypted: ${answer.name}. Well done, sir.`, tone: "hit" as const };
    if (day.gaveUp) return { text: `It was ${answer.name}. Streak reset. New symbols at midnight, sir.`, tone: "amber" as const };
    const last = day.guesses.at(-1);
    if (!last) return { text: "Encrypted signature intercepted. One symbol decoded so far, sir.", tone: "holo" as const };
    const name = characterById.get(last)!.name;
    if (shown < clues.length) return { text: `${name}: no match. Decoding symbol ${shown} of ${clues.length}.`, tone: "holo" as const };
    return { text: `${name}: no match. All symbols decoded.`, tone: "amber" as const };
  }, [day, answer, shown, clues.length]);

  const shareText = useMemo(() => {
    const row = day.guesses.map((id) => (id === answer.id ? "🟩" : "🟥")).join("");
    const url = typeof location !== "undefined" ? location.origin : "";
    const result = day.gaveUp ? `gave up after ${day.guesses.length}` : `${day.guesses.length} ${day.guesses.length === 1 ? "guess" : "guesses"}`;
    // no emojis in the share text: they'd spoil it for friends who haven't played yet
    return `MCUDLE Emoji #${dayNumber(today)} — ${result}\n${row}\n${url}`;
  }, [day.guesses, day.gaveUp, answer.id, today]);

  return (
    <>
      <div className="mx-auto flex min-h-dvh max-w-[34rem] flex-col px-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-4">
        <Header onHome={onHome} onHelp={() => setModal("help")} onCountdown={() => setModal("countdown")} onStats={() => setModal("stats")} />

        {/* status strip: real data only */}
        <div className="mb-3 flex items-center justify-between gap-2 border-y border-holo/15 px-1 py-1.5 font-mono text-[10.5px] text-holo/70">
          <span>EMOJI {String(dayNumber(today)).padStart(3, "0")}</span>
          <span className="hidden sm:inline">{today}</span>
          <span>SCANS {String(day.guesses.length).padStart(2, "0")}</span>
          <span className={stats.currentStreak ? "text-amber" : ""}>STREAK {String(stats.currentStreak).padStart(2, "0")}</span>
        </div>

        <main className="flex flex-1 flex-col gap-4">
          {stale && (
            <div role="status" className="tile flex items-center justify-between gap-3 bg-amber/10 px-3 py-2.5 shadow-[inset_0_0_0_1px_rgb(255_181_71/0.5)]">
              <div className="min-w-0 text-[13px] leading-snug text-ice/85">
                <span className="block font-hud text-[9px] tracking-[0.2em] text-amber">NEW SYMBOLS LIVE</span>
                {over ? "Emoji " + dayNumber(liveKey) + " is out." : "Midnight passed. This board is still on yesterday's character."}
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

          {/* the emojis: revealed ones, then locked slots */}
          <Panel label="Encrypted signature" right={`${shown}/${clues.length} DECODED`}>
            <div className="grid grid-cols-5 gap-2">
              {clues.map((e, i) => (
                <div
                  key={i}
                  className={`tile grid aspect-square place-items-center ${
                    i < shown ? "bg-holo/10 shadow-[inset_0_0_0_1px_rgb(127_232_255/0.45)]" : "bg-deep/70 shadow-[inset_0_0_0_1px_rgb(127_232_255/0.15)]"
                  }`}
                  aria-label={i < shown ? `Clue ${i + 1}: ${e}` : `Clue ${i + 1}: locked`}
                >
                  {i < shown ? (
                    <motion.span
                      key={`${today}-${i}`}
                      initial={{ scale: 0.3, opacity: 0, rotate: -20 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 16 }}
                      className="text-[clamp(1.75rem,9vw,2.6rem)] leading-none"
                    >
                      {e}
                    </motion.span>
                  ) : (
                    <span className="font-hud text-[18px] text-holo/30">?</span>
                  )}
                </div>
              ))}
            </div>
          </Panel>

          <Panel label="Subject identification" className="z-20">
            <SearchBar guessed={guessed} disabled={over} disabledText={day.won ? "Target identified" : "Target revealed"} onGuess={onGuess} />
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
              title={day.won ? "Symbols decrypted" : "Target revealed"}
              reticle={day.won}
              detail={clues.join(" ")}
              delay={day.won && newestId ? 0.5 : 0}
              nextLive={stale}
              nextLabel="NEXT EMOJI"
            />
          )}

          <GuessList guesses={day.guesses} answerId={answer.id} newestId={newestId} />
        </main>

        <footer className="mt-10 text-center font-mono text-[10px] leading-relaxed text-holo/40">
          MCUDLE // FAN-MADE // NOT AFFILIATED WITH MARVEL OR DISNEY
        </footer>
      </div>

      <EmojiHelp open={modal === "help"} onClose={closeModal} />
      <StatsModal open={modal === "stats"} onClose={closeModal} stats={stats} todayBucket={day.won ? bucketFor(day.guesses.length) : null} />
      <CountdownModal open={modal === "countdown"} onClose={closeModal} yesterday={yesterday} />
    </>
  );
}
