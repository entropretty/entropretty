"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { PastWinterAssemblyEventCard } from "./PastWinterAssemblyEventCard";
import { PastRevision2025EventCard } from "./PastRevision2025EventCard";
import { AssemblySummer2025EventCard } from "./AssemblySummer2025EventCard";

export function EventsSection() {
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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl">Competitions</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Join our competitions to showcase your algorithmic art skills. Win
            prizes and have your designs featured in the Entropretty ecosystem.
          </p>
          <Link
            href="/rules"
            className="mt-4 inline-flex items-center gap-2 text-foreground underline-offset-4 hover:underline"
          >
            Read Competition Rules
            <span>→</span>
          </Link>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0 }}
          >
            <AssemblySummer2025EventCard />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <PastRevision2025EventCard />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <PastWinterAssemblyEventCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
