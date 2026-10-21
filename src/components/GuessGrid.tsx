import { characterById } from "../data/characters";
import { compare } from "../lib/compare";
import type { Character } from "../types";
import Portrait from "./Portrait";
import Tile from "./Tile";

const COLUMNS = ["Hero", "Gender", "Species", "Status", "Power", "Team", "Debut"];

// Shorter labels / soft hyphens (­) so long words break cleanly inside small phone tiles
const SHORT: Record<string, string> = {
  "Masters of the Mystic Arts": "Mystic Arts",
  "Guardians of the Galaxy": "Guardians",
  "Physical/Peak": "Peak Human",
  Technology: "Tech­nology",
  Independent: "Inde­pendent",
  Thunderbolts: "Thunder­bolts",
  Biological: "Bio­logical",
  Government: "Govern­ment",
  Synthezoid: "Synthe­zoid",
  Celestial: "Celes­tial",
  Asgardian: "Asgar­dian",
};
const short = (v: string) => SHORT[v] ?? v;

interface Props {
  guesses: string[]; // oldest first
  answer: Character;
  newestId: string | null; // the row that should animate
}

export default function GuessGrid({ guesses, answer, newestId }: Props) {
  if (guesses.length === 0) return null;
  const rows = [...guesses].reverse(); // newest on top

  return (
    <div className="scroll-thin overflow-x-auto pb-2">
      <div className="mx-auto w-max">
        <div className="mb-2 flex gap-1">
          {COLUMNS.map((c) => (
            <div key={c} className="tile-col shrink-0 border-b border-line pb-1 text-center text-[9px] font-semibold uppercase tracking-wider text-muted sm:text-[10px]">
              {c}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          {rows.map((id) => {
            const g = characterById.get(id);
            if (!g) return null;
            const f = compare(g, answer);
            const animate = id === newestId;
            return (
              <div key={id} className="flex gap-1">
                <Tile index={0} animate={animate} label={g.name} bare>
                  <span className="absolute inset-0 [&>*]:!size-full">
                    <Portrait character={g} size={44} rounded="rounded-none" className="pb-[38%]" />
                  </span>
                  <span className="tile-name absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-0.5 pt-3 pb-0.5 leading-tight">
                    {g.name}
                  </span>
                </Tile>
                <Tile index={1} animate={animate} result={f.gender} label={`Gender ${g.gender}`}>{g.gender}</Tile>
                <Tile index={2} animate={animate} result={f.species} label={`Species ${g.species}`}>{short(g.species)}</Tile>
                <Tile index={3} animate={animate} result={f.status} label={`Status ${g.status}`}>{g.status}</Tile>
                <Tile index={4} animate={animate} result={f.powerType} label={`Power ${g.powerType}`}>{short(g.powerType)}</Tile>
                <Tile index={5} animate={animate} result={f.affiliation} label={`Affiliation ${g.affiliation}`}>{short(g.affiliation)}</Tile>
                <Tile
                  index={6}
                  animate={animate}
                  result={f.debutPhase}
                  label={`Debut phase ${g.debutPhase}${f.debutPhase === "higher" ? ", answer is later" : f.debutPhase === "lower" ? ", answer is earlier" : ""}`}
                >
                  <span className="block text-[0.8em] uppercase tracking-wider opacity-80">Phase</span>
                  <span className="block font-display text-[2em] leading-none">{g.debutPhase}</span>
                </Tile>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
