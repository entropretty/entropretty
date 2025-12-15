import { defineConfig } from "tsup"
import { copyFileSync, mkdirSync, existsSync } from "fs"
import { join } from "path"

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
  onSuccess: async () => {
    // Copy fonts to dist directory
    const fontsDir = join(process.cwd(), "fonts")
    const distFontsDir = join(process.cwd(), "dist", "fonts")

    if (!existsSync(distFontsDir)) {
      mkdirSync(distFontsDir, { recursive: true })
    }

    const fontFiles = [
      "IBMPlexMono-Light.ttf",
      "IBMPlexMono-Medium.ttf",
    ]

    for (const file of fontFiles) {
      const srcPath = join(fontsDir, file)
      const destPath = join(distFontsDir, file)
      if (existsSync(srcPath)) {
        copyFileSync(srcPath, destPath)
        console.log(`Copied ${file} to dist/fonts/`)
      }
    }
  },
})
