import { seedToKey } from '@entropretty/utils'
import { useAtom } from 'jotai'
import { useEffect, useMemo, useState } from 'react'
import useMeasure from 'react-use-measure'
import {
  editorCodeAtom,
  editorCodeVersionAtom,
  editorSeedFamilyAtom,
  editorSeedTypeAtom,
  scriptErrorAtom,
} from './atoms'
import { AlgorithmCompliance } from './AlgorithmCompliance'
import { useAlgorithmService } from '@/contexts/service-context'
import { cn } from '@/lib/utils'

const PREVIEW_SIZE = 128 // Smaller size for the grid previews

export const AlgorithmPreview = () => {
  const [editorCode] = useAtom(editorCodeAtom)
  const [seedFamily] = useAtom(editorSeedFamilyAtom)
  const [seedType] = useAtom(editorSeedTypeAtom)
  const [, setScriptError] = useAtom(scriptErrorAtom)
  const [codeVersion, setAlgorithmVersion] = useAtom(editorCodeVersionAtom)
  const algorithmService = useAlgorithmService()
  const [ready, setReady] = useState(false)
  const [ref, bounds] = useMeasure()

  // Calculate grid dimensions based on available space
  const { cols, totalSlots } = useMemo(() => {
    if (!bounds.width || !bounds.height) {
      return { cols: 4, totalSlots: 12 } // fallback
    }

    const availableWidth = bounds.width
    const availableHeight = bounds.height

    // Add some padding/margin between items (let's say 8px)
    const itemSpacing = 8
    const effectiveItemWidth = PREVIEW_SIZE + itemSpacing
    const effectiveItemHeight = PREVIEW_SIZE + itemSpacing

    const maxCols = Math.max(1, Math.floor(availableWidth / effectiveItemWidth))
    const maxRows = Math.max(
      1,
      Math.floor(availableHeight / effectiveItemHeight),
    )

    const totalSlots = maxCols * maxRows

    return { cols: maxCols, totalSlots }
  }, [bounds.width, bounds.height])

  // Update algorithm in worker when code changes
  useEffect(() => {
    setReady(false)

    algorithmService.cancelAllRenderRequests()

    try {
      algorithmService.updateAlgorithm(0, editorCode, seedType).then(() => {
        algorithmService
          .testRender(0)
          .then(() => {
            setScriptError(null)

            setReady(true)

            // Increment version to trigger redraws
            setAlgorithmVersion((v) => v + 1)
          })
          .catch((e) => {
            console.info('TestRenderError:', e)
            setScriptError(e.message)
          })
      })
    } catch (e) {
      console.error('UpdateAlgorithmError:', e)
    }
  }, [
    algorithmService,
    editorCode,
    seedType,
    setAlgorithmVersion,
    setScriptError,
  ])

  // Get the number of seeds to show based on available space
  const seedsToShow = Math.min(totalSlots, seedFamily.length)

  return (
    <div ref={ref} className="h-full w-full overflow-scroll">
      <div
        className="grid gap-2 p-2"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {seedFamily.slice(0, seedsToShow).map((seed, index) => (
          <div
            key={seedToKey(seed)}
            className="flex items-center justify-center"
          >
            <div
              className={cn('relative border border-dashed', {
                'blur-xs opacity-25': !ready,
              })}
            >
              {!!editorCode && (
                <AlgorithmCompliance
                  key={`compliance-${index}`}
                  algorithmId={0}
                  seed={seed}
                  scale={2}
                  size={PREVIEW_SIZE}
                  version={codeVersion}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
