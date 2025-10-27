/**
 * This is a draw function you need to fill.
 * It should draw a design based on the seed.
 * The seed is an array of bytes.
 * You can treat as as in Array of numbers between 0-255.
 * Depending on the FamilyKind you specify in the schema,
 * the seed will be either 4, 8 or 32 bytes long.
 *
 * @param {CanvasRenderingContext2D} ctx - The context to draw on. It's canvas size is 100 x 100.
 * @param {Uint8Array} seed - Array of bytes, depending on the kind of design, it is either 4, 8 or 32 bytes.
 */
function draw(ctx, seed) {
  /// Set up the canvas
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
 *
 * @typedef {( "Procedural" | "ProceduralPersonal" | "ProceduralAccount" )} FamilyKind
 * @type {{name: string, artist: string, kind: FamilyKind, draw: Function}}
 */
export const schema = {
  artist: "Your-Name",
  name: "Procedural-Design",
  draw,
  kind: "Procedural", // Try changing this to "ProceduralPersonal" or "ProceduralAccount" to explore how the seed changes
}
