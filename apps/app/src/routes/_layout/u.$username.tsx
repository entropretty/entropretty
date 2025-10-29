import { createFileRoute } from "@tanstack/react-router"
import UserPage from "@/pages/User"

export const Route = createFileRoute("/_layout/u/$username")({
  component: UserPage,
})
