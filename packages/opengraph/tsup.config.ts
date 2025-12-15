import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: {
    compilerOptions: {
      skipLibCheck: true,
    },
  },
  sourcemap: true,
  clean: true,
  splitting: false,
  // Fonts are now embedded as base64 in src/embedded-fonts.ts
  // No need to copy font files to dist
})
