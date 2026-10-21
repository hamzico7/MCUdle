import type { Character, TileResult } from "../types";

export interface GuessFeedback {
  gender: TileResult;
  species: TileResult;
  status: TileResult;
  powerType: TileResult;
  affiliation: TileResult;
  /** "higher" = answer debuted in a LATER phase (arrow up), "lower" = EARLIER (arrow down) */
  debutPhase: TileResult;
  isCorrect: boolean;
}

const same = (a: string, b: string): TileResult => (a === b ? "correct" : "wrong");

/** Green = identical set, orange = at least one shared value, red = nothing shared. */
function overlap(guess: readonly string[], answer: readonly string[]): TileResult {
  const shared = guess.filter((v) => answer.includes(v)).length;
  if (shared === 0) return "wrong";
  if (shared === guess.length && shared === answer.length) return "correct";
  return "partial";
}

export function compare(guess: Character, answer: Character): GuessFeedback {
  let debutPhase: TileResult = "correct";
  if (guess.debutPhase < answer.debutPhase) debutPhase = "higher";
  else if (guess.debutPhase > answer.debutPhase) debutPhase = "lower";

  return {
    gender: same(guess.gender, answer.gender),
    species: overlap(guess.species, answer.species),
    status: same(guess.status, answer.status),
    powerType: overlap(guess.powerType, answer.powerType),
    affiliation: overlap(guess.affiliation, answer.affiliation),
    debutPhase,
    isCorrect: guess.id === answer.id,
  };
}

/** Emoji line for the share text, one per guess. */
export function emojiRow(f: GuessFeedback): string {
  const sq = (r: TileResult) => (r === "correct" ? "🟩" : r === "partial" ? "🟧" : "🟥");
  const phase = f.debutPhase === "correct" ? "🟩" : f.debutPhase === "higher" ? "⬆️" : "⬇️";
  return [f.gender, f.species, f.status, f.powerType, f.affiliation].map(sq).join("") + phase;
}
