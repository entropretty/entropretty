import sharp from "sharp";
import type { PreprocessorConfig } from "../types";

interface ColorGroup {
  r: number;
  g: number;
  b: number;
  count: number;
  pixels: number[]; // Store pixel indices
}

export async function mergeColors(
  imageBuffer: Buffer,
  config: PreprocessorConfig["colorMerge"]
): Promise<Buffer> {
  const image = sharp(imageBuffer);
  const { width, height, channels } = await image.metadata();
  const rawData = await image.raw().toBuffer();

  // First pass: Group similar colors globally
  const colorGroups: ColorGroup[] = [];

  for (let i = 0; i < rawData.length; i += channels!) {
    const r = rawData[i];
    const g = rawData[i + 1];
    const b = rawData[i + 2];

    // Try to find a similar color group
    let foundGroup = false;
    for (const group of colorGroups) {
      if (
        Math.abs(group.r - r) <= config.tolerance &&
        Math.abs(group.g - g) <= config.tolerance &&
        Math.abs(group.b - b) <= config.tolerance
      ) {
        // Add to existing group and update its average color
        group.count++;
        group.pixels.push(i);

        // Weighted average to maintain color accuracy
        group.r = Math.round((group.r * (group.count - 1) + r) / group.count);
        group.g = Math.round((group.g * (group.count - 1) + g) / group.count);
        group.b = Math.round((group.b * (group.count - 1) + b) / group.count);

        foundGroup = true;
        break;
      }
    }

    if (!foundGroup) {
      // Create new color group
      colorGroups.push({
        r,
        g,
        b,
        count: 1,
        pixels: [i],
      });
    }
  }

  // Sort groups by size (number of pixels)
  colorGroups.sort((a, b) => b.count - a.count);

  // Create new image with merged colors
  const newData = Buffer.alloc(rawData.length);

  // First, copy alpha channel if it exists
  if (channels === 4) {
    for (let i = 3; i < rawData.length; i += 4) {
      newData[i] = rawData[i];
    }
  }

  // Apply the merged colors
  colorGroups.forEach((group) => {
    group.pixels.forEach((pixelIndex) => {
      newData[pixelIndex] = group.r;
      newData[pixelIndex + 1] = group.g;
      newData[pixelIndex + 2] = group.b;
    });
  });

  console.log(`Merged into ${colorGroups.length} distinct colors`);

  // Create new image
  return await sharp(newData, {
    raw: {
      width: width!,
      height: height!,
      channels: channels!,
    },
  })
    .toFormat("png")
    .toBuffer();
}
