import { useMemo } from "react"

export const useDisplaySizes = () => {
  return useMemo(() => {
    const root = document.documentElement
    return {
      single: parseFloat(
        getComputedStyle(root).getPropertyValue("--single-algorithm"),
      ),
      grid: parseFloat(
        getComputedStyle(root).getPropertyValue("--grid-algorithm"),
      ),
      infinite: parseFloat(
        getComputedStyle(root).getPropertyValue("--infinite-algorithm"),
      ),
      demo: parseFloat(
        getComputedStyle(root).getPropertyValue("--demo-algorithm"),
      ),
    }
  }, [])
}
