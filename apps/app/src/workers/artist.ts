import { expose, transfer } from "comlink"
import { preludeScript } from "./prelude"
import type { Seed } from "entropretty-utils"

const RENDER_TIMEOUT_MS = 300
type Size = number
export type AlgorithmId = number
export interface RenderRequest {
  algorithmId: AlgorithmId
  size: Size
  seed: Seed
  resolve: (image: ImageBitmap) => void
  reject: (error: Error) => void
}

const algorithms: Map<AlgorithmId, string> = new Map()
const renderQueue: RenderRequest[] = []
let isRendering = false

const workerAPI = {
  async updateAlgorithm(algorithmId: AlgorithmId, algorithm: string) {
    // 0 is the editor algorithm
    if (algorithmId === 0) {
      algorithms.set(algorithmId, algorithm)
      return this.render(
        algorithmId,
        50,
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      )
    } else {
      if (!algorithms.has(algorithmId)) {
        algorithms.set(algorithmId, algorithm)
      }
    }
  },

  async render(
    algorithmId: AlgorithmId,
    size: Size,
    seed: Seed,
  ): Promise<ImageBitmap> {
    return new Promise((resolve, reject) => {
      const seedCopy = [...seed] // Copy to avoid shared memory issues
      const job: RenderRequest = {
        algorithmId,
        size,
        seed: seedCopy,
        resolve,
        reject,
      }
      renderQueue.push(job)
      processQueue()
    })
  },

  cancelRender(algorithmId: AlgorithmId, size: Size, seed: Seed) {
    const index = renderQueue.findIndex(
      (job) =>
        job.algorithmId === algorithmId &&
        job.size === size &&
        compareNumberArrays(job.seed, seed),
    )
    if (index !== -1) {
      renderQueue.splice(index, 1)
    }
  },
}
async function processQueue() {
  if (isRendering || renderQueue.length === 0) return

  isRendering = true
  const { algorithmId, size, seed, resolve, reject } = renderQueue.shift()!

  if (!algorithms.has(algorithmId)) {
    reject(new Error(`No script found for ${algorithmId}`))
    isRendering = false
    processQueue()
    return
  }

  const script = algorithms.get(algorithmId)!
  const canvas = new OffscreenCanvas(size, size)

  const ctx = canvas.getContext("2d")

  if (!ctx) {
    reject(new Error("Failed to get 2D rendering context"))
    isRendering = false
    processQueue()
    return
  }

  try {
    // Set up a timeout of 2000ms (2 seconds)
    const timeoutPromise = new Promise((_, timeoutReject) => {
      setTimeout(() => {
        timeoutReject(
          new Error(`Render job timed out after ${RENDER_TIMEOUT_MS}ms`),
        )
      }, RENDER_TIMEOUT_MS)
    })

    // Create a promise for the actual rendering work
    const renderPromise = (async () => {
      ctx.scale(canvas.width / 100, canvas.width / 100)
      ctx.lineWidth = 1
      ctx.lineCap = "butt"
      ctx.lineJoin = "miter"
      ctx.strokeStyle = "black"
      ctx.fillStyle = "black"
      ctx.textAlign = "center"
      ctx.textBaseline = "bottom"

      const drawAlgorithm = new Function(
        "ctx",
        "seed",
        `${preludeScript}\n${script}`,
      )
      drawAlgorithm(ctx, seed)
      const imageBitmap = canvas.transferToImageBitmap()
      return imageBitmap
    })()

    // Race between the timeout and the render
    const imageBitmap = (await Promise.race([
      renderPromise,
      timeoutPromise,
    ])) as ImageBitmap
    resolve(transfer(imageBitmap, [imageBitmap]))
  } catch (error) {
    console.error(error)
    reject(error as Error)
  }

  isRendering = false
  processQueue()
}

function compareNumberArrays(a: Seed, b: Seed): boolean {
  if (a.length !== b.length) return false
  return a.every((val, i) => val === b[i])
}

export type ArtistWorker = typeof workerAPI
expose(workerAPI)
