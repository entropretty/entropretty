"use client";

import { motion } from "motion/react";
import { Button } from "./ui/button";

export function Hero() {
  return (
    <section className="relative border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Content */}
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-jersey text-5xl sm:text-6xl lg:text-7xl">
              Entropretty
            </h1>
            <p className="mt-4 max-w-lg text-lg text-muted-foreground sm:mt-6 sm:text-xl">
              Algorithmic art for proof of personhood. Create unique visual
              identities from entropy that are beautiful, recognizable, and
              impossible to forge.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <a href="https://app.entropretty.com/">Launch App</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a
                  href="https://www.youtube.com/watch?v=xJKjGjiJytA"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch Video
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Right: Video Preview */}
          <motion.div
            className="relative aspect-square overflow-hidden border border-border lg:aspect-auto lg:h-full lg:min-h-[400px]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
              src="/videos/bg-1920p-10s.mp4"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
