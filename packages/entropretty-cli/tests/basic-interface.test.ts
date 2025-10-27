import { describe, expect, test } from "vitest"

const scriptPaths: string[] = process.env.VITEST_SCRIPT_PATH!.split(",")

describe.each(scriptPaths)("%s", (scriptPath) => {
  describe("interface", () => {
    test("schema is a named export", async () => {
      const module = await import(scriptPath)
      expect(module.schema).toBeDefined()
    })

    test("schema has correct shape", async () => {
      const { schema } = await import(scriptPath)

      expect(schema).toBeDefined()
      expect(schema.name).toBeDefined()

      expect(typeof schema.name).toBe("string")

      expect(schema.kind).toBeDefined()
      expect(typeof schema.kind).toBe("string")
      expect(schema.kind).oneOf([
        "Procedural",
        "ProceduralAccount",
        "ProceduralPersonal",
      ])

      expect(schema.artist).toBeDefined()
      expect(typeof schema.artist).toBe("string")

      expect(schema.draw).toBeDefined()
      expect(typeof schema.draw).toBe("function")
    })

    test("schema draw function is valid", async () => {
      const { schema } = await import(scriptPath)

      expect(schema.draw).toBeDefined()
      expect(typeof schema.draw).toBe("function")

      const drawArgs = schema.draw.toString().match(/\(([^)]*)\)/)?.[1]
      expect(drawArgs).toBeDefined()
      expect(drawArgs?.split(",").map((arg) => arg.trim()).length).toBe(2)
    })
  })
})
