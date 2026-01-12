import { supabase, type Algorithm } from "./supabase"

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

export async function getAllAlgorithmIds(): Promise<number[]> {
  const { data, error } = await supabase
    .from("algorithms")
    .select("id")
    .order("id", { ascending: true })

  if (error) throw error
  return data.map((row) => row.id)
}
