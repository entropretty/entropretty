import { u as useAuth, s as supabase } from './router-Dgt9epnn.mjs';
import { useQuery } from '@tanstack/react-query';

function useUserProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase.from("profiles").select("*").eq("user_id", user.id).limit(1).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
}

export { useUserProfile as u };
//# sourceMappingURL=useUserProfile-j6YqCSWd.mjs.map
