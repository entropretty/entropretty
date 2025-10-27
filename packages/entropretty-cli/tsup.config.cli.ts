import { defineConfig } from "tsup"

export default defineConfig({
  entryPoints: { cli: "./src/cli.ts" },
  tsconfig: "./tsconfig.lib.json",
  format: ["esm"],
  outDir: "dist",
  name: "entropretty-cli",
})
