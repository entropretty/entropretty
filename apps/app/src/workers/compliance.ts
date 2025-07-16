import { expose } from "comlink"
import { preludeScript } from "./prelude"
import {
  colorCountRule,
  colorIslandsRule,
} from "entropretty-compliance/browser"
import type {
  SingleImageRule,
  ComplianceResult as RuleComplianceResult,
  CheckMetadata,
} from "entropretty-compliance/browser"
import type { Seed } from "entropretty-utils"

const COMPLIANCE_TIMEOUT_MS = 300
const COMPLIANCE_REFERENCE_SIZE = 300

type Size = number
export type AlgorithmId = number
type ComplianceJob = {
  algorithmId: AlgorithmId
  size: Size
  seed: Seed
  resolve: (result: ComplianceResult) => void
  reject: (error: Error) => void
}

export interface ComplianceResult {
  isCompliant: boolean
  issues: CheckMetadata[]
  issueOverlayImageData?: ImageData
  ruleTypesFailed: string[]
}

export interface ComplianceRequest {
  algorithmId: AlgorithmId
  size: Size
  seed: Seed
  resolve: (result: ComplianceResult) => void
  reject: (error: Error) => void
}

// Centralized registry of all compliance rules
const complianceRules: SingleImageRule[] = [
  colorCountRule,
  colorIslandsRule,
  // Add new rules here
]

const algorithms: Map<AlgorithmId, string> = new Map()
const complianceQueue: ComplianceJob[] = []
let isProcessing = false

const workerAPI = {
  async updateAlgorithm(algorithmId: AlgorithmId, algorithm: string) {
    if (algorithmId === 0) {
      algorithms.set(algorithmId, algorithm)
    } else {
      if (!algorithms.has(algorithmId)) {
        algorithms.set(algorithmId, algorithm)
      }
    }
  },

  async checkCompliance(
    algorithmId: AlgorithmId,
    size: Size,
    seed: Seed,
  ): Promise<ComplianceResult> {
    return new Promise((resolve, reject) => {
      const seedCopy: Seed = [...seed]
      const job: ComplianceJob = {
        algorithmId,
        size,
        seed: seedCopy,
        resolve,
        reject,
      }
      complianceQueue.push(job)
      processQueue()
    })
  },

  cancelCheck(algorithmId: AlgorithmId, size: Size, seed: Seed) {
    const index = complianceQueue.findIndex(
      (job) =>
        job.algorithmId === algorithmId &&
        job.size === size &&
        compareNumberArrays(job.seed, seed),
    )

    if (index !== -1) {
      complianceQueue[index].reject(new Error("Compliance check cancelled"))
      complianceQueue.splice(index, 1)
    }
  },
}

