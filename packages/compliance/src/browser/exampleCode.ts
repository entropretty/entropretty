import type { CodeRule, ComplianceResult } from "../types"

// Normalized version of the forbidden example code pattern
// This is part of the default example algorithm and should score 0
const FORBIDDEN_PATTERN = `const row = Math.floor(i / grid)
  const col = i % grid
  const x = col * cellSize
  const y = row * cellSize

  // Draw cell border
  ctx.strokeStyle = "#ccc"
  ctx.strokeRect(x, y, cellSize, cellSize)

  // Draw number
  ctx.fillStyle = "#000"
  ctx.fillText(n.toString(), x + cellSize / 2, y + cellSize / 2)`

/**
 * Normalizes code by removing extra whitespace for comparison
 */
function normalizeCode(code: string): string {
  return code
    .replace(/\s+/g, " ") // Replace multiple whitespace with single space
    .replace(/\s*([{}();,])\s*/g, "$1") // Remove space around punctuation
    .trim()
}

export const exampleCodeRule: CodeRule = {
  name: "example-code",
  description:
    "Checks if the algorithm contains forbidden example code patterns",
  type: "code",
  check: async (code: string): Promise<ComplianceResult> => {
    const normalizedCode = normalizeCode(code)
    const normalizedPattern = normalizeCode(FORBIDDEN_PATTERN)

    if (normalizedCode.includes(normalizedPattern)) {
      return {
        status: "error",
        metadata: [
          {
            message:
              "Algorithm contains forbidden example code pattern (grid/cell drawing snippet). This appears to be an unmodified or minimally modified example algorithm.",
          },
        ],
      }
    }

    return {
      status: "pass",
      metadata: [
        {
          message: "No forbidden example code patterns detected",
        },
      ],
    }
  },
}
