import type { CAC } from "cac"

const DEFAULT_DELAY_MS = 1000

export function registerSocialCommand(cli: CAC) {
  cli
    .command("social", "Generate social media images (OpenGraph & Twitter) for algorithms")
    .option("--id <id>", "Generate for specific algorithm by ID")
    .option("--delay <ms>", "Delay between requests in milliseconds (default: 1000)")
    .option("--og-only", "Only generate OpenGraph images")
    .option("--twitter-only", "Only generate Twitter images")
    .action(async (options) => {
      // Lazy load dependencies
      const { getAllAlgorithmIds } = await import("../../lib/database")
      const { generateSocialImages, generateOGImage, generateTwitterImage } = await import("./api")

      const delayMs = options.delay ? parseInt(options.delay) : DEFAULT_DELAY_MS

      try {
        let algorithmIds: number[] = []

        if (options.id) {
          algorithmIds = [parseInt(options.id)]
        } else {
          algorithmIds = await getAllAlgorithmIds()
        }

        if (algorithmIds.length === 0) {
          console.log("No algorithms found")
          process.exit(0)
        }

        const total = algorithmIds.length
        const mode = options.id ? `specific (ID: ${options.id})` : "all"
        const imageType = options.ogOnly
          ? "OpenGraph only"
          : options.twitterOnly
            ? "Twitter only"
            : "OpenGraph + Twitter"

        console.log(`Generating ${imageType} images for ${total} algorithm(s) (mode: ${mode})`)
        console.log(`Delay between requests: ${delayMs}ms`)
        console.log("")

        let completed = 0
        let failed = 0

        for (let i = 0; i < algorithmIds.length; i++) {
          const algorithmId = algorithmIds[i]
          const current = i + 1
          const remaining = total - current

          process.stdout.write(
            `[${current}/${total}] Algorithm ${algorithmId}... `,
          )

          if (options.ogOnly) {
            const result = await generateOGImage(algorithmId)
            if (result.success) {
              console.log(`✓ OG: ${result.status} (${remaining} remaining)`)
              completed++
            } else {
              console.log(`✗ OG failed: ${result.error || result.status} (${remaining} remaining)`)
              failed++
            }
          } else if (options.twitterOnly) {
            const result = await generateTwitterImage(algorithmId)
            if (result.success) {
              console.log(`✓ Twitter: ${result.status} (${remaining} remaining)`)
              completed++
            } else {
              console.log(`✗ Twitter failed: ${result.error || result.status} (${remaining} remaining)`)
              failed++
            }
          } else {
            const { og, twitter } = await generateSocialImages(algorithmId, delayMs)

            const ogStatus = og.success ? `✓ ${og.status}` : `✗ ${og.error || og.status}`
            const twitterStatus = twitter.success ? `✓ ${twitter.status}` : `✗ ${twitter.error || twitter.status}`

            console.log(`OG: ${ogStatus}, Twitter: ${twitterStatus} (${remaining} remaining)`)

            if (og.success && twitter.success) {
              completed++
            } else {
              failed++
            }
          }

          // Add delay between algorithms (but not after the last one)
          if (i < algorithmIds.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, delayMs))
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
