import { b as useAlgorithmService, s as supabase } from './router-Dgt9epnn.mjs';
import { useQuery } from '@tanstack/react-query';

function useAlgorithm(algorithmId) {
  const algorithmService = useAlgorithmService();
  return useQuery({
    queryKey: ["algorithm", algorithmId],
    queryFn: async () => {
      const { data, error } = await supabase.from("algorithms_with_user_profile").select().eq("id", algorithmId).single();
      if (error) throw error;
      if (!data) throw new Error("Algorithm not found");
      algorithmService.addAlgorithm(data.id, data.content, data.family_kind);
      return data;
    },
    staleTime: Infinity
  });
}

export { useAlgorithm as u };
//# sourceMappingURL=useAlgorithm-CZ_W-qjG.mjs.map
