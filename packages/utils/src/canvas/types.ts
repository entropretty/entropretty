/**
 * Canvas adapter interface for environment-agnostic rendering
 */
export interface CanvasAdapter {
  createCanvas(width: number, height: number): CanvasLike
}

export interface CanvasLike {
  width: number
  height: number
  getContext(type: '2d'): CanvasRenderingContext2D | null
  toBuffer(): Promise<Uint8Array>
  toImageBitmap?(): ImageBitmap
}

export type RenderOutput =
  | { type: 'buffer'; data: Uint8Array }
  | { type: 'imagedata'; data: ImageData }
  | { type: 'bitmap'; data: ImageBitmap }
