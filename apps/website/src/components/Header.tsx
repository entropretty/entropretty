"use client";

import Link from "next/link";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-jersey text-2xl tracking-tight">
          Entropretty
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" asChild className="text-sm">
            <Link href="/rules">Rules</Link>
          </Button>
          <Button variant="ghost" asChild className="text-sm">
            <a
              href="https://github.com/nickreynolds/entropretty"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </Button>
          <Button asChild className="text-sm">
            <a href="https://app.entropretty.com/">Launch App</a>
          </Button>
        </nav>
      </div>
    </header>
  );
}
