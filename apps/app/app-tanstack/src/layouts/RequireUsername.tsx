import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useUserProfile } from '../hooks/useUserProfile'

export default function RequireUsername({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: profile, isLoading } = useUserProfile()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !profile?.username) {
      navigate({ to: '/profile' })
    }
  }, [profile, isLoading, navigate])

  if (isLoading) return null

  if (!profile?.username) {
    return null
  }

  return <>{children}</>
}
