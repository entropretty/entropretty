import { createFileRoute } from "@tanstack/react-router"
import ExplorePage from "@/pages/Explore"

export const Route = createFileRoute("/_layout/explore")({
  component: ExplorePage,
})
