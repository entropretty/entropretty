import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { FEATURES } from '@/lib/features'
import { supabase } from '@/lib/supabase'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  algorithmNameAtom,
  editorCodeAtom,
  editorSeedTypeAtom,
  remixAtom,
  scriptErrorAtom,
} from './atoms'

const validateAlgorithmName = (
  name: string,
): { isValid: boolean; error?: string } => {
  const trimmedName = name.trim().replace(/\s+/g, ' ')

  if (!trimmedName) {
    return { isValid: false, error: 'Name is required' }
  }
  if (trimmedName.length < 3) {
    return { isValid: false, error: 'Name must be at least 3 characters' }
  }
  if (trimmedName.length > 32) {
    return { isValid: false, error: 'Name must be 32 characters or less' }
  }

  return { isValid: true }
}

export const PostButton = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [editorCode] = useAtom(editorCodeAtom)
  const [editorSeedType] = useAtom(editorSeedTypeAtom)
  const [scriptError] = useAtom(scriptErrorAtom)
  const [remix] = useAtom(remixAtom)
  const [algorithmName, setAlgorithmName] = useAtom(algorithmNameAtom)
  const [hasPosted, setHasPosted] = useState(false)

  const nameValidation = validateAlgorithmName(algorithmName)

  const createAlgorithm = useMutation({
    mutationFn: async () => {
      const { isValid, error } = validateAlgorithmName(algorithmName)
      if (!isValid) {
        throw new Error(error)
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error('You must be logged in to create an algorithm')
      }

      const { data: insertedAlgorithm, error: insertError } = await supabase
        .from('algorithms')
        .insert({
          content: editorCode,
          name: algorithmName.trim().replace(/\s+/g, ' '),
          user_id: user.id,
          remix_of: remix?.id || undefined,
          like_count: 0,
          family_kind: editorSeedType,
        })
        .select()
        .single()

      if (insertError) {
        throw new Error(insertError.message)
      }

      fetch(`/api/twitter/${insertedAlgorithm.id}`, {
        method: 'GET',
      })
      fetch(`/api/og/${insertedAlgorithm.id}`, {
        method: 'GET',
      })

      return insertedAlgorithm
    },
    onSuccess: (data) => {
      console.info('Successfully created algorithm', data)

      setAlgorithmName('')
      if (FEATURES.isCompetition) {
        queryClient
          .invalidateQueries({ queryKey: ['algorithms', 'user-id'] })
          .finally(() => {
            navigate({ to: '/mine' })
          })
      } else {
        queryClient
          .invalidateQueries({ queryKey: ['algorithms', 'latest'] })
          .finally(() => {
            navigate({ to: '/new' })
          })
      }
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  // TODO: Re-enable navigation prompt when TanStack Router supports it
  // unstable_usePrompt({
  //   message: "Your code will be lost if you leave this page.",
  //   when: !hasPosted,
  // })

  return (
    <div className="flex flex-col gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => {
                setHasPosted(true)
                setTimeout(() => {
                  createAlgorithm.mutate()
                }, 0)
              }}
              disabled={
                createAlgorithm.isPending ||
                !nameValidation.isValid ||
                scriptError !== null
              }
              className="min-w-[100px]"
            >
              <div className="flex items-center justify-center">
                {createAlgorithm.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    POSTING...
                  </>
                ) : (
                  'POST' + (remix ? '*' : '')
                )}
              </div>
            </Button>
          </TooltipTrigger>
          {remix && (
            <TooltipContent>
              <p>* Will be marked as remix of {remix.id}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
