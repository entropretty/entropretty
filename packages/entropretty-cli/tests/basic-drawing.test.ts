import { PuppeteerSchemaDrawer, SchemaDrawer } from "entropretty-cli"
import { afterAll, beforeAll, describe, expect, test } from "vitest"

const scriptPaths: string[] = process.env.VITEST_SCRIPT_PATH!.split(",")

const seeds = [
  new Uint8Array([11, 22, 33, 44, 55, 66, 77, 88]),
  new Uint8Array([99, 100, 101, 102, 103, 104, 105, 106]),
]

const CANVAS_SIZE = 256

describe.each(scriptPaths)("%s", (scriptPath) => {
  describe("drawing", () => {
    let drawer: SchemaDrawer | undefined = undefined

    beforeAll(async () => {
      drawer = new PuppeteerSchemaDrawer()
      await drawer.init(scriptPath, { size: CANVAS_SIZE })
    })

    afterAll(async () => {
      await drawer?.deinit()
    })

    test("is not empty", async () => {
      await drawer!.draw(seeds[0])
      const pixels = await drawer!.getImagePixels()
      const isNotSolidWhite = pixels.some((pixel) => pixel !== 0)

      expect(isNotSolidWhite).toBe(true)
    })

    test("is deterministic", async () => {
      await drawer!.draw(seeds[0])
      const firstRun = await drawer!.getImageAsBase64()
      await drawer!.draw(seeds[0])

      const secondRun = await drawer?.getImageAsBase64()
      expect(firstRun).toEqual(secondRun)
    })

    test("is different for different seeds", async () => {
      await drawer!.draw(seeds[0])
      const seedAResult = await drawer!.getImageAsBase64()
      await drawer!.draw(seeds[1])
      const seedBResult = await drawer!.getImageAsBase64()

      expect(seedAResult).not.toEqual(seedBResult)
    })
  })
})
