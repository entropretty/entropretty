import type { ComplianceRule } from "./types"
import { colorCountRule } from "./rules/color-count"
import { colorIslandsRule } from "./rules/color-islands"
import { colorContrastRule } from "./rules/color-contrast"
import { nonEmptyImageRule } from "./rules/non-empty-image"
import { imageHashRule } from "./rules/image-hash"
import { imageSimilarityRule } from "./rules/image-similarity"
import { exampleCodeRule } from "./rules/example-code"

export interface RuleRegistryConfig {
  [ruleName: string]: { enabled: boolean; config?: Record<string, unknown> }
}

const ALL_RULES: ComplianceRule[] = [
  colorCountRule,
  colorIslandsRule,
  colorContrastRule,
  nonEmptyImageRule,
  imageHashRule,
  imageSimilarityRule,
  exampleCodeRule,
]

export class RuleRegistry {
  private rules: Map<string, ComplianceRule> = new Map()
  private enabledSet: Set<string> = new Set()

  register(rule: ComplianceRule): void {
    this.rules.set(rule.name, rule)
    this.enabledSet.add(rule.name)
  }

  enable(name: string): void {
    if (this.rules.has(name)) {
      this.enabledSet.add(name)
    }
  }

  disable(name: string): void {
    this.enabledSet.delete(name)
  }

  getEnabled(): ComplianceRule[] {
    return Array.from(this.rules.values()).filter((r) =>
      this.enabledSet.has(r.name),
    )
  }

  getEnabledByType(type: ComplianceRule["type"]): ComplianceRule[] {
    return this.getEnabled().filter((r) => r.type === type)
  }

  getBrowserCompatible(): ComplianceRule[] {
    return this.getEnabled().filter((r) => r.browserCompatible)
  }

  configure(config: RuleRegistryConfig): void {
    for (const [name, settings] of Object.entries(config)) {
      if (settings.enabled) {
        this.enable(name)
      } else {
        this.disable(name)
      }
    }
  }

  list(): Array<{
    name: string
    type: string
    enabled: boolean
    browserCompatible: boolean
  }> {
    return Array.from(this.rules.values()).map((r) => ({
      name: r.name,
      type: r.type,
      enabled: this.enabledSet.has(r.name),
      browserCompatible: r.browserCompatible,
    }))
  }
}

export function createBrowserRegistry(): RuleRegistry {
  const registry = new RuleRegistry()
  for (const rule of ALL_RULES) {
    if (rule.browserCompatible) {
      registry.register(rule)
    }
  }
  return registry
}

export function createServerRegistry(): RuleRegistry {
  const registry = new RuleRegistry()
  for (const rule of ALL_RULES) {
    registry.register(rule)
  }
  return registry
}

export function createDefaultRegistry(
  config?: RuleRegistryConfig,
): RuleRegistry {
  const registry = new RuleRegistry()
  for (const rule of ALL_RULES) {
    registry.register(rule)
  }
  if (config) {
    registry.configure(config)
  }
  return registry
}
