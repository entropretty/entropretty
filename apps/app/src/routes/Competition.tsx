import { Link } from "react-router"
import AnimatedPathText from "../components/fancy/text-along-path"
import { Button } from "../components/ui/button"
import { Countdown } from "../components/ui/countdown"
import { NewDialog } from "../components/NewDialog"
import { useTheme } from "../contexts/theme-context"
import { useAuth } from "../contexts/auth-context"
import { cn } from "../lib/utils"
import { XIcon } from "../components/icons/XIcon"
import { DiscordIcon } from "../components/icons/DiscordIcon"

export default function Competition() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const rectPath =
    "M 20,20 L 180,20 A 20,20 0 0,1 200,40 L 200,160 A 20,20 0 0,1 180,180 L 20,180 A 20,20 0 0,1 0,160 L 0,40 A 20,20 0 0,1 20,20"

  // Set the submission deadline to August 2nd, 2025 at 1pm UTC
  const submissionDeadline = new Date("2025-08-02T13:00:00Z")

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <AnimatedPathText
        path={rectPath}
        svgClassName="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 py-2 sm:py-8"
        viewBox="-20 10 240 180"
        text="COMPETITION IN PROGRESS — COMPETITION IN PROGRESS — COMPETITION IN PROGRESS — COMPETITION IN PROGRESS — COMPETITION IN PROGRESS —"
        textClassName="text-[12.71px] font-jersey text-foreground"
        duration={30}
        preserveAspectRatio="none"
        textAnchor="start"
      />

      {/* Summer Assembly 2025 Competition */}
      <div className="absolute left-1/2 top-1/2 w-80 -translate-x-1/2 -translate-y-1/2 p-6 sm:w-96">
        <div className="space-y-5 text-center">
          <div className="">
            <div className="flex justify-center">
              <div className={cn("font-jersey flex-row text-2xl")}>
                <div>Entropretty Competition at</div>
              </div>
            </div>
            <a
              href="https://assembly.org/en/events/summer25/program/entropretty-tattoo-algorithm-competition-assembly-summer-2025-2"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-auto block w-fit transition-transform hover:scale-105"
            >
              <img
                src="/assets/assembly-summer-2025-logo-640w.png"
                alt="Summer Assembly 2025"
                className="h-20 w-auto object-contain sm:h-24"
                style={{
                  filter: theme === "light" ? "invert(1)" : "none",
                }}
              />
            </a>
            <div className="mt-5 space-y-6">
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

          <div className="space-y-4">
            <p className="text-muted-foreground text-xs font-medium sm:text-sm">
              Create unique tattoo designs using our algorithmic art platform.
            </p>

            <a
              href="https://entropretty.com/rules"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground text-xs font-medium underline hover:no-underline sm:text-sm"
            >
              Learn more about competition rules
            </a>

            <Countdown targetDate={submissionDeadline} className="mt-6" />

            <div className="mt-4 hidden text-center md:block">
              <p className="text-muted-foreground mb-2 text-xs uppercase tracking-wide">
                Submit THE LINK TO YOUR ENTRY TO
              </p>
              <p className="text-foreground text-sm font-medium">
                <a
                  href="https://scene.assembly.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                >
                  scene.assembly.org
                </a>
              </p>
            </div>

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

            {/* Social Media Links */}
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button asChild variant={"link"} className="h-5 w-5">
                <Link to="https://x.com/entropretty" target="_blank">
                  <XIcon />
                </Link>
              </Button>
              <Button asChild variant={"link"} className="h-5 w-5">
                <Link
                  to="https://discord.com/invite/x73PxY95BZ"
                  target="_blank"
                >
                  <DiscordIcon />
                </Link>
              </Button>
              <span className="text-muted-foreground -ml-1 hidden text-xs md:inline">
                #entropretty-compo-2025
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
