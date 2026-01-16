import { deriveSeedFamily, getSeed, seedToKey } from '@entropretty/utils'
import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import type { FamilyKind } from '@entropretty/utils'
import type { AlgorithmView } from '@/lib/helper.types'
import { AlgorithmBitmap } from '@/components/AlgorithmBitmap'
import { FamilyKindBadge } from '@/components/FamilyKindBadge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { useDisplaySizes } from '@/hooks/useDisplaySizes'
import { LikeButton } from '@/components/AlgorithmCard/LikeButton'

interface AlgorithmHeroProps {
  algorithm: AlgorithmView
  onScrollDown?: () => void
}

const getHeroSeeds = (kind: FamilyKind): Array<Array<number>> => {
  const seeds: Array<Array<number>> = []
  for (let i = 0; i < 8; i++) {
    const initial = getSeed(kind)
    const family = deriveSeedFamily(initial, {
      size: 1,
      minBits: 1,
      maxBits: 1,
    })
    seeds.push(family[0])
  }
  return seeds
}

export function AlgorithmHero({ algorithm, onScrollDown }: AlgorithmHeroProps) {
  const { user } = useAuth()
  const { hero } = useDisplaySizes()

  const heroSeeds = useMemo(() => {
    if (!algorithm.family_kind) return []
    return getHeroSeeds(algorithm.family_kind)
  }, [algorithm.family_kind])

  return (
    <div className="bg-background border-border flex flex-col border-b lg:h-[calc(100dvh-var(--nav-height))] lg:flex-row">
      {/* Left side - Algorithm Info */}
      <div className="border-border relative flex h-[calc(100dvh-var(--nav-height))] w-full flex-col justify-center px-8 py-12 lg:h-full lg:w-[35%] lg:border-r lg:px-12 lg:py-0 xl:px-16">
        <div className="mx-auto flex max-w-md flex-col gap-4 lg:mx-0 lg:gap-5">
          {/* Algorithm ID badge */}
          <div className="text-muted-foreground font-mono text-sm tracking-wider">
            /a/{algorithm.id}
          </div>

          {/* Family Kind */}
          <FamilyKindBadge
            familyKind={algorithm.family_kind}
            className="w-fit"
          />

          {/* Algorithm Name */}
          <h1 className="text-foreground text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">
            {algorithm.name || 'Untitled'}
          </h1>

          {/* Author */}
          <div className="text-foreground text-base lg:text-lg">
            <Link
              to="/u/$username"
              params={{ username: algorithm.username || 'Anonymous' }}
              className="underline-offset-4 hover:underline"
            >
              {algorithm.username || 'Anonymous'}
            </Link>
          </div>

          {/* Remix info */}
          {algorithm.remix_of && (
            <div className="text-muted-foreground text-sm">
              remix of{' '}
              <Link
                to="/a/$algorithmId"
                params={{ algorithmId: algorithm.remix_of.toString() }}
                className="text-foreground underline-offset-4 hover:underline"
              >
                /a/{algorithm.remix_of}
              </Link>
            </div>
          )}

          {/* Stats */}
          <div className="text-muted-foreground flex flex-col gap-1 text-sm">
            {algorithm.family_kind === 'Procedural' && (
              <span>4,294,967,295 unique outputs</span>
            )}
            {algorithm.created_at && (
              <span>
                Created{' '}
                {new Date(algorithm.created_at).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="mt-2 flex flex-wrap items-center gap-8 lg:mt-4">
            <Button asChild variant="link" className="px-0">
              <Link
                to="/demo/$algorithmId"
                params={{ algorithmId: algorithm.id.toString() }}
              >
                DEMO
              </Link>
            </Button>
            {user && (
              <Button asChild variant="link" className="px-0">
                <Link to={`/create`} search={{ remix: algorithm.id }}>
                  REMIX
                </Link>
              </Button>
            )}
            {user && <LikeButton algorithm={algorithm} />}
          </div>
        </div>
        {/* Scroll indicator - only on mobile in info section */}
        <button
          onClick={onScrollDown}
          className="hover:cursor-pointer text-muted-foreground hover:text-foreground absolute bottom-4 left-1/2 -translate-x-1/2 p-4 transition-colors lg:hidden"
          aria-label="Scroll down to see more"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-bounce"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </button>
      </div>

      {/* Right side - Preview Grid */}
      <div className="relative flex w-full items-center justify-center p-6 lg:h-full lg:w-[65%] lg:p-8 xl:p-12">
        <div className="flex flex-wrap content-center items-center justify-center gap-4 lg:gap-6">
          {heroSeeds.map((seed) => (
            <div
              key={seedToKey(seed)}
              className="bg-white"
              style={{
                width: hero,
                height: hero,
              }}
            >
              <AlgorithmBitmap
                algorithmId={algorithm.id}
                seed={seed}
                size={hero}
                scale={2}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Scroll indicator - only on desktop in preview section */}
      <button
        onClick={onScrollDown}
        className="text-muted-foreground hover:cursor-pointer hover:text-foreground absolute bottom-[5.25rem] left-1/2 -translate-x-1/2 hidden p-4 transition-colors lg:block"
        aria-label="Scroll down to see more"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-bounce"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </button>
    </div>
  )
}
