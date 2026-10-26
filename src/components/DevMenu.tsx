import { FlaskConical, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { characterById, characters } from "../data/characters";
import { emojiClues } from "../data/emojis";
import { quotes } from "../data/quotes";
import type { Character } from "../types";
import Modal from "./Modal";
import Portrait from "./Portrait";

/*
  Secret dev menu (type "hamzico" into the Endless search box).
  Browse every character, check its data, emoji clues and quotes, and start an Endless
  test round with it as the answer. Test rounds never touch stats or streaks.
*/

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

// newest additions first (they carry addedOn), then A–Z
const sorted = [...characters].sort((a, b) => (b.addedOn ?? "").localeCompare(a.addedOn ?? "") || a.name.localeCompare(b.name));

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="contents">
      <dt className="font-mono text-[11px] text-holo/60 uppercase">{label}</dt>
      <dd className="m-0 text-[13px] text-ice">{value}</dd>
    </div>
  );
}

function Details({ c, onTest }: { c: Character; onTest: (id: string) => void }) {
  const clues = emojiClues[c.id] ?? [];
  const lines = quotes.filter((q) => q.characterId === c.id);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="tile size-16 shrink-0 overflow-hidden">
          <Portrait character={c} fill />
        </span>
        <div className="min-w-0 flex-1">
          <div className="font-hud text-[14px] tracking-wider text-white uppercase">{c.name}</div>
          <div className="font-mono text-[11px] text-holo/70">
            {c.id}
            {c.addedOn && <span className="ml-2 text-amber">ADDED {c.addedOn}</span>}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onTest(c.id)}
          className="tile flex h-10 shrink-0 items-center gap-1.5 bg-amber px-3 font-hud text-[10px] tracking-[0.18em] text-void transition hover:bg-white active:scale-95"
        >
          <FlaskConical size={14} /> TEST
        </button>
      </div>

      <dl className="m-0 grid grid-cols-[4.5rem_1fr] gap-x-3 gap-y-1">
        {c.alias && <Field label="Alias" value={c.alias} />}
        <Field label="Gender" value={c.gender} />
        <Field label="Species" value={c.species.join(", ")} />
        <Field label="Status" value={c.status} />
        <Field label="Power" value={c.powerType.join(", ")} />
        <Field label="Team" value={c.affiliation.join(", ")} />
        <Field label="Debut" value={`Phase ${c.debutPhase} · ${c.debut}`} />
      </dl>

      <div>
        <div className="mb-1 font-mono text-[11px] text-holo/60">EMOJI CLUES</div>
        <div className="text-[26px] leading-none tracking-[0.15em]">{clues.length ? clues.join("") : "—"}</div>
      </div>

      <div>
        <div className="mb-1 font-mono text-[11px] text-holo/60">QUOTES ({lines.length})</div>
        {lines.length ? (
          <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
            {lines.map((q) => (
              <li key={q.id} className="text-[13px] leading-snug text-ice/85">
                "{q.text}" <span className="font-mono text-[10.5px] text-holo/55">— {q.source}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-[13px] text-ice/50">No quotes for this character.</div>
        )}
      </div>
    </div>
  );
}

export default function DevMenu({ open, onClose, onTest }: { open: boolean; onClose: () => void; onTest: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [newOnly, setNewOnly] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const list = useMemo(() => {
    const q = norm(query.trim());
    return sorted.filter((c) => (!newOnly || c.addedOn) && (!q || norm(`${c.name} ${c.alias ?? ""} ${c.id}`).includes(q)));
  }, [query, newOnly]);

  const newCount = characters.filter((c) => c.addedOn).length;
  const pick = selected ? characterById.get(selected) : undefined;

  return (
    <Modal open={open} title="Dev menu" code={`${characters.length} PROFILES // ${newCount} NEW`} onClose={onClose}>
      {pick ? (
        <div className="flex flex-col gap-3">
          <button type="button" onClick={() => setSelected(null)} className="self-start font-mono text-[11px] text-holo/70 hover:text-holo">
            ← BACK TO LIST
          </button>
          <Details c={pick} onTest={onTest} />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <label className="tile relative flex flex-1 items-center bg-void/80 shadow-[inset_0_0_0_1px_rgb(127_232_255/0.4)]">
              <Search size={15} className="pointer-events-none absolute left-3 text-holo" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search characters…"
                autoComplete="off"
                spellCheck={false}
                className="h-10 w-full bg-transparent pr-3 pl-9 text-[15px] text-ice placeholder:text-holo/45 outline-none"
              />
            </label>
            <button
              type="button"
              onClick={() => setNewOnly((v) => !v)}
              aria-pressed={newOnly}
              className={`tile h-10 shrink-0 px-3 font-mono text-[11px] transition ${
                newOnly ? "bg-amber text-void" : "bg-deep/80 text-holo shadow-[inset_0_0_0_1px_rgb(127_232_255/0.35)]"
              }`}
            >
              NEW ONLY
            </button>
          </div>

          <ul className="scroll-thin m-0 flex max-h-[55vh] list-none flex-col gap-1 overflow-y-auto p-0">
            {list.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setSelected(c.id)}
                  className="tile flex w-full items-center gap-3 bg-deep/70 py-1 pr-3 pl-1 text-left transition hover:bg-holo/15"
                >
                  <span className="tile size-9 shrink-0 overflow-hidden">
                    <Portrait character={c} fill />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[14px] font-semibold tracking-wide text-ice uppercase">{c.name}</span>
                  {c.addedOn && <span className="font-mono text-[10px] text-amber">NEW</span>}
                </button>
              </li>
            ))}
            {!list.length && <li className="py-3 text-center text-[13px] text-ice/50">No match.</li>}
          </ul>
        </div>
      )}
    </Modal>
  );
}
