"use client"

import { motion, stagger, useAnimate } from "motion/react"
import { useEffect } from "react"

import { RainbowButton } from "./magicui/rainbow-button"

const HeroBlock = () => {
  const [scope, animate] = useAnimate()

  useEffect(() => {
    animate("div", { opacity: [0, 1] }, { duration: 0.5, delay: stagger(0.08) })
  }, [animate])

  useEffect(() => {
    // Set random playback rates for all floating animation videos between 0.5x and 2x
    const videos = document.querySelectorAll(".floating-animation video")
    videos.forEach((video) => {
      // Generate random speed between 0.5 and 2.0
      const randomSpeed = 0.5 + Math.random() * 1.5
      ;(video as HTMLVideoElement).playbackRate = randomSpeed
    })
  }, [])

  return (
    <div
      className="relative flex h-[70vh] w-dvw items-center justify-center overflow-hidden"
      ref={scope}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/bg-1920p-10s.mp4"
      />
      <div className="absolute inset-0 bg-black/40" />
      <motion.div
        className="z-50 mb-4 flex flex-col items-center space-y-4 text-center md:m-0"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.88, delay: 1.5 }}
      >
        <p className="font-jersey z-50 text-6xl text-white md:text-7xl">
          Entropretty
        </p>
        <a href="https://app.entropretty.com/">
          <RainbowButton className="text-lg transition-transform hover:scale-105">
            Launch App
          </RainbowButton>
        </a>
      </motion.div>
    </div>
  )
}

export default HeroBlock
