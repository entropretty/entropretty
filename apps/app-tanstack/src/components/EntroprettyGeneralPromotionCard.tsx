import { Link } from "react-router"
import { useEffect, useState } from "react"

function PromotionContent() {
  return (
    <div className="flex flex-col space-y-3">
      <h3 className="font-bold text-white">
        Design Tattoos for Web3 Individuality
      </h3>
      <div className="text-sm text-white">
        Entropretty lets you create tattooable designs that prove individuality
        using the DIM1 Proof-of-Ink mechanism, in an open & transparent way
        using blockchain technology.
      </div>
      <div className="text-sm text-white">
        Learn more at{" "}
        <Link
          to="https://entropretty.com"
          target="_blank"
          className="text-gray-300 underline hover:text-white"
        >
          Entropretty.com
        </Link>
      </div>
    </div>
  )
}

export function EntroprettyGeneralPromotionCard() {
  const [isDismissed, setIsDismissed] = useState(false)
  const storageKey = "promocard-v1"

  useEffect(() => {
    // Check if card was previously dismissed
    const dismissedStatus = localStorage.getItem(storageKey)
    if (dismissedStatus === "dismissed") {
      setIsDismissed(true)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem(storageKey, "dismissed")
    setIsDismissed(true)
  }

  if (isDismissed) {
    return null
  }

  return (
    <div className="mx-auto flex w-screen flex-col overflow-hidden border bg-black text-white sm:flex-col md:w-[682px]">
      <div className="relative h-52 w-full overflow-hidden">
        <video
          src="/videos/bg-960p-10s.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="h-auto w-full -translate-y-1/3 object-cover"
        />
        <button
          onClick={handleDismiss}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70"
          aria-label="Dismiss promotion"
        >
          <span className="text-lg">&times;</span>
        </button>
      </div>

      <div className="p-6">
        <PromotionContent />
      </div>
    </div>
  )
}
