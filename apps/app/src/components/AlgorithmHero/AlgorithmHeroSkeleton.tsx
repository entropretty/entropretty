import { Skeleton } from '@/components/ui/skeleton'
import { useDisplaySizes } from '@/hooks/useDisplaySizes'

export function AlgorithmHeroSkeleton() {
  const { hero } = useDisplaySizes()

  return (
    <div className="bg-background border-border flex flex-col border-b lg:h-[calc(100dvh-var(--nav-height))] lg:flex-row">
      {/* Left side - Algorithm Info Skeleton */}
      <div className="border-border relative flex h-[calc(100dvh-var(--nav-height))] w-full flex-col justify-center px-8 py-12 lg:h-full lg:w-[35%] lg:border-r lg:px-12 lg:py-0 xl:px-16">
        <div className="mx-auto flex max-w-md flex-col gap-4 lg:mx-0 lg:gap-5">
          {/* Algorithm ID badge skeleton */}
          <Skeleton className="h-5 w-16 rounded-sm" />

          {/* Family Kind badge skeleton */}
          <Skeleton className="h-6 w-24 rounded-sm" />

          {/* Algorithm Name skeleton */}
          <Skeleton className="h-10 w-48 rounded-sm sm:h-12 lg:h-14" />

          {/* Author skeleton */}
          <Skeleton className="h-6 w-32 rounded-sm" />

          {/* Stats skeleton */}
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-40 rounded-sm" />
            <Skeleton className="h-4 w-28 rounded-sm" />
          </div>

          {/* Actions skeleton */}
          <div className="mt-2 flex flex-wrap items-center gap-8 lg:mt-4">
            <Skeleton className="h-6 w-12 rounded-sm" />
            <Skeleton className="h-6 w-14 rounded-sm" />
          </div>
        </div>
      </div>

      {/* Right side - Preview Grid Skeleton */}
      <div className="relative flex w-full items-center justify-center p-6 lg:h-full lg:w-[65%] lg:p-8 xl:p-12">
        {/* Desktop: 8 previews in flex wrap */}
        <div className="hidden flex-wrap content-center items-center justify-center gap-6 lg:flex">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <Skeleton
                key={i}
                className="rounded-none"
                style={{
                  width: hero,
                  height: hero,
                }}
              />
            ))}
        </div>
        {/* Mobile: 4 centered previews in column */}
        <div className="flex w-full flex-col items-center gap-4 lg:hidden">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton
                key={i}
                className="aspect-square w-full max-w-sm rounded-none"
              />
            ))}
        </div>
      </div>
    </div>
  )
}
