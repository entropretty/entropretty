// Types for validation results
export interface ValidationResult {
  passed: boolean
  message: string
  line?: number
  column?: number
  code?: string
}

export interface CodeValidationResult {
  isValid: boolean
  results: ValidationResult[]
}

// Regex patterns for detecting potentially malicious code
const DANGEROUS_PATTERNS = {
  networkAccess: /\b(fetch|XMLHttpRequest|WebSocket|navigator\.sendBeacon)\b/,
  eval: /\b(eval|Function|setTimeout|setInterval)\(/,
  storage: /\b(localStorage|sessionStorage|indexedDB|openDatabase)\b/,
  document: /\b(document|window)\b/,
  alerts: /\b(alert|confirm|prompt)\b/,
  workers: /\b(Worker|ServiceWorker|SharedWorker)\b/,
  timers: /\b(requestAnimationFrame|setImmediate)\b/,
  location: /\b(location|history)\b/,
  cookies: /\b(document\.cookie)\b/,
} as const

// Individual validation checks
const checks = {
  checkDangerousAPIs: (code: string): ValidationResult[] => {
    const results: ValidationResult[] = []

    Object.entries(DANGEROUS_PATTERNS).forEach(([name, pattern]) => {
      const match = code.match(pattern)
      if (match) {
        results.push({
          passed: false,
          message: `Detected potentially dangerous API usage: ${name}`,
          line: getLineNumber(code, match.index!),
          code: match[0],
        })
      }
    })

    return results
  },

  checkInfiniteLoops: (code: string): ValidationResult[] => {
    const results: ValidationResult[] = []

    // Check for while(true) or for(;;)
    const infiniteLoopPatterns = [
      /while\s*\(\s*true\s*\)/,
      /for\s*\(\s*;\s*;\s*\)/,
    ]

    infiniteLoopPatterns.forEach((pattern) => {
      const match = code.match(pattern)
      if (match) {
        results.push({
          passed: false,
          message: "Detected potential infinite loop",
          line: getLineNumber(code, match.index!),
          code: match[0],
        })
      }
    })

    return results
  },

  // checkResourceIntensive: (code: string): ValidationResult[] => {
  //   const results: ValidationResult[] = []

  //   // Check for nested loops that might be resource intensive
  //   const nestedLoopsMatch = code.match(
  //     /for\s*\([^)]*\)[^{]*{[^}]*for\s*\([^)]*\)/,
  //   )
  //   if (nestedLoopsMatch) {
  //     results.push({
  //       passed: false,
  //       message: "Detected potentially resource-intensive nested loops",
  //       line: getLineNumber(code, nestedLoopsMatch.index!),
  //       code: nestedLoopsMatch[0],
  //     })
  //   }

  //   return results
  // },
}

// Helper function to get line number from code string and character index
function getLineNumber(code: string, index: number): number {
  const lines = code.slice(0, index).split("\n")
  return lines.length
}

// Main validation function
export function validateCode(code: string): CodeValidationResult {
  const results: ValidationResult[] = []

  // Run all checks
  Object.values(checks).forEach((check) => {
    results.push(...check(code))
  })

  return {
    isValid: results.length === 0,
    results,
  }
}

// Export individual checks for testing or specific use cases
export const validationChecks = checks
