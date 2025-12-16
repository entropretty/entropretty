import { createCanvas, GlobalFonts, Path2D, type Canvas } from "@napi-rs/canvas"
import {
  RenderCoreBase,
  createNodeCanvasAdapter,
  getSeed,
  type FamilyKind,
} from "@entropretty/utils"
import {
  IBM_PLEX_MONO_LIGHT_BASE64,
  IBM_PLEX_MONO_MEDIUM_BASE64,
} from "./embedded-fonts"

let fontsRegistered = false

const mapFamilyKindToLabel: Record<FamilyKind, string> = {
  Procedural: "Entropy",
  ProceduralPersonal: "Personal Id",
  ProceduralAccount: "Account Id",
}

function registerFonts(): void {
  if (fontsRegistered) return

  try {
    // Use embedded base64 fonts for reliable serverless deployment
    const lightFontBuffer = Buffer.from(IBM_PLEX_MONO_LIGHT_BASE64, "base64")
    const mediumFontBuffer = Buffer.from(IBM_PLEX_MONO_MEDIUM_BASE64, "base64")

    GlobalFonts.register(lightFontBuffer, "IBM Plex Mono")
    GlobalFonts.register(mediumFontBuffer, "IBM Plex Mono")

    fontsRegistered = true
  } catch (error) {
    console.error("[@entropretty/opengraph] Failed to register fonts:", error)
  }
}

// Install Path2D globally for algorithm code
if (typeof globalThis.Path2D === "undefined") {
  // @ts-ignore - Install Path2D globally for user algorithm code
  globalThis.Path2D = Path2D
}

// Singleton RenderCore for server-side rendering
let serverRenderCore: RenderCoreBase | null = null

function getServerRenderCore(): RenderCoreBase {
  if (!serverRenderCore) {
    const adapter = createNodeCanvasAdapter(
      // @ts-ignore - Canvas type compatibility
      createCanvas as (w: number, h: number) => Canvas,
    )
    serverRenderCore = new RenderCoreBase(adapter, 1000) // 1s timeout for OG images
  }
  return serverRenderCore
}

export interface OGImageConfig {
  width: number
  height: number
  rows: number
  columns: number
  tileSize: number
  padding: number
  gap: number
  backgroundColor: string
  textColor: string
}

export const OG_IMAGE_CONFIG: OGImageConfig = {
  width: 1200,
  height: 630,
  rows: 3,
  columns: 3,
  tileSize: 160,
  padding: 40,
  gap: 16,
  backgroundColor: "#ffffff",
  textColor: "#000000",
}

export const TWITTER_CARD_CONFIG: OGImageConfig = {
  width: 1200,
  height: 600,
  rows: 3,
  columns: 3,
  tileSize: 175,
  padding: 40,
  gap: 16,
  backgroundColor: "#ffffff",
  textColor: "#000000",
}

