import { ArrowRight, Flag } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
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

  const answer = characterById.get(state.answerId)!;
  const over = state.won || state.gaveUp;
  const guessed = useMemo(() => new Set(state.guesses), [state.guesses]);

  const update = useCallback((next: EndlessState) => {
    setState(next);
    saveEndless(next);
  }, []);

  const onGuess = useCallback(
    (id: string) => {
      const next = guessEndless(state, id);
      if (next === state) return;
      update(next);
      setNewestId(id);
    },
    [state, update],
  );

  const onNext = useCallback(() => {
    update(nextRound(state));
    setNewestId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state, update]);

  const jarvis = useMemo(() => {
    if (state.won && state.newBest)
      return { text: `Identity confirmed: ${answer.name}. New record streak: ${state.streak}. Outstanding, sir.`, tone: "amber" as const };
    if (state.won) return { text: `Identity confirmed: ${answer.name}. Ready for the next one, sir.`, tone: "hit" as const };
    if (state.gaveUp) return { text: `Target was ${answer.name}. Streak reset. Shall we go again?`, tone: "amber" as const };
    const last = state.guesses.at(-1);
    if (!last) return { text: `Round ${state.round}. New target acquired. Awaiting your first identification, sir.`, tone: "holo" as const };
    return jarvisReport(characterById.get(last)!.name, compare(characterById.get(last)!, answer));
  }, [state, answer]);

  return (
    <>
      <div className="mx-auto flex min-h-dvh max-w-[34rem] flex-col px-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-4">
        <Header onHome={onHome} onHelp={() => setHelp(true)} />

        {/* status strip: real data only */}
        <div className="mb-3 flex items-center justify-between gap-2 border-y border-holo/15 px-1 py-1.5 font-mono text-[10.5px] text-holo/70">
          <span>ROUND {String(state.round).padStart(3, "0")}</span>
          <span>SCANS {pad(state.guesses.length)}</span>
          <span className={state.streak ? "text-amber" : ""}>STREAK {pad(state.streak)}</span>
          <span className={state.newBest ? "text-amber" : ""}>BEST {pad(state.bestStreak)}</span>
        </div>

        <main className="flex flex-1 flex-col gap-4">
          <Panel label="Endless identification" right={`${characters.length} PROFILES`} className="z-20">
            <SearchBar guessed={guessed} disabled={over} disabledText={state.won ? "Target identified" : "Target revealed"} onGuess={onGuess} />
            <div className="mt-3 flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <JarvisLine key={jarvis.text} text={jarvis.text} tone={jarvis.tone} />
              </div>
              {!over && state.guesses.length > 0 && (
                <button
                  type="button"
                  onClick={() => update(giveUpEndless(state))}
                  className="flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-holo/55 transition hover:text-miss-glow"
                >
                  <Flag size={12} /> GIVE UP
                </button>
              )}
            </div>
          </Panel>

          {over && (
            <WinCard
              answer={answer}
              guessCount={state.guesses.length}
              title={state.newBest ? `New record · streak ${state.streak}` : state.won ? "Identity confirmed" : "Target revealed"}
              reticle={state.won}
              delay={state.won && newestId ? FLIP_TIME : 0}
              footer={
                <>
                  <div className="font-mono text-[12px] text-holo/70">
                    SOLVED {pad(state.solved)} · AVG {averageGuesses(state)}
                  </div>
                  <button
                    type="button"
                    onClick={onNext}
                    className="tile flex h-10 shrink-0 items-center gap-2 bg-amber px-4 font-hud text-[10px] tracking-[0.2em] text-void transition hover:bg-white hover:shadow-[0_0_20px_rgb(255_181_71/0.6)] active:scale-95"
                  >
                    NEXT <ArrowRight size={15} />
                  </button>
                </>
              }
            />
          )}

          <GuessGrid guesses={state.guesses} answer={answer} newestId={newestId} />
        </main>

        <footer className="mt-10 text-center font-mono text-[10px] leading-relaxed text-holo/40">
          MCUDLE // FAN-MADE // NOT AFFILIATED WITH MARVEL OR DISNEY
        </footer>
      </div>

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
