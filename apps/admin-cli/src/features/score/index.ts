import type { CAC } from "cac"
import type { Algorithm } from "../../lib/supabase"

export function registerScoreCommand(cli: CAC) {
  cli
    .command("score", "Score algorithms based on quality benchmarks")
    .option("--missing-only", "Only score algorithms without scores")
    .option("--all", "Rescore all algorithms")
    .option("--id <id>", "Score specific algorithm by ID")
    .option(
      "--older-than <time>",
      "Rescore algorithms older than specified time (e.g. 7d)",
    )
    .action(async (options) => {
      // Lazy load canvas polyfills and scoring dependencies
      const { installCanvasPolyfills } = await import("../../lib/canvas-polyfill")
      installCanvasPolyfills()

      const { getAllAlgorithms, getAlgorithmById } = await import("../../lib/database")
      const { getUnscoredAlgorithms, getAlgorithmsOlderThan } = await import("./queries")
      const { scoreAlgorithm } = await import("./scorer")

      let algorithms: Algorithm[] = []
      let mode = "missing"

      try {
        if (options.id) {
          const algo = await getAlgorithmById(parseInt(options.id))
          if (!algo) {
            console.error(`Algorithm with ID ${options.id} not found`)
            process.exit(1)
          }
          algorithms = [algo]
          mode = `specific (ID: ${options.id})`
        } else if (options.all) {
          algorithms = await getAllAlgorithms()
          mode = "all"
        } else if (options.olderThan) {
          const match = options.olderThan.match(/^(\d+)d$/)
          if (!match) {
            console.error("Invalid --older-than format. Use format like: 7d")
            process.exit(1)
          }
          const days = parseInt(match[1])
          algorithms = await getAlgorithmsOlderThan(days)
          mode = `older than ${days} days`
        } else if (options.missingOnly) {
          algorithms = await getUnscoredAlgorithms()
          mode = "missing only"
        } else {
          // Default: missing only
          algorithms = await getUnscoredAlgorithms()
          mode = "missing only"
        }

        if (algorithms.length === 0) {
          console.log(`No algorithms to score (mode: ${mode})`)
          process.exit(0)
        }

        const total = algorithms.length
        console.log(`Found ${total} algorithm(s) to score (mode: ${mode})`)
        console.log("")

        let completed = 0
        let failed = 0

        for (let i = 0; i < algorithms.length; i++) {
          const algorithm = algorithms[i]
          const current = i + 1
          const remaining = total - current

          process.stdout.write(
            `[${current}/${total}] Scoring algorithm ${algorithm.id}... `,
          )

          const result = await scoreAlgorithm(algorithm, (_progress) => {
            // Optional: show progress bar
          })

          if (result.success) {
            console.log(
              `✓ Score: ${result.score} (${remaining} remaining, ${completed + 1} completed)`,
            )
            completed++
          } else {
            console.log(
              `✗ Error: ${result.error} (${remaining} remaining, ${completed} completed, ${failed + 1} failed)`,
            )
            failed++
          }
        }

        console.log("")
        console.log("=".repeat(60))
        console.log(
          `Summary: ${completed} completed, ${failed} failed, ${total} total`,
        )
        console.log("=".repeat(60))
      } catch (error) {
        console.error("Fatal error:", error)
        process.exit(1)
      }
    })
}