export async function generateOGImage(
  algorithmId: number,
  algorithmContent: string,
  familyKind: FamilyKind,
  algorithmName: string,
  authorName: string,
  type: "og" | "twitter" = "og",
): Promise<Uint8Array> {
  // Ensure fonts are registered before rendering
  registerFonts()

  // const cacheKey = getCacheKey(algorithmId, type)
  // const cached = getFromCache(cacheKey)
  // if (cached) return cached

  const config = type === "og" ? OG_IMAGE_CONFIG : TWITTER_CARD_CONFIG
  const renderCore = getServerRenderCore()

  // Add algorithm to render core
  console.info(
    `[${type} Image] Generating for algorithm ${algorithmId}, kind: ${familyKind}, content length: ${algorithmContent?.length ?? 0}`,
  )
  renderCore.updateAlgorithm(algorithmId, algorithmContent, familyKind)

  // Generate seeds for the grid (rows × columns)
  const totalTiles = config.rows * config.columns
  const seeds = new Array(totalTiles).fill(0).map(() => getSeed(familyKind))

  // Create main canvas
  const canvas = createCanvas(config.width, config.height)
  const ctx = canvas.getContext("2d")

  // Background
  ctx.fillStyle = config.backgroundColor
  ctx.fillRect(0, 0, config.width, config.height)

  // Calculate grid positioning (left side)
  const gridWidth =
    config.columns * config.tileSize + (config.columns - 1) * config.gap
  const gridHeight =
    config.rows * config.tileSize + (config.rows - 1) * config.gap
  const gridX = config.padding
  const gridY = (config.height - gridHeight) / 2

  // ctx.translate(config.padding / 2, 0)
  // Gray Box
  // ctx.strokeStyle = "black"
  // ctx.lineWidth = 0.5
  // ctx.lineCap = "butt"
  // ctx.strokeRect(
  //   gridX - config.padding / 2,
  //   gridY - config.padding / 2,
  //   gridWidth + config.padding,
  //   gridHeight + config.padding,
  // )
  // ctx.stroke()

  // Render algorithm tiles
  for (let i = 0; i < seeds.length; i++) {
    const row = Math.floor(i / config.columns)
    const col = i % config.columns
    const x = gridX + col * (config.tileSize + config.gap)
    const y = gridY + row * (config.tileSize + config.gap)

    try {
      const tileBuffer = await renderCore.renderBuffer(
        algorithmId,
        config.tileSize * 1,
        seeds[i],
      )
      // Decode PNG buffer and draw to canvas
      const img = await loadImageFromBuffer(tileBuffer)
      ctx.drawImage(img, x, y, config.tileSize, config.tileSize)
    } catch (error) {
      // Log the error for debugging
      console.error(
        `[${type} Image] Failed to render tile ${i} for algorithm ${algorithmId}:`,
        error,
      )
      // Draw placeholder on error
      ctx.fillStyle = "#f0f0f0"
      ctx.fillRect(x, y, config.tileSize, config.tileSize)
      ctx.strokeStyle = "#cccccc"
      ctx.strokeRect(x, y, config.tileSize, config.tileSize)
    }
  }

  // Text area (right side)
  ctx.translate(-config.padding / 2, 0)
  const textX = gridX + gridWidth + config.padding * 2
  const textWidth = config.width - textX - config.padding
  const textCenterX = textX + textWidth / 2

  // Algorithm name (using Medium weight for emphasis)
  ctx.fillStyle = config.textColor
  ctx.font = "500 56px 'IBM Plex Mono'"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  // Word wrap algorithm name if needed
  const nameLines = wrapText(ctx, algorithmName, textWidth - 20)
  const nameY = config.height / 2 - 40
  nameLines.forEach((line, i) => {
    ctx.fillText(line, textCenterX, nameY + i * 56)
  })

  // Author name (using Light weight)
  ctx.font = "500 40px 'IBM Plex Mono'"
  ctx.fillStyle = "black"
  const authorY = nameY + nameLines.length * 40 + 30
  ctx.fillText(`by ${authorName}`, textCenterX, authorY)

  // Family kind badge (using Light weight)
  ctx.font = "300 24px 'IBM Plex Mono'"
  ctx.fillStyle = "black"
  ctx.fillText(
    mapFamilyKindToLabel[familyKind].toUpperCase(),
    textCenterX,
    authorY + 50,
  )

  // Entropretty branding (using Medium weight)
  ctx.font = "500 24px 'IBM Plex Mono'"
  ctx.fillStyle = "black"
  ctx.textAlign = "right"
  ctx.fillText(
    `app.entropretty.com/a/${algorithmId}`,
    config.width - config.padding,
    config.height - config.padding,
  )

  const buffer = canvas.toBuffer("image/png")
  const result = new Uint8Array(buffer)

  return result
}

async function loadImageFromBuffer(buffer: Uint8Array): Promise<Canvas> {
  // @napi-rs/canvas can load from buffer directly
  const { loadImage } = await import("@napi-rs/canvas")
  return loadImage(Buffer.from(buffer)) as unknown as Canvas
}

function wrapText(
  ctx: any, // Use any to avoid @napi-rs/canvas type incompatibility
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(" ")
  const lines: string[] = []
  let currentLine = ""

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const metrics = ctx.measureText(testLine)

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines.length > 0 ? lines : [text]
}
