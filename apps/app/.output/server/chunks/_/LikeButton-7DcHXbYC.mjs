import { jsx, jsxs } from 'react/jsx-runtime';
import { B as Button } from './button-CeG_45YZ.mjs';
import { u as useAuth, s as supabase } from './router-Dgt9epnn.mjs';
import { u as useUsersLikes } from './useUsersLikes-Bs2eUBG1.mjs';
import { c as cn } from './utils-CZo72ztR.mjs';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowUp } from 'lucide-react';
import { useMemo, useCallback } from 'react';
import { toast } from 'sonner';

function LikeButton({ algorithm }) {
  const { user } = useAuth();
  const { data: likesOfUser, isLoading } = useUsersLikes();
  const queryClient = useQueryClient();
  const isLiked = likesOfUser?.includes(algorithm.id);
  const totalLikes = useMemo(() => {
    return algorithm.like_count ?? 0;
  }, [algorithm]);
  const toggleLike = useCallback(async () => {
    if (!user) return;
    const queryKey = ["user-likes", user.id];
    const previousLikes = queryClient.getQueryData(queryKey) ?? [];
    if (!isLiked) {
      queryClient.setQueryData(queryKey, [...previousLikes, algorithm.id]);
      const { error } = await supabase.from("likes").insert([{ algorithm_id: algorithm.id, user_id: user.id }]);
      if (error) {
        queryClient.setQueryData(queryKey, previousLikes);
        console.error("Error liking algorithm:", error);
        toast.error("Error Liking Algorithm: " + error.message);
      }
    } else {
      queryClient.setQueryData(
        queryKey,
        previousLikes.filter((id) => id !== algorithm.id)
      );
      const { error } = await supabase.from("likes").delete().eq("algorithm_id", algorithm.id).eq("user_id", user.id);
      if (error) {
        queryClient.setQueryData(queryKey, previousLikes);
        console.error("Error unliking algorithm:", error);
        toast.error("Error Unliking Algorithm: " + error.message);
      }
    }
  }, [algorithm, user, queryClient, isLiked]);
  if (isLoading) return null;
  return /* @__PURE__ */ jsx("div", { className: "flex flex-row items-center justify-center gap-2", children: /* @__PURE__ */ jsxs(
    Button,
    {
      variant: "ghost",
      onClick: toggleLike,
      className: cn({
        "bg-brand-blue hover:bg-brand-blue/80 text-background": isLiked,
        "pointer-events-none": !user || isLoading
      }),
      children: [
        /* @__PURE__ */ jsx(
          ArrowUp,
          {
            className: "h-4 w-4",
            strokeLinecap: "square",
            strokeLinejoin: "miter"
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("span", { className: "text-sm", children: totalLikes || 0 }) })
      ]
    }
  ) });
}

export { LikeButton as L };
//# sourceMappingURL=LikeButton-7DcHXbYC.mjs.map
