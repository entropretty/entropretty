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
  rows: 2,
  columns: 3,
  tileSize: 245,
  padding: 40,
  gap: 12,
  backgroundColor: "#ffffff",
  textColor: "#000000",
}

export const TWITTER_CARD_CONFIG: OGImageConfig = {
  width: 1200,
  height: 600,
  rows: 2,
  columns: 3,
  tileSize: 240,
  padding: 40,
  gap: 12,
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

  // Layout: Text on left (35%), Grid on right (65%) - matching AlgorithmHero
  const leftSectionWidth = Math.floor(config.width * 0.35)
  const rightSectionWidth = config.width - leftSectionWidth

  // Calculate grid positioning (right side)
  const gridWidth =
    config.columns * config.tileSize + (config.columns - 1) * config.gap
  const gridHeight =
    config.rows * config.tileSize + (config.rows - 1) * config.gap
  const gridX = leftSectionWidth + (rightSectionWidth - gridWidth) / 2
  const gridY = (config.height - gridHeight) / 2

  // Draw vertical separator line (like border-r in hero component)
  ctx.strokeStyle = "#e5e5e5"
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(leftSectionWidth, 0)
  ctx.lineTo(leftSectionWidth, config.height)
  ctx.stroke()

  // Render algorithm tiles (right side)
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

  // Text area (left side) - matching AlgorithmHero layout
  const textPadding = config.padding * 1.5
  const textX = textPadding
  const textMaxWidth = leftSectionWidth - textPadding * 2

  // Starting Y position for text content (vertically centered)
  let currentY = config.height / 2 - 100

  // Algorithm ID badge (like /a/{id} in hero)
  ctx.fillStyle = "#737373" // muted-foreground
  ctx.font = "300 18px 'IBM Plex Mono'"
  ctx.textAlign = "left"
  ctx.textBaseline = "top"
  ctx.fillText(`/a/${algorithmId}`, textX, currentY)
  currentY += 35

  // Family kind badge
  ctx.fillStyle = config.textColor
  ctx.font = "300 16px 'IBM Plex Mono'"
  ctx.fillText(mapFamilyKindToLabel[familyKind].toUpperCase(), textX, currentY)
  currentY += 40

  // Algorithm name (large, prominent - like h1 in hero)
  ctx.fillStyle = config.textColor
  ctx.font = "500 42px 'IBM Plex Mono'"

  // Word wrap algorithm name if needed
  const nameLines = wrapText(ctx, algorithmName, textMaxWidth)
  nameLines.forEach((line) => {
    ctx.fillText(line, textX, currentY)
    currentY += 50
  })
  currentY += 10

  // Author name
  ctx.font = "300 24px 'IBM Plex Mono'"
  ctx.fillStyle = config.textColor
  ctx.fillText(authorName, textX, currentY)

  // Entropretty branding (bottom right)
  ctx.font = "300 18px 'IBM Plex Mono'"
  ctx.fillStyle = "#737373"
  ctx.textAlign = "right"
  ctx.fillText(
    `app.entropretty.com`,
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
