import type { ComparisonRule, ComplianceResult, ImagePixelData } from "../types"
import { getConfig } from "../config"

function hammingDistance(hash1: number[], hash2: number[]): number {
  let distance = 0
  const len = Math.min(hash1.length, hash2.length)

  for (let i = 0; i < len; i++) {
    if (hash1[i] !== hash2[i]) {
      distance++
    }
  }

  distance += Math.abs(hash1.length - hash2.length)
  return distance
}

// Pure-JS nearest-neighbor downscale to targetW x targetH grayscale
function downscaleGrayscale(
  image: ImagePixelData,
  targetW: number,
  targetH: number,
): number[] {
  const { data, width, height } = image
  const channels = 4
  const result: number[] = new Array(targetW * targetH)

  for (let ty = 0; ty < targetH; ty++) {
    const sy = Math.floor((ty * height) / targetH)
    for (let tx = 0; tx < targetW; tx++) {
      const sx = Math.floor((tx * width) / targetW)
      const idx = (sy * width + sx) * channels
      // Luminance approximation
      result[ty * targetW + tx] = Math.round(
        data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114,
      )
    }
  }

  return result
}

function computePhash(image: ImagePixelData): number[] {
  const pixels = downscaleGrayscale(image, 32, 32)
  const mean = pixels.reduce((sum, val) => sum + val, 0) / pixels.length
  return pixels.map((val) => (val > mean ? 1 : 0))
}

export const imageHashRule: ComparisonRule = {
  name: "image-hash",
  description:
    "Compares perceptual hashes of two images to detect visual differences",
  type: "comparison",
  browserCompatible: true,
  compare: async (
    baseImage: ImagePixelData,
    compareImage: ImagePixelData,
  ): Promise<ComplianceResult> => {
    try {
      const config = getConfig().rules.imageHash

      const baseHash = computePhash(baseImage)
      const compareHash = computePhash(compareImage)

      const distance = hammingDistance(baseHash, compareHash)

      const baseHashString = baseHash.join("")
      const compareHashString = compareHash.join("")

      let status: "pass" | "warn" | "error"
      if (distance <= config.warningThreshold) {
        status = "pass"
      } else if (distance <= config.errorThreshold) {
        status = "warn"
      } else {
        status = "error"
      }

      const maxDistance = baseHash.length
      const similarity = ((maxDistance - distance) / maxDistance) * 100

      return {
        status,
        metadata: [
          {
            message:
              status === "pass"
                ? `Images are visually similar (${similarity.toFixed(
                    2,
                  )}% match)`
                : `Images differ significantly (${similarity.toFixed(
                    2,
                  )}% match)`,
            details: {
              hashDistance: distance,
              similarityPercentage: parseFloat(similarity.toFixed(2)),
              warningThreshold: config.warningThreshold,
              errorThreshold: config.errorThreshold,
              baseHash: baseHashString.substring(0, 32) + "...",
              compareHash: compareHashString.substring(0, 32) + "...",
            },
          },
        ],
      }
    } catch (error: unknown) {
      return {
        status: "error",
        metadata: [
          {
            message: `Failed to compare image hashes: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
        ],
      }
    }
  },
}
