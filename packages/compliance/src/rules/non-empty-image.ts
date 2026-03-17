import type {
  SingleImageRule,
  ComplianceResult,
  ImagePixelData,
} from "../types"

export const nonEmptyImageRule: SingleImageRule = {
  name: "non-empty-image",
  description:
    "Checks if the image has any pixel data and is not completely empty",
  type: "single",
  browserCompatible: true,
  check: async (image: ImagePixelData): Promise<ComplianceResult> => {
    try {
      const { data } = image
      const channels = 4 // RGBA

      // Check each channel for variance (min !== max or min !== 0)
      const channelStats = Array.from({ length: channels }, () => ({
        min: 255,
        max: 0,
      }))

      for (let i = 0; i < data.length; i += channels) {
        for (let c = 0; c < channels; c++) {
          const val = data[i + c]
          if (val < channelStats[c].min) channelStats[c].min = val
          if (val > channelStats[c].max) channelStats[c].max = val
        }
      }

      const hasContent = channelStats.some(
        (ch) => ch.min !== ch.max || ch.min !== 0,
      )

      return {
        status: hasContent ? "pass" : "error",
        metadata: [
          {
            message: hasContent
              ? "Image contains valid pixel data"
              : "Image appears to be empty (no variation in pixel values)",
          },
        ],
      }
    } catch (error: unknown) {
      return {
        status: "error",
        metadata: [
          {
            message: `Failed to analyze image: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
        ],
      }
    }
  },
}
