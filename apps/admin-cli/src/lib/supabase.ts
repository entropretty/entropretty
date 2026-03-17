import { createClient } from "@supabase/supabase-js"
import { config } from "dotenv"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import type { BenchmarkResult } from "@entropretty/benchmark-core"

// Load environment variables
const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: join(__dirname, "../../.env") })

if (!process.env.SUPABASE_URL) {
  throw new Error("Missing SUPABASE_URL environment variable")
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable")
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
)

export interface Algorithm {
  id: number
  content: string
  family_kind: "Procedural" | "ProceduralAccount" | "ProceduralPersonal"
}

export interface AlgorithmScore {
  algorithm_id: number
  quality_score: number
  benchmark_results: BenchmarkResult
  updated_at?: string
}
