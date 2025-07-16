"use client";

import { motion, stagger, useAnimate } from "motion/react";
import { useEffect } from "react";

import { RainbowButton } from "./magicui/rainbow-button";

const HeroBlock = () => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(
      "div",
      { opacity: [0, 1] },
      { duration: 0.5, delay: stagger(0.08) }
    );
  }, [animate]);

  useEffect(() => {
    // Set random playback rates for all floating animation videos between 0.5x and 2x
    const videos = document.querySelectorAll(".floating-animation video");
    videos.forEach((video) => {
      // Generate random speed between 0.5 and 2.0
      const randomSpeed = 0.5 + Math.random() * 1.5;
      (video as HTMLVideoElement).playbackRate = randomSpeed;
    });
  }, []);

  return (
    <div
      className="flex w-dvw justify-center items-center overflow-hidden relative h-[70vh]"
      ref={scope}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/bg-1920p-10s.mp4"
      />
      <div className="absolute inset-0 bg-black/40" />
      <motion.div
        className="z-50 text-center space-y-4 items-center flex flex-col mb-4 md:m-0"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.88, delay: 1.5 }}
      >
        <p className="text-6xl text-white md:text-7xl z-50 font-jersey">
          Entropretty
        </p>
        <a href="https://app.entropretty.com/">
          <RainbowButton className="hover:scale-105 transition-transform text-lg">
            Launch App{" "}
            <span className="pl-1 text-brand-blue text-sm pb-4 font-jersey">
              BETA
            </span>
          </RainbowButton>
        </a>
      </motion.div>
    </div>
  );
};

export default HeroBlock;
