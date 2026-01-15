"use client";

import { motion } from "motion/react";

const resources = [
  {
    title: "Web3 Citizenship - Gavin Wood @ Web3 Summit 2024",
    url: "https://www.youtube.com/watch?v=MrWioikibEI",
  },
  {
    title: "Proof of Personhood with Dr. Gavin Wood - Space Monkeys 178",
    url: "https://www.youtube.com/watch?v=YRBgGEfelnk",
  },
];

export function VideoSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Video */}
          <motion.div
            className="relative aspect-video overflow-hidden border border-border"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
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

          {/* Content */}
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl">Learn More</h2>
            <p className="mt-4 text-muted-foreground">
              Discover how Entropretty fits into the broader vision of Web3
              identity and proof of personhood. Learn about the technology and
              research behind human-recognizable visual identities.
            </p>

            <div className="mt-8">
              <h3 className="text-sm uppercase tracking-wider text-muted-foreground">
                Related Resources
              </h3>
              <ul className="mt-4 space-y-3">
                {resources.map((resource) => (
                  <li key={resource.url}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-2 text-foreground transition-colors hover:text-muted-foreground"
                    >
                      <span className="text-muted-foreground">→</span>
                      <span className="underline-offset-4 group-hover:underline">
                        {resource.title}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
