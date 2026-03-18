import { describe, it, expect } from "vitest"
import { colorContrastRule } from "../color-contrast"
import type { ImagePixelData } from "../../types"

function makeGradientImage(width: number, height: number): ImagePixelData {
  const data = new Uint8Array(width * height * 4)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const val = Math.round((x / width) * 255)
      data[idx] = val
      data[idx + 1] = val
      data[idx + 2] = val
      data[idx + 3] = 255
    }
  }
  return { data, width, height }
}

function makeHarshEdgeImage(width: number, height: number): ImagePixelData {
  const data = new Uint8Array(width * height * 4)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      // Left half black, right half white -> harsh vertical edge
      const val = x < width / 2 ? 0 : 255
      data[idx] = val
      data[idx + 1] = val
      data[idx + 2] = val
      data[idx + 3] = 255
    }
  }
  return { data, width, height }
}

describe("colorContrastRule", () => {
  it("has correct metadata", () => {
    expect(colorContrastRule.name).toBe("color-contrast")
    expect(colorContrastRule.type).toBe("single")
    expect(colorContrastRule.browserCompatible).toBe(true)
  })

  it("passes for smooth gradient", async () => {
    const image = makeGradientImage(100, 100)
    const result = await colorContrastRule.check(image)
    expect(result.status).toBe("pass")
  })

  it("warns for harsh edge", async () => {
    const image = makeHarshEdgeImage(100, 100)
    const result = await colorContrastRule.check(image)
    expect(result.status).toBe("warn")
    expect(result.metadata!.length).toBeGreaterThan(0)
  })
})
