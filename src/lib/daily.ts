import { characters } from "../data/characters";
import type { Character } from "../types";

/**
 * The game resets at midnight Swiss/European time. "Europe/Zurich" follows CET in
 * winter (UTC+1) and CEST in summer (UTC+2) automatically, so DST is handled for us.
 */
export const GAME_TIMEZONE = "Europe/Zurich";

/** Changing this reshuffles the whole answer order for everyone. Leave it alone once live. */
const SHUFFLE_SEED = "mcudle-v1";

/** Day 0 of the game. Only used to number the days. */
const EPOCH = "2026-01-01";

/** "YYYY-MM-DD" for the given moment, in Swiss time. */
export function dateKey(now: Date = new Date()): string {
  // en-CA formats dates as YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: GAME_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Whole days between two YYYY-MM-DD keys (b - a). */
export function daysBetween(a: string, b: string): number {
  const toUtc = (k: string) => {
    const [y, m, d] = k.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((toUtc(b) - toUtc(a)) / 86_400_000);
}

export function shiftKey(key: string, days: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return t.toISOString().slice(0, 10);
}

/** Game number shown in the share text (#1 = first day). */
export function dayNumber(key: string): number {
  return daysBetween(EPOCH, key) + 1;
}

// ── Seeded randomness ──────────────────────────────────────────────────────
// cyrb53: small string hash -> 53-bit number
function hash(str: string): number {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

// mulberry32: tiny seeded random number generator
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Every "cycle" of N days uses a fresh seeded shuffle of all characters, so nobody
 * repeats until every character has been the answer once. Same code + same date
 * = same character for every player on Earth, no server needed.
 */
function cycleOrder(cycle: number): Character[] {
  const sorted = [...characters].sort((a, b) => a.id.localeCompare(b.id));
  const rand = rng(hash(`${SHUFFLE_SEED}:${cycle}`));
  for (let i = sorted.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
  }
  return sorted;
}

export function characterForDate(key: string): Character {
  const n = characters.length;
  const day = Math.max(0, daysBetween(EPOCH, key));
  const cycle = Math.floor(day / n);
  return cycleOrder(cycle)[day % n];
}

/** Milliseconds until the next midnight in Swiss time. */
export function msUntilReset(now: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: GAME_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const elapsed = get("hour") * 3600 + get("minute") * 60 + get("second");
  return Math.max(0, (86_400 - elapsed) * 1000 - now.getMilliseconds());
}

export function formatCountdown(ms: number): string {
  const s = Math.floor(ms / 1000);
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}
