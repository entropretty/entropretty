import { blake2b256 as blake2b256Hasher } from "@multiformats/blake2/blake2b"
import { bytesToHex } from "@noble/hashes/utils"
import * as Comlink from "comlink"
import { expose } from "comlink"
import type {
  CheckMetadata,
  ComplianceResult as RuleComplianceResult,
  SingleImageRule,
} from "entropretty-compliance/browser"
import { colorIslandsRule } from "entropretty-compliance/browser"
import {
  type FamilyKind,
  type AlgorithmId,
  getSeedFamily,
  RenderCore,
  type Seed,
} from "entropretty-utils"

const COMPLIANCE_TIMEOUT_MS = 300
const COMPLIANCE_REFERENCE_SIZE = 300
const BENCHMARK_REFERENCE_SIZE = 300
const BENCHMARK_DEFAULT_AMOUNT = 1000

type Size = number

type ComplianceJob = {
  algorithmId: AlgorithmId
  seed: Seed
  referenceSize: Size
  overlaySize?: Size
  withOverlay?: boolean
  resolve: (result: ComplianceResult) => void
  reject: (error: Error) => void
}

export interface ComplianceResult {
  imageHash: string
  isCompliant: boolean
  issues: CheckMetadata[]
  issueOverlayImageData?: ImageData
  ruleTypesFailed: string[]
}

export interface BenchmarkResult {
  amount: number
  algorithmId: AlgorithmId
  size: Size
  failedTotal: number
  collisionsTotal: number
  errors: number
  warningDistribution: Record<number, number>
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
  // colorCountRule,
  colorIslandsRule,
  // Add new rules here
]

const renderCore = new RenderCore(COMPLIANCE_TIMEOUT_MS)
const complianceQueue: ComplianceJob[] = []
let isProcessing = false
let progressCallback: ((progress: number) => void) | undefined = undefined

