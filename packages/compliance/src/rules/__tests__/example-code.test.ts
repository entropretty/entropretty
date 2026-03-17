import { describe, it, expect } from "vitest"
import { exampleCodeRule } from "../example-code"

describe("exampleCodeRule", () => {
  it("has correct metadata", () => {
    expect(exampleCodeRule.name).toBe("example-code")
    expect(exampleCodeRule.type).toBe("code")
    expect(exampleCodeRule.browserCompatible).toBe(true)
  })

  it("passes for original code", async () => {
    const code = `
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ff0000'
      ctx.fillRect(0, 0, 100, 100)
    `
    const result = await exampleCodeRule.check(code)
    expect(result.status).toBe("pass")
  })

  it("errors for forbidden example pattern", async () => {
    const code = `
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
    `
    const result = await exampleCodeRule.check(code)
    expect(result.status).toBe("error")
  })
})
