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
})
