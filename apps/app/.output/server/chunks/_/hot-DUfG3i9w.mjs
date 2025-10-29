import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { A as AlgorithmCardSkeleton, a as AlgorithmCard } from './AlgorithmCardSkeleton-C77E4bUX.mjs';
import { F as FamilyKindFilter, f as familyKindFilterAtom } from './FamilyKindFilter-BO9I_PQH.mjs';
import { u as useAuth, b as useAlgorithmService, s as supabase } from './router-Dgt9epnn.mjs';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { F as FeedbackDialog } from './index-BUYfvkjm.mjs';
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
import '@tanstack/react-router';
import './FamilyKindBadge-8clZ-XnL.mjs';
import './AlgorithmBitmap-CIcD_7lU.mjs';
import './index-CWNUk7Yv.mjs';
import './skeleton-CSd4mn2E.mjs';
import 'jotai/utils';
import './select-BK0MCkcO.mjs';
import '@radix-ui/react-select';
import '@radix-ui/react-icons';
import 'react-helmet-async';
import 'comlink';
import 'p-queue';
import '@supabase/supabase-js';
import 'next-themes';
import 'react-hook-form';
import './label-DtJL4vlD.mjs';
import '@radix-ui/react-label';
import '@hookform/resolvers/zod';
import 'motion/react';
import 'zod';
import 'react-use-measure';

const PAGE_SIZE = 3;
function useHotAlgorithms() {
  const algorithmService = useAlgorithmService();
  const familyKindFilter = useAtomValue(familyKindFilterAtom);
  return useInfiniteQuery({
    queryKey: ["algorithms", "hot", familyKindFilter],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      let query = supabase.from("algorithms_with_user_profile").select().order("like_count", { ascending: false }).order("id", { ascending: true }).gt("like_count", 0);
      if (familyKindFilter !== "All") {
        query = query.eq("family_kind", familyKindFilter);
      }
      const { data, error } = await query.range(from, to);
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
function Feed() {
  const { ref, inView } = useInView();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useHotAlgorithms();
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);
  if (isLoading) {
    return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx(AlgorithmCardSkeleton, {}),
      /* @__PURE__ */ jsx(AlgorithmCardSkeleton, {})
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    data?.pages.map(
      (page) => page.map((algorithm) => /* @__PURE__ */ jsx(AlgorithmCard, { algorithm }, algorithm.id))
    ),
    /* @__PURE__ */ jsx("div", { ref, className: "py-4 text-center", children: isFetchingNextPage ? /* @__PURE__ */ jsx("div", { children: "Loading more..." }) : hasNextPage ? /* @__PURE__ */ jsx("div", { children: "Load more" }) : /* @__PURE__ */ jsx("div", { children: "No more rated algorithms" }) })
  ] });
}
function HotPage() {
  const { user } = useAuth();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    user && /* @__PURE__ */ jsx(FeedbackDialog, { className: "fixed bottom-4 left-4 z-50" }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto my-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx(FamilyKindFilter, {}),
      /* @__PURE__ */ jsx(Feed, {})
    ] }) })
  ] });
}
const SplitComponent = HotPage;

export { SplitComponent as component };
//# sourceMappingURL=hot-DUfG3i9w.mjs.map
