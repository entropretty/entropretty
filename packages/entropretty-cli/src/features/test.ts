import fs from "node:fs/promises"
import path, { basename } from "node:path"
import pc from "picocolors"
import { startVitest } from "vitest/node"

export default async function run(scriptPaths: string[]) {
  const __cwd = process.cwd()

  const testFolder = path.join(__cwd, ".entropretty", "test")

  const testsFolder = path.join(__cwd, "node_modules/entropretty-cli")

  await fs.rm(testFolder, { recursive: true, force: true })
  await fs.mkdir(testFolder, { recursive: true })

  try {
    const vitest = await startVitest("test", ["basic"], {
      watch: false,
      dir: testsFolder,
      run: true,
      env: {
        VITEST_SCRIPT_NAME: scriptPaths
          .map((scriptPath) => basename(scriptPath))
          .join(","),
        VITEST_SCRIPT_PATH: scriptPaths.join(","),
      },
    })
    await vitest?.close()
  } catch (e) {
    console.error(
      pc.red(`failed to test run tests for \n${scriptPaths.join(", ")}`),
    )
    console.error(e)
  }
}
