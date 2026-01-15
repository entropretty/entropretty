"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { Marquee } from "@/components/magicui/marquee"

const useWebMTransparencySupport = () => {
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    if (isSafari) {
      setIsSupported(false)
    }
  }, [])

  return isSupported
}

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
]

const firstRow = videos.slice(0, Math.ceil(videos.length / 2))
const secondRow = videos.slice(Math.ceil(videos.length / 2))

const VideoCard = ({ filename }: { filename: string }) => {
  return (
    <div className="border-border/50 relative h-28 w-28 cursor-pointer overflow-hidden border-r px-3 sm:h-36 sm:w-36 sm:px-4">
      <video
        className="h-full w-full object-contain"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={`/design-videos/${filename}`} type="video/webm" />
      </video>
    </div>
  )
}

export function Showcase() {
  const webMTransparencySupported = useWebMTransparencySupport()

  if (!webMTransparencySupported) {
    return null
  }

  return (
    <section className="border-border bg-secondary/30 border-b">
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
          <p className="text-muted-foreground mt-4 max-w-2xl">
            Explore algorithms created by the community. Each design transforms
            entropy into unique, recognizable patterns.
          </p>
        </motion.div>

        <div className="border-border relative flex w-full flex-col items-center justify-center overflow-hidden border-y">
          <Marquee reverse pauseOnHover className="[--duration:40s]">
            {firstRow.map((filename) => (
              <VideoCard key={filename} filename={filename} />
            ))}
          </Marquee>
          <div className="h-0 w-full border-y" />
          <Marquee pauseOnHover className="[--duration:40s]">
            {secondRow.map((filename) => (
              <VideoCard key={filename} filename={filename} />
            ))}
          </Marquee>
          <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r to-transparent sm:w-1/4" />
          <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l to-transparent sm:w-1/4" />
        </div>
      </div>
    </section>
  )
}
