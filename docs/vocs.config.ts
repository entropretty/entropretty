import { defineConfig } from "vocs"

export default defineConfig({
  title: "Entropretty",
  description: "Beautiful visualizations of entropy",
  basePath: "/entropretty",
  rootDir: ".",
  sidebar: [
    {
      text: "Getting Started",
      link: "/getting-started",
    },
    {
      text: "Benchmarking",
      items: [
        { text: "Overview", link: "/benchmarking" },
        { text: "Compliance Rules", link: "/benchmarking/compliance-rules" },
        { text: "Scoring", link: "/benchmarking/scoring" },
        { text: "Seed Strategies", link: "/benchmarking/seed-strategies" },
        { text: "Rule Registry", link: "/benchmarking/rule-registry" },
      ],
    },
  ],
})
