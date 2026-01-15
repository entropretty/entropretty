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
              Algorithmic art for proof of personhood.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-medium">Resources</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
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
            <h4 className="text-sm font-medium">App</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://app.entropretty.com/"
                  className="transition-colors hover:text-foreground"
                >
                  Launch App
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            Built for the Web3 community
          </p>
        </div>
      </div>
    </footer>
  );
}
