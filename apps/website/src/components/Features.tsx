"use client"

import { motion } from "motion/react"

const features = [
  {
    title: "Sybil Resistant",
    description:
      "Combat the digital identity crisis. Entropretty powers Polkadot's Proof of Ink—a privacy-preserving way to prove you're a unique human without invasive KYC.",
  },
  {
    title: "Billions of Designs",
    description:
      "The blockchain generates billions of unique geometric patterns. Each person receives 100 designs unique only to them—impossible to duplicate or forge.",
  },
  {
    title: "Human Recognizable",
    description:
      "Optimized for human perception, not machines. Easy to recognize, remember, and verify at a glance—because identity should be human-first.",
  },
  {
    title: "Privacy by Design",
    description:
      "A proof that does not identify you. No personal information required—just mathematical proof that you're one unique person in the system.",
  },
]

export function Features() {
  return (
    <section className="border-border border-b">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <motion.div
          className="mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl">Why Entropretty?</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            Web3 should serve people, not platforms. Entropretty is the
            algorithmic art engine behind Polkadot&apos;s proof of
            personhood—creating visual identities that let you prove you&apos;re
            human without sacrificing privacy.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="border-border border p-6 sm:p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-xl">{feature.title}</h3>
              <p className="text-muted-foreground mt-2">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
