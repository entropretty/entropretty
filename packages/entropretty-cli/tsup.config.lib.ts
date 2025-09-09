import { defineConfig } from "tsup"

export default defineConfig({
  entryPoints: {
    lib: "./src/lib/index.ts",
  },
  tsconfig: "./tsconfig.lib.json",
  format: ["esm"],
  outDir: "dist",
  dts: true,
  name: "entropretty-test",
})
