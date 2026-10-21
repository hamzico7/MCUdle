/**
 * MCUDLE logo, one line, matched to Hamza's reference image (Marvel Television style):
 * red block with heavy white "MCU", then "DLE" between a thin rule above and below.
 *
 * Fonts were picked by testing ~20 condensed fonts at every weight against the reference
 * and scoring how well the letter shapes overlap:
 *   MCU → Sofia Sans Extra Condensed, weight 951 (best overall match, M/C/U in one font)
 *   DLE → Fjalla One (95% overlap with the reference)
 * Each word uses ONE font size and ONE horizontal squeeze for all its letters, so the
 * letters always look like the same font and size; only their spacing follows the reference.
 * Frame: 251 × 99 (the reference's pixel size), letters 70 tall, baseline at 84.
 */
const MCU_FONT = { fontFamily: "Sofia Sans Extra Condensed Variable", fontWeight: 951, fontSize: 106.87 };
const MCU_SQUEEZE = 0.7347;
const DLE_FONT = { fontFamily: "Fjalla One", fontWeight: 400, fontSize: 83.93 };
const DLE_SQUEEZE = 0.8571;

function Word({ letters, squeeze, font }: { letters: [string, number][]; squeeze: number; font: typeof MCU_FONT }) {
  return (
    <>
      {letters.map(([ch, x]) => (
        <text key={ch} transform={`translate(${x} 84) scale(${squeeze} 1)`} fill="#fff" {...font}>
          {ch}
        </text>
      ))}
    </>
  );
}

export default function Logo({ height = 40 }: { height?: number }) {
  return (
    <svg viewBox="0 0 251 99" height={height} width={(height * 251) / 99} role="img" aria-label="MCUDLE" className="block select-none">
      <rect x={0} y={0} width={140} height={99} fill="#fe0000" />
      <Word letters={[["M", 10.36], ["C", 53.27], ["U", 90.77]]} squeeze={MCU_SQUEEZE} font={MCU_FONT} />
      <rect x={154} y={0} width={97} height={4} fill="#fff" />
      <rect x={154} y={95} width={97} height={4} fill="#fff" />
      <Word letters={[["D", 154.21], ["L", 191.64], ["E", 219.71]]} squeeze={DLE_SQUEEZE} font={DLE_FONT} />
    </svg>
  );
}
