import { getSeedFamily, seedToKey } from '@entropretty/utils'
import { useCallback, useState } from 'react'
import { Link } from '@tanstack/react-router'
import type { Dispatch, SetStateAction } from 'react'
import type { AlgorithmView } from '@/lib/helper.types'
import { LikeButton } from '@/components/AlgorithmCard/LikeButton'
import { AlgorithmInfo } from '@/components/AlgorithmInfo'
import { FamilyKindBadge } from '@/components/FamilyKindBadge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { AlgorithmBitmap } from '@/components/AlgorithmBitmap'
import { useDisplaySizes } from '@/hooks/useDisplaySizes'

interface AlgorithmCardProps {
  algorithm: AlgorithmView
}

export function AlgorithmCard({ algorithm }: AlgorithmCardProps) {
  const { single, grid } = useDisplaySizes()

  const [seedFamily, setSeedFamily] = useState<Array<Array<number>>>([
    ...getSeedFamily(algorithm.family_kind, 4),
    ...getSeedFamily(algorithm.family_kind, 3),
    ...getSeedFamily(algorithm.family_kind, 3),
  ])

  if (!algorithm.id) return null

  return (
    <div className="border-border flex w-full flex-col border sm:w-card-algorithm">
      <Link to={`/a/${algorithm.id}`}>
        <div className="relative flex flex-col items-center justify-center gap-4 p-4 sm:flex-row">
          <div className={`flex aspect-square items-center justify-center`}>
            <AlgorithmBitmap
              key={seedToKey(seedFamily[0])}
              algorithmId={algorithm.id}
              seed={seedFamily[0]}
              size={single}
              scale={2}
            />
          </div>

          <div className={`flex h-full w-full items-center justify-center`}>
            <div className="grid grid-cols-3 items-center justify-center gap-4">
              {seedFamily.slice(1, 10).map((seed) => (
                <AlgorithmBitmap
                  key={seedToKey(seed)}
                  algorithmId={algorithm.id}
                  seed={seed}
                  size={grid}
                  scale={2}
                />
              ))}
            </div>
          </div>

          <div className="absolute bottom-2 right-2 flex flex-row"></div>
        </div>
      </Link>

      {/* Bottom Part */}
      <div className="border-border relative flex flex-row items-center justify-between gap-y-2 border-t p-4">
        <FamilyKindBadge
          familyKind={algorithm.family_kind}
          className="absolute left-0 top-0 translate-y-[calc(-100%-1px)]"
        />

        <AlgorithmInfo algorithm={algorithm} />

        <AlgorithmActions algorithm={algorithm} setSeedFamily={setSeedFamily} />
      </div>
    </div>
  )
}

const AlgorithmActions = ({
  algorithm,
  setSeedFamily,
}: {
  algorithm: AlgorithmView
  setSeedFamily: Dispatch<SetStateAction<Array<Array<number>>>>
}) => {
  const { user } = useAuth()
  const reroll = useCallback(() => {
    setSeedFamily([...getSeedFamily(algorithm.family_kind).map((s) => [...s])])
  }, [algorithm.family_kind, setSeedFamily])

  return (
    <div className="flex w-auto flex-row items-center justify-end gap-2 md:w-auto">
      <Button variant="ghost" onClick={reroll}>
        REROLL
      </Button>

      {user && (
        <Button asChild variant="link">
          <Link to={`/create?remix=${algorithm.id}`}>{`REMIX`}</Link>
        </Button>
      )}

      <div className="hidden md:block">
        <LikeButton algorithm={algorithm} />
      </div>
    </div>
  )
}
