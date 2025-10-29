import { Navigate, Outlet } from "@tanstack/react-router"
import { useUserProfile } from "../hooks/useUserProfile"

export default function RequireUsername() {
  const { data: profile, isLoading } = useUserProfile()

  if (isLoading) return null

  if (!profile?.username) {
    return <Navigate to="/profile" />
  }

  return (
    <>
      <Outlet />
    </>
  )
}
