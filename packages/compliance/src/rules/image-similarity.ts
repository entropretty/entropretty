import type { ComparisonRule, ComplianceResult, ImagePixelData } from "../types"

// Pure-JS nearest-neighbor downscale to targetW x targetH RGBA
function downscaleRGBA(
  image: ImagePixelData,
  targetW: number,
  targetH: number,
): Uint8Array {
  const { data, width, height } = image
  const channels = 4
  const result = new Uint8Array(targetW * targetH * channels)

  for (let ty = 0; ty < targetH; ty++) {
    const sy = Math.floor((ty * height) / targetH)
    for (let tx = 0; tx < targetW; tx++) {
      const sx = Math.floor((tx * width) / targetW)
      const srcIdx = (sy * width + sx) * channels
      const dstIdx = (ty * targetW + tx) * channels
      result[dstIdx] = data[srcIdx]
      result[dstIdx + 1] = data[srcIdx + 1]
      result[dstIdx + 2] = data[srcIdx + 2]
      result[dstIdx + 3] = data[srcIdx + 3]
    }
  }

  return result
}

// Simple pixel-level comparison (replaces pixelmatch dependency)
function comparePixels(
  img1: Uint8Array,
  img2: Uint8Array,
  threshold: number,
): number {
  const channels = 4
  let diffCount = 0

  for (let i = 0; i < img1.length; i += channels) {
    const dr = Math.abs(img1[i] - img2[i])
    const dg = Math.abs(img1[i + 1] - img2[i + 1])
    const db = Math.abs(img1[i + 2] - img2[i + 2])

    // Max channel difference normalized to 0-1
    const maxDiff = Math.max(dr, dg, db) / 255
    if (maxDiff > threshold) {
      diffCount++
    }
  }

  return diffCount
}

export const imageSimilarityRule: ComparisonRule = {
  name: "image-similarity",
  description: "Checks if two images are visually similar",
  type: "comparison",
  browserCompatible: true,
  compare: async (
    baseImage: ImagePixelData,
    compareImage: ImagePixelData,
  ): Promise<ComplianceResult> => {
    try {
      const targetSize = 32

      const img1Data = downscaleRGBA(baseImage, targetSize, targetSize)
      const img2Data = downscaleRGBA(compareImage, targetSize, targetSize)

      const diffPixels = comparePixels(img1Data, img2Data, 0.1)
      const totalPixels = targetSize * targetSize
      const diffPercentage = (diffPixels / totalPixels) * 100

      let status: "pass" | "warn" | "error"
      if (diffPercentage < 5) {
        status = "pass"
      } else if (diffPercentage < 10) {
        status = "warn"
      } else {
        status = "error"
      }

      return {
        status,
        metadata: [
          {
            message:
              status === "pass"
                ? `Images are similar (${diffPercentage.toFixed(
                    2,
                  )}% difference)`
                : `Images are too different (${diffPercentage.toFixed(
                    2,
                  )}% difference)`,
            details: {
              diffPixels,
              diffPercentage: parseFloat(diffPercentage.toFixed(2)),
              totalPixels,
            },
          },
        ],
      }
    } catch (error: unknown) {
      return {
        status: "error",
        metadata: [
          {
            message: `Failed to compare images: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
        ],
      }
    }
  },
}
