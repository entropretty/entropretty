import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { useQuery } from "@tanstack/react-query"
import { Profile } from "@/lib/helper.types"

export function useUserProfile() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated")

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .limit(1)
        .single()

      if (error) throw error
      return data as Profile
    },
    enabled: !!user,
  })
}
