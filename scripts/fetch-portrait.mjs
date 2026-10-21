// Download a character portrait from the MCU Fandom wiki.
// Usage:  node scripts/fetch-portrait.mjs <character-id> "<Fandom page title>"
// Example: node scripts/fetch-portrait.mjs iron-man "Iron Man"
import { writeFile } from "node:fs/promises";

const [id, title] = process.argv.slice(2);
if (!id || !title) {
  console.log('Usage: node scripts/fetch-portrait.mjs <character-id> "<Fandom page title>"');
  process.exit(1);
}

const api = new URL("https://marvelcinematicuniverse.fandom.com/api.php");
api.search = new URLSearchParams({ action: "query", titles: title, prop: "pageimages", piprop: "original", format: "json", redirects: "1" });
const data = await (await fetch(api)).json();
const page = Object.values(data.query.pages)[0];
if (!page?.original) {
  console.log(`No image found for "${title}". Check the exact page title on marvelcinematicuniverse.fandom.com`);
  process.exit(1);
}
const url = page.original.source.replace("/revision/latest?", "/revision/latest/scale-to-width-down/400?");
const img = Buffer.from(await (await fetch(url)).arrayBuffer());
await writeFile(new URL(`../public/portraits/${id}.jpg`, import.meta.url), img);
console.log(`Saved public/portraits/${id}.jpg  (from ${page.title})`);
