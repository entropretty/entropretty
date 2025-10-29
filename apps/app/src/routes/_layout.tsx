import { createFileRoute } from "@tanstack/react-router"
import HeaderLayout from "@/layouts/HeaderLayout"

export const Route = createFileRoute("/_layout")({
  component: LayoutComponent,
})

function LayoutComponent() {
  return <HeaderLayout />
}
