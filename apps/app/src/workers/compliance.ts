import { blake2b256 as blake2b256Hasher } from '@multiformats/blake2/blake2b'
import { bytesToHex } from '@noble/hashes/utils.js'
import * as Comlink from 'comlink'
import { expose } from 'comlink'
import { BenchmarkCore } from '@entropretty/benchmark-core'
import { createDefaultRegistry } from '@entropretty/compliance'
import { RenderCore } from '@entropretty/utils'
import type { BenchmarkResultV2 } from '@entropretty/benchmark-core'
import type {
  CheckMetadata,
  ImagePixelData,
  RuleRegistry,
  SingleImageRule,
} from '@entropretty/compliance'
import type { AlgorithmId, FamilyKind, Seed } from '@entropretty/utils'

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
  issues: Array<CheckMetadata>
  issueOverlayImageData?: ImageData
  ruleTypesFailed: Array<string>
}

// Re-export BenchmarkResult for use in other files
export type BenchmarkResult = BenchmarkResultV2

export interface ComplianceRequest {
  algorithmId: AlgorithmId
  size: Size
  seed: Seed
  resolve: (result: ComplianceResult) => void
  reject: (error: Error) => void
}

// Use registry for all rules
const registry: RuleRegistry = createDefaultRegistry({
  'color-count': { enabled: true },
  'color-islands': { enabled: true },
  'example-code': { enabled: true },
  'color-contrast': { enabled: false },
  'non-empty-image': { enabled: false },
  'image-hash': { enabled: false },
  'image-similarity': { enabled: false },
})

const renderCore = new RenderCore(COMPLIANCE_TIMEOUT_MS)
const complianceQueue: Array<ComplianceJob> = []
let isProcessing = false
let progressCallback: ((progress: number) => void) | undefined = undefined

function imageDataToPixelData(imageData: ImageData): ImagePixelData {
  return {
    data: new Uint8Array(imageData.data.buffer),
    width: imageData.width,
    height: imageData.height,
  }
}

const workerAPI = {
  async updateAlgorithm(
    algorithmId: AlgorithmId,
    algorithm: string,
    kind: FamilyKind = 'Procedural',
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

    const algorithm = renderCore.getAlgorithm(algorithmId)
    if (!algorithm) {
      throw new Error(`No algorithm found for algorithm ${algorithmId}`)
    }

    const benchmarkCore = new BenchmarkCore()

    const result = await benchmarkCore.benchmark({
      algorithmId,
      algorithm,
      kind: meta.kind,
      size,
      amount,
      rules: registry,
      renderFn: async (seed, renderSize) => {
        const imageData = await renderCore.renderImageData(
          algorithmId,
          renderSize,
          seed,
        )
        return imageDataToPixelData(imageData)
      },
      onProgress: (progress: number) => {
        progressCallback?.(progress)
      },
    })

    return result
  },

  cancelCheck(algorithmId: AlgorithmId, size: Size, seed: Seed) {
    const index = complianceQueue.findIndex(
      (job) =>
        job.algorithmId === algorithmId &&
        job.overlaySize === size &&
        compareNumberArrays(job.seed, seed),
    )

    if (index !== -1) {
      complianceQueue[index].reject(new Error('Compliance check cancelled'))
      complianceQueue.splice(index, 1)
    }
  },
  cancelAllChecks() {
    renderCore.cancelPending()
    complianceQueue.length = 0
    isProcessing = false
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
    const imageData = await renderCore.renderImageData(
      algorithmId,
      referenceSize,
      seed,
    )

    const pixelData = imageDataToPixelData(imageData)

    const digest = await blake2b256Hasher.digest(pixelData.data)
    const imageHash = bytesToHex(digest.digest)

    // Run all single-image rules from registry
    const singleRules = registry.getEnabledByType(
      'single',
    ) as Array<SingleImageRule>
    const ruleResults = await Promise.all(
      singleRules.map((rule) => rule.check(pixelData)),
    )

    const issues: Array<CheckMetadata> = []
    let isCompliant = true
    const rulesWithIssues = new Set<string>()

    for (let i = 0; i < singleRules.length; i++) {
      const result = ruleResults[i]
      if (result.status !== 'pass' && result.metadata) {
        issues.push(...result.metadata)
        isCompliant = false
        rulesWithIssues.add(singleRules[i].name)
      }
    }

    // Create issue overlay if there are issues with location data
    let issueOverlayImageData: ImageData | undefined = undefined
    if (withOverlay) {
      if (!overlaySize) {
        reject(new Error('Overlay size is required'))
        isProcessing = false
        processQueue()
        return
      }
      if (
        !isCompliant &&
        issues.length > 0 &&
        issues.some((issue) => issue.location)
      ) {
        const overlayCanvas = new OffscreenCanvas(overlaySize, overlaySize)
        const overlayCtx = overlayCanvas.getContext('2d')

        if (overlayCtx) {
          overlayCtx.fillStyle = 'rgba(0, 0, 0, 0)'
          overlayCtx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height)
          overlayCtx.strokeStyle = 'rgba(255, 0, 0, 0.7)'
          overlayCtx.lineWidth = 4

          const scaleFactor = overlayCanvas.width / COMPLIANCE_REFERENCE_SIZE
          const paddingPixels = 5

          for (const issue of issues) {
            if (issue.location) {
              const { x, y, width, height } = issue.location
              const scaledX = x * scaleFactor
              const scaledY = y * scaleFactor
              const scaledWidth = width * scaleFactor
              const scaledHeight = height * scaleFactor
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
              overlayCtx.strokeRect(paddedX, paddedY, paddedWidth, paddedHeight)
            }
          }

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

function compareNumberArrays(a: Seed, b: Seed): boolean {
  if (a.length !== b.length) return false
  return a.every((val, i) => val === b[i])
}

export type ComplianceWorker = typeof workerAPI
expose(workerAPI)
