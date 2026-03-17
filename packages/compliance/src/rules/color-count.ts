import type {
  SingleImageRule,
  ComplianceResult,
  ImagePixelData,
} from "../types"
import { getConfig } from "../config"

interface RGB {
  r: number
  g: number
  b: number
}

function areSimilarColors(
  color1: RGB,
  color2: RGB,
  tolerance: number,
): boolean {
  return (
    Math.abs(color1.r - color2.r) <= tolerance &&
    Math.abs(color1.g - color2.g) <= tolerance &&
    Math.abs(color1.b - color2.b) <= tolerance
  )
}

function isNearWhite(color: RGB, whiteTolerance: number): boolean {
  return (
    color.r >= 255 - whiteTolerance &&
    color.g >= 255 - whiteTolerance &&
    color.b >= 255 - whiteTolerance
  )
}

export const colorCountRule: SingleImageRule = {
  name: "color-count",
  description:
    "Checks if the image uses more than 3 distinct colors (excluding white, transparent pixels, and anti-aliasing colors)",
  type: "single",
  browserCompatible: true,
  check: async (image: ImagePixelData): Promise<ComplianceResult> => {
    try {
      const config = getConfig().rules.colorCount
      const { data, width, height } = image
      const channels = 4 // RGBA

      const totalPixelCount = width * height

      const colorGroups: RGB[] = []
      const colorFrequency: number[] = []

      for (let i = 0; i < data.length; i += channels) {
        // Skip transparent or mostly transparent pixels
        if (data[i + 3] < 10) {
          continue
        }

        const currentColor: RGB = {
          r: data[i],
          g: data[i + 1],
          b: data[i + 2],
        }

        if (isNearWhite(currentColor, config.whiteTolerance)) {
          continue
        }

        let foundGroup = false
        for (let j = 0; j < colorGroups.length; j++) {
          if (
            areSimilarColors(currentColor, colorGroups[j], config.tolerance)
          ) {
            foundGroup = true
            colorFrequency[j]++
            break
          }
        }

        if (!foundGroup) {
          colorGroups.push(currentColor)
          colorFrequency.push(1)
        }
      }

      const frequencyThreshold = Math.max(
        1,
        totalPixelCount * config.frequencyThreshold,
      )
      const significantColors: RGB[] = []

      for (let i = 0; i < colorGroups.length; i++) {
        if (colorFrequency[i] >= frequencyThreshold) {
          significantColors.push(colorGroups[i])
        }
      }

      const colorCount = significantColors.length
      const status = colorCount <= config.maxColors ? "pass" : "warn"

      return {
        status,
        metadata: [
          {
            message:
              status === "pass"
                ? `Image uses ${colorCount} distinct colors, which is within the limit of ${config.maxColors}`
                : `Image uses ${colorCount} distinct colors, which exceeds the recommended limit of ${config.maxColors}`,
            details: {
              totalColors: colorCount,
              uniqueColors: significantColors.map((color) => ({
                r: color.r,
                g: color.g,
                b: color.b,
                hex: `#${color.r.toString(16).padStart(2, "0")}${color.g
                  .toString(16)
                  .padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`,
              })),
              tolerance: config.tolerance,
              whiteTolerance: config.whiteTolerance,
              maxColors: config.maxColors,
              note:
                "White/near-white colors, transparent pixels, and colors that appear in less than " +
                config.frequencyThreshold * 100 +
                "% of the total image are excluded from the count",
            },
          },
        ],
      }
    } catch (error: unknown) {
      return {
        status: "error",
        metadata: [
          {
            message: `Failed to analyze color count: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
        ],
      }
    }
  },
}
