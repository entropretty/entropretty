import { Outlet } from "react-router"
import { useAuth } from "../contexts/auth-context"

export default function RequireUser() {
  const { user } = useAuth()

  if (!user) {
    return <div>You need to login first</div>
  }

  return (
    <>
      <Outlet />
    </>
  )
}
