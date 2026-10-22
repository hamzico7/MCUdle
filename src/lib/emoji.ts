import { characters } from "../data/characters";
import { emojiClues } from "../data/emojis";
import type { Character } from "../types";
import { dailyItem } from "./daily";

/** Changing this reshuffles the emoji order for everyone. Leave it alone once live. */
const EMOJI_SEED = "mcudle-emoji-v1";

/** Characters that have emoji clues (all of them right now). */
const pool = characters.filter((c) => emojiClues[c.id]?.length);

/** Today's emoji character: same for everyone, no repeats until everyone has had a turn. */
export const emojiCharacterForDate = (key: string): Character => dailyItem(pool, key, EMOJI_SEED);
