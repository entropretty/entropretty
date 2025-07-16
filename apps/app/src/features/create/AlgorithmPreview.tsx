import { useAlgorithmService } from "@/contexts/service-context"
import { seedToKey } from "entropretty-utils"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import {
  editorCodeAtom,
  editorCodeVersionAtom,
  scriptErrorAtom,
  editorSeedFamilyAtom,
} from "./atoms"
import { AlgorithmCompliance } from "./AlgorithmCompliance"

const PREVIEW_SIZE = 164 // Smaller size for the grid previews

export const AlgorithmPreview = () => {
  const [editorCode] = useAtom(editorCodeAtom)
  const [seedFamily] = useAtom(editorSeedFamilyAtom)
  const [, setScriptError] = useAtom(scriptErrorAtom)
  const [codeVersion, setAlgorithmVersion] = useAtom(editorCodeVersionAtom)
  const algorithmService = useAlgorithmService()
  const [ready, setReady] = useState(false)

  // Update algorithm in worker when code changes
  useEffect(() => {
    setReady(false)
    algorithmService
      .updateAlgorithm(0, editorCode)
      .then(() => {
        setReady(true)
        setScriptError(null)
        // Increment version to trigger redraws
        setAlgorithmVersion((v) => v + 1)
      })
      .catch((e) => {
        setScriptError(e.message)
        console.error(e)
      })
  }, [algorithmService, editorCode, setScriptError, setAlgorithmVersion])

  return (
    <div className="grid h-full w-full grid-cols-4 overflow-scroll">
      {seedFamily.slice(0, 12).map((seed, index) => (
        <div key={seedToKey(seed)} className="flex items-center justify-center">
          <div className="relative border border-dashed">
            {ready && (
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
  )
}
