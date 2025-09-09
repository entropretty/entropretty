import { Schema, SchemaMetadata } from "entropretty-utils"
import * as Comlink from "comlink"
import type { Seed } from "entropretty-utils"

export const createWorker = (
  dynamicImports: Record<string, () => Promise<unknown>>,
) => {
  const _schemas = new Map<string, Schema>()
  let _isInitialized = false
  return {
    init: async () => {
      const imported: SchemaMetadata[] = []
      await Promise.all(
        Object.values(dynamicImports).map(async (importPromise) => {
          try {
            const result = await importPromise()
            const module = (result as { schema: Schema }).schema as Schema

            _schemas.set(module.name, module)

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { draw, ...rest } = module
            if (rest.kind === undefined) {
              console.warn(
                `Schema kind for '${rest.name}' not defined, defaulting to 'Procedural'`,
              )
              rest.kind = "Procedural"
            }
            imported.push(rest)
          } catch (e) {
            console.log({ e })
          }
        }),
      )

      _isInitialized = true
      return Array.from(imported).sort((a, b) => a.name.localeCompare(b.name))
    },
    isInitialized: () => {
      return _isInitialized
    },
    hasSchema: (name: string) => {
      return _schemas.has(name)
    },
    drawTransfer: async (name: string, seed: Seed, size: number) => {
      const canvas = new OffscreenCanvas(size, size)
      const context = canvas.getContext("2d")
      if (!context) throw "Unable to get Context from OffscreenCanvas in Worker"

      const schema = _schemas.get(name)
      if (schema === undefined)
        throw "Schema not loaded, try adding it before drawing"

      context.clearRect(0, 0, canvas.width, canvas.height)
      context.scale(canvas.width / 100, canvas.width / 100)

      // Prelude
      context.lineWidth = 1
      context.lineCap = "butt"
      context.lineJoin = "miter"
      context.strokeStyle = "black"
      context.fillStyle = "black"
      context.textAlign = "center"
      context.textBaseline = "bottom"

      try {
        schema.draw(context as unknown as CanvasRenderingContext2D, seed)
      } catch (e) {
        console.error("Error drawing", name)
        console.info(e)
      }

      const bitmap = canvas.transferToImageBitmap()
      return Comlink.transfer(bitmap, [bitmap])
    },
  }
}

export type EntroprettyEditorWorker = ReturnType<typeof createWorker>