const workerAPI = {
  async updateAlgorithm(
    algorithmId: AlgorithmId,
    algorithm: string,
    kind: FamilyKind = "Procedural",
  ) {
    renderCore.updateAlgorithm(algorithmId, algorithm, kind)
  },

  async checkCompliance(
    algorithmId: AlgorithmId,
    seed: Seed,
    options: {
      referenceSize?: Size
      overlaySize?: Size
      withOverlay?: boolean
    } = {
      referenceSize: COMPLIANCE_REFERENCE_SIZE,
      overlaySize: COMPLIANCE_REFERENCE_SIZE,
      withOverlay: false,
    },
  ): Promise<ComplianceResult> {
    return new Promise((resolve, reject) => {
      const seedCopy: Seed = [...seed]
      const job: ComplianceJob = {
        algorithmId,
        overlaySize: options.overlaySize,
        referenceSize: options.referenceSize ?? COMPLIANCE_REFERENCE_SIZE,
        withOverlay: options.withOverlay ?? false,
        seed: seedCopy,
        resolve,
        reject,
      }
      complianceQueue.push(job)
      processQueue()
    })
  },

  onProgress: Comlink.proxy((cb: (progress: number) => void) => {
    progressCallback = cb
  }),

  async benchmark(
    algorithmId: AlgorithmId,
    size: Size = BENCHMARK_REFERENCE_SIZE,
    amount: number = BENCHMARK_DEFAULT_AMOUNT,
  ): Promise<BenchmarkResult> {
    const meta = renderCore.getAlgorithmMeta(algorithmId)
    if (!meta) {
      throw new Error(`No algorithm meta found for algorithm ${algorithmId}`)
    }
    const kind = meta.kind
    const seeds = getSeedFamily(kind, amount)

    const results: ComplianceResult[] = []
    const hashes: Record<string, number[][]> = {}

    const hashesSet: Set<string> = new Set()
    let checked = 0
    let errors = 0
    for (const seed of seeds) {
      try {
        const result = await this.checkCompliance(algorithmId, seed, {
          withOverlay: false,
          referenceSize: size,
        })
        results.push(result)

        const dupeSeeds = hashes[result.imageHash]
        if (dupeSeeds) {
          hashes[result.imageHash] = [...dupeSeeds, [...seed]]
        } else {
          hashes[result.imageHash] = [[...seed]]
        }
        if (!hashesSet.has(result.imageHash)) {
          hashesSet.add(result.imageHash)
        }
      } catch {
        errors++
      }

      checked++
      if (checked % 5 === 0) {
        progressCallback?.(checked / amount)
      }
    }
    // Post-process
    progressCallback?.(checked)

    const failed = results.filter((r) => !r.isCompliant).length
    const chartData: Record<number, number> = {}
    for (const result of results) {
      const amountOfIssues = result.issues.length
      if (chartData[amountOfIssues]) {
        chartData[amountOfIssues]++
      } else {
        chartData[amountOfIssues] = 1
      }
    }

    const collisions = Object.entries(hashes).filter(
      ([, seeds]) => seeds.length > 1,
    )

    return {
      warningDistribution: chartData,
      failedTotal: failed,
      collisionsTotal: collisions.length,
      size,
      amount,
      errors,
      algorithmId,
    }
  },

  cancelCheck(algorithmId: AlgorithmId, size: Size, seed: Seed) {
    const index = complianceQueue.findIndex(
      (job) =>
        job.algorithmId === algorithmId &&
        job.overlaySize === size &&
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
  const {
    algorithmId,
    referenceSize,
    overlaySize,
    withOverlay,
    seed,
    resolve,
    reject,
  } = complianceQueue.shift()!

  try {
    // Use RenderCore to render the image data for compliance checking
    const imageData = await renderCore.renderImageData(
      algorithmId,
      referenceSize,
      seed,
    )

    // Create a proper ArrayBuffer from the image data
    const buffer = new ArrayBuffer(imageData.data.length)
    new Uint8Array(buffer).set(imageData.data)

    const digest = await blake2b256Hasher.digest(new Uint8Array(buffer))
    const imageHash = bytesToHex(digest.digest)

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
    if (withOverlay) {
      if (!overlaySize) {
        reject(new Error("Overlay size is required"))
        isProcessing = false
        processQueue()
        return
      }
      if (
        !isCompliant &&
        issues.length > 0 &&
        issues.some((issue) => issue.location)
      ) {
        // Create a new canvas for the overlay with the target size
        const overlayCanvas = new OffscreenCanvas(overlaySize, overlaySize)
        const overlayCtx = overlayCanvas.getContext("2d")

        if (overlayCtx) {
          // Set up the context for drawing red rectangles
          overlayCtx.fillStyle = "rgba(0, 0, 0, 0)" // Transparent background
          overlayCtx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height) // Clear the canvas
          overlayCtx.strokeStyle = "rgba(255, 0, 0, 0.7)" // Red with some transparency
          overlayCtx.lineWidth = 4

          // Calculate scaling factor from reference size to target size
          const scaleFactor = overlayCanvas.width / COMPLIANCE_REFERENCE_SIZE

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
                overlaySize - paddedX,
                scaledWidth + paddingPixels * 2,
              )
              const paddedHeight = Math.min(
                overlaySize - paddedY,
                scaledHeight + paddingPixels * 2,
              )

              // Draw the rectangle with padding
              overlayCtx.strokeRect(paddedX, paddedY, paddedWidth, paddedHeight)
            }
          }

          // Get the image data from the overlay canvas
          issueOverlayImageData = overlayCtx.getImageData(
            0,
            0,
            overlaySize,
            overlaySize,
          )
        }
      }
    }

    const result: ComplianceResult = {
      isCompliant,
      imageHash,
      issues,
      issueOverlayImageData,
      ruleTypesFailed: Array.from(rulesWithIssues),
    }

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
