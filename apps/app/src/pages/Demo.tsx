import { Skeleton } from "@/components/ui/skeleton"
import { useParams } from "@tanstack/react-router"
import { AlgorithmDemo } from "../components/AlgorithmDemo"
import { useAlgorithm } from "../hooks/useAlgorithm"
import { LayoutGroup, motion } from "motion/react"
import { useEffect, useState } from "react"

export default function DemoPage() {
  const { algorithmId } = useParams({ from: "/demo/$algorithmId" })
  const [visibleDemos, setVisibleDemos] = useState<number[]>([])

  const { data: algorithm, isLoading } = useAlgorithm(Number(algorithmId))

  // Calculate scale based on number of visible items
  const getScale = () => {
    const visibleCount = visibleDemos.length
    if (visibleCount === 1) return 1.7 // Larger when only 1 item
    if (visibleCount === 2) return 1.02 // Fit 2 items on screen properly
    return 1.0 // Slightly smaller when all 3 items to ensure good fit
  }

  useEffect(() => {
    // Reset visible demos when algorithm changes
    setVisibleDemos([])

    if (algorithm) {
      // Animation sequence: center first, then left/right (no second row)
      const animationSequence = [
        { indices: [1], delay: 0 }, // Center of row
        { indices: [0], delay: 4000 }, // Left of row
        { indices: [2], delay: 8000 }, // Right of row
      ]

      animationSequence.forEach(({ indices, delay }) => {
        setTimeout(() => {
          setVisibleDemos((prev) => [...prev, ...indices])
        }, delay)
      })
    }
  }, [algorithm])

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-black">
        <Skeleton className={`aspect-square h-[70vh] w-[70vh]`} />
      </div>
    )
  }

  if (!algorithm) {
    return <div>Algorithm not found</div>
  }

  return (
    <div className="flex h-screen w-screen cursor-none flex-col items-center justify-center bg-black">
      <div className="flex flex-col items-center justify-center gap-4 bg-black p-4">
        <LayoutGroup>
          {/* Single row with dynamic scaling */}
          <motion.div
            className="flex items-center justify-center gap-4"
            animate={{
              scale: getScale(),
            }}
            transition={{
              duration: 1.0,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                layout
                initial={{ scale: 0 }}
                animate={{
                  scale: visibleDemos.includes(index) ? 1 : 0,
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  layout: {
                    duration: 0.5,
                    ease: [0.25, 0.1, 0.25, 1],
                  },
                }}
                className="flex items-center justify-center"
                style={
                  {
                    "--demo-size":
                      "min(calc((100vw - 8rem) / 3), calc((100vh - 8rem)))",
                  } as React.CSSProperties
                }
              >
                <AlgorithmDemo
                  algorithm={algorithm}
                  className="demo-flex-responsive !p-1"
                  startDelay={index * 200}
                />
              </motion.div>
            ))}
          </motion.div>
        </LayoutGroup>

        <style>{`
        .demo-flex-responsive .relative.aspect-square {
          height: var(--demo-size) !important;
          width: var(--demo-size) !important;
        }
        .demo-flex-responsive {
          width: var(--demo-size) !important;
          height: var(--demo-size) !important;
        }
      `}</style>
      </div>
    </div>
  )
}
