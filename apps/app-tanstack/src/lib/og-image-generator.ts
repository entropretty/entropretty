import { createCanvas, Path2D, type Canvas } from '@napi-rs/canvas'
import {
  RenderCoreBase,
  createNodeCanvasAdapter,
  deriveSeedFamily,
  getSeed,
  type FamilyKind,
} from '@entropretty/utils'

// In-memory cache for generated OG images
const imageCache = new Map<string, { buffer: Uint8Array; timestamp: number }>()
const CACHE_TTL = 1000 * 60 * 60 // 1 hour

// Install Path2D globally for algorithm code
if (typeof globalThis.Path2D === 'undefined') {
  // @ts-ignore - Install Path2D globally for user algorithm code
  globalThis.Path2D = Path2D
}

// Singleton RenderCore for server-side rendering
let serverRenderCore: RenderCoreBase | null = null

function getServerRenderCore(): RenderCoreBase {
  if (!serverRenderCore) {
    const adapter = createNodeCanvasAdapter(
      createCanvas as (w: number, h: number) => Canvas,
    )
    serverRenderCore = new RenderCoreBase(adapter, 1000) // 1s timeout for OG images
  }
  return serverRenderCore
}

export interface OGImageConfig {
  width: number
  height: number
  gridSize: number // 3 for 3x3 grid
  tileSize: number
  padding: number
  gap: number
  backgroundColor: string
  textColor: string
}

export const OG_IMAGE_CONFIG: OGImageConfig = {
  width: 1200,
  height: 630,
  gridSize: 3,
  tileSize: 160,
  padding: 40,
  gap: 16,
  backgroundColor: '#ffffff',
  textColor: '#000000',
}

export const TWITTER_CARD_CONFIG: OGImageConfig = {
  width: 1200,
  height: 600,
  gridSize: 3,
  tileSize: 150,
  padding: 40,
  gap: 16,
  backgroundColor: '#ffffff',
  textColor: '#000000',
}

function getCacheKey(algorithmId: number, type: 'og' | 'twitter'): string {
  return `${type}-${algorithmId}`
}

function getFromCache(key: string): Uint8Array | null {
  const cached = imageCache.get(key)
  if (!cached) return null

  if (Date.now() - cached.timestamp > CACHE_TTL) {
    imageCache.delete(key)
    return null
  }

  return cached.buffer
}

function setCache(key: string, buffer: Uint8Array): void {
  imageCache.set(key, { buffer, timestamp: Date.now() })
}

export async function generateOGImage(
  algorithmId: number,
  algorithmContent: string,
  familyKind: FamilyKind,
  algorithmName: string,
  authorName: string,
  type: 'og' | 'twitter' = 'og',
): Promise<Uint8Array> {
  const cacheKey = getCacheKey(algorithmId, type)
  const cached = getFromCache(cacheKey)
  if (cached) return cached

  const config = type === 'og' ? OG_IMAGE_CONFIG : TWITTER_CARD_CONFIG
  const renderCore = getServerRenderCore()

  // Add algorithm to render core
  console.log(
    `[OG Image] Generating for algorithm ${algorithmId}, kind: ${familyKind}, content length: ${algorithmContent?.length ?? 0}`,
  )
  renderCore.updateAlgorithm(algorithmId, algorithmContent, familyKind)

  // Generate seeds for the 3x3 grid
  const initialSeed = getSeed(familyKind)
  const seeds = deriveSeedFamily(initialSeed, {
    size: config.gridSize * config.gridSize,
    minBits: 1,
    maxBits: 1,
  }) as number[][]

  // Create main canvas
  const canvas = createCanvas(config.width, config.height)
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = config.backgroundColor
  ctx.fillRect(0, 0, config.width, config.height)

  // Calculate grid positioning (left side)
  const gridWidth =
    config.gridSize * config.tileSize + (config.gridSize - 1) * config.gap
  const gridHeight = gridWidth
  const gridX = config.padding
  const gridY = (config.height - gridHeight) / 2

  // Render algorithm tiles
  for (let i = 0; i < seeds.length; i++) {
    const row = Math.floor(i / config.gridSize)
    const col = i % config.gridSize
    const x = gridX + col * (config.tileSize + config.gap)
    const y = gridY + row * (config.tileSize + config.gap)

    try {
      const tileBuffer = await renderCore.renderBuffer(
        algorithmId,
        config.tileSize,
        seeds[i],
      )
      // Decode PNG buffer and draw to canvas
      const img = await loadImageFromBuffer(tileBuffer)
      ctx.drawImage(img, x, y, config.tileSize, config.tileSize)
    } catch (error) {
      // Log the error for debugging
      console.error(
        `[OG Image] Failed to render tile ${i} for algorithm ${algorithmId}:`,
        error,
      )
      // Draw placeholder on error
      ctx.fillStyle = '#f0f0f0'
      ctx.fillRect(x, y, config.tileSize, config.tileSize)
      ctx.strokeStyle = '#cccccc'
      ctx.strokeRect(x, y, config.tileSize, config.tileSize)
    }
  }

  // Text area (right side)
  const textX = gridX + gridWidth + config.padding
  const textWidth = config.width - textX - config.padding
  const textCenterX = textX + textWidth / 2

  // Algorithm name
  ctx.fillStyle = config.textColor
  ctx.font = 'bold 48px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // Word wrap algorithm name if needed
  const nameLines = wrapText(ctx, algorithmName, textWidth - 20)
  const nameY = config.height / 2 - 40
  nameLines.forEach((line, i) => {
    ctx.fillText(line, textCenterX, nameY + i * 56)
  })

  // Author name
  ctx.font = '32px sans-serif'
  ctx.fillStyle = '#666666'
  const authorY = nameY + nameLines.length * 56 + 30
  ctx.fillText(`by ${authorName}`, textCenterX, authorY)

  // Family kind badge
  ctx.font = '24px sans-serif'
  ctx.fillStyle = '#999999'
  ctx.fillText(familyKind.toUpperCase(), textCenterX, authorY + 50)

  // Entropretty branding
  ctx.font = 'bold 24px sans-serif'
  ctx.fillStyle = '#cccccc'
  ctx.textAlign = 'right'
  ctx.fillText(
    'entropretty.app',
    config.width - config.padding,
    config.height - config.padding,
  )

  const buffer = canvas.toBuffer('image/png')
  const result = new Uint8Array(buffer)

  setCache(cacheKey, result)

  return result
}

async function loadImageFromBuffer(buffer: Uint8Array): Promise<Canvas> {
  // @napi-rs/canvas can load from buffer directly
  const { loadImage } = await import('@napi-rs/canvas')
  return loadImage(Buffer.from(buffer)) as unknown as Canvas
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

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

// Clear cache (useful for debugging)
export function clearOGImageCache(): void {
  imageCache.clear()
}
