import { TILE_STAGGER } from "../components/Tile";
import type { GuessFeedback } from "./compare";

/** Time for the newest row's 7 tiles to finish flipping (seconds). */
export const FLIP_TIME = 6 * TILE_STAGGER + 0.45;

/** What J.A.R.V.I.S. says about the latest guess. */
export function jarvisReport(name: string, f: GuessFeedback): { text: string; tone: "holo" | "amber" } {
  const results = [f.gender, f.species, f.status, f.powerType, f.affiliation, f.debutPhase];
  const hits = results.filter((r) => r === "correct").length;
  const partials = results.filter((r) => r === "partial").length;
  const phase =
    f.debutPhase === "higher" ? " Target debuted later." : f.debutPhase === "lower" ? " Target debuted earlier." : " Debut phase confirmed.";
  const partialTxt = partials ? `, ${partials} partial` : "";
  if (hits >= 4) return { text: `${name}: ${hits}/6 match${partialTxt}. Very close, sir.${phase}`, tone: "amber" };
  if (hits === 0 && partials === 0) return { text: `${name}: no matching readings. Try a different angle.${phase}`, tone: "holo" };
  return { text: `${name}: ${hits}/6 match${partialTxt}.${phase}`, tone: "holo" };
}
