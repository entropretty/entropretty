/// <reference lib="dom" />

import type { SingleImageRule, ComplianceResult } from "./types"
import { defaultConfig } from "../config"

interface RGB {
  r: number
  g: number
  b: number
}

// Helper function to determine if colors are similar
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

// Helper function to determine if a color is white or near-white
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
  check: async (buffer: ArrayBuffer): Promise<ComplianceResult> => {
    try {
      const config = defaultConfig.rules.colorCount
      // Create ImageData directly from the ArrayBuffer
      const data = new Uint8ClampedArray(buffer)

      // Calculate total pixel count (total pixels in the image)
      const totalPixelCount = data.length / 4

      // Store unique colors with tolerance grouping and their frequencies
      const colorGroups: RGB[] = []
      const colorFrequency: number[] = []

      // Process pixels in groups of 4 (RGBA)
      for (let i = 0; i < data.length; i += 4) {
        // Skip transparent or mostly transparent pixels
        const alpha = data[i + 3]
        if (alpha < 10) {
          continue
        }

        const currentColor: RGB = {
          r: data[i],
          g: data[i + 1],
          b: data[i + 2],
        }

        // Skip white or near-white colors
        if (isNearWhite(currentColor, config.whiteTolerance || 10)) {
          continue
        }

        // Check if this color is similar to any existing group
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

        // If no similar color group found, create new group
        if (!foundGroup) {
          colorGroups.push(currentColor)
          colorFrequency.push(1)
        }
      }

      // Filter out colors that appear in less than the configured threshold percentage of total image pixels
      // This helps exclude anti-aliasing artifacts and insignificant colors
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
        type: "colorCount",
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
        type: "colorCount",
      }
    }
  },
}
