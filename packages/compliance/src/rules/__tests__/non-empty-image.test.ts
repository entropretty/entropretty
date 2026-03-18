import { describe, it, expect } from "vitest"
import { nonEmptyImageRule } from "../non-empty-image"
import type { ImagePixelData } from "../../types"

describe("nonEmptyImageRule", () => {
  it("has correct metadata", () => {
    expect(nonEmptyImageRule.name).toBe("non-empty-image")
    expect(nonEmptyImageRule.type).toBe("single")
    expect(nonEmptyImageRule.browserCompatible).toBe(true)
  })

  it("passes for image with content", async () => {
    const data = new Uint8Array(10 * 10 * 4)
    // Fill with varied pixel data
    for (let i = 0; i < data.length; i += 4) {
      data[i] = (i * 7) % 256
      data[i + 1] = (i * 13) % 256
      data[i + 2] = (i * 3) % 256
      data[i + 3] = 255
    }
    const image: ImagePixelData = { data, width: 10, height: 10 }
    const result = await nonEmptyImageRule.check(image)
    expect(result.status).toBe("pass")
  })

  it("errors for completely empty image (all zeros)", async () => {
    const data = new Uint8Array(10 * 10 * 4) // all zeros
    const image: ImagePixelData = { data, width: 10, height: 10 }
    const result = await nonEmptyImageRule.check(image)
    expect(result.status).toBe("error")
  })

  it("passes for white image (non-zero min)", async () => {
    const data = new Uint8Array(10 * 10 * 4)
    data.fill(255)
    const image: ImagePixelData = { data, width: 10, height: 10 }
    const result = await nonEmptyImageRule.check(image)
    expect(result.status).toBe("pass")
  })
})
