import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/browser.ts", "src/server.ts", "src/config.ts"],
  format: ["esm"],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  minify: true,
  target: "node18",
  outDir: "dist",
  treeshake: true,
});
