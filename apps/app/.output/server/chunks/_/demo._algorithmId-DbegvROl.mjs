import { jsx, jsxs } from 'react/jsx-runtime';
import { S as Skeleton, u as useDisplaySizes } from './skeleton-CSd4mn2E.mjs';
import { useParams } from '@tanstack/react-router';
import { A as AlgorithmBitmap } from './AlgorithmBitmap-CIcD_7lU.mjs';
import { g as getSeed, d as deriveSeedFamily, s as seedToKey } from './index-CWNUk7Yv.mjs';
import { LayoutGroup, motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';
import { c as cn } from './utils-CZo72ztR.mjs';
import { u as useAlgorithm } from './useAlgorithm-CZ_W-qjG.mjs';
import './router-Dgt9epnn.mjs';
import 'react-helmet-async';
import '@tanstack/react-query';
import 'comlink';
import 'p-queue';
import '@supabase/supabase-js';
import 'next-themes';
import 'sonner';
import 'clsx';
import 'tailwind-merge';

function AlgorithmDemo({
  algorithm,
  className = "",
  startDelay = 0
}) {
  const [seeds, setSeeds] = useState([]);
  const [index, setIndex] = useState(0);
  const [shouldStartCycling, setShouldStartCycling] = useState(false);
  const { demo } = useDisplaySizes();
  const loadMore = useCallback(() => {
    if (seeds.length === 0) return;
    const newSeed = getSeed(algorithm.family_kind);
    const newFamily = deriveSeedFamily(newSeed, {
      size: 3
    });
    const existingKeys = new Set(seeds.map((seed) => seedToKey(seed)));
    const uniqueNewSeeds = newFamily.filter(
      (seed) => !existingKeys.has(seedToKey([...seed]))
    );
    setSeeds((prev) => [...prev, ...uniqueNewSeeds.map((s) => [...s])]);
  }, [algorithm.family_kind, seeds]);
  useEffect(() => {
    if (startDelay === 0) {
      setShouldStartCycling(true);
      return;
    }
    const timeout = setTimeout(() => {
      setShouldStartCycling(true);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [startDelay]);
  useEffect(() => {
    if (!shouldStartCycling || seeds.length === 0) return;
    const interval = setInterval(() => {
      if (index + 1 === seeds.length) {
        loadMore();
      }
      setIndex((prev) => (prev + 1) % seeds.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [index, loadMore, seeds, shouldStartCycling]);
  useEffect(() => {
    const initial = getSeed(algorithm.family_kind);
    const family = deriveSeedFamily(initial, {
      size: 3
    });
    const uniqueSeeds = Array.from(
      new Set(family.map((seed) => seedToKey(seed)))
    ).map((key) => family.find((seed) => seedToKey(seed) === key)).map((s) => [...s]);
    setSeeds(uniqueSeeds);
  }, [algorithm.family_kind]);
  if (seeds[index] === void 0) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `flex flex-col items-center justify-center bg-white p-10 ${className}`,
      children: /* @__PURE__ */ jsx("div", { className: cn("flex w-full flex-col items-center justify-center"), children: /* @__PURE__ */ jsx("div", { className: "relative aspect-square h-[70vh] overflow-hidden", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "sync", children: /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: {
            opacity: 0,
            // scale: 0.95,
            filter: "blur(2px)"
          },
          animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
          exit: {
            opacity: 0,
            // scale: 1.05,
            filter: "blur(2px)"
          },
          transition: { duration: 0.5, ease: "easeInOut" },
          className: "absolute inset-0 flex items-center justify-center p-8",
          children: /* @__PURE__ */ jsx(
            AlgorithmBitmap,
            {
              algorithmId: algorithm.id,
              seed: seeds[index],
              size: demo,
              scale: 2,
              style: {
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "contain"
              }
            }
          )
        },
        seedToKey(seeds[index])
      ) }) }) })
    }
  );
}
function DemoPage() {
  const { algorithmId } = useParams({ from: "/demo/$algorithmId" });
  const [visibleDemos, setVisibleDemos] = useState([]);
  const { data: algorithm, isLoading } = useAlgorithm(Number(algorithmId));
  const getScale = () => {
    const visibleCount = visibleDemos.length;
    if (visibleCount === 1) return 1.7;
    if (visibleCount === 2) return 1.02;
    return 1;
  };
  useEffect(() => {
    setVisibleDemos([]);
    if (algorithm) {
      const animationSequence = [
        { indices: [1], delay: 0 },
        // Center of row
        { indices: [0], delay: 4e3 },
        // Left of row
        { indices: [2], delay: 8e3 }
        // Right of row
      ];
      animationSequence.forEach(({ indices, delay }) => {
        setTimeout(() => {
          setVisibleDemos((prev) => [...prev, ...indices]);
        }, delay);
      });
    }
  }, [algorithm]);
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex h-screen w-screen flex-col items-center justify-center bg-black", children: /* @__PURE__ */ jsx(Skeleton, { className: `aspect-square h-[70vh] w-[70vh]` }) });
  }
  if (!algorithm) {
    return /* @__PURE__ */ jsx("div", { children: "Algorithm not found" });
  }
  return /* @__PURE__ */ jsx("div", { className: "flex h-screen w-screen cursor-none flex-col items-center justify-center bg-black", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-4 bg-black p-4", children: [
    /* @__PURE__ */ jsx(LayoutGroup, { children: /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "flex items-center justify-center gap-4",
        animate: {
          scale: getScale()
        },
        transition: {
          duration: 1,
          ease: [0.25, 0.1, 0.25, 1]
        },
        children: [0, 1, 2].map((index) => /* @__PURE__ */ jsx(
          motion.div,
          {
            layout: true,
            initial: { scale: 0 },
            animate: {
              scale: visibleDemos.includes(index) ? 1 : 0
            },
            transition: {
              duration: 0.6,
              ease: "easeOut",
              layout: {
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1]
              }
            },
            className: "flex items-center justify-center",
            style: {
              "--demo-size": "min(calc((100vw - 8rem) / 3), calc((100vh - 8rem)))"
            },
            children: /* @__PURE__ */ jsx(
              AlgorithmDemo,
              {
                algorithm,
                className: "demo-flex-responsive !p-1",
                startDelay: index * 200
              }
            )
          },
          index
        ))
      }
    ) }),
    /* @__PURE__ */ jsx("style", { children: `
        .demo-flex-responsive .relative.aspect-square {
          height: var(--demo-size) !important;
          width: var(--demo-size) !important;
        }
        .demo-flex-responsive {
          width: var(--demo-size) !important;
          height: var(--demo-size) !important;
        }
      ` })
  ] }) });
}
const SplitComponent = DemoPage;

export { SplitComponent as component };
//# sourceMappingURL=demo._algorithmId-DbegvROl.mjs.map
