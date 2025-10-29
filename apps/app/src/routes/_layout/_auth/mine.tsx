import { createFileRoute } from "@tanstack/react-router"
import MinePage from "@/pages/Mine"

export const Route = createFileRoute("/_layout/_auth/mine")({
  component: MinePage,
})
