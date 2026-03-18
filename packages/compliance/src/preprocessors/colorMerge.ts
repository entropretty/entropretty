import type { PreprocessorConfig } from "../types"
import type { ImagePixelData } from "../types"

interface ColorGroup {
  r: number
  g: number
  b: number
  count: number
  pixels: number[] // Store pixel indices (byte offset of R channel)
}

export function mergeColors(
  image: ImagePixelData,
  config: PreprocessorConfig["colorMerge"],
): ImagePixelData {
  const { data, width, height } = image
  const channels = 4 // RGBA

  // First pass: Group similar colors globally
  const colorGroups: ColorGroup[] = []

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    let foundGroup = false
    for (const group of colorGroups) {
      if (
        Math.abs(group.r - r) <= config.tolerance &&
        Math.abs(group.g - g) <= config.tolerance &&
        Math.abs(group.b - b) <= config.tolerance
      ) {
        group.count++
        group.pixels.push(i)

        group.r = Math.round((group.r * (group.count - 1) + r) / group.count)
        group.g = Math.round((group.g * (group.count - 1) + g) / group.count)
        group.b = Math.round((group.b * (group.count - 1) + b) / group.count)

        foundGroup = true
        break
      }
    }

    if (!foundGroup) {
      colorGroups.push({
        r,
        g,
        b,
        count: 1,
        pixels: [i],
      })
    }
  }

  colorGroups.sort((a, b) => b.count - a.count)

  const newData = new Uint8Array(data.length)

  // Copy alpha channel
  for (let i = 3; i < data.length; i += 4) {
    newData[i] = data[i]
  }

  // Apply merged colors
  for (const group of colorGroups) {
    for (const pixelIndex of group.pixels) {
      newData[pixelIndex] = group.r
      newData[pixelIndex + 1] = group.g
      newData[pixelIndex + 2] = group.b
    }
  }

  return {
    data: newData,
    width,
    height,
  }
}
