import { AlgorithmBitmap } from "@/features/create/AlgorithmBitmap"
import { useDisplaySizes } from "@/hooks/useDisplaySizes"
import { AlgorithmView } from "@/lib/helper.types"
import { deriveSeedFamily, getSeed, seedToKey } from "entropretty-utils"
import { AnimatePresence, motion } from "motion/react"
import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router"

interface Props {
  algorithm: AlgorithmView
  className?: string
}

export function AlgorithmDemo({ algorithm, className = "" }: Props) {
  const [seeds, setSeeds] = useState<number[][]>([])
  const [index, setIndex] = useState(0)

  const { demo } = useDisplaySizes()

  const loadMore = useCallback(() => {
    if (seeds.length === 0) return

    const lastSeed = new Uint8Array(seeds[seeds.length - 1])
    const newFamily = deriveSeedFamily(lastSeed, {
      size: 24,
      minBits: 1,
      maxBits: 1,
    })

    // Filter out any duplicates by converting to string for comparison
    const existingKeys = new Set(seeds.map((seed) => seedToKey(seed)))
    const uniqueNewSeeds = newFamily.filter(
      (seed) => !existingKeys.has(seedToKey([...seed])),
    )

    setSeeds((prev) => [...prev, ...uniqueNewSeeds.map((s) => [...s])])
  }, [seeds])

  useEffect(() => {
    const interval = setInterval(() => {
      if (index + 1 === seeds.length) {
        loadMore()
      }
      setIndex((prev) => (prev + 1) % seeds.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [index, loadMore, seeds])

  useEffect(() => {
    const initial = getSeed(algorithm.family_kind!)
    const family = deriveSeedFamily(initial, {
      size: 48,
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
      <div className="flex w-full flex-col items-center justify-center border border-b-0">
        <div className="relative aspect-square h-[70vh] overflow-hidden">
          <AnimatePresence mode="sync">
            <motion.div
              key={seedToKey(seeds[index])}
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: "circInOut" }}
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
      <div className="relative flex w-full items-center justify-between gap-8 gap-y-2 border border-gray-200 p-4 pb-8 text-gray-600 sm:pb-4">
        {/* <FamilyKindBadge
          familyKind={algorithm.family_kind}
          className="absolute left-0 top-[-30px] z-10 text-xl"
        /> */}
        <AlgorithmInfo algorithm={algorithm} />
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
