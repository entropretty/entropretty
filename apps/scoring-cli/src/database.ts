import { supabase, type Algorithm, type AlgorithmScore } from "./supabase"

export async function getUnscoredAlgorithms(): Promise<Algorithm[]> {
  // First get all scored algorithm IDs
  const { data: scoredIds, error: scoreError } = await supabase
    .from("algorithm_scores")
    .select("algorithm_id")

  if (scoreError) throw scoreError

  const scoredAlgorithmIds = scoredIds.map((row) => row.algorithm_id)

  // Then get all algorithms not in that list
  let query = supabase.from("algorithms").select("id, content, family_kind")

  if (scoredAlgorithmIds.length > 0) {
    query = query.not("id", "in", `(${scoredAlgorithmIds.join(",")})`)
  }

  const { data, error } = await query

  if (error) throw error
  return data as Algorithm[]
}

export async function getAllAlgorithms(): Promise<Algorithm[]> {
  const { data, error } = await supabase
    .from("algorithms")
    .select("id, content, family_kind")

  if (error) throw error
  return data as Algorithm[]
}

export async function getAlgorithmById(id: number): Promise<Algorithm | null> {
  const { data, error } = await supabase
    .from("algorithms")
    .select("id, content, family_kind")
    .eq("id", id)
    .single()

  if (error) throw error
  return data as Algorithm
}

export async function getAlgorithmsOlderThan(
  days: number,
): Promise<Algorithm[]> {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  const { data, error } = await supabase
    .from("algorithm_scores")
    .select("algorithm_id")
    .lt("updated_at", cutoffDate.toISOString())

  if (error) throw error

  const algorithmIds = data.map((row) => row.algorithm_id)
  if (algorithmIds.length === 0) return []

  const { data: algorithms, error: algoError } = await supabase
    .from("algorithms")
    .select("id, content, family_kind")
    .in("id", algorithmIds)

  if (algoError) throw algoError
  return algorithms as Algorithm[]
}

export async function upsertAlgorithmScore(
  score: AlgorithmScore,
): Promise<void> {
  const { error } = await supabase.from("algorithm_scores").upsert(
    {
      algorithm_id: score.algorithm_id,
      quality_score: score.quality_score,
      benchmark_results: score.benchmark_results,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "algorithm_id",
    },
  )

  if (error) throw error
}
