# MCUDLE

**Guess the MCU character. A new one every day.**

▶ **Play now: [mcudle-amber.vercel.app](https://mcudle-amber.vercel.app)**

MCUDLE is a free daily guessing game for Marvel Cinematic Universe fans, in the spirit of Wordle and Loldle. Every day there's one secret character, the same for everyone in the world, and you've got as many guesses as you need to figure out who it is. It resets at midnight (CET), so come back tomorrow for a new one.

It's dressed up as a Stark Industries heads-up display, with J.A.R.V.I.S. commenting on every guess.

---

## Game modes

### 🎯 Classic (daily)
Guess any MCU character and see how close you are. Every guess is compared to the secret character in six categories:

| Column | What it tells you |
| --- | --- |
| **Gender** | Male, female or other |
| **Species** | Human, Asgardian, Kree, Mutant, Synthezoid, … |
| **Status** | Alive or dead, as of the latest MCU release |
| **Power** | Where their abilities come from: tech, magic, cosmic, gamma, super soldier, … |
| **Team** | The group they belong to: Avengers, Guardians, Wakanda, Thunderbolts, … |
| **Debut** | The MCU phase of their first appearance, with arrows if the answer is earlier or later |

🟩 green = exact match · 🟧 orange = partly right (they share some of it) · 🟥 red = no match.

### ♾️ Endless
Classic, but you don't have to wait for tomorrow. A new random character every round. Build a win streak and chase your best one. Giving up ends the streak.

### 💬 Quote (daily)
Read a real line from an MCU movie or show and guess who said it. Stuck? After 3 wrong guesses you find out which movie or show it's from, and after 6 who they were talking to.

### 😀 Emoji (daily)
Guess the character from emojis. You start with one, and every wrong guess reveals another, from vague to obvious. 5 in total.

---

## Good to know

- **The same puzzle for everyone.** Compare with your friends: hit **Share** for a spoiler-free 🟩🟥 result.
- **Unlimited guesses.** If you're really stuck, a **Give up** button appears after 10 wrong guesses (it does end your streak).
- **Streaks and stats** are saved on your device. Every mode keeps its own.
- **Always up to date.** New characters, quotes and deaths from new MCU movies and shows get added after they come out.
- **Install it like an app:** open the site on your phone → Share → *Add to Home Screen* (iPhone) or ⋮ → *Install app* (Android).

## What's in it

- 160+ characters from the Marvel Studios movies and Disney+ shows, from Iron Man (2008) to today
- Nearly 500 real quotes
- 5 emoji clues for every character

Only Marvel Studios projects count, so no Sony, Fox or Netflix-only characters. Characters from those shows are in only if they've appeared in a Marvel Studios project.

## Credits

Character info, quotes and portraits come from the [MCU Fandom wiki](https://marvelcinematicuniverse.fandom.com). Made by Hamza as a fan project.

**MCUDLE is fan-made and not affiliated with or endorsed by Marvel Studios or Disney.** All characters and images belong to their respective owners.

---

<sub>Developers: `npm install`, then `npm run dev` (local) or `npm run build`. Built with Vite, React, TypeScript and Tailwind. Data lives in `src/data/`; the weekly data update is described in `AUTO-UPDATE.md`.</sub>
