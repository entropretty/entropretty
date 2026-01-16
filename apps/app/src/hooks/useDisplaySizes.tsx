import { useMemo } from 'react'

// Default sizes for SSR (fallback values)
const SSR_DEFAULTS = {
  single: 400,
  grid: 200,
  infinite: 150,
  demo: 300,
  hero: 80,
}

export const useDisplaySizes = () => {
  return useMemo(() => {
    // Return defaults during SSR when document is not available
    if (typeof document === 'undefined') {
      return SSR_DEFAULTS
    }

    const root = document.documentElement
    return {
      single:
        parseFloat(
          getComputedStyle(root).getPropertyValue('--single-algorithm'),
        ) || SSR_DEFAULTS.single,
      grid:
        parseFloat(
          getComputedStyle(root).getPropertyValue('--grid-algorithm'),
        ) || SSR_DEFAULTS.grid,
      infinite:
        parseFloat(
          getComputedStyle(root).getPropertyValue('--infinite-algorithm'),
        ) || SSR_DEFAULTS.infinite,
      demo:
        parseFloat(
          getComputedStyle(root).getPropertyValue('--demo-algorithm'),
        ) || SSR_DEFAULTS.demo,
      hero:
        parseFloat(
          getComputedStyle(root).getPropertyValue('--hero-algorithm'),
        ) || SSR_DEFAULTS.hero,
    }
  }, [])
}
