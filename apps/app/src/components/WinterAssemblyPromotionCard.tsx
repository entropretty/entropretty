import { Link } from "react-router"

function CountdownTimer() {
  return (
    <div className="flex flex-col space-y-4">
      <div>
        <div className="text-center text-2xl font-bold text-white">
          Thank You for Participating!
        </div>
        <div className="text-center text-lg text-gray-300">
          Congratulations to All Winners
        </div>
      </div>
      <div className="text-center text-gray-300">
        We will be contacting the winners shortly to arrange prize distribution.
        Stay tuned for the next competition!
      </div>
      <div className="text-center">
        <Link
          to="https://www.pouet.net/party_results.php?which=1898&when=2025"
          target="_blank"
          className="text-gray-300 underline hover:text-white"
        >
          See the results on Pouet
        </Link>
      </div>
      <div className="text-center text-gray-300">
        Keep experimenting with new algorithms and join us for more exciting
        events ahead!
      </div>
    </div>
  )
}

export function WinterAssemblyPromotionCard() {
  return (
    <div className="mx-auto flex w-screen flex-col overflow-hidden border bg-black text-white sm:flex-col md:w-[682px]">
      <div className="relative aspect-video h-36 w-full sm:aspect-video sm:h-36">
        <img
          src="/assets/Assembly-Winter-25-bg.webp"
          alt="Assembly Winter 2025 Background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/assets/assembly-winter-2025-logo.png"
            alt="Assembly Winter 2025 Logo"
            className="max-h-32 w-auto max-w-[70%] sm:max-w-[60%]"
          />
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="space-y-4 pt-2">
          <CountdownTimer />
        </div>
      </div>
    </div>
  )
}
