import { characters } from "../data/characters";
import { characterForDate, dateKey } from "./daily";

/*
  Endless mode: unlimited rounds, a random character each time.
  Saved in localStorage under mcudle:endless so a refresh keeps the round you're on.
*/

const KEY = "mcudle:endless";

export interface EndlessState {
  round: number; // 1 = first round ever played
  answerId: string;
  guesses: string[]; // character ids, oldest first
  won: boolean;
  gaveUp: boolean;
  recent: string[]; // answers already used in the current streak (no repeats until the streak ends)
  solved: number; // rounds won
  totalGuesses: number; // guesses across all won rounds (for the average)
  streak: number; // rounds won in a row without giving up
  bestStreak: number;
  newBest?: boolean; // this round's win set a new best streak
}

/** Random character not used yet in this streak, and never today's daily (no spoilers). */
function pick(recent: string[]): string {
  const blocked = new Set([...recent, characterForDate(dateKey()).id]);
  const pool = characters.filter((c) => !blocked.has(c.id));
  const from = pool.length ? pool : characters;
  return from[Math.floor(Math.random() * from.length)].id;
}

function fresh(): EndlessState {
  return { round: 1, answerId: pick([]), guesses: [], won: false, gaveUp: false, recent: [], solved: 0, totalGuesses: 0, streak: 0, bestStreak: 0 };
}

export function loadEndless(): EndlessState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = { ...fresh(), ...(JSON.parse(raw) as Partial<EndlessState>) };
      // a character removed from the database? start a new round instead of crashing
      if (characters.some((c) => c.id === s.answerId) && Array.isArray(s.guesses)) return s;
      return { ...s, answerId: pick(s.recent), guesses: [], won: false, gaveUp: false };
    }
  } catch {
    /* storage unavailable or broken — start fresh */
  }
  return fresh();
}

export function saveEndless(s: EndlessState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* storage unavailable — ignore */
  }
}

/** Add a guess; updates the stats if it solves the round. */
export function guessEndless(s: EndlessState, id: string): EndlessState {
  if (s.won || s.gaveUp || s.guesses.includes(id)) return s;
  const guesses = [...s.guesses, id];
  if (id !== s.answerId) return { ...s, guesses };
  const streak = s.streak + 1;
  return {
    ...s,
    guesses,
    won: true,
    solved: s.solved + 1,
    totalGuesses: s.totalGuesses + guesses.length,
    streak,
    bestStreak: Math.max(s.bestStreak, streak),
    newBest: streak > s.bestStreak,
  };
}

export function giveUpEndless(s: EndlessState): EndlessState {
  if (s.won || s.gaveUp) return s;
  return { ...s, gaveUp: true, streak: 0 };
}

export function nextRound(s: EndlessState): EndlessState {
  // Streak ended (gave up): everyone is back in the draw. Streak goes on: this answer is out.
  // Once every character has been used in one streak, the list starts over.
  let recent = s.gaveUp ? [] : [...s.recent, s.answerId];
  if (characters.every((c) => recent.includes(c.id) || c.id === characterForDate(dateKey()).id)) recent = [];
  return { ...s, round: s.round + 1, answerId: pick(recent), guesses: [], won: false, gaveUp: false, newBest: false, recent };
}

/** Average guesses per solved round, one decimal; "-" before the first solve. */
export function averageGuesses(s: EndlessState): string {
  return s.solved ? (s.totalGuesses / s.solved).toFixed(1) : "-";
}
