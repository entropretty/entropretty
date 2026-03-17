import { describe, it, expect } from "vitest"
import {
  RuleRegistry,
  createBrowserRegistry,
  createServerRegistry,
  createDefaultRegistry,
} from "../registry"
import { exampleCodeRule } from "../rules/example-code"
import { colorCountRule } from "../rules/color-count"

describe("RuleRegistry", () => {
  it("registers and enables rules", () => {
    const registry = new RuleRegistry()
    registry.register(exampleCodeRule)
    registry.register(colorCountRule)

    expect(registry.getEnabled()).toHaveLength(2)
    expect(registry.list()).toHaveLength(2)
  })

  it("disables and enables rules by name", () => {
    const registry = new RuleRegistry()
    registry.register(exampleCodeRule)
    registry.register(colorCountRule)

    registry.disable("example-code")
    expect(registry.getEnabled()).toHaveLength(1)
    expect(registry.getEnabled()[0].name).toBe("color-count")

    registry.enable("example-code")
    expect(registry.getEnabled()).toHaveLength(2)
  })

  it("filters by type", () => {
    const registry = new RuleRegistry()
    registry.register(exampleCodeRule)
    registry.register(colorCountRule)

    expect(registry.getEnabledByType("code")).toHaveLength(1)
    expect(registry.getEnabledByType("single")).toHaveLength(1)
    expect(registry.getEnabledByType("comparison")).toHaveLength(0)
  })

  it("filters browser compatible rules", () => {
    const registry = new RuleRegistry()
    registry.register(exampleCodeRule)
    registry.register(colorCountRule)

    const compatible = registry.getBrowserCompatible()
    expect(compatible).toHaveLength(2)
  })

  it("configures via config object", () => {
    const registry = new RuleRegistry()
    registry.register(exampleCodeRule)
    registry.register(colorCountRule)

    registry.configure({
      "example-code": { enabled: false },
      "color-count": { enabled: true },
    })

    expect(registry.getEnabled()).toHaveLength(1)
    expect(registry.getEnabled()[0].name).toBe("color-count")
  })

  it("lists all rules with status", () => {
    const registry = new RuleRegistry()
    registry.register(exampleCodeRule)
    registry.disable("example-code")

    const list = registry.list()
    expect(list).toEqual([
      {
        name: "example-code",
        type: "code",
        enabled: false,
        browserCompatible: true,
      },
    ])
  })
})

describe("preset factories", () => {
  it("createBrowserRegistry returns all browser-compatible rules", () => {
    const registry = createBrowserRegistry()
    const rules = registry.getEnabled()
    expect(rules.length).toBeGreaterThan(0)
    // All should be browser compatible
    for (const rule of rules) {
      expect(rule.browserCompatible).toBe(true)
    }
  })

  it("createServerRegistry returns all rules", () => {
    const registry = createServerRegistry()
    const rules = registry.getEnabled()
    // Should have all 7 rules
    expect(rules).toHaveLength(7)
  })

  it("createDefaultRegistry accepts config", () => {
    const registry = createDefaultRegistry({
      "color-count": { enabled: false },
    })
    const enabled = registry.getEnabled()
    expect(enabled.find((r) => r.name === "color-count")).toBeUndefined()
    expect(enabled.length).toBe(6)
  })
})
