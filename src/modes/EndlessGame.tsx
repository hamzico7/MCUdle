import { ArrowRight, FlaskConical } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import DevMenu from "../components/DevMenu";
import GiveUp from "../components/GiveUp";
import GuessGrid from "../components/GuessGrid";
import Header from "../components/Header";
import HowToPlayModal from "../components/HowToPlayModal";
import JarvisLine from "../components/JarvisLine";
import Panel from "../components/Panel";
import SearchBar from "../components/SearchBar";
import WinCard from "../components/WinCard";
import { characterById, characters } from "../data/characters";
import { compare } from "../lib/compare";
import { averageGuesses, giveUpEndless, guessEndless, loadEndless, nextRound, saveEndless, type EndlessState } from "../lib/endless";
import { FLIP_TIME, jarvisReport } from "../lib/jarvis";
import { hasSeenHelp, markHelpSeen } from "../lib/storage";

const pad = (n: number) => String(n).padStart(2, "0");

export default function EndlessGame({ onHome }: { onHome: () => void }) {
  const [state, setState] = useState<EndlessState>(() => {
    const s = loadEndless();
    saveEndless(s); // keep the first random pick, so a refresh doesn't change it
    return s;
  });
  const [newestId, setNewestId] = useState<string | null>(null);
  const [help, setHelp] = useState(() => !hasSeenHelp());
  const [dev, setDev] = useState(false);
  // Dev test round (secret menu): a throwaway copy of the state, never saved, so stats and streaks stay untouched.
  const [test, setTest] = useState<EndlessState | null>(null);

  const real = state;
  const view = test ?? real; // what's on screen
  const answer = characterById.get(view.answerId)!;
  const over = view.won || view.gaveUp;
  const guessed = useMemo(() => new Set(view.guesses), [view.guesses]);

  const update = useCallback(
    (next: EndlessState) => {
      if (test) {
        setTest(next);
        return;
      }
      setState(next);
      saveEndless(next);
    },
    [test],
  );

  const onGuess = useCallback(
    (id: string) => {
      const next = guessEndless(view, id);
      if (next === view) return;
      update(next);
      setNewestId(id);
    },
    [view, update],
  );

  const onNext = useCallback(() => {
    if (test) setTest(null); // back to the real round
    else update(nextRound(state));
    setNewestId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [test, state, update]);

  const startTest = useCallback(
    (id: string) => {
      setTest({ ...state, answerId: id, guesses: [], won: false, gaveUp: false, newBest: false });
      setNewestId(null);
      setDev(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [state],
  );

  const jarvis = useMemo(() => {
    if (test && view.won) return { text: `Test complete: ${answer.name}. Nothing was recorded, sir.`, tone: "hit" as const };
    if (test && view.gaveUp) return { text: `Test target was ${answer.name}. Nothing was recorded, sir.`, tone: "amber" as const };
    if (view.won && view.newBest)
      return { text: `Identity confirmed: ${answer.name}. New record streak: ${view.streak}. Outstanding, sir.`, tone: "amber" as const };
    if (view.won) return { text: `Identity confirmed: ${answer.name}. Ready for the next one, sir.`, tone: "hit" as const };
    if (view.gaveUp) return { text: `Target was ${answer.name}. Streak reset. Shall we go again?`, tone: "amber" as const };
    const last = view.guesses.at(-1);
    if (!last)
      return test
        ? { text: "Developer test round. Stats and streak are off, sir.", tone: "amber" as const }
        : { text: `Round ${view.round}. New target acquired. Awaiting your first identification, sir.`, tone: "holo" as const };
    return jarvisReport(characterById.get(last)!.name, compare(characterById.get(last)!, answer));
  }, [view, answer, test]);

  return (
    <>
      <div className="mx-auto flex min-h-dvh max-w-[34rem] flex-col px-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-4">
        <Header onHome={onHome} onHelp={() => setHelp(true)} />

        {/* status strip: real data only */}
        <div className="mb-3 flex items-center justify-between gap-2 border-y border-holo/15 px-1 py-1.5 font-mono text-[10.5px] text-holo/70">
          <span>ROUND {String(real.round).padStart(3, "0")}</span>
          <span>SCANS {pad(view.guesses.length)}</span>
          <span className={real.streak ? "text-amber" : ""}>STREAK {pad(real.streak)}</span>
          <span className={real.newBest ? "text-amber" : ""}>BEST {pad(real.bestStreak)}</span>
        </div>

        <main className="flex flex-1 flex-col gap-4">
          {test && (
            <div role="status" className="tile flex items-center justify-between gap-3 bg-amber/10 px-3 py-2.5 shadow-[inset_0_0_0_1px_rgb(255_181_71/0.5)]">
              <div className="min-w-0 text-[13px] leading-snug text-ice/85">
                <span className="flex items-center gap-1.5 font-hud text-[9px] tracking-[0.2em] text-amber">
                  <FlaskConical size={12} /> DEV TEST ROUND
                </span>
                Not saved. Your real round, streak and stats are untouched.
              </div>
              <button
                type="button"
                onClick={() => {
                  setTest(null);
                  setNewestId(null);
                }}
                className="tile h-9 shrink-0 bg-amber px-3 font-hud text-[9px] tracking-[0.18em] text-void transition hover:bg-white active:scale-95"
              >
                EXIT
              </button>
            </div>
          )}

          <Panel label="Endless identification" right={`${characters.length} PROFILES`} className="z-20">
            <SearchBar
              guessed={guessed}
              disabled={over}
              disabledText={view.won ? "Target identified" : "Target revealed"}
              onGuess={onGuess}
              secret="hamzico"
              onSecret={() => setDev(true)}
            />
            <div className="mt-3 flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <JarvisLine key={jarvis.text} text={jarvis.text} tone={jarvis.tone} />
              </div>
              {!over && <GiveUp wrong={view.guesses.length} onGiveUp={() => update(giveUpEndless(view))} />}
            </div>
          </Panel>

          {over && (
            <WinCard
              answer={answer}
              guessCount={view.guesses.length}
              title={test ? "Test complete" : view.newBest ? `New record · streak ${view.streak}` : view.won ? "Identity confirmed" : "Target revealed"}
              reticle={view.won}
              delay={view.won && newestId ? FLIP_TIME : 0}
              footer={
                <>
                  <div className="font-mono text-[12px] text-holo/70">
                    {test ? "DEV TEST · NOT SAVED" : `SOLVED ${pad(real.solved)} · AVG ${averageGuesses(real)}`}
                  </div>
                  <button
                    type="button"
                    onClick={onNext}
                    className="tile flex h-10 shrink-0 items-center gap-2 bg-amber px-4 font-hud text-[10px] tracking-[0.2em] text-void transition hover:bg-white hover:shadow-[0_0_20px_rgb(255_181_71/0.6)] active:scale-95"
                  >
                    {test ? "BACK" : "NEXT"} <ArrowRight size={15} />
                  </button>
                </>
              }
            />
          )}

          <GuessGrid guesses={view.guesses} answer={answer} newestId={newestId} />
        </main>

        <footer className="mt-10 text-center font-mono text-[10px] leading-relaxed text-holo/40">
          MCUDLE // FAN-MADE // NOT AFFILIATED WITH MARVEL OR DISNEY
        </footer>
      </div>

      <DevMenu open={dev} onClose={() => setDev(false)} onTest={startTest} />

      <HowToPlayModal
        open={help}
        mode="endless"
        onClose={() => {
          markHelpSeen();
          setHelp(false);
        }}
      />
    </>
  );
}
