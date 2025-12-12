import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '../contexts/auth-context'

export default function RequireUser({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Only redirect if we're done loading and there's no user
    if (!isLoading && !user) {
      navigate({ to: '/login' })
    }
  }, [user, isLoading, navigate])

  // Show loading state while checking auth
  if (isLoading) {
    return <div>Loading...</div>
  }

  // Don't render anything if redirecting
  if (!user) {
    return null
  }

  return <>{children}</>
}
