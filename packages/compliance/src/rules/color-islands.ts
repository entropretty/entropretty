import type {
  SingleImageRule,
  ComplianceResult,
  CheckMetadata,
  ImagePixelData,
} from "../types"
import { getConfig } from "../config"

interface Point {
  x: number
  y: number
}

interface ColorIsland {
  color: number[]
  size: number
  bounds: {
    minX: number
    minY: number
    maxX: number
    maxY: number
  }
}

export const colorIslandsRule: SingleImageRule = {
  name: "color-islands",
  description:
    "Checks if there are color islands smaller than the minimum size",
  type: "single",
  browserCompatible: true,
  check: async (image: ImagePixelData): Promise<ComplianceResult> => {
    try {
      const config = getConfig().rules.colorIslands
      const { data, width, height } = image
      const channels = 4 // RGBA

      const visited = new Set<number>()
      const islands: ColorIsland[] = []

      const areColorsSimilar = (
        color1: number[],
        color2: number[],
        tolerance: number,
      ): boolean => {
        for (let c = 0; c < 3; c++) {
          // Compare RGB only
          if (Math.abs(color1[c] - color2[c]) > tolerance) {
            return false
          }
        }
        return true
      }

      const floodFill = (start: Point, baseColor: number[]): ColorIsland => {
        const queue: Point[] = [start]
        const island: ColorIsland = {
          color: baseColor,
          size: 0,
          bounds: {
            minX: start.x,
            minY: start.y,
            maxX: start.x,
            maxY: start.y,
          },
        }

        const isColorMatch = (x: number, y: number): boolean => {
          const idx = (y * width + x) * channels
          const pixelColor = [data[idx], data[idx + 1], data[idx + 2]]
          return areColorsSimilar(baseColor, pixelColor, config.colorTolerance)
        }

        while (queue.length > 0) {
          const { x, y } = queue.shift()!
          const key = y * width + x

          if (visited.has(key)) continue
          visited.add(key)

          if (!isColorMatch(x, y)) continue

          island.size++
          island.bounds.minX = Math.min(island.bounds.minX, x)
          island.bounds.minY = Math.min(island.bounds.minY, y)
          island.bounds.maxX = Math.max(island.bounds.maxX, x)
          island.bounds.maxY = Math.max(island.bounds.maxY, y)

          const neighbors = [
            { x: x + 1, y },
            { x: x - 1, y },
            { x, y: y + 1 },
            { x, y: y - 1 },
          ]

          for (const neighbor of neighbors) {
            if (
              neighbor.x >= 0 &&
              neighbor.x < width &&
              neighbor.y >= 0 &&
              neighbor.y < height &&
              !visited.has(neighbor.y * width + neighbor.x)
            ) {
              queue.push(neighbor)
            }
          }
        }

        return island
      }

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const key = y * width + x
          if (visited.has(key)) continue

          const idx = (y * width + x) * channels
          const color = [data[idx], data[idx + 1], data[idx + 2]]

          const island = floodFill({ x, y }, color)
          if (island.size < config.minIslandSize) {
            islands.push(island)
          }
        }
      }

      if (islands.length === 0) {
        return {
          status: "pass",
          metadata: [
            {
              message: "No small color islands found",
            },
          ],
        }
      }

      const failingIslands = islands.filter(
        (island) => island.size < config.errorThreshold,
      )

      const status = failingIslands.length > 0 ? "error" : "warn"

      const metadata: CheckMetadata[] = failingIslands.map((island) => {
        const boundingRect = {
          x: island.bounds.minX,
          y: island.bounds.minY,
          width: island.bounds.maxX - island.bounds.minX + 1,
          height: island.bounds.maxY - island.bounds.minY + 1,
        }

        const xPercent = ((boundingRect.x / width) * 100).toFixed(1)
        const yPercent = ((boundingRect.y / height) * 100).toFixed(1)
        const widthPercent = ((boundingRect.width / width) * 100).toFixed(1)
        const heightPercent = ((boundingRect.height / height) * 100).toFixed(1)

        return {
          message: `Found failing color island:
  - Size: ${island.size} pixels (below error threshold: ${config.errorThreshold})
  - Position: (${boundingRect.x}, ${boundingRect.y}) [${xPercent}%, ${yPercent}% of image]
  - Dimensions: ${boundingRect.width}x${boundingRect.height} pixels [${widthPercent}%x${heightPercent}% of image]
  - Bounding box: (${boundingRect.x},${boundingRect.y}) to (${island.bounds.maxX},${island.bounds.maxY})`,
          location: boundingRect,
        }
      })

      if (failingIslands.length === 0 && islands.length > 0) {
        metadata.push({
          message: `Found ${islands.length} small color islands above error threshold`,
        })
      }

      return {
        status,
        metadata,
      }
    } catch (error: unknown) {
      return {
        status: "error",
        metadata: [
          {
            message: `Failed to analyze color islands: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
        ],
      }
    }
  },
}
