import { u as useAuth, s as supabase } from './router-Dgt9epnn.mjs';
import { useQuery } from '@tanstack/react-query';

function useUsersLikes() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user-likes", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase.from("likes").select("*").eq("user_id", user.id);
      if (error) throw error;
      return data.map((like) => like.algorithm_id);
    },
    enabled: !!user
  });
}

export { useUsersLikes as u };
//# sourceMappingURL=useUsersLikes-Bs2eUBG1.mjs.map
