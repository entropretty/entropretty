import {
  editorCodeAtom,
  editorSeedTypeAtom,
  generateNewSeedAtom,
  remixAtom,
} from "@/features/create/atoms"
import { AlgorithmView } from "@/lib/helper.types"
import { supabase } from "@/lib/supabase"
import { useQuery } from "@tanstack/react-query"
import { FamilyKind } from "@entropretty/utils"
import { useAtom, useSetAtom } from "jotai"
import { Suspense, lazy, useEffect, useState } from "react"
import { useSearch } from "@tanstack/react-router"

const CreateFeature = lazy(() => import("../features/create"))

function Create() {
  const searchParams = useSearch({ from: "/_layout/_auth/create" }) as {
    remix?: string
    type?: string
  }
  const remixId = searchParams.remix
  const seedTypeQuery = searchParams.type
  const [, setRemix] = useAtom(remixAtom)
  const [, setSeedType] = useAtom(editorSeedTypeAtom)
  const [, setEditorCode] = useAtom(editorCodeAtom)
  const [isReady, setIsReady] = useState<boolean>(false)
  const generateNewSeed = useSetAtom(generateNewSeedAtom)

  const { data, isLoading } = useQuery({
    queryKey: ["algorithm", remixId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("algorithms_with_user_profile")
        .select()
        .eq("id", Number(remixId))
        .single()

      if (error) throw error

      if (!data) return
      return data as AlgorithmView
    },
    enabled: remixId !== null,
  })

  useEffect(() => {
    if (!data) {
      setEditorCode("")
      setSeedType((seedTypeQuery as FamilyKind) || "Procedural")
      generateNewSeed()
      setRemix(null)
    } else {
      setRemix(data as AlgorithmView)

      setEditorCode(data.content || "")
      setSeedType(data.family_kind || "Procedural")
      generateNewSeed()
    }
    setTimeout(() => setIsReady(true), 500)
  }, [
    data,
    setRemix,
    seedTypeQuery,
    setSeedType,
    generateNewSeed,
    setEditorCode,
  ])

  return (
    <>
      {!isLoading && isReady && (
        <Suspense fallback={<div className="p-8">Setting up editor...</div>}>
          <CreateFeature />
        </Suspense>
      )}
    </>
  )
}

export default Create
