import React from "react"

interface HeroBlockProps {
  className?: string
}

export const HeroBlock: React.FC<HeroBlockProps> = ({ className }) => {
  return (
    <section className={`relative min-h-screen w-full ${className}`}>
      {/* Full screen image placeholder */}
      <div className="absolute inset-0 h-full w-full bg-gray-100 dark:bg-gray-800">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          Image Placeholder
        </div>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-between gap-12 px-8 py-24 lg:flex-row">
        <div className="flex max-w-2xl flex-col gap-6">
          <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
            Entropretty
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Discover the Beauty of Algorithmic Art. Immerse yourself in a
            vibrant world where technology meets creativity. Our community
            showcases stunning algorithm-based artwork that pushes the
            boundaries of imagination.
          </p>
          <div className="flex">
            <a
              href="https://entropretty.netlify.app/"
              className="inline-flex items-center bg-black px-6 py-3 text-base font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              LAUNCH Entropretty
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroBlock
