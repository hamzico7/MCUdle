import { useState } from "react";
import type { Character } from "../types";

/** Character portrait, or a holo initials badge if the image is missing / fails to load. */
export default function Portrait({
  character,
  size = 40,
  className = "",
  fill = false,
}: {
  character: Character;
  size?: number;
  className?: string;
  fill?: boolean; // stretch to the parent instead of a fixed size
}) {
  const [failed, setFailed] = useState(false);
  const dims = fill ? { width: "100%", height: "100%" } : { width: size, height: size };

  if (!failed && character.imageUrl) {
    return (
      <img
        src={character.imageUrl}
        alt={character.name}
        loading="lazy"
        draggable={false}
        onError={() => setFailed(true)}
        className={`shrink-0 object-cover object-top ${className}`}
        style={dims}
      />
    );
  }

  const initials = character.name
    .replace(/[^A-Za-z0-9 -]/g, "")
    .split(/[\s-]+/)
    .filter((w) => w && !["the", "of", "by"].includes(w.toLowerCase()))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

  return (
    <div
      aria-label={character.name}
      className={`grid shrink-0 place-items-center bg-[radial-gradient(circle_at_50%_35%,#0f3550,#04101c)] font-hud text-holo ${className}`}
      style={{ ...dims, fontSize: fill ? "1.1em" : size * 0.3, textShadow: "0 0 8px rgb(127 232 255 / 0.6)" }}
    >
      {initials}
    </div>
  );
}
