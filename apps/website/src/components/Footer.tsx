"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-border bg-secondary/30 border-t">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="font-jersey text-2xl tracking-tight">
              Entropretty
            </Link>
            <p className="text-muted-foreground mt-2 text-sm">
              Powering Polkadot&apos;s Proof of Ink.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-medium">Resources</h4>
            <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="https://app.entropretty.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Launch App
                </a>
              </li>
              <li>
                <Link
                  href="/rules"
                  className="hover:text-foreground transition-colors"
                >
                  Competition Rules
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/entropretty/entropretty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium">Learn</h4>
            <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="https://www.youtube.com/watch?v=xJKjGjiJytA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Introduction Video
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/watch?v=YRBgGEfelnk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Proof of Personhood Interview
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/watch?v=MrWioikibEI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Web3 Citizenship
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium">Community</h4>
            <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="https://x.com/entropretty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  X (Twitter)
                </a>
              </li>
              <li>
                <a
                  href="https://bsky.app/profile/entropretty.bsky.social"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Bluesky
                </a>
              </li>
              <li>
                <a
                  href="https://polkadot.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Polkadot
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-border mt-12 border-t pt-8">
          <p className="text-muted-foreground text-center text-sm">
            Web3 should serve people, not platforms
          </p>
        </div>
      </div>
    </footer>
  )
}
