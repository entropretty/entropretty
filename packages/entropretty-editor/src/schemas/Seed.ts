import type { Schema, Seed } from "entropretty-utils"

function draw(ctx: CanvasRenderingContext2D, seed: Seed) {
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

export const schema: Schema = {
  draw,
  name: "Seed Grid",
  artist: "peet.sh",
  kind: "ProceduralAccount",
}

export default schema
