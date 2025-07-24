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
  gridMode?: 1 | 3 | 6 // 1 = single, 3 = row, 6 = 3x2 grid
}

interface GridItem {
  seeds: number[][]
  index: number
}

// Grid configuration helper
const getGridConfig = (mode: 1 | 3 | 6) => {
  switch (mode) {
    case 1:
      return {
        gridClasses: "grid h-full w-full grid-cols-1 grid-rows-1 gap-4 p-4",
        sizeMultiplier: 1,
        itemCount: 1,
      }
    case 3:
      return {
        gridClasses: "grid h-full w-full grid-cols-3 grid-rows-1 gap-4 p-4",
        sizeMultiplier: 0.5,
        itemCount: 3,
      }
    case 6:
      return {
        gridClasses: "grid h-full w-full grid-cols-3 grid-rows-2 gap-4 p-4",
        sizeMultiplier: 0.5,
        itemCount: 6,
      }
    default:
      return {
        gridClasses: "grid h-full w-full grid-cols-3 grid-rows-1 gap-4 p-4",
        sizeMultiplier: 0.5,
        itemCount: 3,
      }
  }
}

export function AlgorithmDemo({
  algorithm,
  className = "",
  gridMode = 3,
}: Props) {
  const [gridItems, setGridItems] = useState<GridItem[]>([])
  const { demo } = useDisplaySizes()

  const gridConfig = getGridConfig(gridMode)

  // Initialize grid items with different seed families
  useEffect(() => {
    const initializeGridItems = () => {
      const items: GridItem[] = []

      for (let i = 0; i < gridConfig.itemCount; i++) {
        // Generate different initial seeds for each grid position
        const baseSeed = getSeed(algorithm.family_kind!)
        // Modify the seed slightly for each position to get different families
        const modifiedSeed = new Uint8Array(baseSeed)
        modifiedSeed[0] = (modifiedSeed[0] + i * 17) % 256 // Add some variation

        const family = deriveSeedFamily(modifiedSeed, {
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

        items.push({
          seeds: uniqueSeeds,
          index: Math.floor(Math.random() * uniqueSeeds.length), // Start at random position
        })
      }

      setGridItems(items)
    }

    initializeGridItems()
  }, [algorithm.family_kind, gridConfig.itemCount])

  // Load more seeds for a specific grid item
  const loadMoreForItem = useCallback((itemIndex: number) => {
    setGridItems((prev) => {
      const newItems = [...prev]
      const item = newItems[itemIndex]

      if (item.seeds.length === 0) return prev

      const lastSeed = new Uint8Array(item.seeds[item.seeds.length - 1])
      const newFamily = deriveSeedFamily(lastSeed, {
        size: 24,
        minBits: 1,
        maxBits: 1,
      })

      // Filter out any duplicates by converting to string for comparison
      const existingKeys = new Set(item.seeds.map((seed) => seedToKey(seed)))
      const uniqueNewSeeds = newFamily.filter(
        (seed) => !existingKeys.has(seedToKey([...seed])),
      )

      newItems[itemIndex] = {
        ...item,
        seeds: [...item.seeds, ...uniqueNewSeeds.map((s) => [...s])],
      }

      return newItems
    })
  }, [])

  // Cycle through seeds for each grid item
  useEffect(() => {
    if (gridItems.length === 0) return

    const interval = setInterval(() => {
      setGridItems((prev) => {
        return prev.map((item, itemIndex) => {
          const nextIndex = (item.index + 1) % item.seeds.length

          // Load more seeds if we're near the end
          if (nextIndex === item.seeds.length - 1) {
            setTimeout(() => loadMoreForItem(itemIndex), 100)
          }

          return {
            ...item,
            index: nextIndex,
          }
        })
      })
    }, 1750)

    return () => clearInterval(interval)
  }, [gridItems.length, loadMoreForItem])

  if (gridItems.length === 0) {
    return null
  }

  return (
    <div
      className={`flex aspect-video h-full flex-col items-center justify-center bg-white p-10 ${className}`}
    >
      <div className="flex w-full flex-col items-center justify-center border border-b-0">
        <div className="relative h-[70vh] w-full overflow-hidden">
          {/* Dynamic Grid */}
          <div className={gridConfig.gridClasses}>
            {gridItems.map((item, gridIndex) => (
              <div
                key={gridIndex}
                className="relative flex aspect-square h-full w-full items-center justify-center overflow-hidden"
              >
                {item.seeds[item.index] && (
                  <AnimatePresence mode="sync">
                    <motion.div
                      key={`${gridIndex}-${seedToKey(item.seeds[item.index])}`}
                      initial={{ opacity: 0, scale: 0.9, filter: "blur(1px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.9, filter: "blur(1px)" }}
                      transition={{ duration: 1, ease: "circInOut" }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <AlgorithmBitmap
                        algorithmId={algorithm.id!}
                        seed={item.seeds[item.index]}
                        size={demo * gridConfig.sizeMultiplier}
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
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-background-200 relative flex w-full items-center justify-between gap-8 gap-y-2 border p-4 pb-8 text-gray-600 sm:pb-4">
        <AlgorithmInfo algorithm={algorithm} />
      </div>
    </div>
  )
}

export const AlgorithmInfo = ({ algorithm }: { algorithm: AlgorithmView }) => {
  return (
    <div className="flex w-full flex-row items-center justify-center gap-2 text-gray-600">
      <div className="text-2xl font-bold">{`${algorithm.name || "Untitled"} `}</div>
      <div className="text-2xl">
        {`by `}
        <Link
          className="text-muted-foreground underline"
          to={`/u/${algorithm.username || "Anonymous"}`}
        >
          {algorithm.username || "Anonymous"}
        </Link>
      </div>
      {/* <div>
        <Link
          className="text-muted-foreground text-2xl underline"
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
      </div> */}
    </div>
  )
}
