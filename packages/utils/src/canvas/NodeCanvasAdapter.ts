import type { CanvasAdapter, CanvasLike } from './types'

// Type definitions for @napi-rs/canvas
// Using loose types since the actual types come from the package
interface NapiCanvas {
  width: number
  height: number
  getContext(type: '2d'): CanvasRenderingContext2D
  toBuffer(mimeType: 'image/png'): Buffer
}

type CreateCanvasFn = (width: number, height: number) => NapiCanvas

class NodeCanvas implements CanvasLike {
  private canvas: NapiCanvas

  constructor(canvas: NapiCanvas) {
    this.canvas = canvas
  }

  get width() {
    return this.canvas.width
  }

  get height() {
    return this.canvas.height
  }

  getContext(type: '2d'): CanvasRenderingContext2D | null {
    return this.canvas.getContext(type) as CanvasRenderingContext2D | null
  }

  async toBuffer(): Promise<Uint8Array> {
    const buffer = this.canvas.toBuffer('image/png')
    return new Uint8Array(buffer)
  }
}

export class NodeCanvasAdapter implements CanvasAdapter {
  private createCanvasFn: CreateCanvasFn

  constructor(createCanvasFn: CreateCanvasFn) {
    this.createCanvasFn = createCanvasFn
  }

  createCanvas(width: number, height: number): CanvasLike {
    const canvas = this.createCanvasFn(width, height)
    return new NodeCanvas(canvas)
  }
}

/**
 * Create a Node.js canvas adapter using @napi-rs/canvas
 * Must be called with the createCanvas function from @napi-rs/canvas
 *
 * @example
 * import { createCanvas } from '@napi-rs/canvas'
 * const adapter = createNodeCanvasAdapter(createCanvas)
 */
export function createNodeCanvasAdapter(createCanvasFn: CreateCanvasFn): CanvasAdapter {
  return new NodeCanvasAdapter(createCanvasFn)
}

