import { useCallback, useEffect } from 'react'

interface UseNavigationProtectionOptions {
  when?: boolean
}

export const useNavigationProtection = ({
  when = true,
}: UseNavigationProtectionOptions = {}) => {
  // Handle page refresh, close, and external navigation with native dialog
  const handleBeforeUnload = useCallback(
    (event: BeforeUnloadEvent) => {
      if (!when) return

      // This triggers the native "Leave page?" dialog
      event.preventDefault()
      event.returnValue = '' // Modern browsers ignore custom messages anyway
      return ''
    },
    [when],
  )

  // Handle back/forward navigation within the app
  const handlePopState = useCallback(() => {
    if (!when) return

    // Push current state back to prevent navigation
    window.history.pushState(null, '', window.location.href)

    // Show a confirm dialog that looks similar to native
    const shouldLeave = window.confirm(
      'Leave site?\n\nChanges you made may not be saved.',
    )

    if (shouldLeave) {
      // User chose to leave - disable protection and navigate
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.history.back()
    }
  }, [when, handleBeforeUnload])

  useEffect(() => {
    if (when) {
      // Push a state to catch back navigation
      window.history.pushState(null, '', window.location.href)

      // Handle different types of navigation
      window.addEventListener('beforeunload', handleBeforeUnload) // refresh, close, external
      window.addEventListener('popstate', handlePopState) // back/forward within app

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload)
        window.removeEventListener('popstate', handlePopState)
      }
    }
  }, [when, handleBeforeUnload, handlePopState])

  return {
    isBlocked: false,
  }
}
