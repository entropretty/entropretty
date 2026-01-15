"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Marquee } from "@/components/magicui/marquee";

const useWebMTransparencySupport = () => {
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      setIsSupported(false);
    }
  }, []);

  return isSupported;
};

const videos = [
  "inkflow.webm",
  "star.webm",
  "EntropySymbolizer.webm",
  "hex.webm",
  "squidlink.webm",
  "dial.webm",
  "circles.webm",
  "sprite.webm",
  "maze.webm",
  "sonarcompass.webm",
  "truthy.webm",
  "gummiring.webm",
  "planet.webm",
  "circlebara.webm",
  "clock.webm",
  "roman.webm",
  "lines.webm",
  "bloom.webm",
  "squares.webm",
  "lemonjelly.webm",
  "wave2.webm",
  "80tiesSpriteGenerator.webm",
  "confusedeyeball.webm",
  "tilesoflisbon.webm",
  "musicalnotes.webm",
];

const firstRow = videos.slice(0, Math.ceil(videos.length / 2));
const secondRow = videos.slice(Math.ceil(videos.length / 2));

const VideoCard = ({ filename }: { filename: string }) => {
  return (
    <div className="relative mx-2 h-24 w-24 cursor-pointer overflow-hidden border border-border sm:h-32 sm:w-32">
      <video
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={`/design-videos/${filename}`} type="video/webm" />
      </video>
    </div>
  );
};

export function Showcase() {
  const webMTransparencySupported = useWebMTransparencySupport();

  if (!webMTransparencySupported) {
    return null;
  }

  return (
    <section className="border-b border-border bg-secondary/30">
      <div className="py-16 sm:py-24">
        <motion.div
          className="mx-auto mb-12 max-w-6xl px-4 sm:mb-16 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl">
            Community Designs
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Explore algorithms created by the community. Each design transforms
            entropy into unique, recognizable patterns.
          </p>
        </motion.div>

        <div className="relative flex w-full flex-col items-center justify-center gap-4 overflow-hidden">
          <Marquee pauseOnHover className="[--duration:50s]">
            {firstRow.map((filename) => (
              <VideoCard key={filename} filename={filename} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:50s]">
            {secondRow.map((filename) => (
              <VideoCard key={filename} filename={filename} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background to-transparent sm:w-1/4" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background to-transparent sm:w-1/4" />
        </div>
      </div>
    </section>
  );
}
