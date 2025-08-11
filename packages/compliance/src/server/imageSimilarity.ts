import { ComparisonRule, ComplianceResult } from "../types";
import sharp from "sharp";
import pixelmatch from "pixelmatch";

export const imageSimilarityRule: ComparisonRule = {
  name: "image-similarity",
  description: "Checks if two images are visually similar",
  type: "comparison",
  compare: async (
    baseImage: Buffer,
    compareImage: Buffer
  ): Promise<ComplianceResult> => {
    try {
      // Convert both images to same dimensions and format for comparison
      const [img1Data, img2Data] = await Promise.all([
        sharp(baseImage)
          .raw()
          .resize(32, 32, { fit: "fill" }) // Use consistent dimensions
          .toBuffer({ resolveWithObject: true }),
        sharp(compareImage)
          .raw()
          .resize(32, 32, { fit: "fill" }) // Use consistent dimensions
          .toBuffer({ resolveWithObject: true }),
      ]);

      // Create output buffer for diff image (not used but required by pixelmatch)
      const diffBuffer = new Uint8Array(
        img1Data.info.width * img1Data.info.height
      );

      // Convert Buffer to Uint8Array
      const img1Uint8 = new Uint8Array(img1Data.data.buffer);
      const img2Uint8 = new Uint8Array(img2Data.data.buffer);

      const diffPixels = pixelmatch(
        img1Uint8,
        img2Uint8,
        diffBuffer,
        img1Data.info.width,
        img1Data.info.height,
        { threshold: 0.1 }
      );

      const totalPixels = img1Data.info.width * img1Data.info.height;
      const diffPercentage = (diffPixels / totalPixels) * 100;

      // Determine status based on difference percentage
      let status: "pass" | "warn" | "error";
      if (diffPercentage < 5) {
        status = "pass";
      } else if (diffPercentage < 10) {
        status = "warn";
      } else {
        status = "error";
      }

      return {
        status,
        metadata: [
          {
            message:
              status === "pass"
                ? `Images are similar (${diffPercentage.toFixed(
                    2
                  )}% difference)`
                : `Images are too different (${diffPercentage.toFixed(
                    2
                  )}% difference)`,
            details: {
              diffPixels,
              diffPercentage: parseFloat(diffPercentage.toFixed(2)),
              totalPixels,
            },
          },
        ],
      };
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
      };
    }
  },
};
