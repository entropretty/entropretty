import { FamilyKindBadge } from "@/components/FamilyKindBadge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { AlgorithmBitmap } from "@/features/create/AlgorithmBitmap"
import { useDisplaySizes } from "@/hooks/useDisplaySizes"
import { AlgorithmView } from "@/lib/helper.types"
import { getSeedFamily, seedToKey } from "@entropretty/utils"
import { Dispatch, SetStateAction, useCallback, useState } from "react"
import { Link } from "react-router"
import { SaveButton } from "./SaveButton"

export const AlgorithmInfo = ({ algorithm }: { algorithm: AlgorithmView }) => {
  return (
    <div className="flex flex-col text-xs text-gray-600">
      <div>
        <span>
          {`${algorithm.name || "Untitled"} `}
          <Link
            className="text-muted-foreground underline"
            to={`/a/${algorithm.id}`}
          >{`/a/${algorithm.id}`}</Link>
        </span>

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
      <div>
        {`by `}
        <Link
          className="text-muted-foreground underline"
          to={`/u/${algorithm.username || "Anonymous"}`}
        >
          {algorithm.username || "Anonymous"}
        </Link>
      </div>
    </div>
  )
}

interface AlgorithmCardProps {
  algorithm: AlgorithmView
}

export function AlgorithmCard({ algorithm }: AlgorithmCardProps) {
  const { grid } = useDisplaySizes()

  const [seedFamily, setSeedFamily] = useState<number[][]>([
    ...getSeedFamily(algorithm.family_kind!).slice(0, 3),
    ...getSeedFamily(algorithm.family_kind!).slice(0, 3),
    ...getSeedFamily(algorithm.family_kind!).slice(0, 3),
  ])

  if (!algorithm.id) return null

  return (
    <div className="border-background-200 hover:border-foreground/30 group relative flex w-full flex-col border">
      <Link to={`/a/${algorithm.id}`}>
        <div className="z-100 relative flex flex-col items-center justify-center gap-4 p-4 transition-colors md:flex-row">
          <div className={`flex h-full w-full items-center justify-center`}>
            <div className="grid grid-cols-3 items-center justify-center gap-4">
              {seedFamily.slice(0, 9).map((seed) => (
                <AlgorithmBitmap
                  key={seedToKey(seed)}
                  algorithmId={algorithm.id!}
                  seed={seed}
                  size={grid}
                  scale={2}
                />
              ))}
            </div>
          </div>
        </div>
      </Link>

      <div className="bg-background absolute bottom-0 w-full border-t border-black/30 px-4 py-2 opacity-0 transition-opacity group-hover:opacity-100 group-hover:[box-shadow:4px_4px_0_0_rgba(0,0,0,0.5)] hover:dark:[box-shadow:4px_4px_0_0_rgba(255,255,255,0.5)]">
        <FamilyKindBadge
          familyKind={algorithm.family_kind}
          className="absolute left-0 top-[-22px]"
        />
        <div className="relative flex flex-col items-start justify-between gap-y-2">
          <AlgorithmInfo algorithm={algorithm} />

          <AlgorithmActions
            algorithm={algorithm}
            setSeedFamily={setSeedFamily}
          />
        </div>
      </div>
    </div>
  )
}

const AlgorithmActions = ({
  algorithm,
  setSeedFamily,
}: {
  algorithm: AlgorithmView
  setSeedFamily: Dispatch<SetStateAction<number[][]>>
}) => {
  const { user } = useAuth()
  const reroll = useCallback(() => {
    setSeedFamily([
      ...getSeedFamily(algorithm.family_kind!).slice(0, 3),
      ...getSeedFamily(algorithm.family_kind!).slice(0, 3),
      ...getSeedFamily(algorithm.family_kind!).slice(0, 3),
    ])
  }, [algorithm.family_kind, setSeedFamily])

  return (
    <div className="flex w-full flex-row items-center justify-center gap-2">
      <Button
        variant="ghost"
        size={"sm"}
        onClick={reroll}
        className="select-none"
      >
        REROLL
      </Button>

      {user && (
        <Button asChild variant="link" size={"sm"} className="select-none">
          <Link to={`/create?remix=${algorithm.id}`}>{`REMIX`}</Link>
        </Button>
      )}

      <div className="hidden select-none md:block">
        <SaveButton algorithm={algorithm} />
      </div>
    </div>
  )
}
