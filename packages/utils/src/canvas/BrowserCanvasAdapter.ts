import type { CanvasAdapter, CanvasLike } from "./types"

class BrowserCanvas implements CanvasLike {
  private canvas: OffscreenCanvas

  constructor(width: number, height: number) {
    this.canvas = new OffscreenCanvas(width, height)
  }

  get width() {
    return this.canvas.width
  }

  get height() {
    return this.canvas.height
  }

  getContext(type: "2d"): CanvasRenderingContext2D | null {
    return this.canvas.getContext(type) as CanvasRenderingContext2D | null
  }

  async toBuffer(): Promise<Uint8Array> {
    const blob = await this.canvas.convertToBlob({ type: "image/png" })
    const arrayBuffer = await blob.arrayBuffer()
    return new Uint8Array(arrayBuffer)
  }

  toImageBitmap(): ImageBitmap {
    return this.canvas.transferToImageBitmap()
  }
}

export class BrowserCanvasAdapter implements CanvasAdapter {
  createCanvas(width: number, height: number): CanvasLike {
    return new BrowserCanvas(width, height)
  }
}

/**
 * Create a browser canvas adapter
 * Only use in browser environment
 */
export function createBrowserCanvasAdapter(): CanvasAdapter {
  if (typeof OffscreenCanvas === "undefined") {
    throw new Error(
      "OffscreenCanvas is not available. Are you running in a browser?",
    )
  }
  return new BrowserCanvasAdapter()
}
