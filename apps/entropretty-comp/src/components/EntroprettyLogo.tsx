import { cn } from "@/lib/utils"

export const EntroprettyLogo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("font-jersey flex-row text-3xl", className)}>
      <div>Entropretty</div>
    </div>
  )
}
