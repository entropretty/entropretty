import { writeFileSync } from "node:fs"
import { COLORS } from "./src/prelude/colors"
import {
  bit,
  bits,
  bytesToNibbles,
  fillEach,
  getByte,
  numeric,
  randomGenerator,
  sfc32,
  split,
  strokeEach,
  symmetrical,
  bytesToBits,
  bytesToQuarterBytes,
  map,
} from "./src/prelude/functions"

export * from "./src/prelude/colors"
export * from "./src/prelude/functions"

export const preludeScriptString = `
  const black = "${COLORS.black}"
  const white = "${COLORS.white}"
  const light = "${COLORS.light}"
  const dark = "${COLORS.dark}"

  ${getByte.toString()}
  ${split.toString()}
  ${bytesToNibbles.toString()}
  ${bit.toString()}
  ${bits.toString()}
  ${symmetrical.toString()}
  ${strokeEach.toString()}
  ${fillEach.toString()}
  ${numeric.toString()}
  ${randomGenerator.toString()}
  ${sfc32.toString()}
  ${bytesToBits.toString()}
  ${bytesToQuarterBytes.toString()}
  ${map.toString()}
`
writeFileSync(
  "./src/prelude/generatedScriptString.ts",
  `export const preludeScriptString=\`${preludeScriptString}\``,
)
console.log("Prelude script string generated")
