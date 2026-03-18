import { describe, it, expect } from "vitest"
import { imageSimilarityRule } from "../image-similarity"
import type { ImagePixelData } from "../../types"

function makeImage(
  width: number,
  height: number,
  fill: number,
): ImagePixelData {
  const data = new Uint8Array(width * height * 4)
  for (let i = 0; i < data.length; i += 4) {
    data[i] = fill
    data[i + 1] = fill
    data[i + 2] = fill
    data[i + 3] = 255
  }
  return { data, width, height }
}

describe("imageSimilarityRule", () => {
  it("has correct metadata", () => {
    expect(imageSimilarityRule.name).toBe("image-similarity")
    expect(imageSimilarityRule.type).toBe("comparison")
    expect(imageSimilarityRule.browserCompatible).toBe(true)
  })

  it("passes for identical images", async () => {
    const img1 = makeImage(32, 32, 128)
    const img2 = makeImage(32, 32, 128)
    const result = await imageSimilarityRule.compare(img1, img2)
    expect(result.status).toBe("pass")
  })

  it("detects very different images", async () => {
    const img1 = makeImage(32, 32, 0)
    const img2 = makeImage(32, 32, 255)
    const result = await imageSimilarityRule.compare(img1, img2)
    expect(result.status).toBe("error")
  })
})
