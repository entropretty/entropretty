import type { DrawFn, Schema } from "entropretty-utils"

/**
 * This is a draw function you need to fill.
 * It should draw a design based on the seed.
 * The seed is an array of bytes.
 * You can treat as as in Array of numbers between 0-255.
 * Depending on the FamilyKind you specify in the schema,
 * the seed will be either 4, 8 or 32 bytes long.
 */
const draw: DrawFn = (ctx, seed) => {
  // Set up the canvas
  ctx.translate(5, 5) // Add a small margin

  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  const length = seed.length
  const grid = Math.ceil(Math.sqrt(length))
  const cellSize = Math.floor(90 / grid) // 90 to leave space for margins
  const fontSize = Math.max(8, Math.floor(cellSize * 0.4)) // Minimum font size of 8px
  ctx.font = `${fontSize}px sans-serif`

  // Draw grid and numbers
  seed.forEach((n, i) => {
    const row = Math.floor(i / grid)
    const col = i % grid
    const x = col * cellSize
    const y = row * cellSize

    // Draw cell border
    ctx.strokeStyle = "#ccc"
    ctx.strokeRect(x, y, cellSize, cellSize)

    // Draw number
    ctx.fillStyle = "#000"
    ctx.fillText(n.toString(), x + cellSize / 2, y + cellSize / 2)
  })
}

/**
 * This is the schema of your design. It informs the user of about metadata of the design.
 *
 * Procedural: The seed are 4 random bytes.
 * ProceduralPersonal: The seed is u32 number, representing a citizenship number.
 * ProceduralAccount: The seed is a 32 bytes public key.
 */
export const schema: Schema = {
  artist: "Your-Name",
  name: "ProceduralPersonal-Design",
  draw,
  kind: "ProceduralPersonal", // Try changing this to "Procedural" or "ProceduralAccount" to explore how the seed changes
}
