import { defineConfig } from "tsup"

export default defineConfig({
  entryPoints: ["./src/index.ts"],
  format: ["esm"],
  outDir: "dist",
  clean: true,
  dts: false,
  name: "entropretty-utils",
})
