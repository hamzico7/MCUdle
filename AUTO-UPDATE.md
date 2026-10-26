# MCUDLE weekly auto-update

Instructions for the weekly scheduled Claude task that keeps the MCU data up to date.
Hamza (the owner) reviews and merges the pull request it opens. Nothing goes live without that.

## Rules

- **Never push to `main`.** Work on a branch named `auto-update/YYYY-MM-DD` (today's date, Europe/Berlin) and open a pull request into `main`.
- If an `auto-update/*` pull request is already open, update that branch instead of opening a second one (rebase it on `main` first).
- **Only released content counts.** Use a movie or show only once it has actually been released (the episode has aired, or the film is out in cinemas or on Disney+). Ignore trailers, set photos, leaks and rumours.
- **Look everything up**, don't assume. The source of truth is the MCU Fandom wiki (https://marvelcinematicuniverse.fandom.com). Use web search only to confirm release dates.
- Only Marvel Studios movies, Marvel Studios Disney+ series and Marvel Studios specials count. No Sony Spider-Man Universe, Fox, Netflix, ABC or Hulu shows, What If…? or other animated alternate universes, comics, or games.
- Never remove characters or quotes. Never change an existing `id`. Never touch `SHUFFLE_SEED`, `EPOCH`, the quote/emoji seeds, the logo or any UI code.
- If nothing changed since the last check, don't create a branch or pull request. Just stop.

## Steps

1. Read the **Log** at the bottom of this file to get the date of the last check.
2. Find every Marvel Studios release (films, series episodes, specials) that came out after that date, up to today.
3. For each release, using the wiki pages of the release and its characters:
   - **Status changes**: a character in `src/data/characters.ts` who clearly dies on screen becomes `"Deceased"`. One who clearly comes back becomes `"Alive"`. A character who is only missing, captured or vanished stays `"Alive"`. There is no "Unknown".
   - **Other changes**: update `affiliation` / `powerType` / `species` only when the release clearly establishes it (e.g. a character officially joins the Avengers). When in doubt, leave it.
   - **New characters**: add major named characters with a real role (a main hero, a main villain, a key supporting character) who have a wiki page with a portrait. Skip extras and cameos. Usually 0–5 per release.
4. For every **new character**:
   - Add an entry to `src/data/characters.ts` in the matching section, in the same format as the others. Use only the allowed values from `src/types.ts`; if nothing fits, use the closest one and say so in the PR (don't invent new values without the owner). `debutPhase` / `debut` = their first Marvel Studios appearance. Add `addedOn: "YYYY-MM-DD"` (today), which keeps today's daily answer from changing.
   - Download a portrait: `node scripts/fetch-portrait.mjs <id> "<exact wiki page title>"`. Add the id, title and image URL to `portrait-sources.json`.
   - Add 5 emoji clues to `src/data/emojis.ts`, ordered from vague to obvious (the first one must not give it away). Base them on facts from the wiki page, and don't copy another character's set.
   - Add their quotes to `src/data/quotes.ts` following the rules in that file's header: `{{Quote}}` boxes on their wiki page, a single speaker, 4–18 words, from a released Marvel Studios movie/show, never containing their own name. Use ids `<characterId>-<n>`, and `addedOn: "YYYY-MM-DD"` on every new quote.
5. Existing characters may also have new quotes from the new release. Add those the same way, with new ids continuing their numbering, and `addedOn`.
6. Update the status comment at the top of `src/data/characters.ts` ("status = state as of …") to name the latest release covered.
7. Run `npm ci`, `npm run check` and `npm run build`. All must pass. Fix any problems before continuing.
8. Add a line to the **Log** below: today's date, the releases covered, and a short summary.
9. Commit with a message like `MCU auto-update: <release names>`, push the branch, and open the pull request with `gh pr create`. The PR body must list:
   - the releases covered
   - every status change (character, old → new, one-line reason)
   - every new character (name + fields) and how many quotes and emoji clues were added
   - links to the wiki pages used
   - anything uncertain the owner should double-check

## Log

- 2026-10-22: Baseline. Data covers everything up to Spider-Man: Brand New Day, Daredevil: Born Again Season 2, Wonder Man and VisionQuest. Next check starts after this date.
- 2026-10-26: No new releases since 2026-10-22 (VisionQuest episodes 5-6 drop 27/28 Oct). Backfill of VisionQuest episodes 1-4, which the baseline had missed: added Tommy Maximoff, Jocasta and Paladin (portraits + emoji clues; no wiki quotes qualify yet). Status comment now says "VisionQuest episodes 1-4". Next check starts after this date.
