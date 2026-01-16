import { useEffect, useState } from "react"

// Define the possible screen sizes as a const array for better type inference
const SCREEN_SIZES = ["xs", "sm", "md", "lg", "xl", "2xl"] as const

// Create a union type from the array
export type ScreenSize = (typeof SCREEN_SIZES)[number]

// Type-safe size order mapping
const sizeOrder: Record<ScreenSize, number> = SCREEN_SIZES.reduce(
  (acc, size, index) => ({
    ...acc,
    [size]: index,
  }),
  {} as Record<ScreenSize, number>,
)

export class ComparableScreenSize {
  constructor(private value: ScreenSize) {}

  toString(): ScreenSize {
    return this.value
  }

  valueOf(): number {
    return sizeOrder[this.value]
  }

  equals(other: ScreenSize | ComparableScreenSize): boolean {
    const otherValue =
      other instanceof ComparableScreenSize ? other.toString() : other
    return this.value === otherValue
  }

  lessThan(other: ScreenSize | ComparableScreenSize): boolean {
    const otherValue =
      other instanceof ComparableScreenSize ? other.toString() : other
    return this.valueOf() < sizeOrder[otherValue]
  }

  greaterThan(other: ScreenSize | ComparableScreenSize): boolean {
    const otherValue =
      other instanceof ComparableScreenSize ? other.toString() : other
    return this.valueOf() > sizeOrder[otherValue]
  }

  lessThanOrEqual(other: ScreenSize | ComparableScreenSize): boolean {
    const otherValue =
      other instanceof ComparableScreenSize ? other.toString() : other
    return this.valueOf() <= sizeOrder[otherValue]
  }

  greaterThanOrEqual(other: ScreenSize | ComparableScreenSize): boolean {
    const otherValue =
      other instanceof ComparableScreenSize ? other.toString() : other
    return this.valueOf() >= sizeOrder[otherValue]
  }
}

const getScreenSize = (width: number): ScreenSize => {
  if (width >= 1536) return "2xl"
  if (width >= 1280) return "xl"
  if (width >= 1024) return "lg"
  if (width >= 768) return "md"
  if (width >= 640) return "sm"
  return "xs"
}

const useScreenSize = (): ComparableScreenSize => {
  const [screenSize, setScreenSize] = useState<ScreenSize>("xs")

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleResize = () => {
      const width = window.innerWidth
      setScreenSize(getScreenSize(width))
    }

    // Initial size
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return new ComparableScreenSize(screenSize)
}

export default useScreenSize
