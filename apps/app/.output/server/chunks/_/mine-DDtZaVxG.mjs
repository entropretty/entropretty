import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { A as AlgorithmInfo } from './AlgorithmInfo-CxZKPX1g.mjs';
import { B as Button } from './button-CeG_45YZ.mjs';
import { u as useAuth, b as useAlgorithmService, s as supabase } from './router-Dgt9epnn.mjs';
import { useInfiniteQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'motion/react';
import useMeasure from 'react-use-measure';
import { F as FamilyKindBadge } from './FamilyKindBadge-8clZ-XnL.mjs';
import { A as AlgorithmBitmap } from './AlgorithmBitmap-CIcD_7lU.mjs';
import { g as getSeed, s as seedToKey } from './index-CWNUk7Yv.mjs';
import { Navigate, Link } from '@tanstack/react-router';
import { useInView } from 'react-intersection-observer';
import { F as FeedbackDialog } from './index-BUYfvkjm.mjs';
import '@radix-ui/react-slot';
import 'class-variance-authority';
import './utils-CZo72ztR.mjs';
import 'clsx';
import 'tailwind-merge';
import 'react-helmet-async';
import 'comlink';
import 'p-queue';
import '@supabase/supabase-js';
import 'next-themes';
import 'react-hook-form';
import './label-DtJL4vlD.mjs';
import '@radix-ui/react-label';
import '@hookform/resolvers/zod';
import 'zod';

function DeleteButton({ algorithm }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isConfirming, setIsConfirming] = useState(false);
  const [ref, bounds] = useMeasure();
  const canDelete = user?.id === algorithm.user_id;
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!user || !canDelete) throw new Error("Unauthorized");
      const { error } = await supabase.from("algorithms").delete().eq("id", algorithm.id).eq("user_id", user.id);
      if (error) throw error;
      return algorithm.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["algorithms"] });
      toast.success("Algorithm deleted successfully");
      setIsConfirming(false);
    },
    onError: (error) => {
      console.error("Error deleting algorithm:", error);
      toast.error("Error Deleting Algorithm: " + error.message);
      setIsConfirming(false);
    }
  });
  useEffect(() => {
    let timeoutId;
    if (isConfirming) {
      timeoutId = setTimeout(() => {
        setIsConfirming(false);
      }, 3e3);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isConfirming]);
  const handleClick = useCallback(() => {
    if (isConfirming) {
      deleteMutation.mutate();
    } else {
      setIsConfirming(true);
    }
  }, [isConfirming, deleteMutation]);
  if (!canDelete) return null;
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      className: "overflow-hidden",
      animate: {
        width: bounds.width
      },
      transition: { duration: 0.1, type: "spring" },
      children: /* @__PURE__ */ jsx(
        Button,
        {
          variant: isConfirming ? "destructive" : "ghost",
          onMouseDown: handleClick,
          ref,
          disabled: deleteMutation.isPending,
          className: "gap-2 transition-colors",
          children: deleteMutation.isPending ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
            motion.div,
            {
              layout: true,
              initial: { opacity: 0, width: "100%" },
              animate: { opacity: 1, width: "auto" },
              exit: { opacity: 0, width: "100%" },
              transition: { duration: 0.2 },
              children: isConfirming ? "YES, DELETE!" : "DELETE"
            },
            isConfirming ? "confirm" : "delete"
          ) })
        }
      )
    }
  );
}
function AlgorithmRow({ algorithm }) {
  const { user } = useAuth();
  const seed = useMemo(() => {
    return [...getSeed(algorithm.family_kind)];
  }, [algorithm.family_kind]);
  if (!algorithm.id) return null;
  return /* @__PURE__ */ jsxs("div", { className: "bg-background border-background-200 relative flex w-full items-center justify-between gap-4 border p-2", children: [
    /* @__PURE__ */ jsx(
      FamilyKindBadge,
      {
        familyKind: algorithm.family_kind,
        className: "absolute bottom-0 left-0 z-10"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        AlgorithmBitmap,
        {
          algorithmId: algorithm.id,
          seed,
          size: 68,
          scale: 2
        },
        seedToKey(seed)
      ) }),
      /* @__PURE__ */ jsx(AlgorithmInfo, { algorithm })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Button, { asChild: true, variant: "link", children: /* @__PURE__ */ jsx(Link, { to: `/a/${algorithm.id}`, children: `VIEW` }) }),
      user && /* @__PURE__ */ jsx(Button, { asChild: true, variant: "link", children: /* @__PURE__ */ jsx(Link, { to: `/create?remix=${algorithm.id}`, children: `REMIX` }) }),
      /* @__PURE__ */ jsx(DeleteButton, { algorithm })
    ] })
  ] });
}
const PAGE_SIZE = 3;
function useUserIdAlgorithms(userId) {
  const algorithmService = useAlgorithmService();
  return useInfiniteQuery({
    queryKey: ["algorithms", "user-id", userId],
    enabled: !!userId,
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error } = await supabase.from("algorithms_with_user_profile").select().eq("user_id", userId).order("created_at", { ascending: false }).range(from, to);
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
function Mine() {
  const { user } = useAuth();
  const { ref, inView } = useInView();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useUserIdAlgorithms(user?.id);
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);
  if (!user) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/login" });
  }
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex w-full max-w-4xl flex-col gap-4 p-4", children: "Loading..." });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    user && /* @__PURE__ */ jsx(FeedbackDialog, { className: "fixed bottom-4 left-4 z-50" }),
    /* @__PURE__ */ jsxs("div", { className: "flex w-full max-w-4xl flex-col gap-4 p-4", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "My Algorithms" }),
      /* @__PURE__ */ jsx(AnimatePresence, { children: data?.pages.map(
        (page) => page.map((algorithm) => /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 1, filter: "blur(0px)" },
            exit: {
              opacity: 0,
              filter: "blur(4px)",
              transition: { duration: 0.3, ease: "easeInOut" }
            },
            layout: true,
            children: /* @__PURE__ */ jsx(AlgorithmRow, { algorithm })
          },
          algorithm.id
        ))
      ) })
    ] }),
    /* @__PURE__ */ jsx("div", { ref, className: "py-4 text-center", children: isFetchingNextPage ? /* @__PURE__ */ jsx("div", { children: "Loading more..." }) : hasNextPage ? /* @__PURE__ */ jsx("div", { children: "Load more" }) : data?.pages[0].length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500", children: "You haven't created any algorithms yet." }) : /* @__PURE__ */ jsx("div", { children: "No more algorithms" }) })
  ] });
}
const SplitComponent = Mine;

export { SplitComponent as component };
//# sourceMappingURL=mine-DDtZaVxG.mjs.map
