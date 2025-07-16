import React from "react";

interface HeroBlockProps {
  className?: string;
}

export const HeroBlock: React.FC<HeroBlockProps> = ({ className }) => {
  return (
    <section className={`relative min-h-screen w-full ${className}`}>
      {/* Full screen image placeholder */}
      <div className="absolute inset-0 w-full h-full bg-gray-100 dark:bg-gray-800">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          Image Placeholder
        </div>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-8 py-24 gap-12 min-h-screen">
        <div className="flex flex-col gap-6 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
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
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              LAUNCH Entropretty
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBlock;
