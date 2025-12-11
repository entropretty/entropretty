import { blake2b256 as blake2b256Hasher } from "@multiformats/blake2/blake2b"
import { bytesToHex } from "@noble/hashes/utils"
import PQueue from "p-queue"
import { preludeScriptString as preludeScript } from "./prelude/generatedScriptString"
import type { FamilyKind, Seed } from "./types"
import { getSeed } from "./seeds"
import type { CanvasAdapter, RenderOutput } from "./canvas/types"
import type { AlgorithmId, AlgorithmMeta } from "./RenderCore"

export type RenderCoreOutputType = "buffer" | "imagedata"

/**
 * Environment-agnostic RenderCore
 * Use with a CanvasAdapter for browser or Node.js
 */
export class RenderCoreBase {
  private algorithms = new Map<AlgorithmId, string>()
  private metadata = new Map<AlgorithmId, FamilyKind>()
  private queue: PQueue
  private canvasAdapter: CanvasAdapter

  constructor(
    canvasAdapter: CanvasAdapter,
    private timeoutMs = 300,
  ) {
    this.canvasAdapter = canvasAdapter
    this.queue = new PQueue({ concurrency: 4 })
  }

  /**
   * Store or update an algorithm and its metadata
   */
  updateAlgorithm(id: AlgorithmId, script: string, kind: FamilyKind): void {
    this.algorithms.set(id, script)
    this.metadata.set(id, kind)
  }

  /**
   * Quick sanity render to get potential Errors thrown by the algorithm
   */
  async testRender(algorithmId: AlgorithmId): Promise<void> {
    const script = this.algorithms.get(algorithmId)
    if (!script) throw new Error(`No script found for algorithm ${algorithmId}`)

    const kind = this.metadata.get(algorithmId)
    if (!kind) throw new Error(`No kind found for algorithm ${algorithmId}`)

    const seed = getSeed(kind)
    await this.render(algorithmId, 50, seed)
  }

  /**
   * Render an algorithm by id
   * @param id Algorithm identifier
   * @param size Output size in pixels
   * @param seed Input seed array
   * @param options.output "buffer" (default) or "imagedata"
   */
  async render(
    id: AlgorithmId,
    size: number,
    seed: Seed,
    options: { output: RenderCoreOutputType } = { output: "buffer" },
  ): Promise<RenderOutput> {
    const script = this.algorithms.get(id)
    if (!script) throw new Error(`No script found for algorithm ${id}`)

    return this.queue.add(() =>
      this.drawWithTimeout(script, size, [...seed], options.output),
    ) as Promise<RenderOutput>
  }

  /**
   * Render to PNG buffer (works in both browser and Node.js)
   */
  async renderBuffer(
    id: AlgorithmId,
    size: number,
    seed: Seed,
  ): Promise<Uint8Array> {
    const result = await this.render(id, size, seed, { output: "buffer" })
    if (result.type !== "buffer") throw new Error("Unexpected output type")
    return result.data
  }

  /**
   * Render to ImageData
   */
  async renderImageData(
    id: AlgorithmId,
    size: number,
    seed: Seed,
  ): Promise<ImageData> {
    const result = await this.render(id, size, seed, { output: "imagedata" })
    if (result.type !== "imagedata") throw new Error("Unexpected output type")
    return result.data
  }

  /**
   * Hash the rendered output
   */
  async hash(id: AlgorithmId, size: number, seed: Seed): Promise<string> {
    const image = await this.renderImageData(id, size, seed)
    const buffer = new ArrayBuffer(image.data.length)
    new Uint8Array(buffer).set(image.data)
    const digest = await blake2b256Hasher.digest(new Uint8Array(buffer))
    return bytesToHex(digest.digest)
  }

  /**
   * Cancel all pending jobs
   */
  cancelPending(): void {
    this.queue.clear()
  }

  /**
   * Get metadata
   */
  getAlgorithmMeta(id: AlgorithmId): AlgorithmMeta | undefined {
    const kind = this.metadata.get(id)
    if (!kind) return undefined
    return { kind }
  }

  /**
   * Get algorithm script by ID
   */
  getAlgorithm(id: AlgorithmId): string | undefined {
    return this.algorithms.get(id)
  }

  /**
   * Check if algorithm exists
   */
  hasAlgorithm(id: AlgorithmId): boolean {
    return this.algorithms.has(id)
  }

  private async drawWithTimeout(
    script: string,
    size: number,
    seed: Seed,
    output: RenderCoreOutputType,
  ): Promise<RenderOutput> {
    const canvas = this.canvasAdapter.createCanvas(size, size)
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Failed to get 2D rendering context")

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Render timed out after ${this.timeoutMs}ms`)),
        this.timeoutMs,
      ),
    )

    const renderPromise = (async (): Promise<RenderOutput> => {
      // Setup canvas state
      ctx.scale(canvas.width / 100, canvas.width / 100)
      ctx.lineWidth = 1
      ctx.lineCap = "butt"
      ctx.lineJoin = "miter"
      ctx.strokeStyle = "black"
      ctx.fillStyle = "black"
      ctx.textAlign = "center"
      ctx.textBaseline = "bottom"

      // Compile user script
      let drawAlgorithm: (ctx: CanvasRenderingContext2D, seed: number[]) => void
      try {
        drawAlgorithm = new Function(
          "ctx",
          "seed",
          `${preludeScript}\n${script}`,
        ) as typeof drawAlgorithm
      } catch (syntaxError: unknown) {
        if (syntaxError instanceof SyntaxError) {
          throw new Error(`Syntax error: ${syntaxError.message}`)
        }
        throw new Error(`Syntax error: ${syntaxError}`)
      }

      // Execute drawing
      try {
        drawAlgorithm(ctx, [...seed])
      } catch (runtimeError: unknown) {
        throw new Error(`Runtime error: ${runtimeError}`)
      }

      if (output === "imagedata") {
        return { type: "imagedata", data: ctx.getImageData(0, 0, size, size) }
      } else {
        const buffer = await canvas.toBuffer()
        return { type: "buffer", data: buffer }
      }
    })()

    return Promise.race([renderPromise, timeoutPromise])
  }
}
