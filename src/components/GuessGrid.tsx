import { characterById } from "../data/characters";
import { compare } from "../lib/compare";
import type { Character } from "../types";
import Portrait from "./Portrait";
import Tile from "./Tile";

const COLUMNS = ["Subject", "Gender", "Species", "Status", "Power", "Team", "Debut"];

// Short labels / soft hyphens (­) so long words break cleanly inside small phone tiles
const SHORT: Record<string, string> = {
  "Masters of the Mystic Arts": "Mystic Arts",
  "Guardians of the Galaxy": "Guardians",
  "Physical/Peak": "Peak Human",
  "Super Soldier": "Super Soldier",
  "Fantastic Four": "Fantastic 4",
  "Kree Empire": "Kree",
  Technology: "Tech",
  Independent: "Solo",
  Thunderbolts: "Thunder­bolts",
  Biological: "Bio­logical",
  Government: "Govern­ment",
  Synthezoid: "Synthe­zoid",
  Celestial: "Celes­tial",
  Asgardian: "Asgar­dian",
};
const short = (v: string) => SHORT[v] ?? v;

/** Shrink a little for 8–9 letter words (e.g. DECEASED) so they fit on one line on phones. */
const fit = (v: string) => {
  const longest = Math.max(...short(v).split(/[\s­]/).map((w) => w.length));
  return longest >= 8 && longest <= 9 ? 7.2 / longest : 1;
};

/** One or more values stacked; smaller text when there are several. */
function Values({ values }: { values: readonly string[] }) {
  const base = values.length >= 3 ? 0.68 : values.length === 2 ? 0.82 : 1;
  const size = `${base * Math.min(...values.map(fit))}em`;
  return (
    <span className="flex flex-col gap-[0.25em]" style={{ fontSize: size }}>
      {values.map((v) => (
        <span key={v}>{short(v)}</span>
      ))}
    </span>
  );
}

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
            <div key={c} className="tile-col shrink-0 border-b border-holo/30 pb-1.5 text-center font-sans text-[10px] font-bold tracking-[0.06em] text-holo/80 uppercase min-[400px]:font-hud min-[400px]:font-normal min-[400px]:text-[6.5px] min-[400px]:tracking-[0.1em] sm:text-[7.5px]">
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
                  <span className="absolute inset-0">
                    <Portrait character={g} fill />
                  </span>
                  <span className="tile-name absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent px-0.5 pt-3 pb-0.5 leading-tight font-bold">
                    {g.name}
                  </span>
                </Tile>
                <Tile index={1} animate={animate} result={f.gender} label={`Gender ${g.gender}`}>
                  <Values values={[g.gender]} />
                </Tile>
                <Tile index={2} animate={animate} result={f.species} label={`Species ${g.species.join(", ")}`}>
                  <Values values={g.species} />
                </Tile>
                <Tile index={3} animate={animate} result={f.status} label={`Status ${g.status}`}>
                  <Values values={[g.status]} />
                </Tile>
                <Tile index={4} animate={animate} result={f.powerType} label={`Power ${g.powerType.join(", ")}`}>
                  <Values values={g.powerType} />
                </Tile>
                <Tile index={5} animate={animate} result={f.affiliation} label={`Affiliation ${g.affiliation.join(", ")}`}>
                  <Values values={g.affiliation} />
                </Tile>
                <Tile
                  index={6}
                  animate={animate}
                  result={f.debutPhase}
                  label={`Debut phase ${g.debutPhase}${f.debutPhase === "higher" ? ", answer is later" : f.debutPhase === "lower" ? ", answer is earlier" : ""}`}
                >
                  <span className="block font-hud text-[0.55em] tracking-widest opacity-80">PH</span>
                  <span className="block font-hud text-[2em] leading-none">{g.debutPhase}</span>
                </Tile>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
