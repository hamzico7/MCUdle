import { useState } from "react";
import type { Character } from "../types";

/** Shows the character's portrait, or a colored initials badge if no image exists yet. */
export default function Portrait({
  character,
  size = 40,
  rounded = "rounded-lg",
  className = "",
}: {
  character: Character;
  size?: number;
  rounded?: string;
  className?: string; // only applied to the initials badge
}) {
  const [failed, setFailed] = useState(false);

  if (!failed && character.imageUrl) {
    return (
      <img
        src={character.imageUrl}
        alt={character.name}
        width={size}
        height={size}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`${rounded} shrink-0 object-cover object-top`}
        style={{ width: size, height: size }}
      />
    );
  }

  const initials = character.name
    .replace(/[^A-Za-z0-9 \-]/g, "")
    .split(/[\s-]+/)
    .filter((w) => w && !["the", "of", "by"].includes(w.toLowerCase()))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

  let h = 0;
  for (const ch of character.id) h = (h * 31 + ch.charCodeAt(0)) % 360;

  return (
    <div
      aria-label={character.name}
      className={`${rounded} grid shrink-0 place-items-center font-display text-white ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `linear-gradient(140deg, hsl(${h} 55% 42%), hsl(${(h + 40) % 360} 60% 24%))`,
      }}
    >
      {initials}
    </div>
  );
}
