import { createFileRoute } from "@tanstack/react-router"
import { FEATURES } from "@/lib/features"
import CompetitionPage from "@/pages/Competition"
import NewPage from "@/pages/New"

export const Route = createFileRoute("/_layout/")({
  component: IndexComponent,
})

function IndexComponent() {
  if (FEATURES.isCompetition) {
    return <CompetitionPage />
  }
  return <NewPage />
}
