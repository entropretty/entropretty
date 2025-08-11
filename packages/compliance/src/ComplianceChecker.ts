import type {
  ComplianceRule,
  ComplianceReport,
  SingleImageRule,
  ComparisonRule,
  MultiImageRule,
  ComplianceResult,
} from "./types";

export class ComplianceChecker {
  private _rules: ComplianceRule[] = [];

  constructor(rules: ComplianceRule[] = []) {
    this._rules = rules;
  }

  // Expose rules for help documentation
  get rules(): ReadonlyArray<ComplianceRule> {
    return this._rules;
  }

  addRule(rule: ComplianceRule) {
    this._rules.push(rule);
  }

  // Check a single image against all single-image rules
  async checkImage(imageBuffer: Buffer): Promise<ComplianceReport[]> {
    const reports: ComplianceReport[] = [];
    const singleImageRules = this._rules.filter(
      (rule): rule is SingleImageRule => rule.type === "single"
    );

    for (const rule of singleImageRules) {
      const result = await rule.check(imageBuffer);
      reports.push({
        ruleName: rule.name,
        result,
      });
    }

    return reports;
  }

  // Compare two images using comparison rules
  async compareImages(
    baseImage: Buffer,
    compareImage: Buffer
  ): Promise<ComplianceReport[]> {
    const reports: ComplianceReport[] = [];
    const comparisonRules = this._rules.filter(
      (rule): rule is ComparisonRule => rule.type === "comparison"
    );

    for (const rule of comparisonRules) {
      const result = await rule.compare(baseImage, compareImage);
      reports.push({
        ruleName: rule.name,
        result,
      });
    }

    return reports;
  }

  // Check multiple images using multi-image rules
  async checkMultipleImages(images: Buffer[]): Promise<ComplianceReport[]> {
    const reports: ComplianceReport[] = [];
    const multiImageRules = this._rules.filter(
      (rule): rule is MultiImageRule => rule.type === "multi"
    );

    for (const rule of multiImageRules) {
      const result = await rule.checkMultiple(images);
      reports.push({
        ruleName: rule.name,
        result,
      });
    }

    return reports;
  }

  // Check a single rule by name (supports all rule types)
  async checkSingleRule(
    ruleName: string,
    images: Buffer | [Buffer, Buffer] | Buffer[]
  ): Promise<ComplianceReport | null> {
    const rule = this._rules.find((r) => r.name === ruleName);
    if (!rule) {
      return null;
    }

    let result: ComplianceResult;

    switch (rule.type) {
      case "single":
        if (!Buffer.isBuffer(images)) {
          throw new Error("Single image rule requires one image buffer");
        }
        result = await rule.check(images);
        break;

      case "comparison":
        if (!Array.isArray(images) || images.length !== 2) {
          throw new Error("Comparison rule requires exactly two image buffers");
        }
        result = await rule.compare(images[0], images[1]);
        break;

      case "multi":
        if (!Array.isArray(images)) {
          throw new Error(
            "Multi-image rule requires an array of image buffers"
          );
        }
        result = await rule.checkMultiple(images);
        break;
    }

    return {
      ruleName: rule.name,
      result,
    };
  }
}
