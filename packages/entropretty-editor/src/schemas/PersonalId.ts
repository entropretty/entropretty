import type { Schema, Seed } from "entropretty-utils"
import { numeric } from "entropretty-utils"

function draw(ctx: CanvasRenderingContext2D, seed: Seed) {
  const size = 100
  const personalId = numeric(seed).toString() // Convert seed to BigInt and then to string

  ctx.strokeStyle = ""
  ctx.fillStyle = "black"
  ctx.textAlign = "center" // Center-align the text
  ctx.textBaseline = "top" // Align from the top
  ctx.font = `${size / 10}px serif` // Fixed font size (1/10th of the canvas)

  const digitWidth = size / 10 // Fixed digit width (1/10th of the canvas)
  const lineHeight = size / 10 // Fixed line height based on font size

  let index = 0
  let row = 1 // Start with 1 digit in the first row

  // Calculate total height of the pyramid
  let totalHeight = 0
  let tempIndex = 0
  let tempRow = 1
  while (tempIndex < personalId.length) {
    totalHeight += lineHeight // Add height of each row
    tempIndex += tempRow
    tempRow++
  }

  // Center the pyramid vertically
  let y = (size - totalHeight) / 2

  // Loop through the digits to form the pyramid
  while (index < personalId.length) {
    const currentRowDigits = personalId.slice(index, index + row)
    const rowWidth = currentRowDigits.length * digitWidth
    let rowX = size / 2 - rowWidth / 2 // Center the row horizontally

    // Draw each digit in the current row
    for (let i = 0; i < currentRowDigits.length; i++) {
      const digit = currentRowDigits[i]
      ctx.fillText(digit, rowX, y)
      rowX += digitWidth
    }

    index += row
    row++ // Next row will have one more digit
    y += lineHeight // Move down to the next line
  }
}

export const schema: Schema = {
  draw,
  name: "Personal Id",
  artist: "peet.sh",
  kind: "ProceduralPersonal",
}
