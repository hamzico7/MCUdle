import { quotes, type Quote } from "../data/quotes";
import { dailyItem } from "./daily";

/** Changing this reshuffles the quote order for everyone. Leave it alone once live. */
const QUOTE_SEED = "mcudle-quote-v1";

/** Today's quote: same for everyone, no repeats until every quote has been used. */
export const quoteForDate = (key: string): Quote => dailyItem(quotes, key, QUOTE_SEED);
