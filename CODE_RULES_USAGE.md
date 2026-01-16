# Code-Based Scoring Rules - Usage Guide

## Overview

The system now supports code-based compliance rules that analyze algorithm source code before rendering. Code violations result in an immediate score of 0.

## Current Rules

### 1. Example Code Rule (`exampleCodeRule`)

**Purpose**: Detects algorithms that contain the default example code pattern.

**Pattern Detected**:

```javascript
const row = Math.floor(i / grid)
const col = i % grid
const x = col * cellSize
const y = row * cellSize

// Draw cell border
ctx.strokeStyle = "#ccc"
ctx.strokeRect(x, y, cellSize, cellSize)

// Draw number
ctx.fillStyle = "#000"
ctx.fillText(n.toString(), x + cellSize / 2, y + cellSize / 2)
```

**Behavior**:

- Normalizes code (removes extra whitespace) for comparison
- Returns `error` status if pattern is found
- Algorithm receives score of 0
- Detailed error message stored in database

## Running the Scorer

```bash
cd apps/scoring-cli
pnpm score
```

The scorer will:

1. Check code rules first (before rendering)
2. If code rule fails: immediate score 0, skip rendering
3. If code rules pass: proceed with image-based rules
4. Store complete versioned results in database

## Database Structure

Results are stored with version information:

```json
{
  "version": 1,
  "amount": 250,
  "algorithmId": 123,
  "size": 300,
  "failedTotal": 250,
  "collisionsTotal": 0,
  "errors": 250,
  "warningDistribution": {},
  "ruleResults": [
    {
      "ruleName": "example-code",
      "ruleType": "code",
      "status": "error",
      "metadata": [
        {
          "message": "Algorithm contains forbidden example code pattern..."
        }
      ]
    }
  ],
  "errorMessage": "Algorithm contains forbidden example code pattern..."
}
```

## Adding New Code Rules

Create a new rule in `packages/compliance/src/browser/`:

```typescript
import type { CodeRule, ComplianceResult } from "../types"

export const myNewCodeRule: CodeRule = {
  name: "my-rule",
  description: "Checks for specific code patterns",
  type: "code",
  check: async (code: string): Promise<ComplianceResult> => {
    // Your logic here
    if (codeViolatesRule(code)) {
      return {
        status: "error",
        metadata: [
          {
            message: "Detailed error message",
          },
        ],
      }
    }

    return {
      status: "pass",
      metadata: [
        {
          message: "Rule passed",
        },
      ],
    }
  },
}
```

Then add it to the scorer:

```typescript
// In apps/scoring-cli/src/scorer.ts
import {
  colorIslandsRule,
  exampleCodeRule,
  myNewCodeRule, // Add your rule
} from "@entropretty/compliance/browser"

// In scoreAlgorithm():
benchmark.addRule(colorIslandsRule)
benchmark.addRule(exampleCodeRule)
benchmark.addRule(myNewCodeRule) // Add your rule
```

## Rule Status Types

- **pass**: Rule passed, no issues
- **warn**: Minor issues, doesn't fail the algorithm
- **error**: Critical failure, algorithm scores 0
- **info**: Informational only

## Querying Results

To check if an algorithm failed due to code rules:

```typescript
// Check if algorithm has code rule failures
const hasCodeRuleFailure = result.ruleResults.some(
  (r) => r.ruleType === "code" && r.status === "error",
)

// Get specific rule failures
const exampleCodeFailure = result.ruleResults.find(
  (r) => r.ruleName === "example-code" && r.status === "error",
)

if (exampleCodeFailure) {
  console.log(exampleCodeFailure.metadata[0].message)
}
```

## Benefits

1. **Fast**: Code checks happen once before rendering
2. **Clear**: Detailed error messages explain why algorithms fail
3. **Extensible**: Easy to add new code-based rules
4. **Versioned**: Database results include version for future compatibility
5. **Type-Safe**: Full TypeScript support with proper types
