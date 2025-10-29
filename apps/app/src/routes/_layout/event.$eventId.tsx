import { createFileRoute } from "@tanstack/react-router"
import EventPage from "@/pages/Event"

export const Route = createFileRoute("/_layout/event/$eventId")({
  component: EventPage,
})
