import type { Character } from "../types";

/*
  MCUDLE character database
  -------------------------
  - Marvel Studios movies + Disney+ shows only.
  - Netflix/Fox/Sony characters are only in here if they showed up in a Marvel Studios
    project, and their debutPhase is that Marvel Studios debut (e.g. Daredevil -> No Way Home).
  - status = state as of October 2026 (after Spider-Man: Brand New Day, Daredevil: Born Again S2,
    Wonder Man, VisionQuest episodes 1-4; before Avengers: Doomsday). Kept up to date by the weekly
    auto-update (see AUTO-UPDATE.md). Characters added later carry addedOn: "YYYY-MM-DD". Only Alive or Deceased: anyone not shown dying counts as Alive (e.g. the Eternals taken by Arishem).
  - Portraits: drop an image at public/portraits/<id>.jpg and it shows up automatically.
    Or set imageUrl to any full https:// link. No image = initials badge.

  species, powerType and affiliation are lists. A character can have more than one value,
  e.g. Star-Lord species ["Human", "Celestial"]. When a guess shares SOME values with the
  answer the tile turns orange (partial); all the same = green; nothing shared = red.

  Category cheat sheet (keep values consistent or matches break):
  species:     Human, Mutant, Asgardian, Frost Giant, Kree, Skrull, Eternal, Celestial,
               Titan, Synthezoid, AI, Animal, Alien
  powerType:   Technology, Super Soldier, Magic, Cosmic, Gamma, Biological (body changed by
               mutation/accident/experiment/herb), Divine, Physical/Peak (trained human), None
  affiliation: see the Affiliation list in src/types.ts
*/

type Entry = Omit<Character, "imageUrl"> & { imageUrl?: string };

