import { createFileRoute } from "@tanstack/react-router"
import AlgorithmPage from "@/pages/Algorithm"

export const Route = createFileRoute("/_layout/a/$algorithmId")({
  component: AlgorithmPage,
})
