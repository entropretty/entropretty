import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"

export const ListItem = ({
  className,
  title,
  description,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  title: string
  description?: string
}) => {
  return (
    <div
      className={cn(
        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 p-3 leading-none no-underline outline-none transition-colors hover:cursor-pointer",
        className,
      )}
      {...props}
    >
      <div className="text-sm font-medium leading-none">{title}</div>
      {description && (
        <p className="text-muted-foreground line-clamp-2 text-xs leading-snug">
          {description}
        </p>
      )}
    </div>
  )
}

export function HelpMenu() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-9 px-4 py-2 text-sm font-medium">
          help
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-2 md:w-[300px] lg:w-[400px]">
        <div className="grid gap-1">
          <Link to="https://entropretty.com/" target="_blank">
            <ListItem
              title="What is this?"
              description="https://entropretty.com/"
            />
          </Link>

          <Link to="https://github.com/entropretty/entropretty" target="_blank">
            <ListItem
              title="GitHub Repository"
              description="View the source code for Entropretty"
            />
          </Link>
          <Link to="https://entropretty.com/rules" target="_blank">
            <ListItem
              title="Competition Rules"
              description="Learn about the rules of the competition"
            />
          </Link>

          <Link
            to="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D"
            target="_blank"
          >
            <ListItem
              title="Canvas API Reference"
              description="Documentation for the CanvasRenderingContext2D API used for drawing"
            />
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
