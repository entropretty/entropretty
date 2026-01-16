# @entropretty/opengraph

OpenGraph and Twitter Card image generation for Entropretty algorithms.

## Features

- Generate OG images (1200x630) for OpenGraph protocol
- Generate Twitter Card images (1200x600) optimized for Twitter
- Server-side rendering using @napi-rs/canvas
- In-memory caching with TTL
- 3x3 grid layout of algorithm renders

## Usage

```typescript
import { generateOGImage } from "@entropretty/opengraph"

const imageBuffer = await generateOGImage(
  algorithmId,
  algorithmContent,
  familyKind,
  "Algorithm Name",
  "Author Name",
  "twitter", // or 'og'
)
```
