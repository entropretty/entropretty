#!/usr/bin/env bun
import { cac } from "cac"
import { registerScoreCommand } from "./features/score"
import { registerSocialCommand } from "./features/social"

const cli = cac("admin")

// Register feature commands
registerScoreCommand(cli)
registerSocialCommand(cli)

// Default command (show help)
cli.command("", "Entropretty Admin CLI").action(() => {
  cli.outputHelp()
})

cli.help()
cli.version("0.0.1")

cli.parse()
