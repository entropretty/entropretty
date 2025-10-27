import pc from "picocolors"
import path from "node:path"
import { build } from "tsup"

export default async function run(scriptPath: string) {
  const __cwd = process.cwd()
  const fullPath = path.resolve(__cwd, scriptPath)
  const outFolder = "dist"
  const outFile = path.basename(scriptPath)

  console.log(pc.cyan(`${scriptPath} → ${outFolder}/${outFile}`))

  try {
    const startTime = Date.now()
    build({
      entryPoints: [fullPath],
      clean: false,
      format: ["esm"],
      minify: true,
      silent: true,
      treeshake: true,
      outDir: path.join(__cwd, outFolder),
    })
    const endTime = Date.now()
    const time = endTime - startTime
    console.log(pc.green(`created ${outFolder}/${outFile} in ${time}ms\n`))
  } catch (e) {
    console.error(pc.red(`failed to build ${scriptPath}`))
    console.error(e)
  }
}
