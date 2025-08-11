export interface Config {
  rules: {
    colorCount: {
      maxColors: number
      tolerance: number
      whiteTolerance: number
      frequencyThreshold: number // Minimum percentage of total image pixels required for a color to be considered significant
    }
    colorIslands: {
      minIslandSize: number
      warningThreshold: number
      errorThreshold: number
      colorTolerance: number
    }
    colorContrast: {
      maxContrastDelta: number // Maximum allowed color difference between adjacent pixels
      minContrastLength: number // Minimum length of high contrast edge to trigger warning
      samplingSteps: number // How many pixels to check in each direction
    }
    imageHash: {
      warningThreshold: number
      errorThreshold: number
    }
  }
  preprocessors: {
    colorMerge: {
      tolerance: number
    }
  }
}

export const defaultConfig: Config = {
  rules: {
    colorCount: {
      maxColors: 3,
      tolerance: 10, // Increased tolerance for color grouping
      whiteTolerance: 10, // Tolerance for determining if a color is white or near-white
      frequencyThreshold: 0.01, // 1% threshold for color significance
    },
    colorIslands: {
      minIslandSize: 50,
      warningThreshold: 50,
      errorThreshold: 100,
      colorTolerance: 50,
    },
    colorContrast: {
      maxContrastDelta: 100, // Color difference threshold (0-255)
      minContrastLength: 3, // Minimum number of consecutive high-contrast pixels
      samplingSteps: 2, // Check pixels 2 steps away to detect harsh gradients
    },
    imageHash: {
      warningThreshold: 10,
      errorThreshold: 20,
    },
  },
  preprocessors: {
    colorMerge: {
      tolerance: 25, // Default tolerance for color merging
    },
  },
}

let currentConfig = { ...defaultConfig }

export function getConfig(): Config {
  return currentConfig
}

export function updateConfig(newConfig: Partial<Config>) {
  currentConfig = {
    ...currentConfig,
    ...newConfig,
    rules: {
      ...currentConfig.rules,
      ...(newConfig.rules || {}),
    },
  }
}
