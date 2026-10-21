# MCUDLE

Daily MCU character guessing game. One secret character per day, same for everyone, resets at midnight Swiss time (CET/CEST). No server — runs entirely in the browser.

Built with Vite + React + TypeScript + Tailwind CSS + Framer Motion + Lucide icons.

---

## Step 1 — Install the tools (one time only)

1. **Node.js** — download the **LTS** version from https://nodejs.org and install it (just click Next through the installer).
2. **VS Code** — https://code.visualstudio.com
3. **Git** — https://git-scm.com/downloads (on Windows, keep all the default options).
4. **GitHub account** — https://github.com/signup

Check it worked: open a terminal (Windows: search "Terminal" or "PowerShell"; Mac: "Terminal") and run:

```bash
node -v
npm -v
git --version
```

Each should print a version number. If one says "not recognized", restart your computer and try again.

## Step 2 — Open the project in VS Code

1. Unzip `mcudle.zip` somewhere easy, e.g. `Documents/mcudle`.
2. Open VS Code → **File → Open Folder…** → pick the `mcudle` folder.
3. If VS Code asks "Do you trust the authors?" → **Yes**.
4. Open the built-in terminal: **Terminal → New Terminal** (or `` Ctrl+` ``).

## Step 3 — Run it on your computer

In the VS Code terminal:

```bash
npm install
npm run dev
```

`npm install` downloads the libraries (takes a minute, only needed once). `npm run dev` starts the game — Ctrl+click the `http://localhost:5173` link it prints. Edits you save show up instantly. Press `Ctrl+C` in the terminal to stop it.

## Step 4 — Put it on GitHub

1. Go to https://github.com/new
2. Repository name: `mcudle`. Leave everything else as is (don't add a README). Click **Create repository**.
3. Back in the VS Code terminal (stop the dev server first with `Ctrl+C`), run these one by one — replace `YOUR-USERNAME`:

```bash
git init
git add .
git commit -m "First version of MCUDLE"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/mcudle.git
git push -u origin main
```

If git asks who you are, run these once and then repeat the commit command:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

The first push opens a browser window to log in to GitHub — just approve it.

## Step 5 — Put it online for free (Vercel)

1. Go to https://vercel.com → **Sign Up** → **Continue with GitHub**.
2. Click **Add New… → Project**.
3. Find `mcudle` in the list → **Import**.
4. Vercel detects **Vite** automatically (build command `npm run build`, output folder `dist`). Don't change anything.
5. Click **Deploy**. About a minute later you get a link like `https://mcudle.vercel.app`.

From now on, every time you push to GitHub, Vercel updates the site by itself:

```bash
git add .
git commit -m "Describe what you changed"
git push
```

**Netlify instead?** https://app.netlify.com → **Add new site → Import an existing project → GitHub → mcudle**. Build command `npm run build`, publish directory `dist` → **Deploy**.

**Install it like an app:** open your site on your phone → Share → **Add to Home Screen** (iPhone) or ⋮ → **Install app** (Android).

---

## How it works

| File | What it does |
| --- | --- |
| `src/data/characters.ts` | All 157 characters and their attributes |
| `src/lib/daily.ts` | Picks today's character from the date in Swiss time (seeded shuffle — no repeats until everyone has been picked once) + countdown |
| `src/lib/compare.ts` | Compares a guess to the answer (green / red / phase arrows) + share emojis |
| `src/lib/storage.ts` | Saves today's guesses and your stats in `localStorage` |
| `src/components/` | Header, SearchBar, GuessGrid, Tile, StatsModal, HowToPlayModal, CountdownModal, WinCard |
| `public/` | App icons, PWA manifest, `portraits/` folder |

**Daily pick:** `Europe/Zurich` time zone handles CET (winter, UTC+1) and CEST (summer, UTC+2) automatically. The date (`2026-10-21`) decides the character, so everyone gets the same one without a backend.

## Adding portraits

Every character currently shows a colored initials badge. To add real pictures, save square images (≈256×256) to `public/portraits/` named after the character's `id`, e.g. `public/portraits/iron-man.jpg`. They appear automatically. You can also set `imageUrl` on a character to a full `https://` link. Use images you have the right to use (your own art, or properly licensed images).

## Adding or editing characters

Open `src/data/characters.ts` and copy a line. Use the exact values from the cheat sheet at the top of that file — a typo like `"human"` instead of `"Human"` will never match. Note: adding or removing characters changes the order of future daily picks (still the same for everyone, just a different sequence), so do it before you share the game widely, or accept the reshuffle.

**Data notes:** statuses are as of October 2026 (after Spider-Man: Brand New Day, Daredevil: Born Again S2 and Wonder Man; before Avengers: Doomsday on Dec 18, 2026). After Doomsday, update statuses. Characters who are missing or in limbo (Wanda, Sersi, Kingo, Kang, Red Skull, Monica Rambeau, Galactus, Silver Surfer, Bill Metzger) are `"Unknown"`. Ultron is `"Unknown"` because VisionQuest is still airing. Debut phase = first **Marvel Studios** appearance, so Daredevil is Phase 4 (No Way Home) and the Punisher is Phase 5 (Born Again).

---

Fan-made project. Not affiliated with or endorsed by Marvel or Disney.
