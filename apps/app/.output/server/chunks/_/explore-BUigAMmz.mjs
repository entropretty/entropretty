import { jsx, jsxs } from 'react/jsx-runtime';
import { G as GalleryAlgorithm } from './GalleryAlgorithm-Ddez0jC4.mjs';
import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { s as supabase } from './router-Dgt9epnn.mjs';
import { useQuery } from '@tanstack/react-query';
import './useAlgorithm-CZ_W-qjG.mjs';
import './FamilyKindBadge-8clZ-XnL.mjs';
import './utils-CZo72ztR.mjs';
import 'clsx';
import 'tailwind-merge';
import 'class-variance-authority';
import './button-CeG_45YZ.mjs';
import '@radix-ui/react-slot';
import './AlgorithmBitmap-CIcD_7lU.mjs';
import './index-CWNUk7Yv.mjs';
import './skeleton-CSd4mn2E.mjs';
import '@tanstack/react-router';
import './useUsersLikes-Bs2eUBG1.mjs';
import 'lucide-react';
import 'sonner';
import 'react-helmet-async';
import 'comlink';
import 'p-queue';
import '@supabase/supabase-js';
import 'next-themes';

function useTopAlgorithmIds() {
  return useQuery({
    queryKey: ["algorithms", "ids", "top-scored"],
    queryFn: async () => {
      const { data, error } = await supabase.from("algorithm_scores").select(
        "algorithm_id, quality_score, algorithms_with_user_profile!inner(id)"
      ).order("quality_score", { ascending: false }).order("algorithm_id", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => row.algorithm_id).filter((id) => id !== null);
    },
    staleTime: 5 * 60 * 1e3
    // 5 minutes - scores don't change often
  });
}
function ExploreGallery() {
  const [algorithmIds, setAlgorithmIds] = useState([]);
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "400px"
    // Start loading more content before reaching the bottom
  });
  const { data: availableAlgorithmIds } = useTopAlgorithmIds();
  console.log({ algorithmIds, availableAlgorithmIds });
  useEffect(() => {
    if (!availableAlgorithmIds) return;
    const initialSet = availableAlgorithmIds.slice(0, 128);
    setAlgorithmIds(initialSet);
  }, [availableAlgorithmIds]);
  const loadMore = useCallback(() => {
    if (!availableAlgorithmIds) return;
    const currentCount = algorithmIds.length;
    const nextBatch = availableAlgorithmIds.slice(
      currentCount,
      currentCount + 64
    );
    if (nextBatch.length > 0) {
      setAlgorithmIds((prev) => [...prev, ...nextBatch]);
    }
  }, [availableAlgorithmIds, algorithmIds.length]);
  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);
  return /* @__PURE__ */ jsx("div", { className: "mx-auto my-4", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 justify-center gap-4 md:grid-cols-2 lg:grid-cols-3", children: [
    algorithmIds.map((id, index) => /* @__PURE__ */ jsx(GalleryAlgorithm, { algorithmId: id }, `${id}-${index}`)),
    /* @__PURE__ */ jsx("div", { ref, className: "h-4 w-full" })
  ] }) });
}
function Page() {
  return /* @__PURE__ */ jsx("div", { className: "flex h-screen w-full flex-col", children: /* @__PURE__ */ jsx(ExploreGallery, {}) });
}
const SplitComponent = Page;

export { SplitComponent as component };
//# sourceMappingURL=explore-BUigAMmz.mjs.map
