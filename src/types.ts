export type Gender = "Male" | "Female" | "Other" | "N/A";

export type Species =
  | "Human"
  | "Mutant"
  | "Hybrid"
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

export type Status = "Alive" | "Deceased" | "Unknown";

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
  species: Species;
  /** Status as of the current MCU (Oct 2026, before Avengers: Doomsday) */
  status: Status;
  powerType: PowerType;
  affiliation: Affiliation;
  debutPhase: Phase;
  /** First Marvel Studios project the character appeared in */
  debut: string;
}

export type TileResult = "correct" | "wrong" | "higher" | "lower";
