import { Button } from "./ui/button"

function Content() {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col gap-2 text-gray-300">
        <p className="leading-6">
          The public has spoken, the results are in and live!
          <br /> Congratulations to the winners:
        </p>

        <ol className="ml-6 list-decimal space-y-1 pl-5">
          <li>
            <b>Faerjan</b>{" "}
            <a href="/a/205" className="text-blue-400 hover:underline">
              /a/205
            </a>{" "}
            by <b>Jumalauta Faerjan Committee</b>
          </li>
          <li>
            <b>Scary faces</b>{" "}
            <a href="/a/238" className="text-blue-400 hover:underline">
              /a/238
            </a>{" "}
            by <b>blueflame/Ananasmurska</b>
          </li>
          <li>
            <b>Lines & Circles</b>{" "}
            <a href="/a/211" className="text-blue-400 hover:underline">
              /a/211
            </a>{" "}
            by <b>LLB</b>
          </li>
        </ol>
        <p className="leading-6">
          Thanks to everyone who participated in the compo. 🎉
          <br /> Stay tuned for more!
        </p>
      </div>
      <div className="flex flex-col gap-2 text-gray-300">
        <Button asChild variant={"link"} className="text-base">
          <a
            className="text-white"
            href="https://www.pouet.net/party_results.php?which=1550&when=2025&font=1"
          >
            {`> Full results on pouet.net`}
          </a>
        </Button>
      </div>
    </div>
  )
}

export function RevisionPromotionCard() {
  return (
    <div className="mx-auto flex w-screen flex-col overflow-hidden border bg-black text-white sm:flex-col md:w-[682px]">
      <div className="relative aspect-video h-48 w-full sm:aspect-video sm:h-48">
        <img
          src="/assets/revision-2025-bg.jpg"
          alt="Revision Promo Background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/assets/revision-2025-logo.png"
            alt="Revision 2025 Logo"
            className="max-h-32 w-auto max-w-[70%] sm:max-w-[50%]"
          />
        </div>
      </div>

      <div className="space-y-4 p-4 px-4 pb-4 pt-2">
        <div className="relative space-y-4">
          <Content />
        </div>
      </div>
    </div>
  )
}
