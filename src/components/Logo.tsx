/**
 * MCUDLE logo, one line, traced 1:1 from Hamza's reference image (Marvel Television style):
 * red block with heavy white "MCU", then "DLE" between a thin rule above and below.
 * Every position below was measured from the reference (251 × 99 px) and each letter is
 * stretched to the exact measured width with textLength.
 */
export default function Logo({ height = 40 }: { height?: number }) {
  const letter = (ch: string, x: number, w: number) => (
    <text x={x} y={84} fontFamily="Anton" fontSize={81.5} fill="#fff" textLength={w} lengthAdjust="spacingAndGlyphs">
      {ch}
    </text>
  );

  return (
    <svg
      viewBox="0 0 251 99"
      height={height}
      width={(height * 251) / 99}
      role="img"
      aria-label="MCUDLE"
      className="block select-none"
    >
      <rect x={0} y={0} width={140} height={99} fill="#fe0000" />
      {letter("M", 8.8, 49.4)}
      {letter("C", 55.9, 32.1)}
      {letter("U", 87.7, 43.5)}
      <rect x={154} y={0} width={97} height={4} fill="#fff" />
      <rect x={154} y={95} width={97} height={4} fill="#fff" />
      <text x={154.7} y={84} fontFamily="Oswald" fontWeight={400} fontSize={86.4} fill="#fff" textLength={94.5} lengthAdjust="spacingAndGlyphs">
        DLE
      </text>
    </svg>
  );
}
