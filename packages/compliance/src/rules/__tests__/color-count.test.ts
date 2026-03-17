import { describe, it, expect } from "vitest"
import { colorCountRule } from "../color-count"
import type { ImagePixelData } from "../../types"

function makeImage(
  width: number,
  height: number,
  fill: [number, number, number, number],
): ImagePixelData {
  const data = new Uint8Array(width * height * 4)
  for (let i = 0; i < data.length; i += 4) {
    data[i] = fill[0]
    data[i + 1] = fill[1]
    data[i + 2] = fill[2]
    data[i + 3] = fill[3]
  }
  return { data, width, height }
}

function makeMultiColorImage(
  width: number,
  height: number,
  colors: [number, number, number, number][],
): ImagePixelData {
  const data = new Uint8Array(width * height * 4)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const colorIdx = x % colors.length
      const c = colors[colorIdx]
      data[idx] = c[0]
      data[idx + 1] = c[1]
      data[idx + 2] = c[2]
      data[idx + 3] = c[3]
    }
  }
  return { data, width, height }
}

describe("colorCountRule", () => {
  it("has correct metadata", () => {
    expect(colorCountRule.name).toBe("color-count")
    expect(colorCountRule.type).toBe("single")
    expect(colorCountRule.browserCompatible).toBe(true)
  })

  it("passes for single-color image", async () => {
    const image = makeImage(10, 10, [255, 0, 0, 255])
    const result = await colorCountRule.check(image)
    expect(result.status).toBe("pass")
  })

  it("passes for 3-color image", async () => {
    const image = makeMultiColorImage(30, 30, [
      [255, 0, 0, 255],
      [0, 255, 0, 255],
      [0, 0, 255, 255],
    ])
    const result = await colorCountRule.check(image)
    expect(result.status).toBe("pass")
  })

  it("warns for too many colors", async () => {
    const image = makeMultiColorImage(40, 40, [
      [255, 0, 0, 255],
      [0, 255, 0, 255],
      [0, 0, 255, 255],
      [128, 0, 128, 255],
    ])
    const result = await colorCountRule.check(image)
    expect(result.status).toBe("warn")
  })

  it("ignores transparent pixels", async () => {
    const image = makeMultiColorImage(40, 40, [
      [255, 0, 0, 255],
      [0, 255, 0, 0], // transparent
      [0, 0, 255, 255],
      [128, 0, 128, 0], // transparent
    ])
    const result = await colorCountRule.check(image)
    expect(result.status).toBe("pass")
  })

  it("ignores white pixels", async () => {
    const image = makeMultiColorImage(30, 30, [
      [255, 0, 0, 255],
      [255, 255, 255, 255], // white
      [0, 0, 255, 255],
    ])
    const result = await colorCountRule.check(image)
    expect(result.status).toBe("pass")
  })
})
