import { createFileRoute } from "@tanstack/react-router"
import DemoPage from "@/pages/Demo"

export const Route = createFileRoute("/demo/$algorithmId")({
  component: DemoPage,
})
