export type Gender = "Male" | "Female" | "Other" | "N/A";

export type Species =
  | "Human"
  | "Mutant"
  | "Asgardian"
  | "Frost Giant"
  | "Kree"
  | "Skrull"
  | "Eternal"
  | "Celestial"
  | "Titan"
  | "Synthezoid"
  | "AI"
  | "Animal"
  | "Alien";

export type Status = "Alive" | "Deceased";

export type PowerType =
  | "Technology"
  | "Super Soldier"
  | "Magic"
  | "Cosmic"
  | "Gamma"
  | "Biological"
  | "Divine"
  | "Physical/Peak"
  | "None";

export type Affiliation =
  | "Avengers"
  | "Guardians of the Galaxy"
  | "Ravagers"
  | "S.H.I.E.L.D."
  | "Government"
  | "Wakanda"
  | "Talokan"
  | "Masters of the Mystic Arts"
  | "Asgard"
  | "Thunderbolts"
  | "Red Room"
  | "Fantastic Four"
  | "Eternals"
  | "Hydra"
  | "Black Order"
  | "Ten Rings"
  | "TVA"
  | "Kree Empire"
  | "Independent"
  | "Villain";

export type Phase = 1 | 2 | 3 | 4 | 5 | 6;

export interface Character {
  /** Unique slug, also used for the portrait file name: public/portraits/<id>.jpg */
  id: string;
  /** Name shown in the game (usually the hero/villain name) */
  name: string;
  /** Real name or other name people might search for */
  alias?: string;
  /** Portrait path or full URL. Falls back to an initials badge if the image is missing. */
  imageUrl: string;
  gender: Gender;
  /** One or more. Partial (orange) when guess and answer share some but not all values. */
  species: Species[];
  /** Status as of the latest MCU release */
  status: Status;
  powerType: PowerType[];
  affiliation: Affiliation[];
  debutPhase: Phase;
  /** First Marvel Studios project the character appeared in */
  debut: string;
  /**
   * Only for characters added after launch (e.g. by the weekly auto-update): the date they were
   * added, "YYYY-MM-DD". They join the daily draw from the next cycle, so today's answer never changes.
   */
  addedOn?: string;
}

export type TileResult = "correct" | "partial" | "wrong" | "higher" | "lower";
