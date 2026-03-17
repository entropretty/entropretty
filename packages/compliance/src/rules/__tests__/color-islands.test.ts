import { describe, it, expect } from "vitest"
import { colorIslandsRule } from "../color-islands"
import type { ImagePixelData } from "../../types"

function makeUniformImage(
  width: number,
  height: number,
  color: [number, number, number, number],
): ImagePixelData {
  const data = new Uint8Array(width * height * 4)
  for (let i = 0; i < data.length; i += 4) {
    data[i] = color[0]
    data[i + 1] = color[1]
    data[i + 2] = color[2]
    data[i + 3] = color[3]
  }
  return { data, width, height }
}

function makeImageWithIsland(size: number): ImagePixelData {
  // White background with a tiny red island (5x5 pixels)
  const data = new Uint8Array(size * size * 4)
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255
    data[i + 1] = 255
    data[i + 2] = 255
    data[i + 3] = 255
  }

  // Place a 5x5 red island at (10, 10)
  for (let y = 10; y < 15; y++) {
    for (let x = 10; x < 15; x++) {
      const idx = (y * size + x) * 4
      data[idx] = 255
      data[idx + 1] = 0
      data[idx + 2] = 0
      data[idx + 3] = 255
    }
  }

  return { data, width: size, height: size }
}

describe("colorIslandsRule", () => {
  it("has correct metadata", () => {
    expect(colorIslandsRule.name).toBe("color-islands")
    expect(colorIslandsRule.type).toBe("single")
    expect(colorIslandsRule.browserCompatible).toBe(true)
  })

  it("passes for a uniform image", async () => {
    const image = makeUniformImage(100, 100, [128, 128, 128, 255])
    const result = await colorIslandsRule.check(image)
    expect(result.status).toBe("pass")
  })

  it("detects small color islands", async () => {
    const image = makeImageWithIsland(100)
    const result = await colorIslandsRule.check(image)
    // 5x5 = 25 pixels, which is below both minIslandSize (50) and errorThreshold (100)
    expect(result.status).toBe("error")
  })
})
