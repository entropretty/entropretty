"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="font-jersey text-2xl tracking-tight">
              Entropretty
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Powering Polkadot&apos;s Proof of Ink.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-medium">Resources</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://app.entropretty.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  Launch App
                </a>
              </li>
              <li>
                <Link
                  href="/rules"
                  className="transition-colors hover:text-foreground"
                >
                  Competition Rules
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/nickreynolds/entropretty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium">Learn</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://www.youtube.com/watch?v=xJKjGjiJytA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  Introduction Video
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/watch?v=YRBgGEfelnk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  Proof of Personhood Interview
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/watch?v=MrWioikibEI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  Web3 Citizenship
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium">Community</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://x.com/entropretty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  X (Twitter)
                </a>
              </li>
              <li>
                <a
                  href="https://bsky.app/profile/entropretty.bsky.social"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  Bluesky
                </a>
              </li>
              <li>
                <a
                  href="https://polkadot.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  Polkadot
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            Web3 should serve people, not platforms
          </p>
        </div>
      </div>
    </footer>
  );
}
