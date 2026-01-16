import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { AnimatePresence, motion } from 'motion/react'
import useMeasure from 'react-use-measure'
import type { AlgorithmView } from '@/lib/helper.types'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'

interface DeleteButtonProps {
  algorithm: AlgorithmView
}

export function DeleteButton({ algorithm }: DeleteButtonProps) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [isConfirming, setIsConfirming] = useState(false)
  const [ref, bounds] = useMeasure()
  const canDelete = user?.id === algorithm.user_id

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!user || !canDelete) throw new Error('Unauthorized')

      const { error } = await supabase
        .from('algorithms')
        .delete()
        .eq('id', algorithm.id)
        .eq('user_id', user.id)

      if (error) throw error
      return algorithm.id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['algorithms'] })
      toast.success('Algorithm deleted successfully')
      setIsConfirming(false)
    },
    onError: (error: Error) => {
      console.error('Error deleting algorithm:', error)
      toast.error('Error Deleting Algorithm: ' + error.message)
      setIsConfirming(false)
    },
  })

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>
    if (isConfirming) {
      timeoutId = setTimeout(() => {
        setIsConfirming(false)
      }, 3000)
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [isConfirming])

  const handleClick = useCallback(() => {
    if (isConfirming) {
      deleteMutation.mutate()
    } else {
      setIsConfirming(true)
    }
  }, [isConfirming, deleteMutation])

  if (!canDelete) return null

  return (
    <motion.div
      className="overflow-hidden"
      animate={{
        width: bounds.width,
      }}
      transition={{ duration: 0.1, type: 'spring' }}
    >
      <Button
        variant={isConfirming ? 'destructive' : 'ghost'}
        onMouseDown={handleClick}
        ref={ref}
        disabled={deleteMutation.isPending}
        className="gap-2 transition-colors"
      >
        {deleteMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              layout
              key={isConfirming ? 'confirm' : 'delete'}
              initial={{ opacity: 0, width: '100%' }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: '100%' }}
              transition={{ duration: 0.2 }}
            >
              {isConfirming ? 'YES, DELETE!' : 'DELETE'}
            </motion.div>
          </AnimatePresence>
        )}
      </Button>
    </motion.div>
  )
}
