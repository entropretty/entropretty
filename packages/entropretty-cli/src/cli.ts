#!/usr/bin/env node
import build from "@/features/build"
import dev from "@/features/dev"
import test from "@/features/test"
import cac from "cac"

const cli = cac("entropretty")

cli.command("dev", "start entropretty editor in dev mode").action(async () => {
  await dev()
})

cli
  .command("build [...files]", "bundle schemas for distribution")
  .action(async (files) => {
    for (const file of files) {
      await build(file)
    }
  })

cli
  .command("test [...files]", "test bundled schemas for compliance")
  .action(async (files) => {
    await test(files)
  })

// Prints help if no command is provided
cli.command("[...args]", "Print help").action(() => {
  cli.outputHelp()
})

cli.help()

try {
  cli.parse(process.argv, { run: false })
  await cli.runMatchedCommand()
} catch (error) {
  if (error instanceof Error) console.error(error.message)
  else {
    console.error(error)
  }

  process.exit(1)
}
