# @entropretty/benchmark-core

Core benchmarking logic for algorithm quality scoring. Platform-agnostic package that can be used in browser (via workers), Node.js, or Bun environments.

## Features

- Run compliance benchmarks on algorithms
- Calculate quality scores (0-100) based on warnings, collisions, and errors
- Reusable across web app and CLI tools

## Usage

```typescript
import { BenchmarkCore, addQualityScore } from "@entropretty/benchmark-core"
import { colorIslandsRule } from "@entropretty/compliance/browser"

const benchmark = new BenchmarkCore(300) // 300ms timeout
benchmark.addRule(colorIslandsRule)

const result = await benchmark.benchmark({
  algorithmId: 123,
  algorithm: "ctx.fillRect(0, 0, 100, 100)",
  kind: "Procedural",
  size: 300,
  amount: 250,
  onProgress: (p) => console.log(`${Math.round(p * 100)}%`),
})

const scored = addQualityScore(result)
console.log(`Quality score: ${scored.qualityScore}`)
```

## Scoring Rules

- **0 points**: Any collisions or execution errors
- **10-100 points**: Based on warning percentage (exponential curve)
  - 0% warnings = 100 points
  - ~5% warnings = ~80 points
  - ~15% warnings = ~30 points
