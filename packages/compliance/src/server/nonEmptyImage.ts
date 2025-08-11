import type { SingleImageRule, ComplianceResult } from "../types";
import sharp from "sharp";
import { ChannelStats } from "sharp";

export const nonEmptyImageRule: SingleImageRule = {
  name: "non-empty-image",
  description:
    "Checks if the image has any pixel data and is not completely empty",
  type: "single",
  check: async (imageBuffer: Buffer): Promise<ComplianceResult> => {
    try {
      const metadata = await sharp(imageBuffer).stats();

      // Check if all channels have some values
      const hasContent = Object.values(metadata.channels).some(
        (channel: ChannelStats) =>
          channel.min !== channel.max || channel.min !== 0
      );

      return {
        status: hasContent ? "pass" : "error",
        metadata: [
          {
            message: hasContent
              ? "Image contains valid pixel data"
              : "Image appears to be empty (no variation in pixel values)",
          },
        ],
      };
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
      };
    }
  },
};
