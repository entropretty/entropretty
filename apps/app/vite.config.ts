import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { visualizer } from "rollup-plugin-visualizer"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteTsConfigPaths from "vite-tsconfig-paths"
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin"

const ReactCompilerConfig = {
  /* ... */
}

const pluginsWithReactCompiler = [
  react({
    babel: {
      plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
    },
  }),
]

// import reactSwc from "@vitejs/plugin-react-swc"
// const pluginsWithSWC = [reactSwc()]

export default defineConfig(({ mode }) => ({
  plugins: [
    nitroV2Plugin(),
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart(),
    ...pluginsWithReactCompiler,
    mode === "analyze" &&
      visualizer({
        open: true,
        filename: "dist/stats.html",
        gzipSize: true,
        brotliSize: true,
      }),
  ],
  build: {
    target: "esnext",
    sourcemap: mode === "analyze",
  },
  worker: {
    format: "es",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}))
