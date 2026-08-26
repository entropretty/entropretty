import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/state"
import { cn } from "@/lib/utils"

export const SchemaSelect = () => {
  const schemas = useApp((state) => state.schemas)
  const selectedSchema = useApp((state) => state.schema)
  const setSchema = useApp((state) => state.setSchema)
  const showControls = useApp((state) => state.showControls)

  return (
    <aside
      className={cn(
        "fixed left-4 top-4 flex h-10 flex-row items-center justify-center rounded-md border bg-background/95 backdrop-blur transition-all duration-300 ease-in-out supports-[backdrop-filter]:bg-background/30",
        { hidden: !showControls || schemas.length <= 1 },
      )}
    >
      {schemas.map((schema) => (
        <Button
          className={cn({
            underline: selectedSchema?.name === schema.name,
          })}
          key={schema.name}
          variant={selectedSchema?.name === schema.name ? "link" : "ghost"}
          onClick={() => setSchema(schema.name)}
        >
          {`${schema.name}`}
        </Button>
      ))}
    </aside>
  )
}
