import { supabase } from "@/lib/supabase"
import { useQuery } from "@tanstack/react-query"

export function useQueryAlgorithmIds() {
  return useQuery<number[]>({
    queryKey: ["algorithms", "ids"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("algorithms_with_user_profile")
        .select("id")
      if (error) throw error
      // data is Array<{ id: number | null }>
      return (data ?? [])
        .map((row) => row.id)
        .filter((id): id is number => id !== null)
    },
    staleTime: Infinity,
  })
}
