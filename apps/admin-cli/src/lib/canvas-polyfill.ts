import Canvas from "canvas"

const { createCanvas, Image, ImageData: NodeImageData } = Canvas

// Polyfill OffscreenCanvas for Node.js environment
class OffscreenCanvasPolyfill {
  private canvas: any
  width: number
  height: number

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    this.canvas = createCanvas(width, height)
  }

  getContext(contextId: string) {
    if (contextId === "2d") {
      return this.canvas.getContext("2d")
    }
    return null
  }

  transferToImageBitmap() {
    // Return ImageData instead of ImageBitmap
    const ctx = this.canvas.getContext("2d")
    return ctx.getImageData(0, 0, this.width, this.height)
  }
}

// Install polyfills globally
export function installCanvasPolyfills() {
  if (typeof globalThis.OffscreenCanvas === "undefined") {
    // @ts-ignore
    globalThis.OffscreenCanvas = OffscreenCanvasPolyfill
  }

  if (typeof globalThis.Image === "undefined") {
    // @ts-ignore
    globalThis.Image = Image
  }

  if (typeof globalThis.ImageData === "undefined") {
    // @ts-ignore
    globalThis.ImageData = NodeImageData
  }

  // Path2D is available on the canvas context in node-canvas
  if (typeof globalThis.Path2D === "undefined") {
    // @ts-ignore - Path2D is available as a global in node-canvas environments
    const testCanvas = createCanvas(1, 1)
    const testCtx = testCanvas.getContext("2d")
    // @ts-ignore
    if (testCtx.constructor.Path2D) {
      // @ts-ignore
      globalThis.Path2D = testCtx.constructor.Path2D
    } else {
      // @ts-ignore
      globalThis.Path2D =
        Canvas.Path2D ||
        function Path2DPolyfill(path?: string | Path2D) {
          // Minimal Path2D polyfill
          this.commands = []
          if (typeof path === "string") {
            // SVG path string - not fully supported
          }
        }
      // @ts-ignore
      globalThis.Path2D.prototype.addPath = function () {}
      // @ts-ignore
      globalThis.Path2D.prototype.closePath = function () {}
      // @ts-ignore
      globalThis.Path2D.prototype.moveTo = function () {}
      // @ts-ignore
      globalThis.Path2D.prototype.lineTo = function () {}
      // @ts-ignore
      globalThis.Path2D.prototype.bezierCurveTo = function () {}
      // @ts-ignore
      globalThis.Path2D.prototype.quadraticCurveTo = function () {}
      // @ts-ignore
      globalThis.Path2D.prototype.arc = function () {}
      // @ts-ignore
      globalThis.Path2D.prototype.arcTo = function () {}
      // @ts-ignore
      globalThis.Path2D.prototype.ellipse = function () {}
      // @ts-ignore
      globalThis.Path2D.prototype.rect = function () {}
    }
  }
}
