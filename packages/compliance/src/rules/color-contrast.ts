import type {
  SingleImageRule,
  ComplianceResult,
  CheckMetadata,
  ImagePixelData,
} from "../types"
import { getConfig } from "../config"

interface ContrastEdge {
  startX: number
  startY: number
  endX: number
  endY: number
  contrastDelta: number
  length: number
  direction: "horizontal" | "vertical"
}

export const colorContrastRule: SingleImageRule = {
  name: "color-contrast",
  description: "Checks for harsh color transitions between adjacent pixels",
  type: "single",
  browserCompatible: true,
  check: async (image: ImagePixelData): Promise<ComplianceResult> => {
    try {
      const config = getConfig().rules.colorContrast
      const { data, width, height } = image
      const channels = 4 // RGBA

      const contrastEdges: ContrastEdge[] = []

      const getColorDifference = (idx1: number, idx2: number): number => {
        let maxDiff = 0
        for (let c = 0; c < channels; c++) {
          const diff = Math.abs(data[idx1 + c] - data[idx2 + c])
          maxDiff = Math.max(maxDiff, diff)
        }
        return maxDiff
      }

      // Check for vertical contrast edges
      for (let x = 0; x < width - config.samplingSteps; x++) {
        let currentEdge: ContrastEdge | null = null

        for (let y = 0; y < height; y++) {
          const idx1 = (y * width + x) * channels
          const idx2 = (y * width + (x + config.samplingSteps)) * channels

          const contrastDelta = getColorDifference(idx1, idx2)

          if (contrastDelta > config.maxContrastDelta) {
            if (!currentEdge) {
              currentEdge = {
                startX: x,
                startY: y,
                endX: x + config.samplingSteps,
                endY: y,
                contrastDelta,
                length: 1,
                direction: "vertical",
              }
            } else {
              currentEdge.endY = y
              currentEdge.length++
              currentEdge.contrastDelta = Math.max(
                currentEdge.contrastDelta,
                contrastDelta,
              )
            }
          } else if (
            currentEdge &&
            currentEdge.length >= config.minContrastLength
          ) {
            contrastEdges.push(currentEdge)
            currentEdge = null
          } else {
            currentEdge = null
          }
        }

        if (currentEdge && currentEdge.length >= config.minContrastLength) {
          contrastEdges.push(currentEdge)
        }
      }

      // Check for horizontal contrast edges
      for (let y = 0; y < height - config.samplingSteps; y++) {
        let currentEdge: ContrastEdge | null = null

        for (let x = 0; x < width; x++) {
          const idx1 = (y * width + x) * channels
          const idx2 = ((y + config.samplingSteps) * width + x) * channels

          const contrastDelta = getColorDifference(idx1, idx2)

          if (contrastDelta > config.maxContrastDelta) {
            if (!currentEdge) {
              currentEdge = {
                startX: x,
                startY: y,
                endX: x,
                endY: y + config.samplingSteps,
                contrastDelta,
                length: 1,
                direction: "horizontal",
              }
            } else {
              currentEdge.endX = x
              currentEdge.length++
              currentEdge.contrastDelta = Math.max(
                currentEdge.contrastDelta,
                contrastDelta,
              )
            }
          } else if (
            currentEdge &&
            currentEdge.length >= config.minContrastLength
          ) {
            contrastEdges.push(currentEdge)
            currentEdge = null
          } else {
            currentEdge = null
          }
        }

        if (currentEdge && currentEdge.length >= config.minContrastLength) {
          contrastEdges.push(currentEdge)
        }
      }

      if (contrastEdges.length === 0) {
        return {
          status: "pass",
          metadata: [
            {
              message: "No harsh color transitions found",
            },
          ],
        }
      }

      contrastEdges.sort((a, b) => b.contrastDelta - a.contrastDelta)

      const metadata: CheckMetadata[] = contrastEdges.map((edge) => ({
        message: `Found harsh color transition:
  - Direction: ${edge.direction}
  - Contrast delta: ${edge.contrastDelta} (threshold: ${config.maxContrastDelta})
  - Length: ${edge.length} pixels
  - Location: From (${edge.startX},${edge.startY}) to (${edge.endX},${edge.endY})`,
        location: {
          x: Math.min(edge.startX, edge.endX),
          y: Math.min(edge.startY, edge.endY),
          width: Math.abs(edge.endX - edge.startX) + 1,
          height: Math.abs(edge.endY - edge.startY) + 1,
        },
      }))

      return {
        status: "warn",
        metadata,
      }
    } catch (error: unknown) {
      return {
        status: "error",
        metadata: [
          {
            message: `Failed to analyze color contrast: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
        ],
      }
    }
  },
}
