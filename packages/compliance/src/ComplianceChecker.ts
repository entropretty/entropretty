import type {
  ComplianceRule,
  ComplianceReport,
  SingleImageRule,
  ComparisonRule,
  MultiImageRule,
  ComplianceResult,
  ImagePixelData,
} from "./types"

export class ComplianceChecker {
  private _rules: ComplianceRule[] = []

  constructor(rules: ComplianceRule[] = []) {
    this._rules = rules
  }

  get rules(): ReadonlyArray<ComplianceRule> {
    return this._rules
  }

  addRule(rule: ComplianceRule) {
    this._rules.push(rule)
  }

  async checkImage(image: ImagePixelData): Promise<ComplianceReport[]> {
    const reports: ComplianceReport[] = []
    const singleImageRules = this._rules.filter(
      (rule): rule is SingleImageRule => rule.type === "single",
    )

    for (const rule of singleImageRules) {
      const result = await rule.check(image)
      reports.push({
        ruleName: rule.name,
        result,
      })
    }

    return reports
  }

  async compareImages(
    baseImage: ImagePixelData,
    compareImage: ImagePixelData,
  ): Promise<ComplianceReport[]> {
    const reports: ComplianceReport[] = []
    const comparisonRules = this._rules.filter(
      (rule): rule is ComparisonRule => rule.type === "comparison",
    )

    for (const rule of comparisonRules) {
      const result = await rule.compare(baseImage, compareImage)
      reports.push({
        ruleName: rule.name,
        result,
      })
    }

    return reports
  }

  async checkMultipleImages(
    images: ImagePixelData[],
  ): Promise<ComplianceReport[]> {
    const reports: ComplianceReport[] = []
    const multiImageRules = this._rules.filter(
      (rule): rule is MultiImageRule => rule.type === "multi",
    )

    for (const rule of multiImageRules) {
      const result = await rule.checkMultiple(images)
      reports.push({
        ruleName: rule.name,
        result,
      })
    }

    return reports
  }

  async checkSingleRule(
    ruleName: string,
    images:
      | ImagePixelData
      | [ImagePixelData, ImagePixelData]
      | ImagePixelData[],
  ): Promise<ComplianceReport | null> {
    const rule = this._rules.find((r) => r.name === ruleName)
    if (!rule) {
      return null
    }

    let result: ComplianceResult

    switch (rule.type) {
      case "single":
        if (Array.isArray(images)) {
          throw new Error("Single image rule requires one ImagePixelData")
        }
        result = await rule.check(images as ImagePixelData)
        break

      case "comparison":
        if (!Array.isArray(images) || images.length !== 2) {
          throw new Error("Comparison rule requires exactly two ImagePixelData")
        }
        result = await rule.compare(images[0], images[1])
        break

      case "multi":
        if (!Array.isArray(images)) {
          throw new Error(
            "Multi-image rule requires an array of ImagePixelData",
          )
        }
        result = await rule.checkMultiple(images)
        break
    }

    return {
      ruleName: rule.name,
      result,
    }
  }
}
