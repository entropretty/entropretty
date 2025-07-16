import { AlgorithmInfo } from "@/components/AlgorithmInfo"
import { DeleteButton } from "@/components/AlgorithmRow/DeleteButton"
import { FamilyKindBadge } from "@/components/FamilyKindBadge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { AlgorithmBitmap } from "@/features/create/AlgorithmBitmap"
import { AlgorithmView } from "@/lib/helper.types"
import { getSeed, seedToKey } from "entropretty-utils"
import { useMemo } from "react"
import { Link } from "react-router"

interface AlgorithmRowProps {
  algorithm: AlgorithmView
}

export function AlgorithmRow({ algorithm }: AlgorithmRowProps) {
  const { user } = useAuth()
  const seed = useMemo(() => {
    return [...getSeed(algorithm.family_kind!)]
  }, [algorithm.family_kind])

  if (!algorithm.id) return null

  return (
    <div className="relative flex w-full items-center justify-between gap-4 border border-gray-200 bg-white p-2">
      <FamilyKindBadge
        familyKind={algorithm.family_kind}
        className="absolute bottom-0 left-0 z-10"
      />
      <div className="relative flex items-center gap-4">
        <div>
          <AlgorithmBitmap
            key={seedToKey(seed)}
            algorithmId={algorithm.id}
            seed={seed}
            size={68}
            scale={2}
          />
        </div>

        <AlgorithmInfo algorithm={algorithm} />
      </div>

      <div className="flex items-center gap-2">
        {user && (
          <Button asChild variant="link">
            <Link
              to={`/create?remix=${algorithm.id}`}
              className="text-gray-500 hover:text-gray-900"
            >
              {`REMIX`}
            </Link>
          </Button>
        )}
        <DeleteButton algorithm={algorithm} />
        {/* <LikeButton algorithm={algorithm} /> */}
      </div>
    </div>
  )
}
