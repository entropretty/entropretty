import { jsxs, jsx } from 'react/jsx-runtime';
import { A as AlgorithmCardSkeleton, a as AlgorithmCard } from './AlgorithmCardSkeleton-C77E4bUX.mjs';
import { b as useAlgorithmService, s as supabase } from './router-Dgt9epnn.mjs';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useParams } from '@tanstack/react-router';
import './LikeButton-7DcHXbYC.mjs';
import './button-CeG_45YZ.mjs';
import '@radix-ui/react-slot';
import 'class-variance-authority';
import './utils-CZo72ztR.mjs';
import 'clsx';
import 'tailwind-merge';
import './useUsersLikes-Bs2eUBG1.mjs';
import 'lucide-react';
import 'sonner';
import './AlgorithmInfo-CxZKPX1g.mjs';
import './FamilyKindBadge-8clZ-XnL.mjs';
import './AlgorithmBitmap-CIcD_7lU.mjs';
import './index-CWNUk7Yv.mjs';
import './skeleton-CSd4mn2E.mjs';
import 'react-helmet-async';
import 'comlink';
import 'p-queue';
import '@supabase/supabase-js';
import 'next-themes';

const PAGE_SIZE = 3;
function useUserAlgorithms(username) {
  const algorithmService = useAlgorithmService();
  return useInfiniteQuery({
    queryKey: ["algorithms", "user", username],
    enabled: !!username,
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error } = await supabase.from("algorithms_with_user_profile").select().eq("username", username).order("created_at", { ascending: false }).range(from, to);
      if (data) {
        for (const algorithm of data) {
          algorithmService.addAlgorithm(
            algorithm.id,
            algorithm.content,
            algorithm.family_kind
          );
        }
      }
      if (error) throw error;
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === PAGE_SIZE ? allPages.length : void 0;
    }
  });
}
function UserPage() {
  const { username } = useParams({ from: "/_layout/u/$username" });
  const { ref, inView } = useInView();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useUserAlgorithms(username);
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);
  if (!username) {
    return /* @__PURE__ */ jsxs("div", { children: [
      "No user with username ",
      username,
      " found"
    ] });
  }
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "mx-auto my-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx(AlgorithmCardSkeleton, {}),
      /* @__PURE__ */ jsx(AlgorithmCardSkeleton, {})
    ] }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "mx-auto my-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    data?.pages.map(
      (page) => page.map((algorithm) => /* @__PURE__ */ jsx(AlgorithmCard, { algorithm }, algorithm.id))
    ),
    /* @__PURE__ */ jsx("div", { ref, className: "py-4 text-center", children: isFetchingNextPage ? /* @__PURE__ */ jsx("div", { children: "Loading more..." }) : hasNextPage ? /* @__PURE__ */ jsx("div", { children: "Load more" }) : /* @__PURE__ */ jsx("div", { children: "No more algorithms" }) })
  ] }) });
}
const SplitComponent = UserPage;

export { SplitComponent as component };
//# sourceMappingURL=u._username-BFSeYaYd.mjs.map
