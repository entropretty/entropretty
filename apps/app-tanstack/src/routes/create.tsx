import { createFileRoute } from '@tanstack/react-router'
import { useAtom, useSetAtom } from 'jotai'
import { Suspense, lazy, useEffect, useState } from 'react'
import { z } from 'zod'

import {
  editorCodeAtom,
  editorSeedTypeAtom,
  generateNewSeedAtom,
  remixAtom,
} from '@/features/create/atoms'
import { AlgorithmView } from '@/lib/helper.types'
import { supabase } from '@/lib/supabase'
import { FamilyKind } from '@entropretty/utils'
import RequireUser from '@/layouts/RequireUser'
import RequireUsername from '@/layouts/RequireUsername'

const CreateFeature = lazy(() => import('../features/create'))

const createSearchSchema = z.object({
  remix: z.number().optional(),
  type: z.string().optional(),
})

export const Route = createFileRoute('/create')({
  component: CreatePageWithAuth,
  validateSearch: createSearchSchema,
})

function CreatePageWithAuth() {
  return (
    <RequireUser>
      <RequireUsername>
        <CreatePage />
      </RequireUsername>
    </RequireUser>
  )
}

function CreatePage() {
  const { remix: remixId, type: seedTypeQuery } = Route.useSearch()
  const [, setRemix] = useAtom(remixAtom)
  const [, setSeedType] = useAtom(editorSeedTypeAtom)
  const [, setEditorCode] = useAtom(editorCodeAtom)
  const [isReady, setIsReady] = useState<boolean>(false)
  const [data, setData] = useState<AlgorithmView | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const generateNewSeed = useSetAtom(generateNewSeedAtom)

  // Fetch remix algorithm if remixId is present
  useEffect(() => {
    if (remixId) {
      setIsLoading(true)
      supabase
        .from('algorithms_with_user_profile')
        .select()
        .eq('id', remixId)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching algorithm:', error)
          } else if (data) {
            setData(data as AlgorithmView)
          }
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [remixId])

  useEffect(() => {
    if (!data) {
      setEditorCode('')
      setSeedType((seedTypeQuery as FamilyKind) || 'Procedural')
      generateNewSeed()
      setRemix(null)
    } else {
      setRemix(data as AlgorithmView)

      setEditorCode(data.content || '')
      setSeedType(data.family_kind || 'Procedural')
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
