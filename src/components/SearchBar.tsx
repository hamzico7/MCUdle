import { CornerDownLeft, ScanSearch } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { characters } from "../data/characters";
import type { Character } from "../types";
import Portrait from "./Portrait";

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "");

interface Props {
  guessed: Set<string>;
  disabled: boolean;
  disabledText?: string; // placeholder once the round is over
  onGuess: (id: string) => void;
  /** Hidden word that triggers onSecret instead of a search (Endless dev menu). */
  secret?: string;
  onSecret?: () => void;
}

export default function SearchBar({ guessed, disabled, disabledText = "Target identified", onGuess, secret, onSecret }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo<Character[]>(() => {
    const q = norm(query).trim();
    if (!q) return [];
    const scored: { c: Character; score: number }[] = [];
    for (const c of characters) {
      if (guessed.has(c.id)) continue; // no duplicate guesses
      const name = norm(c.name);
      const alias = norm(c.alias ?? "");
      const words = `${name} ${alias}`.split(" ");
      let score = -1;
      if (name.startsWith(q)) score = 0;
      else if (alias.startsWith(q)) score = 1;
      else if (words.some((w) => w.startsWith(q))) score = 2;
      else if (name.includes(q) || alias.includes(q)) score = 3;
      if (score >= 0) scored.push({ c, score });
    }
    return scored.sort((a, b) => a.score - b.score || a.c.name.localeCompare(b.c.name)).map((s) => s.c);
  }, [query, guessed]);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  useEffect(() => {
    listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const pick = (c: Character | undefined) => {
    if (!c || disabled) return;
    onGuess(c.id);
    setQuery("");
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      pick(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showList = open && results.length > 0;

  return (
    <div ref={boxRef} className="relative">
      <div className="flex gap-2">
        <label className="tile relative flex flex-1 items-center bg-void/80 shadow-[inset_0_0_0_1px_rgb(127_232_255/0.4)] transition focus-within:shadow-[inset_0_0_0_1px_rgb(127_232_255/1),0_0_22px_rgb(127_232_255/0.25)]">
          <ScanSearch size={18} strokeWidth={1.75} className="pointer-events-none absolute left-3.5 text-holo" />
          <input
            type="text"
            role="combobox"
            aria-label="Character name"
            aria-expanded={showList}
            aria-controls="mcudle-results"
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
            disabled={disabled}
            value={query}
            placeholder={disabled ? disabledText : "Identify subject…"}
            onChange={(e) => {
              if (secret && onSecret && norm(e.target.value).trim() === secret) {
                setQuery("");
                setOpen(false);
                onSecret();
                return;
              }
              setQuery(e.target.value);
              setActive(0);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            className="h-12 w-full bg-transparent pr-3 pl-11 text-[17px] font-semibold tracking-wide text-ice uppercase placeholder:font-medium placeholder:normal-case placeholder:text-holo/45 outline-none disabled:opacity-50"
          />
        </label>
        <button
          type="button"
          disabled={disabled || results.length === 0}
          onClick={() => pick(results[active])}
          aria-label="Submit guess"
          className="tile flex h-12 items-center gap-2 bg-holo px-4 font-hud text-[10px] tracking-[0.2em] text-void transition hover:bg-white hover:shadow-[0_0_24px_rgb(127_232_255/0.6)] active:scale-95 disabled:bg-holo/20 disabled:text-holo/50"
        >
          SCAN
          <CornerDownLeft size={14} />
        </button>
      </div>

      {showList && (
        <ul
          id="mcudle-results"
          ref={listRef}
          role="listbox"
          className="scroll-thin absolute inset-x-0 top-14 z-30 m-0 max-h-80 list-none overflow-y-auto bg-[#051424] p-1.5 shadow-[inset_0_0_0_1px_rgb(127_232_255/0.45),0_24px_60px_rgb(0_0_0/0.9)]"
        >
          {results.map((c, i) => (
            <li
              key={c.id}
              role="option"
              aria-selected={i === active}
              onPointerEnter={() => setActive(i)}
              onPointerDown={(e) => {
                e.preventDefault();
                pick(c);
              }}
              className={`relative flex cursor-pointer items-center gap-3 px-2 py-1.5 transition-colors ${
                i === active ? "bg-holo/12" : ""
              }`}
            >
              {i === active && <span className="absolute inset-y-1 left-0 w-0.5 bg-holo glow-line" />}
              <span className="tile block size-10 shrink-0 overflow-hidden shadow-[inset_0_0_0_1px_rgb(127_232_255/0.4)]">
                <Portrait character={c} fill />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[16px] font-bold tracking-wide text-ice uppercase">{c.name}</div>
                {c.alias && <div className="truncate font-mono text-[11px] text-holo/60">{c.alias}</div>}
              </div>
              {i === active && <span className="label hidden text-[8px] sm:inline">SELECT</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
