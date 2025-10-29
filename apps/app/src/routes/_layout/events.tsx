import { createFileRoute } from "@tanstack/react-router"
import EventsPage from "@/pages/Events"

export const Route = createFileRoute("/_layout/events")({
  component: EventsPage,
})
