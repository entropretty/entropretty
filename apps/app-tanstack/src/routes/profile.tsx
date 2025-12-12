import { createFileRoute } from '@tanstack/react-router'
import RequireUser from '@/layouts/RequireUser'

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
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Profile management is coming soon. You need to set up your username to
          create algorithms.
        </p>
      </div>
    </div>
  )
}
