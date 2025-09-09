#!/usr/bin/env node
import { cac } from "cac"
import * as fs from "node:fs"
import * as path from "node:path"
import { fileURLToPath } from "node:url"

import pc from "picocolors"
import prompts from "prompts"

import {
  copy,
  emptyDir,
  formatTargetDir,
  isEmpty,
  isValidPackageName,
  pkgFromUserAgent,
  toValidPackageName,
} from "./utils.js"
import { templates } from "./templates.js"

const cli = cac("create-entropretty")

cli
  .usage(`${pc.green("<project-directory>")} [options]`)
  .option("--bun", "Use bun as your package manager")
  .option("--npm", "Use npm as your package manager")
  .option("--pnpm", "Use pnpm as your package manager")
  .option("--yarn", "Use yarn as your package manager")

cli.help()
cli.version("0.1.0")

const cwd = process.cwd()

const renameFiles: Record<string, string | undefined> = {
  "_env.local": ".env.local",
  _gitignore: ".gitignore",
}

const defaultTargetDir = "entropretty-sketch"

async function init() {
  const { args, options } = cli.parse(process.argv)
  if (options.help) return
  if (options.version) return

  const argTargetDir = formatTargetDir(args[0])

  let targetDir = argTargetDir || defaultTargetDir

  function getProjectName() {
    return targetDir === "." ? path.basename(path.resolve()) : targetDir
  }

  let result: prompts.Answers<
    "overwrite" | "packageName" | "projectName" | "template"
  >
  try {
    result = await prompts(
      [
        {
          name: "projectName",
          type: argTargetDir ? null : "text",
          message: pc.reset("Project name:"),
          initial: defaultTargetDir,
          onState(state) {
            targetDir = formatTargetDir(state.value) || defaultTargetDir
          },
        },
        {
          type() {
            return !fs.existsSync(targetDir) || isEmpty(targetDir)
              ? null
              : "confirm"
          },
          name: "overwrite",
          message() {
            return `${
              targetDir === "."
                ? "Current directory"
                : `Target directory "${targetDir}"`
            } is not empty. Remove existing files and continue?`
          },
        },
        {
          type(_, { overwrite }: { overwrite?: boolean }) {
            if (overwrite === false)
              throw new Error(`${pc.red("✖")} Operation cancelled`)
            return null
          },
          name: "overwriteChecker",
        },
        {
          type() {
            return isValidPackageName(getProjectName()) ? null : "text"
          },
          name: "packageName",
          message: pc.reset("Package name:"),
          initial() {
            return toValidPackageName(getProjectName())
          },
          validate(dir) {
            return isValidPackageName(dir) || "Invalid package.json name"
          },
        },
        // Not used yet
        // {
        //   type: "select",
        //   name: "familyKind",
        //   message: pc.reset("Select a kind of tattoo family:"),
        //   initial: 0,
        //   choices: familyKinds.map((kind) => {
        //     const color = kind.color
        //     return {
        //       title: color(kind.display),
        //       value: kind,
        //     }
        //   }),
        // },
        {
          type: "select",
          name: "template",
          message: pc.reset("Select the template you want to use:"),
          initial: 0,
          choices: templates.map((template) => {
            const color = template.color
            return {
              title: color(template.display),
              value: template.name,
            }
          }),
        },
      ],
      {
        onCancel() {
          throw new Error(`${pc.red("✖")} Operation cancelled`)
        },
      },
    )
  } catch (error) {
    console.log((error as Error).message)
    return
  }

  const { template, overwrite, packageName } = result

  const root = path.join(cwd, targetDir)

  if (overwrite) emptyDir(root)
  else if (!fs.existsSync(root)) fs.mkdirSync(root, { recursive: true })

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  type PkgManager = "bun" | "npm" | "pnpm" | "yarn"
  let pkgManager: PkgManager
  if (options.bun) pkgManager = "bun"
  else if (options.npm) pkgManager = "npm"
  else if (options.pnpm) pkgManager = "pnpm"
  else if (options.yarn) pkgManager = "yarn"
  else pkgManager = pkgInfo ? (pkgInfo.name as PkgManager) : "npm"

  console.log(`\nScaffolding project in ${root}...`)

  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    "../../../templates",
    template,
  )

  function write(file: string, content?: string) {
    const targetPath = path.join(root, renameFiles[file] ?? file)
    if (content) fs.writeFileSync(targetPath, content)
    else copy(path.join(templateDir, file), targetPath)
  }

  // Copy over all template files
  const files = fs.readdirSync(templateDir)
  for (const file of files.filter((f) => f !== "package.json")) {
    write(file)
  }

  // Adapt templates package.json
  const pkg = JSON.parse(
    fs.readFileSync(path.join(templateDir, "package.json"), "utf-8"),
  )
  pkg.name = packageName || getProjectName()
  write("package.json", `${JSON.stringify(pkg, null, 2)}\n`)

  // cd into new project directory
  const cdProjectName = path.relative(cwd, root)

  // Print usage instructions
  console.log("\nDone. Now run:\n")
  if (root !== cwd)
    console.log(
      `  cd ${
        cdProjectName.includes(" ") ? `"${cdProjectName}"` : cdProjectName
      }`,
    )

  switch (pkgManager) {
    case "yarn":
      console.log("  yarn")
      console.log("  yarn dev")
      break
    default:
      console.log(`  ${pkgManager} install`)
      console.log(`  ${pkgManager} run dev`)
      break
  }

  console.log()
}

init().catch((e) => {
  console.error(e)
})
