import { createFileRoute, Navigate } from "@tanstack/react-router"
import { useUserProfile } from "@/hooks/useUserProfile"
import { lazy, Suspense } from "react"

const Create = lazy(() => import("@/pages/Create"))

export const Route = createFileRoute("/_layout/_auth/create")({
  component: CreatePageComponent,
})

function CreatePageComponent() {
  const { data: profile, isLoading } = useUserProfile()

  if (isLoading) return null

  if (!profile?.username) {
    return <Navigate to="/profile" />
  }

  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <Create />
    </Suspense>
  )
}
