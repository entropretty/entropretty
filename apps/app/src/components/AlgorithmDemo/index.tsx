import { AlgorithmBitmap } from "@/features/create/AlgorithmBitmap"
import { useDisplaySizes } from "@/hooks/useDisplaySizes"
import { AlgorithmView } from "@/lib/helper.types"
import { deriveSeedFamily, getSeed, seedToKey } from "@entropretty/utils"
import { AnimatePresence, motion } from "motion/react"
import { useCallback, useEffect, useState } from "react"
import { Link } from "@tanstack/react-router"
import { cn } from "../../lib/utils"

interface Props {
  algorithm: AlgorithmView
  className?: string
  info?: boolean
  startDelay?: number // delay in milliseconds before starting the cycling
}

export function AlgorithmDemo({
  algorithm,
  className = "",
  startDelay = 0,
}: Props) {
  const [seeds, setSeeds] = useState<number[][]>([])
  const [index, setIndex] = useState(0)
  const [shouldStartCycling, setShouldStartCycling] = useState(false)

  const { demo } = useDisplaySizes()

  const loadMore = useCallback(() => {
    if (seeds.length === 0) return

    const newSeed = getSeed(algorithm.family_kind!)
    const newFamily = deriveSeedFamily(newSeed, {
      size: 3,
      minBits: 1,
      maxBits: 1,
    })

    // Filter out any duplicates by converting to string for comparison
    const existingKeys = new Set(seeds.map((seed) => seedToKey(seed)))
    const uniqueNewSeeds = newFamily.filter(
      (seed) => !existingKeys.has(seedToKey([...seed])),
    )

    setSeeds((prev) => [...prev, ...uniqueNewSeeds.map((s) => [...s])])
  }, [algorithm.family_kind, seeds])

  // Handle start delay
  useEffect(() => {
    if (startDelay === 0) {
      setShouldStartCycling(true)
      return
    }

    const timeout = setTimeout(() => {
      setShouldStartCycling(true)
    }, startDelay)

    return () => clearTimeout(timeout)
  }, [startDelay])

  // Handle cycling through seeds
  useEffect(() => {
    if (!shouldStartCycling || seeds.length === 0) return

    const interval = setInterval(() => {
      if (index + 1 === seeds.length) {
        loadMore()
      }
      setIndex((prev) => (prev + 1) % seeds.length)
    }, 1800)
    return () => clearInterval(interval)
  }, [index, loadMore, seeds, shouldStartCycling])

  useEffect(() => {
    const initial = getSeed(algorithm.family_kind!)
    const family = deriveSeedFamily(initial, {
      size: 3,
      minBits: 1,
      maxBits: 1,
    })

    // Convert to array of unique seeds
    const uniqueSeeds = Array.from(
      new Set(family.map((seed) => seedToKey(seed))),
    )
      .map((key) => family.find((seed) => seedToKey(seed) === key)!)
      .map((s) => [...s])

    setSeeds(uniqueSeeds)
  }, [algorithm.family_kind])

  if (seeds[index] === undefined) {
    return null
  }

  return (
    <div
      className={`flex flex-col items-center justify-center bg-white p-10 ${className}`}
    >
      <div className={cn("flex w-full flex-col items-center justify-center")}>
        <div className="relative aspect-square h-[70vh] overflow-hidden">
          <AnimatePresence mode="sync">
            <motion.div
              key={seedToKey(seeds[index])}
              initial={{
                opacity: 0.0,
                // scale: 0.95,
                filter: "blur(2px)",
              }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{
                opacity: 0.0,
                // scale: 1.05,
                filter: "blur(2px)",
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center p-8"
            >
              <AlgorithmBitmap
                algorithmId={algorithm.id!}
                seed={seeds[index]}
                size={demo}
                scale={2}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  objectFit: "contain",
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export const AlgorithmInfo = ({ algorithm }: { algorithm: AlgorithmView }) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2 text-gray-600">
      <div className="text-2xl font-bold">{`${algorithm.name || "Untitled"} `}</div>
      <div className="text-xl">
        {`by `}
        <Link
          className="text-muted-foreground underline"
          to={`/u/${algorithm.username || "Anonymous"}`}
        >
          {algorithm.username || "Anonymous"}
        </Link>
      </div>
      <div>
        <Link
          className="text-muted-foreground underline"
          to={`/a/${algorithm.id}`}
        >{`/a/${algorithm.id}`}</Link>

        {algorithm.remix_of && (
          <>
            {` remix of `}
            <Link
              className="text-muted-foreground underline"
              to={`/a/${algorithm.remix_of}`}
            >{`/a/${algorithm.remix_of}`}</Link>
          </>
        )}
      </div>
    </div>
  )
}
