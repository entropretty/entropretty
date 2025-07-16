import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn, familyKindColor } from "@/lib/utils"
import { FamilyKind } from "entropretty-utils"
import { ArrowUpRight, PlusIcon } from "lucide-react"
import { Link, useNavigate } from "react-router"

interface SeedTypeCardProps {
  kind: FamilyKind
}

function SeedTypeCard({ kind }: SeedTypeCardProps) {
  const navigate = useNavigate()
  const isProceduralKind = kind === "Procedural"
  const colorClass = familyKindColor(kind)

  return (
    <div className={cn("relative", isProceduralKind && "pb-2")}>
      {isProceduralKind && (
        <>
          <div
            className={cn(
              "absolute inset-0 -m-2 border",
              colorClass,
              "z-0 bg-transparent",
            )}
          ></div>
          <div
            className={cn(
              "absolute bottom-0 left-1/2 z-10 -translate-x-1/2 translate-y-4 px-4 py-0.5",
              colorClass,
              "text-primary-foreground font-jersey whitespace-nowrap text-xs",
            )}
          >
            START HERE
          </div>
        </>
      )}
      <button
        onClick={() => navigate(`/create?type=${kind}`)}
        className={cn(
          "z-5 relative flex aspect-square w-full flex-col items-center justify-center gap-2 p-4 transition-colors",
          colorClass,
          isProceduralKind
            ? "text-primary-foreground"
            : "text-primary-background",
        )}
      >
        <div className="font-jersey text-xl">
          {kind === "Procedural" && "Entropy"}
          {kind === "ProceduralPersonal" && "Personal Id"}
          {kind === "ProceduralAccount" && "Account Id"}
        </div>
        <div className="text-sm">
          {kind === "Procedural" && "4 random bytes for creative designs"}
          {kind === "ProceduralPersonal" && "8 bytes for personal identifiers"}
          {kind === "ProceduralAccount" && "32 bytes for account-based designs"}
        </div>
      </button>
    </div>
  )
}

export function NewDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="hidden md:flex">
          <div className="flex items-center gap-1">
            <PlusIcon className="h-4 w-4" />
            NEW
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Choose your Seed Category
          </DialogTitle>
        </DialogHeader>
        {/* <Alert variant="info">
          <AlertDescription className="text-xs">
            Remember:{" "}
            <Link
              className="hover:text-brand-blue/80 underline"
              to="https://entropretty.com/rules#2-determinism-uniqueness"
              target="_blank"
            >
              Rule 2.3 Determinism & Uniqueness{" "}
            </Link>
            <br />
            Every byte of the seed should be encoded into the design. Not using
            all bytes will result in a poor uniqueness rating.
          </AlertDescription>
        </Alert> */}

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <SeedTypeCard kind="Procedural" />
          </div>
          <div className="space-y-2">
            <SeedTypeCard kind="ProceduralPersonal" />
          </div>
          <div className="space-y-2">
            <SeedTypeCard kind="ProceduralAccount" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="link" asChild>
            <Link
              to="https://entropretty.com/rules#seed-details"
              target="_blank"
              className="text-primary hover:underline"
            >
              Learn about seed types & meaning
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
