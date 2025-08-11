import { blake2b256 as blake2b256Hasher } from "@multiformats/blake2/blake2b"
import { bytesToHex } from "@noble/hashes/utils"
import PQueue from "p-queue"
import { preludeScriptString as preludeScript } from "./prelude/generatedScriptString"
import type { FamilyKind, Seed } from "./types"
import { getSeed } from "./seeds"

/** Types **/

export type AlgorithmId = number

export interface AlgorithmMeta {
  kind: FamilyKind
}

export type OutputType = "bitmap" | "imagedata"

export class RenderCore {
  private algorithms = new Map<AlgorithmId, string>()
  private metadata = new Map<AlgorithmId, FamilyKind>()
  private queue: PQueue

  constructor(private timeoutMs = 300) {
    this.queue = new PQueue({ concurrency: 4 }) // serialize render jobs
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
   * @param algorithmId Algorithm identifier
   * @returns Promise that resolves on success, rejects with error on failure
   */
  async testRender(algorithmId: AlgorithmId): Promise<void> {
    const script = this.algorithms.get(algorithmId)
    if (!script) throw new Error(`No script found for algorithm ${algorithmId}`)

    const kind = this.metadata.get(algorithmId)
    if (!kind) throw new Error(`No kind found for algorithm ${algorithmId}`)

    const seed = getSeed(kind)
    await this.render(algorithmId, 50, seed)
    return
  }

  /**
   * Render an algorithm by id
   * @param id Algorithm identifier
   * @param size Output size in pixels
   * @param seed Input seed array
   * @param options.output "bitmap" (default) or "imagedata"
   */
  async render(
    id: AlgorithmId,
    size: number,
    seed: Seed,
    options: { output: OutputType } = { output: "bitmap" },
  ): Promise<ImageBitmap | ImageData> {
    const script = this.algorithms.get(id)
    if (!script) throw new Error(`No script found for algorithm ${id}`)

    return this.queue.add(() =>
      this.drawWithTimeout(script, size, [...seed], options.output),
    ) as Promise<ImageBitmap | ImageData>
  }

  async renderBitmap(id: AlgorithmId, size: number, seed: Seed) {
    return this.render(id, size, seed, {
      output: "bitmap",
    }) as Promise<ImageBitmap>
  }

  async renderImageData(id: AlgorithmId, size: number, seed: Seed) {
    return this.render(id, size, seed, {
      output: "imagedata",
    }) as Promise<ImageData>
  }

  async hash(id: AlgorithmId, size: number, seed: Seed) {
    const image = await this.renderImageData(id, size, seed)
    const buffer = new ArrayBuffer(image.data.length)
    new Uint8Array(buffer).set(image.data)
    const digest = await blake2b256Hasher.digest(new Uint8Array(buffer))
    const hash = bytesToHex(digest.digest)
    return hash
  }

  /**
   * Cancel all pending jobs (queue clear)
   */
  cancelPending() {
    this.queue.clear()
  }

  /**
   * Get metadata (useful for UI or analysis)
   */
  getAlgorithmMeta(id: AlgorithmId): AlgorithmMeta | undefined {
    const kind = this.metadata.get(id)
    if (!kind) return undefined

    return {
      kind,
    }
  }

  /**
   * Internal draw logic with timeout + abort
   */
  private async drawWithTimeout(
    script: string,
    size: number,
    seed: Seed,
    output: OutputType,
  ): Promise<ImageBitmap | ImageData> {
    const canvas = new OffscreenCanvas(size, size)
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Failed to get 2D rendering context")

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Render timed out after ${this.timeoutMs}ms`)),
        this.timeoutMs,
      ),
    )

    const renderPromise = (async () => {
      try {
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
        let drawAlgorithm: (
          ctx: OffscreenCanvasRenderingContext2D,
          seed: number[],
        ) => void
        try {
          drawAlgorithm = new Function(
            "ctx",
            "seed",
            `${preludeScript}\n${script}`,
          ) as typeof drawAlgorithm
        } catch (syntaxError: unknown) {
          if (syntaxError instanceof SyntaxError) {
            throw new Error(`Syntax error: ${syntaxError.message}`)
          } else {
            throw new Error(`Syntax error: ${syntaxError}`)
          }
        }

        // Execute drawing
        try {
          drawAlgorithm(ctx, [...seed])
        } catch (runtimeError: unknown) {
          throw new Error(`Runtime error: ${runtimeError}`)
        }

        if (output === "imagedata") {
          return ctx.getImageData(0, 0, size, size)
        } else {
          return canvas.transferToImageBitmap()
        }
      } catch (err) {
        // All errors here are guaranteed to be caught and passed to caller
        throw err
      }
    })()

    return await Promise.race([renderPromise, timeoutPromise])
  }
}