async function processQueue() {
  if (isProcessing || complianceQueue.length === 0) return

  isProcessing = true
  const { algorithmId, size, seed, resolve, reject } = complianceQueue.shift()!

  if (!algorithms.has(algorithmId)) {
    reject(new Error(`No script found for ${algorithmId}`))
    isProcessing = false
    processQueue()
    return
  }

  const script = algorithms.get(algorithmId)!
  const canvas = new OffscreenCanvas(
    COMPLIANCE_REFERENCE_SIZE,
    COMPLIANCE_REFERENCE_SIZE,
  )
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    reject(new Error("Failed to get 2D rendering context"))
    isProcessing = false
    processQueue()
    return
  }

  try {
    const timeoutPromise = new Promise((_, timeoutReject) => {
      setTimeout(() => {
        timeoutReject(
          new Error(
            `Compliance check timed out after ${COMPLIANCE_TIMEOUT_MS}ms`,
          ),
        )
      }, COMPLIANCE_TIMEOUT_MS)
    })

    const checkPromise = (async () => {
      ctx.scale(canvas.width / 100, canvas.width / 100)
      ctx.lineWidth = 1
      ctx.lineCap = "butt"
      ctx.lineJoin = "miter"
      ctx.strokeStyle = "black"
      ctx.fillStyle = "black"
      ctx.textAlign = "center"
      ctx.textBaseline = "bottom"

      // Execute the algorithm to check for compliance
      const drawAlgorithm = new Function(
        "ctx",
        "seed",
        `${preludeScript}\n${script}`,
      )

      // Draw the algorithm first
      drawAlgorithm(ctx, seed)

      // Get the raw pixel data directly from the original canvas
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      // Create a proper ArrayBuffer from the data
      const buffer = new ArrayBuffer(imageData.data.length)
      new Uint8Array(buffer).set(imageData.data)

      // Run all compliance rules
      const ruleResults = await runAllComplianceRules(buffer)

      // Extract all issues from rule results
      const issues: CheckMetadata[] = []
      let isCompliant = true

      // Keep track of rule types with issues
      const rulesWithIssues = new Set<string>()

      for (const result of ruleResults) {
        if (result.status !== "pass" && result.metadata) {
          issues.push(...result.metadata)
          isCompliant = false

          // Record which rule type had issues
          if (result.type) {
            rulesWithIssues.add(result.type)
          }
        }
      }

      // Create issue overlay if there are issues with location data
      let issueOverlayImageData: ImageData | undefined = undefined
      if (
        !isCompliant &&
        issues.length > 0 &&
        issues.some((issue) => issue.location)
      ) {
        // Create a new canvas for the overlay with the target size
        const overlayCanvas = new OffscreenCanvas(size, size)
        const overlayCtx = overlayCanvas.getContext("2d")

        if (overlayCtx) {
          // Set up the context for drawing red rectangles
          overlayCtx.fillStyle = "rgba(0, 0, 0, 0)" // Transparent background
          overlayCtx.fillRect(0, 0, size, size) // Clear the canvas
          overlayCtx.strokeStyle = "rgba(255, 0, 0, 0.7)" // Red with some transparency
          overlayCtx.lineWidth = 4

          // Calculate scaling factor from reference size to target size
          const scaleFactor = size / COMPLIANCE_REFERENCE_SIZE

          // Add padding to make rectangles a bit bigger (in pixels)
          const paddingPixels = 5

          // Draw each issue with location data
          for (const issue of issues) {
            if (issue.location) {
              const { x, y, width, height } = issue.location

              // Scale the coordinates to the target size
              const scaledX = x * scaleFactor
              const scaledY = y * scaleFactor
              const scaledWidth = width * scaleFactor
              const scaledHeight = height * scaleFactor

              // Apply padding to make the rectangle bigger
              const paddedX = Math.max(0, scaledX - paddingPixels)
              const paddedY = Math.max(0, scaledY - paddingPixels)
              const paddedWidth = Math.min(
                size - paddedX,
                scaledWidth + paddingPixels * 2,
              )
              const paddedHeight = Math.min(
                size - paddedY,
                scaledHeight + paddingPixels * 2,
              )

              // Draw the rectangle with padding
              overlayCtx.strokeRect(paddedX, paddedY, paddedWidth, paddedHeight)
            }
          }

          // Get the image data from the overlay canvas
          issueOverlayImageData = overlayCtx.getImageData(0, 0, size, size)
        }
      }

      return {
        isCompliant,
        issues,
        issueOverlayImageData,
        ruleTypesFailed: [...rulesWithIssues],
      }
    })()

    const result = (await Promise.race([
      checkPromise,
      timeoutPromise,
    ])) as ComplianceResult

    resolve(result)
  } catch (error) {
    console.error(error)
    reject(error as Error)
  }

  isProcessing = false
  processQueue()
}

/**
 * Runs all compliance rules on the given image buffer
 * @param buffer The image buffer to check
 * @returns Array of compliance results from all rules
 */
async function runAllComplianceRules(
  buffer: ArrayBuffer,
): Promise<RuleComplianceResult[]> {
  return Promise.all(complianceRules.map((rule) => rule.check(buffer)))
}

function compareNumberArrays(a: Seed, b: Seed): boolean {
  if (a.length !== b.length) return false
  return a.every((val, i) => val === b[i])
}

export type ComplianceWorker = typeof workerAPI
expose(workerAPI)
