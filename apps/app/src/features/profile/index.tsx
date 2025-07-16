import { useNavigate } from "react-router"

import { useAuth } from "@/contexts/auth-context"
import { useUserProfile } from "@/hooks/useUserProfile"
import { Username } from "./components/Username"

export function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: profile, isLoading } = useUserProfile()

  if (!user) {
    navigate("/login")
    return null
  }

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col items-start gap-4 overflow-y-scroll p-4">
        <div>
          <h3 className="text-md font-medium">Loading...</h3>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col items-start gap-4 overflow-y-scroll p-4">
      <div>
        <h3 className="text-md font-medium">Profile</h3>
        <p className="text-muted-foreground text-xs">
          This is how others will see you on the site.
        </p>
      </div>

      <Username profile={profile || null} />
    </div>
  )
}
