import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { AlgorithmBitmap } from '@/components/AlgorithmBitmap'
import { useDisplaySizes } from '@/hooks/useDisplaySizes'
import { AlgorithmView } from '@/lib/helper.types'
import {
  deriveSeedFamily,
  FamilyKind,
  getSeed,
  seedToKey,
} from '@entropretty/utils'
import { useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Link } from '@tanstack/react-router'
import { LikeButton } from '@/components/AlgorithmCard/LikeButton'
import { AlgorithmInfo } from '@/components/AlgorithmInfo'
import { AutoScrollButton } from '@/components/AutoScrollButton'
import { FamilyKindBadge } from '@/components/FamilyKindBadge'

interface AlgorithmInfiniteGridProps {
  algorithm: AlgorithmView
  className?: string
}

const getSeedFamily = (kind: FamilyKind, amount: number) => {
  const initial = getSeed(kind)
  const family = deriveSeedFamily(initial, {
    size: amount,
    minBits: 1,
    maxBits: 1,
  })
  return family as number[][]
}

export function AlgorithmInfiniteGrid({
  algorithm,
  className = '',
}: AlgorithmInfiniteGridProps) {
  const [seeds, setSeeds] = useState<number[][]>([])
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '400px', // Start loading more content before reaching the bottom
  })

  const { infinite } = useDisplaySizes()

  useEffect(() => {
    const families = Array.from({ length: 8 }, () =>
      getSeedFamily(algorithm.family_kind!, 8),
    )
    const combinedFamily = families.reduce((acc, curr) => acc.concat(curr), [])
    setSeeds(combinedFamily)
  }, [algorithm.family_kind])

  const loadMore = useCallback(() => {
    if (seeds.length === 0) return

    const families = Array.from({ length: 3 }, () =>
      getSeedFamily(algorithm.family_kind!, 8),
    )
    const combinedFamily = families.reduce((acc, curr) => acc.concat(curr), [])

    setSeeds((prev) => [...prev, ...combinedFamily.map((s) => [...s])])
  }, [algorithm.family_kind, seeds.length])

  useEffect(() => {
    if (inView) {
      loadMore()
    }
  }, [inView, loadMore])

  return (
    <div className="relative flex flex-col">
      <div className={`flex w-full flex-col ${className} relative`}>
        <div className="h-full w-full p-4">
          <div className="mx-auto flex w-full flex-wrap items-center justify-evenly gap-4 sm:gap-16">
            {seeds.map((seed) => (
              <AlgorithmBitmap
                key={seedToKey(seed)}
                algorithmId={algorithm.id!}
                seed={seed}
                size={infinite}
                scale={2}
              />
            ))}
            {/* Loading trigger */}
            <div ref={ref} className="h-4 w-full" />
          </div>
        </div>
        <div className="bg-background border-border fixed bottom-0 left-0 right-0 flex w-full items-center justify-between gap-8 gap-y-2 border p-4 pb-8 text-gray-600 sm:pb-4">
          <FamilyKindBadge
            familyKind={algorithm.family_kind}
            className="absolute left-[-1px] top-0 translate-y-[calc(-100%-1px)]"
          />
          <AlgorithmInfo algorithm={algorithm} />
          <AlgorithmActions algorithm={algorithm} />
        </div>
      </div>
    </div>
  )
}

const AlgorithmActions = ({ algorithm }: { algorithm: AlgorithmView }) => {
  const { user } = useAuth()

  return (
    <div className="flex w-auto flex-row items-center justify-end gap-2 md:w-auto">
      <AutoScrollButton className="hidden md:block" scrollAmount={2000} />
      <Button className="hidden md:block" asChild variant="link">
        <Link to={`/demo/${algorithm.id}`}>{`DEMO`}</Link>
      </Button>
      {user && (
        <Button asChild variant="link">
          <Link to={`/create`} search={{ remix: algorithm.id }}>{`REMIX`}</Link>
        </Button>
      )}

      {user && <LikeButton algorithm={algorithm} />}
    </div>
  )
}
