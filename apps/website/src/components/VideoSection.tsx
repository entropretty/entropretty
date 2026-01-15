"use client"

import { motion } from "motion/react"

const resources = [
  {
    title: "Proof of Personhood with Dr. Gavin Wood - Space Monkeys 178",
    url: "https://www.youtube.com/watch?v=YRBgGEfelnk",
  },
  {
    title: "Web3 Citizenship - Gavin Wood @ Web3 Summit 2024",
    url: "https://www.youtube.com/watch?v=MrWioikibEI",
  },
  {
    title: "Individuality - Gavin Wood @ Web3 Summit 2025",
    url: "https://youtu.be/PV1QP8cJh74?si=zZOQfJCAjWQtJZRj&t=3228",
  },
]

export function VideoSection() {
  return (
    <section id="learn-more" className="border-border border-b">
      <div className="mx-auto max-w-6xl py-16 sm:py-24 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-8 px-4 sm:mb-12 sm:px-6 lg:px-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl">Learn More</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            Discover how Entropretty powers Polkadot&apos;s Project
            Individuality—three years of research into proving personhood
            without compromising privacy. Learn about DIMs, Proof of Ink, and
            the vision for Web3 citizenship.
          </p>
        </motion.div>

        {/* Large Video - edge to edge on mobile */}
        <motion.div
          className="border-border relative aspect-video w-full overflow-hidden border-y sm:mx-6 sm:w-auto sm:border lg:mx-0 lg:border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <iframe
            className="h-full w-full"
            src="https://www.youtube.com/embed/xJKjGjiJytA?si=Hfh0QPLBF_44qX_p"
            title="Why Entropretty?"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </motion.div>

        {/* Related Resources */}
        <motion.div
          className="mt-8 px-4 sm:mt-12 sm:px-6 lg:px-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-muted-foreground text-sm uppercase tracking-wider">
            Related Resources
          </h3>
          <ul className="mt-4 space-y-3">
            {resources.map((resource) => (
              <li key={resource.url}>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-muted-foreground group flex items-start gap-2 transition-colors"
                >
                  <span className="text-muted-foreground">→</span>
                  <span className="underline-offset-4 group-hover:underline">
                    {resource.title}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
