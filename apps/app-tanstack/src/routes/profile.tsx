import { createFileRoute } from '@tanstack/react-router'
import RequireUser from '@/layouts/RequireUser'
import { Profile } from '@/features/profile'

export const Route = createFileRoute('/profile')({
  component: ProfilePageWithAuth,
})

function ProfilePageWithAuth() {
  return (
    <RequireUser>
      <ProfilePage />
    </RequireUser>
  )
}

function ProfilePage() {
  return (
    <div className="flex w-full max-w-4xl flex-col gap-4 p-4">
      <Profile />
    </div>
  )
}