const entries: Entry[] = [
  // ── Avengers ─────────────────────────────────────────────────────────────
  { id: "iron-man", name: "Iron Man", alias: "Tony Stark", gender: "Male", species: ["Human"], status: "Deceased", powerType: ["Technology"], affiliation: ["Avengers"], debutPhase: 1, debut: "Iron Man (2008)" },
  { id: "steve-rogers", name: "Steve Rogers", alias: "Captain America (original)", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Super Soldier"], affiliation: ["Avengers", "S.H.I.E.L.D."], debutPhase: 1, debut: "Captain America: The First Avenger (2011)" },
  { id: "thor", name: "Thor", alias: "Thor Odinson", gender: "Male", species: ["Asgardian"], status: "Alive", powerType: ["Divine"], affiliation: ["Avengers", "Asgard"], debutPhase: 1, debut: "Thor (2011)" },
  { id: "hulk", name: "Hulk", alias: "Bruce Banner", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Gamma"], affiliation: ["Avengers"], debutPhase: 1, debut: "The Incredible Hulk (2008)" },
  { id: "black-widow", name: "Black Widow", alias: "Natasha Romanoff", gender: "Female", species: ["Human"], status: "Deceased", powerType: ["Physical/Peak"], affiliation: ["Avengers", "S.H.I.E.L.D.", "Red Room"], debutPhase: 1, debut: "Iron Man 2 (2010)" },
  { id: "hawkeye", name: "Hawkeye", alias: "Clint Barton", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Physical/Peak"], affiliation: ["Avengers", "S.H.I.E.L.D."], debutPhase: 1, debut: "Thor (2011)" },
  { id: "war-machine", name: "War Machine", alias: "James \"Rhodey\" Rhodes", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Technology"], affiliation: ["Avengers", "Government"], debutPhase: 1, debut: "Iron Man (2008)" },
  { id: "scarlet-witch", name: "Scarlet Witch", alias: "Wanda Maximoff", gender: "Female", species: ["Human"], status: "Deceased", powerType: ["Magic", "Cosmic"], affiliation: ["Avengers", "Hydra"], debutPhase: 2, debut: "Captain America: The Winter Soldier (2014)" },
  { id: "quicksilver", name: "Quicksilver", alias: "Pietro Maximoff", gender: "Male", species: ["Human"], status: "Deceased", powerType: ["Biological"], affiliation: ["Avengers", "Hydra"], debutPhase: 2, debut: "Captain America: The Winter Soldier (2014)" },
  { id: "vision", name: "Vision", gender: "Male", species: ["Synthezoid"], status: "Alive", powerType: ["Technology", "Cosmic"], affiliation: ["Avengers"], debutPhase: 2, debut: "Avengers: Age of Ultron (2015)" },
  { id: "sam-wilson", name: "Sam Wilson", alias: "Captain America / Falcon", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Technology"], affiliation: ["Avengers"], debutPhase: 2, debut: "Captain America: The Winter Soldier (2014)" },
  { id: "ant-man", name: "Ant-Man", alias: "Scott Lang", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Technology"], affiliation: ["Avengers"], debutPhase: 2, debut: "Ant-Man (2015)" },
  { id: "wasp", name: "Wasp", alias: "Hope van Dyne", gender: "Female", species: ["Human"], status: "Alive", powerType: ["Technology"], affiliation: ["Avengers"], debutPhase: 2, debut: "Ant-Man (2015)" },
  { id: "spider-man", name: "Spider-Man", alias: "Peter Parker", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Biological", "Technology"], affiliation: ["Avengers"], debutPhase: 3, debut: "Captain America: Civil War (2016)" },
  { id: "captain-marvel", name: "Captain Marvel", alias: "Carol Danvers", gender: "Female", species: ["Human", "Kree"], status: "Alive", powerType: ["Cosmic"], affiliation: ["Avengers", "Kree Empire"], debutPhase: 3, debut: "Captain Marvel (2019)" },
  { id: "falcon-torres", name: "Falcon", alias: "Joaquin Torres", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Technology"], affiliation: ["Avengers"], debutPhase: 4, debut: "The Falcon and the Winter Soldier (2021)" },

  // ── Guardians & cosmic ───────────────────────────────────────────────────
  { id: "star-lord", name: "Star-Lord", alias: "Peter Quill", gender: "Male", species: ["Human", "Celestial"], status: "Alive", powerType: ["Technology"], affiliation: ["Guardians of the Galaxy", "Ravagers"], debutPhase: 2, debut: "Guardians of the Galaxy (2014)" },
  { id: "gamora", name: "Gamora", gender: "Female", species: ["Alien"], status: "Alive", powerType: ["Physical/Peak"], affiliation: ["Guardians of the Galaxy", "Ravagers"], debutPhase: 2, debut: "Guardians of the Galaxy (2014)" },
  { id: "drax", name: "Drax", alias: "Drax the Destroyer", gender: "Male", species: ["Alien"], status: "Alive", powerType: ["Physical/Peak"], affiliation: ["Guardians of the Galaxy"], debutPhase: 2, debut: "Guardians of the Galaxy (2014)" },
  { id: "groot", name: "Groot", gender: "Male", species: ["Alien"], status: "Alive", powerType: ["Biological"], affiliation: ["Guardians of the Galaxy"], debutPhase: 2, debut: "Guardians of the Galaxy (2014)" },
  { id: "rocket", name: "Rocket", alias: "Rocket Raccoon", gender: "Male", species: ["Animal"], status: "Alive", powerType: ["Technology"], affiliation: ["Guardians of the Galaxy", "Avengers"], debutPhase: 2, debut: "Guardians of the Galaxy (2014)" },
  { id: "nebula", name: "Nebula", gender: "Female", species: ["Alien"], status: "Alive", powerType: ["Technology", "Physical/Peak"], affiliation: ["Guardians of the Galaxy", "Avengers"], debutPhase: 2, debut: "Guardians of the Galaxy (2014)" },
  { id: "cosmo", name: "Cosmo", alias: "Cosmo the Spacedog", gender: "Female", species: ["Animal"], status: "Alive", powerType: ["Cosmic"], affiliation: ["Guardians of the Galaxy"], debutPhase: 2, debut: "Guardians of the Galaxy (2014)" },
  { id: "mantis", name: "Mantis", gender: "Female", species: ["Celestial", "Alien"], status: "Alive", powerType: ["Biological"], affiliation: ["Guardians of the Galaxy"], debutPhase: 3, debut: "Guardians of the Galaxy Vol. 2 (2017)" },
  { id: "adam-warlock", name: "Adam Warlock", gender: "Male", species: ["Alien"], status: "Alive", powerType: ["Cosmic"], affiliation: ["Guardians of the Galaxy"], debutPhase: 5, debut: "Guardians of the Galaxy Vol. 3 (2023)" },
  { id: "yondu", name: "Yondu", alias: "Yondu Udonta", gender: "Male", species: ["Alien"], status: "Deceased", powerType: ["Technology"], affiliation: ["Ravagers"], debutPhase: 2, debut: "Guardians of the Galaxy (2014)" },
  { id: "ronan", name: "Ronan the Accuser", gender: "Male", species: ["Kree"], status: "Deceased", powerType: ["Technology"], affiliation: ["Kree Empire"], debutPhase: 2, debut: "Guardians of the Galaxy (2014)" },
  { id: "ego", name: "Ego", alias: "Ego the Living Planet", gender: "Male", species: ["Celestial"], status: "Deceased", powerType: ["Cosmic"], affiliation: ["Villain"], debutPhase: 3, debut: "Guardians of the Galaxy Vol. 2 (2017)" },
  { id: "high-evolutionary", name: "High Evolutionary", gender: "Male", species: ["Alien"], status: "Alive", powerType: ["Technology"], affiliation: ["Villain"], debutPhase: 5, debut: "Guardians of the Galaxy Vol. 3 (2023)" },
  { id: "grandmaster", name: "Grandmaster", gender: "Male", species: ["Alien"], status: "Alive", powerType: ["Cosmic"], affiliation: ["Villain"], debutPhase: 3, debut: "Thor: Ragnarok (2017)" },
  { id: "thanos", name: "Thanos", gender: "Male", species: ["Titan"], status: "Deceased", powerType: ["Cosmic", "Physical/Peak"], affiliation: ["Black Order"], debutPhase: 1, debut: "The Avengers (2012)" },
  { id: "ebony-maw", name: "Ebony Maw", gender: "Male", species: ["Alien"], status: "Deceased", powerType: ["Biological"], affiliation: ["Black Order"], debutPhase: 3, debut: "Avengers: Infinity War (2018)" },
  { id: "proxima-midnight", name: "Proxima Midnight", gender: "Female", species: ["Alien"], status: "Deceased", powerType: ["Physical/Peak"], affiliation: ["Black Order"], debutPhase: 3, debut: "Avengers: Infinity War (2018)" },
  { id: "corvus-glaive", name: "Corvus Glaive", gender: "Male", species: ["Alien"], status: "Deceased", powerType: ["Physical/Peak"], affiliation: ["Black Order"], debutPhase: 3, debut: "Avengers: Infinity War (2018)" },

  // ── Asgard & Thor ────────────────────────────────────────────────────────
  { id: "loki", name: "Loki", alias: "Loki Laufeyson", gender: "Male", species: ["Frost Giant"], status: "Alive", powerType: ["Magic", "Divine"], affiliation: ["Asgard", "TVA"], debutPhase: 1, debut: "Thor (2011)" },
  { id: "odin", name: "Odin", gender: "Male", species: ["Asgardian"], status: "Deceased", powerType: ["Divine"], affiliation: ["Asgard"], debutPhase: 1, debut: "Thor (2011)" },
  { id: "frigga", name: "Frigga", gender: "Female", species: ["Asgardian"], status: "Deceased", powerType: ["Divine", "Magic"], affiliation: ["Asgard"], debutPhase: 1, debut: "Thor (2011)" },
  { id: "heimdall", name: "Heimdall", gender: "Male", species: ["Asgardian"], status: "Deceased", powerType: ["Divine"], affiliation: ["Asgard"], debutPhase: 1, debut: "Thor (2011)" },
  { id: "sif", name: "Sif", alias: "Lady Sif", gender: "Female", species: ["Asgardian"], status: "Alive", powerType: ["Divine"], affiliation: ["Asgard"], debutPhase: 1, debut: "Thor (2011)" },
  { id: "jane-foster", name: "Mighty Thor", alias: "Jane Foster", gender: "Female", species: ["Human"], status: "Deceased", powerType: ["Divine"], affiliation: ["Asgard"], debutPhase: 1, debut: "Thor (2011)" },
  { id: "valkyrie", name: "Valkyrie", alias: "Brunnhilde", gender: "Female", species: ["Asgardian"], status: "Alive", powerType: ["Divine"], affiliation: ["Asgard"], debutPhase: 3, debut: "Thor: Ragnarok (2017)" },
  { id: "korg", name: "Korg", gender: "Male", species: ["Alien"], status: "Alive", powerType: ["Biological"], affiliation: ["Asgard"], debutPhase: 3, debut: "Thor: Ragnarok (2017)" },
  { id: "hela", name: "Hela", gender: "Female", species: ["Asgardian"], status: "Deceased", powerType: ["Divine"], affiliation: ["Villain"], debutPhase: 3, debut: "Thor: Ragnarok (2017)" },
  { id: "malekith", name: "Malekith", gender: "Male", species: ["Alien"], status: "Deceased", powerType: ["Cosmic"], affiliation: ["Villain"], debutPhase: 2, debut: "Thor: The Dark World (2013)" },
  { id: "gorr", name: "Gorr the God Butcher", gender: "Male", species: ["Alien"], status: "Deceased", powerType: ["Magic"], affiliation: ["Villain"], debutPhase: 4, debut: "Thor: Love and Thunder (2022)" },
  { id: "erik-selvig", name: "Erik Selvig", gender: "Male", species: ["Human"], status: "Alive", powerType: ["None"], affiliation: ["Independent"], debutPhase: 1, debut: "Thor (2011)" },
  { id: "darcy-lewis", name: "Darcy Lewis", gender: "Female", species: ["Human"], status: "Alive", powerType: ["None"], affiliation: ["Independent"], debutPhase: 1, debut: "Thor (2011)" },

  // ── S.H.I.E.L.D., government & Captain America ───────────────────────────
  { id: "nick-fury", name: "Nick Fury", gender: "Male", species: ["Human"], status: "Alive", powerType: ["None"], affiliation: ["S.H.I.E.L.D."], debutPhase: 1, debut: "Iron Man (2008)" },
  { id: "maria-hill", name: "Maria Hill", gender: "Female", species: ["Human"], status: "Deceased", powerType: ["Physical/Peak"], affiliation: ["S.H.I.E.L.D."], debutPhase: 1, debut: "The Avengers (2012)" },
  { id: "phil-coulson", name: "Phil Coulson", gender: "Male", species: ["Human"], status: "Deceased", powerType: ["None"], affiliation: ["S.H.I.E.L.D."], debutPhase: 1, debut: "Iron Man (2008)" },
  { id: "peggy-carter", name: "Peggy Carter", gender: "Female", species: ["Human"], status: "Deceased", powerType: ["Physical/Peak"], affiliation: ["S.H.I.E.L.D."], debutPhase: 1, debut: "Captain America: The First Avenger (2011)" },
  { id: "howard-stark", name: "Howard Stark", gender: "Male", species: ["Human"], status: "Deceased", powerType: ["None"], affiliation: ["S.H.I.E.L.D."], debutPhase: 1, debut: "Iron Man 2 (2010)" },
  { id: "talos", name: "Talos", gender: "Male", species: ["Skrull"], status: "Deceased", powerType: ["Biological"], affiliation: ["S.H.I.E.L.D."], debutPhase: 3, debut: "Captain Marvel (2019)" },
  { id: "red-hulk", name: "Red Hulk", alias: "Thaddeus Ross", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Gamma"], affiliation: ["Government"], debutPhase: 1, debut: "The Incredible Hulk (2008)" },
  { id: "everett-ross", name: "Everett Ross", gender: "Male", species: ["Human"], status: "Alive", powerType: ["None"], affiliation: ["Government"], debutPhase: 3, debut: "Captain America: Civil War (2016)" },
  { id: "valentina", name: "Valentina Allegra de Fontaine", alias: "Contessa", gender: "Female", species: ["Human"], status: "Alive", powerType: ["None"], affiliation: ["Government"], debutPhase: 4, debut: "The Falcon and the Winter Soldier (2021)" },
  { id: "isaiah-bradley", name: "Isaiah Bradley", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Super Soldier"], affiliation: ["Independent"], debutPhase: 4, debut: "The Falcon and the Winter Soldier (2021)" },
  { id: "sharon-carter", name: "Sharon Carter", alias: "Power Broker", gender: "Female", species: ["Human"], status: "Alive", powerType: ["Physical/Peak"], affiliation: ["Villain"], debutPhase: 2, debut: "Captain America: The Winter Soldier (2014)" },
  { id: "red-skull", name: "Red Skull", alias: "Johann Schmidt", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Super Soldier"], affiliation: ["Hydra"], debutPhase: 1, debut: "Captain America: The First Avenger (2011)" },
  { id: "alexander-pierce", name: "Alexander Pierce", gender: "Male", species: ["Human"], status: "Deceased", powerType: ["None"], affiliation: ["Hydra", "S.H.I.E.L.D."], debutPhase: 2, debut: "Captain America: The Winter Soldier (2014)" },
  { id: "crossbones", name: "Crossbones", alias: "Brock Rumlow", gender: "Male", species: ["Human"], status: "Deceased", powerType: ["Physical/Peak", "Technology"], affiliation: ["Hydra", "S.H.I.E.L.D."], debutPhase: 2, debut: "Captain America: The Winter Soldier (2014)" },
  { id: "zemo", name: "Baron Zemo", alias: "Helmut Zemo", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Physical/Peak"], affiliation: ["Villain"], debutPhase: 3, debut: "Captain America: Civil War (2016)" },
  { id: "leader", name: "The Leader", alias: "Samuel Sterns", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Gamma"], affiliation: ["Villain"], debutPhase: 1, debut: "The Incredible Hulk (2008)" },
  { id: "abomination", name: "Abomination", alias: "Emil Blonsky", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Super Soldier", "Gamma"], affiliation: ["Villain"], debutPhase: 1, debut: "The Incredible Hulk (2008)" },

  // ── Thunderbolts* & Black Widow ──────────────────────────────────────────
  { id: "bucky", name: "Winter Soldier", alias: "Bucky Barnes", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Super Soldier", "Technology"], affiliation: ["Thunderbolts", "Avengers", "Hydra"], debutPhase: 1, debut: "Captain America: The First Avenger (2011)" },
  { id: "yelena", name: "Yelena Belova", gender: "Female", species: ["Human"], status: "Alive", powerType: ["Physical/Peak"], affiliation: ["Thunderbolts", "Red Room"], debutPhase: 4, debut: "Black Widow (2021)" },
  { id: "red-guardian", name: "Red Guardian", alias: "Alexei Shostakov", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Super Soldier"], affiliation: ["Thunderbolts"], debutPhase: 4, debut: "Black Widow (2021)" },
  { id: "ghost", name: "Ghost", alias: "Ava Starr", gender: "Female", species: ["Human"], status: "Alive", powerType: ["Biological", "Technology"], affiliation: ["Thunderbolts"], debutPhase: 3, debut: "Ant-Man and the Wasp (2018)" },
  { id: "us-agent", name: "U.S. Agent", alias: "John Walker", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Super Soldier"], affiliation: ["Thunderbolts", "Government"], debutPhase: 4, debut: "The Falcon and the Winter Soldier (2021)" },
  { id: "sentry", name: "Sentry", alias: "Bob Reynolds", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Super Soldier"], affiliation: ["Thunderbolts"], debutPhase: 5, debut: "Thunderbolts* (2025)" },
  { id: "melina", name: "Melina Vostokoff", gender: "Female", species: ["Human"], status: "Alive", powerType: ["Physical/Peak"], affiliation: ["Red Room"], debutPhase: 4, debut: "Black Widow (2021)" },
  { id: "taskmaster", name: "Taskmaster", alias: "Antonia Dreykov", gender: "Female", species: ["Human"], status: "Deceased", powerType: ["Technology", "Physical/Peak"], affiliation: ["Red Room"], debutPhase: 4, debut: "Black Widow (2021)" },
  { id: "dreykov", name: "Dreykov", gender: "Male", species: ["Human"], status: "Deceased", powerType: ["None"], affiliation: ["Red Room"], debutPhase: 4, debut: "Black Widow (2021)" },

  // ── Wakanda & Talokan ────────────────────────────────────────────────────
  { id: "black-panther", name: "Black Panther", alias: "T'Challa", gender: "Male", species: ["Human"], status: "Deceased", powerType: ["Biological", "Technology"], affiliation: ["Wakanda", "Avengers"], debutPhase: 3, debut: "Captain America: Civil War (2016)" },
  { id: "shuri", name: "Shuri", alias: "Black Panther", gender: "Female", species: ["Human"], status: "Alive", powerType: ["Biological", "Technology"], affiliation: ["Wakanda"], debutPhase: 3, debut: "Black Panther (2018)" },
  { id: "okoye", name: "Okoye", gender: "Female", species: ["Human"], status: "Alive", powerType: ["Physical/Peak"], affiliation: ["Wakanda"], debutPhase: 3, debut: "Black Panther (2018)" },
  { id: "nakia", name: "Nakia", gender: "Female", species: ["Human"], status: "Alive", powerType: ["Physical/Peak"], affiliation: ["Wakanda"], debutPhase: 3, debut: "Black Panther (2018)" },
  { id: "mbaku", name: "M'Baku", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Physical/Peak"], affiliation: ["Wakanda"], debutPhase: 3, debut: "Black Panther (2018)" },
  { id: "ramonda", name: "Ramonda", alias: "Queen Ramonda", gender: "Female", species: ["Human"], status: "Deceased", powerType: ["None"], affiliation: ["Wakanda"], debutPhase: 3, debut: "Black Panther (2018)" },
  { id: "killmonger", name: "Killmonger", alias: "Erik Stevens", gender: "Male", species: ["Human"], status: "Deceased", powerType: ["Biological", "Technology"], affiliation: ["Villain"], debutPhase: 3, debut: "Black Panther (2018)" },
  { id: "klaue", name: "Ulysses Klaue", alias: "Klaw", gender: "Male", species: ["Human"], status: "Deceased", powerType: ["Technology"], affiliation: ["Villain"], debutPhase: 2, debut: "Avengers: Age of Ultron (2015)" },
  { id: "namor", name: "Namor", gender: "Male", species: ["Mutant"], status: "Alive", powerType: ["Biological"], affiliation: ["Talokan"], debutPhase: 4, debut: "Black Panther: Wakanda Forever (2022)" },
  { id: "ironheart", name: "Ironheart", alias: "Riri Williams", gender: "Female", species: ["Human"], status: "Alive", powerType: ["Technology"], affiliation: ["Independent"], debutPhase: 4, debut: "Black Panther: Wakanda Forever (2022)" },
  { id: "the-hood", name: "The Hood", alias: "Parker Robbins", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Magic"], affiliation: ["Villain"], debutPhase: 5, debut: "Ironheart (2025)" },

  // ── Mystic side ──────────────────────────────────────────────────────────
  { id: "doctor-strange", name: "Doctor Strange", alias: "Stephen Strange", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Magic"], affiliation: ["Masters of the Mystic Arts", "Avengers"], debutPhase: 3, debut: "Doctor Strange (2016)" },
  { id: "wong", name: "Wong", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Magic"], affiliation: ["Masters of the Mystic Arts"], debutPhase: 3, debut: "Doctor Strange (2016)" },
  { id: "ancient-one", name: "The Ancient One", gender: "Female", species: ["Human"], status: "Deceased", powerType: ["Magic"], affiliation: ["Masters of the Mystic Arts"], debutPhase: 3, debut: "Doctor Strange (2016)" },
  { id: "mordo", name: "Karl Mordo", alias: "Baron Mordo", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Magic"], affiliation: ["Independent"], debutPhase: 3, debut: "Doctor Strange (2016)" },
  { id: "kaecilius", name: "Kaecilius", gender: "Male", species: ["Human"], status: "Deceased", powerType: ["Magic"], affiliation: ["Villain"], debutPhase: 3, debut: "Doctor Strange (2016)" },
  { id: "christine-palmer", name: "Christine Palmer", gender: "Female", species: ["Human"], status: "Alive", powerType: ["None"], affiliation: ["Independent"], debutPhase: 3, debut: "Doctor Strange (2016)" },
  { id: "america-chavez", name: "America Chavez", gender: "Female", species: ["Human"], status: "Alive", powerType: ["Cosmic"], affiliation: ["Masters of the Mystic Arts"], debutPhase: 4, debut: "Doctor Strange in the Multiverse of Madness (2022)" },
  { id: "agatha", name: "Agatha Harkness", gender: "Female", species: ["Human"], status: "Deceased", powerType: ["Magic"], affiliation: ["Villain"], debutPhase: 4, debut: "WandaVision (2021)" },
  { id: "wiccan", name: "Wiccan", alias: "Billy Maximoff", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Magic"], affiliation: ["Independent"], debutPhase: 4, debut: "WandaVision (2021)" },
  { id: "tommy", name: "Tommy Maximoff", alias: "Thomas Shepherd", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Magic"], affiliation: ["Independent"], debutPhase: 4, debut: "WandaVision (2021)", addedOn: "2026-10-26" },
  { id: "werewolf-by-night", name: "Werewolf by Night", alias: "Jack Russell", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Magic"], affiliation: ["Independent"], debutPhase: 4, debut: "Werewolf by Night (2022)" },
  { id: "elsa-bloodstone", name: "Elsa Bloodstone", gender: "Female", species: ["Human"], status: "Alive", powerType: ["Physical/Peak", "Magic"], affiliation: ["Independent"], debutPhase: 4, debut: "Werewolf by Night (2022)" },
  { id: "moon-knight", name: "Moon Knight", alias: "Marc Spector", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Divine", "Physical/Peak"], affiliation: ["Independent"], debutPhase: 4, debut: "Moon Knight (2022)" },
  { id: "scarlet-scarab", name: "Scarlet Scarab", alias: "Layla El-Faouly", gender: "Female", species: ["Human"], status: "Alive", powerType: ["Divine"], affiliation: ["Independent"], debutPhase: 4, debut: "Moon Knight (2022)" },
  { id: "arthur-harrow", name: "Arthur Harrow", gender: "Male", species: ["Human"], status: "Deceased", powerType: ["Divine"], affiliation: ["Villain"], debutPhase: 4, debut: "Moon Knight (2022)" },

  // ── Ten Rings ────────────────────────────────────────────────────────────
  { id: "shang-chi", name: "Shang-Chi", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Magic", "Physical/Peak"], affiliation: ["Independent"], debutPhase: 4, debut: "Shang-Chi and the Legend of the Ten Rings (2021)" },
  { id: "wenwu", name: "Wenwu", alias: "Xu Wenwu", gender: "Male", species: ["Human"], status: "Deceased", powerType: ["Magic", "Physical/Peak"], affiliation: ["Ten Rings"], debutPhase: 4, debut: "Shang-Chi and the Legend of the Ten Rings (2021)" },
  { id: "xialing", name: "Xialing", alias: "Xu Xialing", gender: "Female", species: ["Human"], status: "Alive", powerType: ["Physical/Peak"], affiliation: ["Ten Rings"], debutPhase: 4, debut: "Shang-Chi and the Legend of the Ten Rings (2021)" },
  { id: "katy", name: "Katy Chen", gender: "Female", species: ["Human"], status: "Alive", powerType: ["Physical/Peak"], affiliation: ["Independent"], debutPhase: 4, debut: "Shang-Chi and the Legend of the Ten Rings (2021)" },
  { id: "trevor-slattery", name: "Trevor Slattery", alias: "\"The Mandarin\"", gender: "Male", species: ["Human"], status: "Alive", powerType: ["None"], affiliation: ["Independent"], debutPhase: 2, debut: "Iron Man 3 (2013)" },
  { id: "wonder-man", name: "Wonder Man", alias: "Simon Williams", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Cosmic"], affiliation: ["Independent"], debutPhase: 6, debut: "Wonder Man (2026)" },

  // ── Eternals ─────────────────────────────────────────────────────────────
  { id: "sersi", name: "Sersi", gender: "Female", species: ["Eternal"], status: "Alive", powerType: ["Cosmic"], affiliation: ["Eternals"], debutPhase: 4, debut: "Eternals (2021)" },
  { id: "ikaris", name: "Ikaris", gender: "Male", species: ["Eternal"], status: "Deceased", powerType: ["Cosmic"], affiliation: ["Eternals"], debutPhase: 4, debut: "Eternals (2021)" },
  { id: "thena", name: "Thena", gender: "Female", species: ["Eternal"], status: "Alive", powerType: ["Cosmic"], affiliation: ["Eternals"], debutPhase: 4, debut: "Eternals (2021)" },
  { id: "kingo", name: "Kingo", gender: "Male", species: ["Eternal"], status: "Alive", powerType: ["Cosmic"], affiliation: ["Eternals"], debutPhase: 4, debut: "Eternals (2021)" },
  { id: "ajak", name: "Ajak", gender: "Female", species: ["Eternal"], status: "Deceased", powerType: ["Cosmic"], affiliation: ["Eternals"], debutPhase: 4, debut: "Eternals (2021)" },
  { id: "druig", name: "Druig", gender: "Male", species: ["Eternal"], status: "Alive", powerType: ["Cosmic"], affiliation: ["Eternals"], debutPhase: 4, debut: "Eternals (2021)" },
  { id: "makkari", name: "Makkari", gender: "Female", species: ["Eternal"], status: "Alive", powerType: ["Cosmic"], affiliation: ["Eternals"], debutPhase: 4, debut: "Eternals (2021)" },
  { id: "gilgamesh", name: "Gilgamesh", gender: "Male", species: ["Eternal"], status: "Deceased", powerType: ["Cosmic"], affiliation: ["Eternals"], debutPhase: 4, debut: "Eternals (2021)" },

  // ── Quantum Realm & TVA ──────────────────────────────────────────────────
  { id: "hank-pym", name: "Hank Pym", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Technology"], affiliation: ["S.H.I.E.L.D."], debutPhase: 2, debut: "Ant-Man (2015)" },
  { id: "cassie-lang", name: "Cassie Lang", gender: "Female", species: ["Human"], status: "Alive", powerType: ["Technology"], affiliation: ["Independent"], debutPhase: 2, debut: "Ant-Man (2015)" },
  { id: "modok", name: "M.O.D.O.K.", alias: "Darren Cross / Yellowjacket", gender: "Male", species: ["Human"], status: "Deceased", powerType: ["Technology"], affiliation: ["Villain"], debutPhase: 2, debut: "Ant-Man (2015)" },
  { id: "kang", name: "Kang the Conqueror", gender: "Male", species: ["Human"], status: "Deceased", powerType: ["Technology"], affiliation: ["Villain"], debutPhase: 5, debut: "Ant-Man and the Wasp: Quantumania (2023)" },
  { id: "he-who-remains", name: "He Who Remains", gender: "Male", species: ["Human"], status: "Deceased", powerType: ["Technology"], affiliation: ["TVA"], debutPhase: 4, debut: "Loki (2021)" },
  { id: "mobius", name: "Mobius", alias: "Mobius M. Mobius", gender: "Male", species: ["Human"], status: "Alive", powerType: ["None"], affiliation: ["TVA"], debutPhase: 4, debut: "Loki (2021)" },
  { id: "sylvie", name: "Sylvie", gender: "Female", species: ["Frost Giant"], status: "Alive", powerType: ["Magic", "Divine"], affiliation: ["Independent"], debutPhase: 4, debut: "Loki (2021)" },

  // ── Captain Marvel & Kree / Skrull ───────────────────────────────────────
  { id: "monica-rambeau", name: "Monica Rambeau", gender: "Female", species: ["Human"], status: "Alive", powerType: ["Cosmic"], affiliation: ["Independent"], debutPhase: 3, debut: "Captain Marvel (2019)" },
  { id: "ms-marvel", name: "Ms. Marvel", alias: "Kamala Khan", gender: "Female", species: ["Mutant"], status: "Alive", powerType: ["Cosmic", "Biological"], affiliation: ["Independent"], debutPhase: 4, debut: "Ms. Marvel (2022)" },
  { id: "yon-rogg", name: "Yon-Rogg", gender: "Male", species: ["Kree"], status: "Alive", powerType: ["Physical/Peak"], affiliation: ["Kree Empire"], debutPhase: 3, debut: "Captain Marvel (2019)" },
  { id: "dar-benn", name: "Dar-Benn", gender: "Female", species: ["Kree"], status: "Deceased", powerType: ["Cosmic"], affiliation: ["Kree Empire"], debutPhase: 5, debut: "The Marvels (2023)" },
  { id: "gravik", name: "Gravik", gender: "Male", species: ["Skrull"], status: "Deceased", powerType: ["Biological"], affiliation: ["Villain"], debutPhase: 5, debut: "Secret Invasion (2023)" },

  // ── Spider-Man's corner ──────────────────────────────────────────────────
  { id: "mj", name: "MJ", alias: "Michelle Jones-Watson", gender: "Female", species: ["Human"], status: "Alive", powerType: ["None"], affiliation: ["Independent"], debutPhase: 3, debut: "Spider-Man: Homecoming (2017)" },
  { id: "ned", name: "Ned Leeds", gender: "Male", species: ["Human"], status: "Alive", powerType: ["None"], affiliation: ["Independent"], debutPhase: 3, debut: "Spider-Man: Homecoming (2017)" },
  { id: "aunt-may", name: "May Parker", alias: "Aunt May", gender: "Female", species: ["Human"], status: "Deceased", powerType: ["None"], affiliation: ["Independent"], debutPhase: 3, debut: "Captain America: Civil War (2016)" },
  { id: "happy-hogan", name: "Happy Hogan", gender: "Male", species: ["Human"], status: "Alive", powerType: ["None"], affiliation: ["Independent"], debutPhase: 1, debut: "Iron Man (2008)" },
  { id: "pepper-potts", name: "Pepper Potts", alias: "Rescue", gender: "Female", species: ["Human"], status: "Alive", powerType: ["Technology"], affiliation: ["Independent"], debutPhase: 1, debut: "Iron Man (2008)" },
  { id: "vulture", name: "Vulture", alias: "Adrian Toomes", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Technology"], affiliation: ["Villain"], debutPhase: 3, debut: "Spider-Man: Homecoming (2017)" },
  { id: "mysterio", name: "Mysterio", alias: "Quentin Beck", gender: "Male", species: ["Human"], status: "Deceased", powerType: ["Technology"], affiliation: ["Villain"], debutPhase: 3, debut: "Spider-Man: Far From Home (2019)" },
  { id: "jean-grey", name: "Jean Grey", gender: "Female", species: ["Mutant"], status: "Alive", powerType: ["Biological"], affiliation: ["Independent"], debutPhase: 6, debut: "Spider-Man: Brand New Day (2026)" },
  { id: "bill-metzger", name: "Bill Metzger", gender: "Male", species: ["Human"], status: "Alive", powerType: ["None"], affiliation: ["Government"], debutPhase: 6, debut: "Spider-Man: Brand New Day (2026)" },

  // ── Street level ─────────────────────────────────────────────────────────
  { id: "daredevil", name: "Daredevil", alias: "Matt Murdock", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Biological", "Physical/Peak"], affiliation: ["Independent"], debutPhase: 4, debut: "Spider-Man: No Way Home (2021)" },
  { id: "kingpin", name: "Kingpin", alias: "Wilson Fisk", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Physical/Peak"], affiliation: ["Villain"], debutPhase: 4, debut: "Hawkeye (2021)" },
  { id: "punisher", name: "Punisher", alias: "Frank Castle", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Physical/Peak"], affiliation: ["Independent"], debutPhase: 5, debut: "Daredevil: Born Again (2025)" },
  { id: "karen-page", name: "Karen Page", gender: "Female", species: ["Human"], status: "Alive", powerType: ["None"], affiliation: ["Independent"], debutPhase: 5, debut: "Daredevil: Born Again (2025)" },
  { id: "bullseye", name: "Bullseye", alias: "Benjamin Poindexter", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Physical/Peak"], affiliation: ["Villain"], debutPhase: 5, debut: "Daredevil: Born Again (2025)" },
  { id: "jessica-jones", name: "Jessica Jones", gender: "Female", species: ["Human"], status: "Alive", powerType: ["Biological"], affiliation: ["Independent"], debutPhase: 6, debut: "Daredevil: Born Again Season 2 (2026)" },
  { id: "luke-cage", name: "Luke Cage", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Biological"], affiliation: ["Independent"], debutPhase: 6, debut: "Daredevil: Born Again Season 2 (2026)" },
  { id: "kate-bishop", name: "Kate Bishop", alias: "Hawkeye", gender: "Female", species: ["Human"], status: "Alive", powerType: ["Physical/Peak"], affiliation: ["Independent"], debutPhase: 4, debut: "Hawkeye (2021)" },
  { id: "echo", name: "Echo", alias: "Maya Lopez", gender: "Female", species: ["Human"], status: "Alive", powerType: ["Physical/Peak"], affiliation: ["Independent"], debutPhase: 4, debut: "Hawkeye (2021)" },
  { id: "she-hulk", name: "She-Hulk", alias: "Jennifer Walters", gender: "Female", species: ["Human"], status: "Alive", powerType: ["Gamma"], affiliation: ["Independent"], debutPhase: 4, debut: "She-Hulk: Attorney at Law (2022)" },

  // ── Iron Man villains ────────────────────────────────────────────────────
  { id: "iron-monger", name: "Iron Monger", alias: "Obadiah Stane", gender: "Male", species: ["Human"], status: "Deceased", powerType: ["Technology"], affiliation: ["Villain"], debutPhase: 1, debut: "Iron Man (2008)" },
  { id: "whiplash", name: "Whiplash", alias: "Ivan Vanko", gender: "Male", species: ["Human"], status: "Deceased", powerType: ["Technology"], affiliation: ["Villain"], debutPhase: 1, debut: "Iron Man 2 (2010)" },
  { id: "justin-hammer", name: "Justin Hammer", gender: "Male", species: ["Human"], status: "Alive", powerType: ["None"], affiliation: ["Villain"], debutPhase: 1, debut: "Iron Man 2 (2010)" },
  { id: "aldrich-killian", name: "Aldrich Killian", gender: "Male", species: ["Human"], status: "Deceased", powerType: ["Biological"], affiliation: ["Villain"], debutPhase: 2, debut: "Iron Man 3 (2013)" },
  { id: "ultron", name: "Ultron", gender: "Male", species: ["AI"], status: "Alive", powerType: ["Technology"], affiliation: ["Villain"], debutPhase: 2, debut: "Avengers: Age of Ultron (2015)" },
  { id: "jocasta", name: "Jocasta", alias: "Jo Carrington", gender: "Female", species: ["Synthezoid"], status: "Alive", powerType: ["Technology"], affiliation: ["Villain"], debutPhase: 6, debut: "VisionQuest (2026)", addedOn: "2026-10-26" },
  { id: "paladin", name: "Paladin", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Technology", "Physical/Peak"], affiliation: ["Villain"], debutPhase: 6, debut: "VisionQuest (2026)", addedOn: "2026-10-26" },

  // ── Fantastic Four ───────────────────────────────────────────────────────
  { id: "mister-fantastic", name: "Mister Fantastic", alias: "Reed Richards", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Cosmic"], affiliation: ["Fantastic Four"], debutPhase: 6, debut: "The Fantastic Four: First Steps (2025)" },
  { id: "invisible-woman", name: "Invisible Woman", alias: "Sue Storm", gender: "Female", species: ["Human"], status: "Alive", powerType: ["Cosmic"], affiliation: ["Fantastic Four"], debutPhase: 6, debut: "The Fantastic Four: First Steps (2025)" },
  { id: "human-torch", name: "Human Torch", alias: "Johnny Storm", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Cosmic"], affiliation: ["Fantastic Four"], debutPhase: 6, debut: "The Fantastic Four: First Steps (2025)" },
  { id: "the-thing", name: "The Thing", alias: "Ben Grimm", gender: "Male", species: ["Human"], status: "Alive", powerType: ["Cosmic"], affiliation: ["Fantastic Four"], debutPhase: 6, debut: "The Fantastic Four: First Steps (2025)" },
  { id: "galactus", name: "Galactus", gender: "Male", species: ["Alien"], status: "Alive", powerType: ["Cosmic"], affiliation: ["Villain"], debutPhase: 6, debut: "The Fantastic Four: First Steps (2025)" },
  { id: "silver-surfer", name: "Silver Surfer", alias: "Shalla-Bal", gender: "Female", species: ["Alien"], status: "Alive", powerType: ["Cosmic"], affiliation: ["Villain"], debutPhase: 6, debut: "The Fantastic Four: First Steps (2025)" },

  // ── Multiverse ───────────────────────────────────────────────────────────
  { id: "deadpool", name: "Deadpool", alias: "Wade Wilson", gender: "Male", species: ["Mutant"], status: "Alive", powerType: ["Biological"], affiliation: ["Independent"], debutPhase: 5, debut: "Deadpool & Wolverine (2024)" },
  { id: "wolverine", name: "Wolverine", alias: "Logan", gender: "Male", species: ["Mutant"], status: "Alive", powerType: ["Biological"], affiliation: ["Independent"], debutPhase: 5, debut: "Deadpool & Wolverine (2024)" },
  { id: "cassandra-nova", name: "Cassandra Nova", gender: "Female", species: ["Mutant"], status: "Deceased", powerType: ["Biological"], affiliation: ["Villain"], debutPhase: 5, debut: "Deadpool & Wolverine (2024)" },
];

export const characters: Character[] = entries.map((e) => ({
  ...e,
  imageUrl: e.imageUrl ?? `/portraits/${e.id}.jpg`,
}));

export const characterById = new Map(characters.map((c) => [c.id, c]));
