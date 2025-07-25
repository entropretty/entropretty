import { useAlgorithmService } from "@/contexts/service-context"
import { seedToKey } from "entropretty-utils"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import {
  editorCodeAtom,
  editorCodeVersionAtom,
  scriptErrorAtom,
  editorSeedFamilyAtom,
  editorSeedTypeAtom,
} from "./atoms"
import { AlgorithmCompliance } from "./AlgorithmCompliance"
import { cn } from "@/lib/utils"

const PREVIEW_SIZE = 164 // Smaller size for the grid previews

export const AlgorithmPreview = () => {
  const [editorCode] = useAtom(editorCodeAtom)
  const [seedFamily] = useAtom(editorSeedFamilyAtom)
  const [seedType] = useAtom(editorSeedTypeAtom)
  const [, setScriptError] = useAtom(scriptErrorAtom)
  const [codeVersion, setAlgorithmVersion] = useAtom(editorCodeVersionAtom)
  const algorithmService = useAlgorithmService()
  const [ready, setReady] = useState(false)

  // Update algorithm in worker when code changes
  useEffect(() => {
    setReady(false)
    algorithmService.cancelAllRenders().then(() =>
      algorithmService.updateAlgorithm(0, editorCode, seedType).then(() => {
        algorithmService
          .testRender(0)
          .then(() => {
            setReady(true)
            setScriptError(null)
            // Increment version to trigger redraws
            setAlgorithmVersion((v) => v + 1)
          })
          .catch((e) => {
            setScriptError(e.message)
            console.info("TestRenderError:", e)
          })
      }),
    )
  }, [
    algorithmService,
    editorCode,
    seedType,
    setScriptError,
    setAlgorithmVersion,
  ])

  return (
    <div className="grid h-full w-full grid-cols-4 overflow-scroll">
      {seedFamily.slice(0, 12).map((seed, index) => (
        <div key={seedToKey(seed)} className="flex items-center justify-center">
          <div
            className={cn("relative border border-dashed", {
              "blur-xs opacity-25": !ready,
            })}
          >
            <AlgorithmCompliance
              key={`compliance-${index}`}
              algorithmId={0}
              seed={seed}
              scale={2}
              size={PREVIEW_SIZE}
              version={codeVersion}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
