"use client";

import { motion } from "motion/react";
import { Button } from "./ui/button";

export function Hero() {
  const scrollToLearnMore = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("learn-more");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative border-b border-border">
      <div className="mx-auto max-w-6xl lg:px-8">
        <div className="grid gap-0 lg:grid-cols-2 lg:gap-16 lg:py-32">
          {/* Left: Content */}
          <motion.div
            className="flex flex-col justify-center px-4 py-16 sm:px-6 sm:py-24 lg:py-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-jersey text-5xl sm:text-6xl lg:text-7xl">
              Entropretty
            </h1>
            <p className="mt-4 max-w-lg text-lg text-muted-foreground sm:mt-6 sm:text-xl">
              Algorithmic art powering Polkadot&apos;s Proof of Ink. Generate
              billions of unique visual identities that prove you&apos;re human
              without revealing who you are.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <a href="https://app.entropretty.com/">LAUNCH APP</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#learn-more" onClick={scrollToLearnMore}>
                  WATCH VIDEO
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Right: Video Preview */}
          <motion.div
            className="relative aspect-square w-full overflow-hidden border-t border-border lg:aspect-auto lg:h-full lg:min-h-[400px] lg:border lg:border-t"
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
