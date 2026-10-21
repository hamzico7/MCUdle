import { useCallback, useEffect, useMemo, useState } from "react";
import CountdownModal from "./components/CountdownModal";
import GuessGrid from "./components/GuessGrid";
import Header from "./components/Header";
import HowToPlayModal from "./components/HowToPlayModal";
import SearchBar from "./components/SearchBar";
import StatsModal from "./components/StatsModal";
import { TILE_STAGGER } from "./components/Tile";
import WinCard from "./components/WinCard";
import { characterById, characters } from "./data/characters";
import { compare, emojiRow } from "./lib/compare";
import { characterForDate, dateKey, dayNumber, shiftKey } from "./lib/daily";
import {
  bucketFor,
  hasSeenHelp,
  loadDay,
  loadStats,
  markHelpSeen,
  recordPlayed,
  recordWin,
  saveDay,
  type DayState,
  type Stats,
} from "./lib/storage";

// time for the newest row's 7 tiles to finish flipping
const FLIP_TIME = 6 * TILE_STAGGER + 0.45;

type ModalName = "help" | "stats" | "countdown" | null;

export default function App() {
  const [today, setToday] = useState(() => dateKey());
  const [day, setDay] = useState<DayState>(() => loadDay(today));
  const [stats, setStats] = useState<Stats>(() => loadStats(today));
  const [newestId, setNewestId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalName>(() => (hasSeenHelp() ? null : "help"));

  const answer = useMemo(() => characterForDate(today), [today]);
  const yesterday = useMemo(() => characterForDate(shiftKey(today, -1)), [today]);
  const guessed = useMemo(() => new Set(day.guesses), [day.guesses]);

  // Midnight (Swiss time) rollover while the tab is open
  useEffect(() => {
    const t = setInterval(() => {
      const k = dateKey();
      if (k !== today) {
        setToday(k);
        setDay(loadDay(k));
        setStats(loadStats(k));
        setNewestId(null);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [today]);

  const onGuess = useCallback(
    (id: string) => {
      if (day.won || day.guesses.includes(id)) return;
      const guesses = [...day.guesses, id];
      const won = id === answer.id;
      const next: DayState = { date: today, guesses, won };

      let s = stats;
      if (day.guesses.length === 0) s = recordPlayed(s);
      if (won) {
        s = recordWin(s, today, guesses.length);
        setTimeout(() => setModal("stats"), (FLIP_TIME + 1.2) * 1000);
      }
      setStats(s);
      setDay(next);
      saveDay(next);
      setNewestId(id);
    },
    [day, answer.id, today, stats],
  );

  const closeModal = useCallback(() => {
    if (modal === "help") markHelpSeen();
    setModal(null);
  }, [modal]);

  const shareText = useMemo(() => {
    const rows = day.guesses.map((id) => emojiRow(compare(characterById.get(id)!, answer)));
    const shown = rows.length > 8 ? [...rows.slice(0, 7), `…+${rows.length - 7} more`] : rows;
    const url = typeof location !== "undefined" ? location.origin : "";
    return `MCUDLE #${dayNumber(today)} — ${day.guesses.length} ${day.guesses.length === 1 ? "guess" : "guesses"}\n${shown.join("\n")}\n${url}`;
  }, [day.guesses, answer, today]);

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <Header onHelp={() => setModal("help")} onCountdown={() => setModal("countdown")} onStats={() => setModal("stats")} />

      <main className="flex flex-1 flex-col gap-4">
        <div className="rounded-2xl border border-line bg-panel/80 p-4 backdrop-blur">
          <p className="mb-3 text-center text-sm text-muted">
            Guess today's <span className="font-semibold text-white">MCU character</span>
            {day.guesses.length > 0 && !day.won && (
              <>
                {" · "}
                <span className="text-white">{day.guesses.length}</span> {day.guesses.length === 1 ? "guess" : "guesses"}
              </>
            )}
          </p>
          <SearchBar guessed={guessed} disabled={day.won} onGuess={onGuess} />
        </div>

        {day.won && (
          <WinCard
            answer={answer}
            guessCount={day.guesses.length}
            shareText={shareText}
            delay={newestId ? FLIP_TIME : 0}
          />
        )}

        <GuessGrid guesses={day.guesses} answer={answer} newestId={newestId} />

        {day.guesses.length === 0 && (
          <p className="mt-6 text-center text-sm text-muted">
            Start with anyone — the tiles will tell you what matches.
          </p>
        )}
      </main>

      <footer className="mt-10 text-center text-[11px] leading-relaxed text-muted/70">
        MCUDLE #{dayNumber(today)} · {characters.length} characters
        <br />
        Fan-made game. Not affiliated with or endorsed by Marvel or Disney.
      </footer>

      <HowToPlayModal open={modal === "help"} onClose={closeModal} total={characters.length} />
      <StatsModal
        open={modal === "stats"}
        onClose={closeModal}
        stats={stats}
        todayBucket={day.won ? bucketFor(day.guesses.length) : null}
      />
      <CountdownModal open={modal === "countdown"} onClose={closeModal} yesterday={yesterday} />
    </div>
  );
}
