import { jsx, jsxs } from 'react/jsx-runtime';
import { B as Button } from './button-CeG_45YZ.mjs';
import { u as useAuth } from './router-Dgt9epnn.mjs';
import { A as AlgorithmBitmap } from './AlgorithmBitmap-CIcD_7lU.mjs';
import { u as useDisplaySizes, S as Skeleton } from './skeleton-CSd4mn2E.mjs';
import { s as seedToKey, g as getSeed, d as deriveSeedFamily } from './index-CWNUk7Yv.mjs';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { useParams, Link } from '@tanstack/react-router';
import { L as LikeButton } from './LikeButton-7DcHXbYC.mjs';
import { A as AlgorithmInfo } from './AlgorithmInfo-CxZKPX1g.mjs';
import { F as FamilyKindBadge } from './FamilyKindBadge-8clZ-XnL.mjs';
import { u as useAlgorithm } from './useAlgorithm-CZ_W-qjG.mjs';
import '@radix-ui/react-slot';
import 'class-variance-authority';
import './utils-CZo72ztR.mjs';
import 'clsx';
import 'tailwind-merge';
import 'react-helmet-async';
import '@tanstack/react-query';
import 'comlink';
import 'p-queue';
import '@supabase/supabase-js';
import 'next-themes';
import 'sonner';
import './useUsersLikes-Bs2eUBG1.mjs';
import 'lucide-react';

function AutoScrollButton({
  className = "",
  scrollAmount = 2,
  scrollInterval = 16
  // ~60fps
}) {
  const [isScrolling, setIsScrolling] = useState(false);
  const intervalRef = useRef(null);
  const startScrolling = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      window.scrollBy(0, scrollAmount);
    }, scrollInterval);
  }, [scrollAmount, scrollInterval]);
  const stopScrolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  const toggleScrolling = useCallback(() => {
    if (isScrolling) {
      stopScrolling();
      setIsScrolling(false);
    } else {
      startScrolling();
      setIsScrolling(true);
    }
  }, [isScrolling, startScrolling, stopScrolling]);
  useEffect(() => {
    return () => {
      stopScrolling();
    };
  }, [stopScrolling]);
  return /* @__PURE__ */ jsx(
    Button,
    {
      variant: isScrolling ? void 0 : "ghost",
      onClick: toggleScrolling,
      className,
      children: isScrolling ? "STOP" : "SCROLL"
    }
  );
}
const getSeedFamily = (kind, amount) => {
  const initial = getSeed(kind);
  const family = deriveSeedFamily(initial, {
    size: amount
  });
  return family;
};
function AlgorithmInfiniteGrid({
  algorithm,
  className = ""
}) {
  const [seeds, setSeeds] = useState([]);
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "400px"
    // Start loading more content before reaching the bottom
  });
  const { infinite } = useDisplaySizes();
  useEffect(() => {
    const families = Array.from(
      { length: 8 },
      () => getSeedFamily(algorithm.family_kind, 8)
    );
    const combinedFamily = families.reduce((acc, curr) => acc.concat(curr), []);
    setSeeds(combinedFamily);
  }, [algorithm.family_kind]);
  const loadMore = useCallback(() => {
    if (seeds.length === 0) return;
    const families = Array.from(
      { length: 3 },
      () => getSeedFamily(algorithm.family_kind, 8)
    );
    const combinedFamily = families.reduce((acc, curr) => acc.concat(curr), []);
    setSeeds((prev) => [...prev, ...combinedFamily.map((s) => [...s])]);
  }, [algorithm.family_kind, seeds.length]);
  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);
  return /* @__PURE__ */ jsx("div", { className: "relative flex flex-col", children: /* @__PURE__ */ jsxs("div", { className: `flex w-full flex-col ${className} relative`, children: [
    /* @__PURE__ */ jsx("div", { className: "h-full w-full p-4", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex w-full flex-wrap items-center justify-evenly gap-4 sm:gap-16", children: [
      seeds.map((seed) => /* @__PURE__ */ jsx(
        AlgorithmBitmap,
        {
          algorithmId: algorithm.id,
          seed,
          size: infinite,
          scale: 2
        },
        seedToKey(seed)
      )),
      /* @__PURE__ */ jsx("div", { ref, className: "h-4 w-full" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-background border-background-200 fixed bottom-0 left-0 right-0 flex w-full items-center justify-between gap-8 gap-y-2 border p-4 pb-8 text-gray-600 sm:pb-4", children: [
      /* @__PURE__ */ jsx(
        FamilyKindBadge,
        {
          familyKind: algorithm.family_kind,
          className: "absolute left-0 top-[-22px] z-10"
        }
      ),
      /* @__PURE__ */ jsx(AlgorithmInfo, { algorithm }),
      /* @__PURE__ */ jsx(AlgorithmActions, { algorithm })
    ] })
  ] }) });
}
const AlgorithmActions = ({ algorithm }) => {
  const { user } = useAuth();
  return /* @__PURE__ */ jsxs("div", { className: "flex w-auto flex-row items-center justify-end gap-2 md:w-auto", children: [
    /* @__PURE__ */ jsx(AutoScrollButton, { className: "hidden md:block" }),
    /* @__PURE__ */ jsx(Button, { className: "hidden md:block", asChild: true, variant: "link", children: /* @__PURE__ */ jsx(Link, { to: `/demo/${algorithm.id}`, children: `DEMO` }) }),
    user && /* @__PURE__ */ jsx(Button, { asChild: true, variant: "link", children: /* @__PURE__ */ jsx(Link, { to: `/create?remix=${algorithm.id}`, children: `REMIX` }) }),
    user && /* @__PURE__ */ jsx(LikeButton, { algorithm })
  ] });
};
function AlgorithmPage() {
  const { algorithmId } = useParams({ from: "/_layout/a/$algorithmId" });
  const { infinite } = useDisplaySizes();
  const { data: algorithm, isLoading } = useAlgorithm(Number(algorithmId));
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "h-full w-full p-4", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-4 p-0 sm:p-8", children: /* @__PURE__ */ jsx("div", { className: "mx-auto flex w-full flex-wrap items-center justify-evenly gap-4 sm:gap-16", children: Array(48).fill(0).map((_, i) => /* @__PURE__ */ jsx(
      Skeleton,
      {
        style: { width: infinite, height: infinite },
        className: `aspect-square rounded-none`
      },
      i
    )) }) }) });
  }
  if (!algorithm) {
    return /* @__PURE__ */ jsx("div", { children: "Algorithm not found" });
  }
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-4 p-0 sm:p-8", children: /* @__PURE__ */ jsx(AlgorithmInfiniteGrid, { algorithm }) });
}
const SplitComponent = AlgorithmPage;

export { SplitComponent as component };
//# sourceMappingURL=a._algorithmId-CUTfigs5.mjs.map
