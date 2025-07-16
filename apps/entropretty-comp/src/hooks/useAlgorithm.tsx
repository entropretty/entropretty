import { useAlgorithmService } from "@/contexts/service-context"
import { AlgorithmView } from "@/lib/helper.types"
import { supabase } from "@/lib/supabase"
import { useQuery } from "@tanstack/react-query"

export function useAlgorithm(algorithmId: number) {
  const algorithmService = useAlgorithmService()

  return useQuery<AlgorithmView>({
    queryKey: ["algorithm", algorithmId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("algorithms_with_user_profile")
        .select()
        .eq("id", algorithmId)
        .single()

      if (error) throw error
      if (!data) throw new Error("Algorithm not found")

      algorithmService.addAlgorithm(data.id!, data.content!)

      return data as AlgorithmView
    },
    staleTime: Infinity,
  })
}
