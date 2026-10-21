import { Search } from "lucide-react";
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
  onGuess: (id: string) => void;
}

export default function SearchBar({ guessed, disabled, onGuess }: Props) {
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

  useEffect(() => setActive(0), [query]);

  // close when clicking outside
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  // keep the highlighted option visible
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
        <label className="relative flex-1">
          <Search size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
          <input
            type="text"
            role="combobox"
            aria-expanded={showList}
            aria-controls="mcudle-results"
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
            disabled={disabled}
            value={query}
            placeholder={disabled ? "Solved for today" : "Type a character name…"}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            className="h-12 w-full rounded-xl border border-line bg-panel pr-3 pl-10 text-base text-white placeholder:text-muted/70 outline-none transition focus:border-gold/70 focus:ring-2 focus:ring-gold/20 disabled:opacity-60"
          />
        </label>
        <button
          type="button"
          disabled={disabled || results.length === 0}
          onClick={() => pick(results[active])}
          className="h-12 rounded-xl bg-gold px-5 font-bold text-night transition hover:brightness-110 active:scale-95 disabled:opacity-40"
        >
          Guess
        </button>
      </div>

      {showList && (
        <ul
          id="mcudle-results"
          ref={listRef}
          role="listbox"
          className="scroll-thin absolute inset-x-0 top-14 z-30 max-h-72 overflow-y-auto rounded-xl border border-line bg-panel p-1 shadow-2xl shadow-black/60"
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
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 ${i === active ? "bg-panel-2" : ""}`}
            >
              <Portrait character={c} size={36} />
              <div className="min-w-0">
                <div className="truncate font-semibold text-white">{c.name}</div>
                {c.alias && <div className="truncate text-xs text-muted">{c.alias}</div>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
