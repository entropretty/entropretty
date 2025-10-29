import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { useAuth } from "@/contexts/auth-context"

export const Route = createFileRoute("/_layout/_auth")({
  component: AuthLayoutComponent,
})

function AuthLayoutComponent() {
  const { user } = useAuth()

  if (!user) {
    return <div>You need to login first</div>
  }

  return <Outlet />
}
