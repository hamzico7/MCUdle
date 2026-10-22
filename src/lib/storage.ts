import { shiftKey } from "./daily";

/*
  Everything lives in the browser's localStorage, so no server or accounts.
  Reads/writes are wrapped in try/catch because private browsing or blocked
  storage can throw — the game still works, it just won't remember.
*/

const DAY_KEY = "mcudle:day";
const STATS_KEY = "mcudle:stats";
const SEEN_HELP_KEY = "mcudle:seenHelp";

export interface DayState {
  date: string; // YYYY-MM-DD (CET/CEST)
  guesses: string[]; // character ids, oldest first
  won: boolean;
  gaveUp?: boolean; // answer revealed with GIVE UP
}

export type Bucket = "1" | "2" | "3" | "4" | "5" | "6+";
export const BUCKETS: Bucket[] = ["1", "2", "3", "4", "5", "6+"];

export interface Stats {
  played: number; // days you made at least one guess
  wins: number;
  currentStreak: number;
  maxStreak: number;
  distribution: Record<Bucket, number>;
  lastWinDate: string | null;
}

const emptyStats = (): Stats => ({
  played: 0,
  wins: 0,
  currentStreak: 0,
  maxStreak: 0,
  distribution: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6+": 0 },
  lastWinDate: null,
});

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — ignore */
  }
}

export function loadDay(today: string): DayState {
  const saved = read<DayState>(DAY_KEY);
  if (saved && saved.date === today && Array.isArray(saved.guesses)) return saved;
  return { date: today, guesses: [], won: false };
}

export function saveDay(state: DayState) {
  write(DAY_KEY, state);
}

/** Loads stats and drops the current streak if you missed a day. */
export function loadStats(today: string): Stats {
  const s = { ...emptyStats(), ...read<Stats>(STATS_KEY) };
  s.distribution = { ...emptyStats().distribution, ...s.distribution };
  const yesterday = shiftKey(today, -1);
  if (s.lastWinDate !== today && s.lastWinDate !== yesterday) s.currentStreak = 0;
  return s;
}

export function bucketFor(guessCount: number): Bucket {
  return guessCount >= 6 ? "6+" : (String(guessCount) as Bucket);
}

/** Call once on the first guess of a day. */
export function recordPlayed(stats: Stats): Stats {
  const next = { ...stats, played: stats.played + 1 };
  write(STATS_KEY, next);
  return next;
}

/** Call once when the day is won. */
export function recordWin(stats: Stats, today: string, guessCount: number): Stats {
  const yesterday = shiftKey(today, -1);
  const streak = stats.lastWinDate === yesterday ? stats.currentStreak + 1 : 1;
  const bucket = bucketFor(guessCount);
  const next: Stats = {
    ...stats,
    wins: stats.wins + 1,
    currentStreak: streak,
    maxStreak: Math.max(stats.maxStreak, streak),
    distribution: { ...stats.distribution, [bucket]: stats.distribution[bucket] + 1 },
    lastWinDate: today,
  };
  write(STATS_KEY, next);
  return next;
}

/** Giving up breaks the daily streak (tomorrow's win starts again at 1). */
export function recordGiveUp(stats: Stats): Stats {
  const next: Stats = { ...stats, currentStreak: 0, lastWinDate: null };
  write(STATS_KEY, next);
  return next;
}

export function hasSeenHelp(): boolean {
  return read<boolean>(SEEN_HELP_KEY) === true;
}

export function markHelpSeen() {
  write(SEEN_HELP_KEY, true);
}
