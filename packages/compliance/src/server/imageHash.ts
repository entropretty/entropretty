import type { ComparisonRule, ComplianceResult } from "../types";
import sharp from "sharp";
import { getConfig } from "../config";

// Calculate Hamming distance between two hashes
function hammingDistance(hash1: number[], hash2: number[]): number {
  let distance = 0;
  const len = Math.min(hash1.length, hash2.length);

  for (let i = 0; i < len; i++) {
    if (hash1[i] !== hash2[i]) {
      distance++;
    }
  }

  // Add remaining length difference to distance if hashes are different lengths
  distance += Math.abs(hash1.length - hash2.length);

  return distance;
}

export const imageHashRule: ComparisonRule = {
  name: "image-hash",
  description:
    "Compares perceptual hashes of two images to detect visual differences",
  type: "comparison",
  compare: async (
    baseImage: Buffer,
    compareImage: Buffer
  ): Promise<ComplianceResult> => {
    try {
      const config = getConfig().rules.imageHash;

      // Generate pHashes for both images
      const [baseHash, compareHash] = await Promise.all([
        sharp(baseImage)
          .resize(32, 32, { fit: "fill" })
          .grayscale()
          .raw()
          .toBuffer()
          .then((data): number[] => {
            // Convert Uint8Array to regular array
            const array = Array.from(data);
            // Convert raw pixel data to binary hash array
            const mean =
              array.reduce((sum, val) => sum + val, 0) / array.length;
            return array.map((val) => (val > mean ? 1 : 0));
          }),
        sharp(compareImage)
          .resize(32, 32, { fit: "fill" })
          .grayscale()
          .raw()
          .toBuffer()
          .then((data): number[] => {
            // Convert Uint8Array to regular array
            const array = Array.from(data);
            const mean =
              array.reduce((sum, val) => sum + val, 0) / array.length;
            return array.map((val) => (val > mean ? 1 : 0));
          }),
      ]);

      // Calculate hash distance
      const distance = hammingDistance(baseHash, compareHash);

      // Store string representation for display
      const baseHashString = baseHash.join("");
      const compareHashString = compareHash.join("");

      // Determine status based on thresholds
      let status: "pass" | "warn" | "error";
      if (distance <= config.warningThreshold) {
        status = "pass";
      } else if (distance <= config.errorThreshold) {
        status = "warn";
      } else {
        status = "error";
      }

      // Calculate similarity percentage
      const maxDistance = baseHash.length; // Maximum possible distance
      const similarity = ((maxDistance - distance) / maxDistance) * 100;

      return {
        status,
        metadata: [
          {
            message:
              status === "pass"
                ? `Images are visually similar (${similarity.toFixed(
                    2
                  )}% match)`
                : `Images differ significantly (${similarity.toFixed(
                    2
                  )}% match)`,
            details: {
              hashDistance: distance,
              similarityPercentage: parseFloat(similarity.toFixed(2)),
              warningThreshold: config.warningThreshold,
              errorThreshold: config.errorThreshold,
              baseHash: baseHashString.substring(0, 32) + "...", // Show truncated hash
              compareHash: compareHashString.substring(0, 32) + "...",
            },
          },
        ],
      };
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
      };
    }
  },
};
