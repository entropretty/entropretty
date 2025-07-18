import { Link } from "react-router"
import AnimatedPathText from "../components/fancy/text-along-path"
import { Button } from "../components/ui/button"
import { NewDialog } from "../components/NewDialog"
import { useTheme } from "../contexts/theme-context"
import { useAuth } from "../contexts/auth-context"
import { cn } from "../lib/utils"

export default function Competition() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const rectPath =
    "M 20,20 L 180,20 A 20,20 0 0,1 200,40 L 200,160 A 20,20 0 0,1 180,180 L 20,180 A 20,20 0 0,1 0,160 L 0,40 A 20,20 0 0,1 20,20"

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <AnimatedPathText
        path={rectPath}
        svgClassName="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 py-2 sm:py-8"
        viewBox="-20 10 240 180"
        text="COMPETITION IN PROGRESS — COMPETITION IN PROGRESS — COMPETITION IN PROGRESS — COMPETITION IN PROGRESS — COMPETITION IN PROGRESS —"
        textClassName="text-[12.71px] font-jersey text-foreground"
        duration={30}
        preserveAspectRatio="none"
        textAnchor="start"
      />

      {/* Summer Assembly 2025 Competition */}
      <div className="absolute left-1/2 top-1/2 w-80 -translate-x-1/2 -translate-y-1/2 p-6 sm:w-96">
        <div className="space-y-8 text-center">
          <div className="">
            <div className="flex justify-center">
              <div className={cn("font-jersey flex-row text-2xl")}>
                <div>Entropretty Competition at</div>
              </div>
            </div>
            <img
              src="/assets/assembly-summer-2025-logo-640w.png"
              alt="Summer Assembly 2025"
              className="mx-auto h-20 w-auto object-contain sm:h-24"
              style={{
                filter: theme === "light" ? "invert(1)" : "none",
              }}
            />
            <div className="mt-10 space-y-6">
              <div className="relative">
                <div className="bg-foreground/10 absolute inset-0"></div>
                <div className="border-foreground bg-background relative border-2 px-6 py-4">
                  <p className="text-muted-foreground text-xs uppercase tracking-wide sm:text-sm">
                    Total Prize Money
                  </p>
                  <p className="text-foreground text-3xl font-black sm:text-4xl">
                    $5,000.00
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <p className="text-muted-foreground text-sm font-medium sm:text-base">
              Create unique tattoo designs using our algorithmic art platform.
            </p>

            <button className="text-foreground text-sm font-medium underline hover:no-underline sm:text-base">
              Learn more about competition rules
            </button>

            <div className="flex justify-center gap-3 pt-2">
              {user ? (
                // Show buttons for logged in users
                <>
                  <NewDialog />
                  <Button
                    asChild
                    variant="outline"
                    className="border-foreground text-foreground hover:bg-foreground/10 hidden md:flex"
                  >
                    <Link to="/mine">My Creations</Link>
                  </Button>
                </>
              ) : (
                // Show join button for non-logged in users
                <Button
                  asChild
                  variant="default"
                  className="bg-foreground text-background hover:bg-foreground/90 uppercase"
                >
                  <Link to="/signup">Join competition</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
