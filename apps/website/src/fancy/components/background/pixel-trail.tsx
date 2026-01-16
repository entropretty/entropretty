"use client"

import React, {
  useCallback,
  useMemo,
  useRef,
  RefObject,
  useEffect,
} from "react"
import { motion, useAnimationControls } from "motion/react"
import { v4 as uuidv4 } from "uuid"

import { cn } from "@/lib/utils"
import { useDimensions } from "@/hooks/use-dimensions"

// Add interface for elements with animate pixel
interface ElementWithAnimatePixel extends HTMLDivElement {
  __animatePixel?: () => void
}

interface PixelTrailProps {
  pixelSize: number // px
  fadeDuration?: number // ms
  delay?: number // ms
  className?: string
  pixelClassName?: string
}

const PixelTrail: React.FC<PixelTrailProps> = ({
  pixelSize = 20,
  fadeDuration = 500,
  delay = 0,
  className,
  pixelClassName,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const dimensions = useDimensions(containerRef as RefObject<HTMLElement>)
  const trailId = useRef(uuidv4())

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = Math.floor((e.clientX - rect.left) / pixelSize)
      const y = Math.floor((e.clientY - rect.top) / pixelSize)

      const pixelElement = document.getElementById(
        `${trailId.current}-pixel-${x}-${y}`,
      ) as ElementWithAnimatePixel | null

      if (pixelElement && pixelElement.__animatePixel) {
        pixelElement.__animatePixel()
      }
    },
    [pixelSize],
  )

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [handleMouseMove])

  const columns = useMemo(
    () =>
      Math.max(
        Math.ceil((dimensions?.width || window.innerWidth) / pixelSize),
        1,
      ),
    [dimensions?.width, pixelSize],
  )

  const rows = useMemo(
    () =>
      Math.max(
        Math.ceil((dimensions?.height || window.innerHeight) / pixelSize),
        1,
      ),
    [dimensions?.height, pixelSize],
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full overflow-hidden",
        className,
      )}
      style={{ minHeight: "100vh" }}
    >
      <div
        className="grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, ${pixelSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${pixelSize}px)`,
          width: "100%",
          height: "100%",
        }}
      >
        {Array.from({ length: rows * columns }).map((_, index) => {
          const rowIndex = Math.floor(index / columns)
          const colIndex = index % columns
          return (
            <PixelDot
              key={`${colIndex}-${rowIndex}`}
              id={`${trailId.current}-pixel-${colIndex}-${rowIndex}`}
              fadeDuration={fadeDuration}
              delay={delay}
              className={pixelClassName}
            />
          )
        })}
      </div>
    </div>
  )
}

export default PixelTrail

interface PixelDotProps {
  id: string
  fadeDuration: number
  delay: number
  className?: string
}

const PixelDot: React.FC<PixelDotProps> = React.memo(
  ({ id, fadeDuration, delay, className }) => {
    const controls = useAnimationControls()

    const animatePixel = useCallback(() => {
      controls.set({ opacity: 0 })
      controls.start({
        opacity: [1, 0],
        transition: {
          duration: fadeDuration / 1000,
          delay: delay / 1000,
          ease: "easeOut",
        },
      })
    }, [controls, fadeDuration, delay])

    const ref = useCallback(
      (node: HTMLDivElement | null) => {
        if (node) {
          ;(node as ElementWithAnimatePixel).__animatePixel = animatePixel
        }
      },
      [animatePixel],
    )

    return (
      <motion.div
        id={id}
        ref={ref}
        className={cn("pointer-events-none rounded-sm", className)}
        style={{
          width: "100%",
          height: "100%",
        }}
        initial={{ opacity: 0 }}
        animate={controls}
      />
    )
  },
)

PixelDot.displayName = "PixelDot"
