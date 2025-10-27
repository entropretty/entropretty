import react from "@vitejs/plugin-react-swc"
import path from "node:path"
import { resolve } from "path"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig({
  plugins: [
    react(),
    dts({ tsconfigPath: "./tsconfig.app.json", rollupTypes: true }),
  ],
  base: "./",
  worker: {
    format: "es",
  },
  build: {
    outDir: "dist",
    lib: {
      entry: resolve(__dirname, "./src/index.ts"),
      name: "Editor",

      fileName: "entropretty-editor",
    },
    rollupOptions: {
      external: ["react"],
      output: {
        globals: {
          vue: "React",
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    __SCRIPTS__: [],
  },
})
