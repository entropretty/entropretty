"use client";

import { motion } from "motion/react";

const features = [
  {
    title: "Proof of Personhood",
    description:
      "Generate unique visual identities that help verify human uniqueness in digital systems without compromising privacy.",
  },
  {
    title: "Algorithmic Art",
    description:
      "Create beautiful, deterministic art from entropy. Each piece is procedurally generated and completely reproducible.",
  },
  {
    title: "Human Recognizable",
    description:
      "Designs optimized for human perception. Easy to recognize, remember, and verify at a glance.",
  },
  {
    title: "Open Source",
    description:
      "Built in the open. Explore the code, contribute algorithms, and join a community of creators.",
  },
];

export function Features() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <motion.div
          className="mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl">Why Entropretty?</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Entropretty creates visual fingerprints from random data, making it
            easy for humans to recognize and verify identity without relying on
            text or numbers.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="border border-border p-6 sm:p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-xl">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
