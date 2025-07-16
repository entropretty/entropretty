import { useAuth } from "@/contexts/auth-context"
import { AlgorithmView } from "@/lib/helper.types"
import { supabase } from "@/lib/supabase"
import { useQuery } from "@tanstack/react-query"

export function useUsersLikes() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ["user-likes", user?.id],
    queryFn: async () => {
      if (!user) return []

      const { data, error } = await supabase
        .from("likes")
        .select("*")
        .eq("user_id", user.id)

      if (error) throw error
      return data.map((like) => like.algorithm_id) as AlgorithmView["id"][]
    },
    enabled: !!user,
  })
}
