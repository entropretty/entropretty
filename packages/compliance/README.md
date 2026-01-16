# @entropretty/compliance

Core library for checking image compliance against various rules.

## Installation

```bash
npm install @entropretty/compliance
# or
yarn add @entropretty/compliance
# or
pnpm add @entropretty/compliance
```

## Usage

```typescript
import {
  ComplianceChecker,
  nonEmptyImageRule,
  colorCountRule,
  colorIslandsRule,
  colorContrastRule,
  imageHashRule,
} from "@entropretty/compliance"

// Create a checker with desired rules
const checker = new ComplianceChecker([
  nonEmptyImageRule,
  colorCountRule,
  colorIslandsRule,
  colorContrastRule,
  imageHashRule,
])

// Check an image
const imageBuffer = await readImage("path/to/image.jpg")
const results = await checker.checkImage(imageBuffer)

// Compare two images
const baseImage = await readImage("base.jpg")
const compareImage = await readImage("compare.jpg")
const comparisonResults = await checker.compareImages(baseImage, compareImage)

// Check a single rule
const singleRuleResult = await checker.checkSingleRule(
  "colorCount",
  imageBuffer,
)
```

## Available Rules

- `nonEmptyImageRule`: Checks if the image contains any content
- `colorCountRule`: Checks the number of distinct colors in the image
- `colorIslandsRule`: Detects isolated color regions
- `colorContrastRule`: Checks color contrast ratios
- `imageHashRule`: Compares image similarity using perceptual hashing

## Configuration

You can configure rule behavior through a configuration object:

```typescript
import { updateConfig } from "@entropretty/compliance"

updateConfig({
  rules: {
    colorCount: {
      maxColors: 3,
      tolerance: 50,
    },
    colorIslands: {
      minIslandSize: 50,
      errorThreshold: 20,
    },
    imageHash: {
      warningThreshold: 10,
      errorThreshold: 20,
    },
  },
})
```

## Preprocessors

The library includes image preprocessing utilities:

```typescript
import { mergeColors } from "@entropretty/compliance"

// Merge similar colors
const processedImage = await mergeColors(imageBuffer, { tolerance: 25 })
```
