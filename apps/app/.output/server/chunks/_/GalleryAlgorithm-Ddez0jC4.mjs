import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { u as useAlgorithm } from './useAlgorithm-CZ_W-qjG.mjs';
import { F as FamilyKindBadge } from './FamilyKindBadge-8clZ-XnL.mjs';
import { B as Button } from './button-CeG_45YZ.mjs';
import { u as useAuth, s as supabase } from './router-Dgt9epnn.mjs';
import { A as AlgorithmBitmap } from './AlgorithmBitmap-CIcD_7lU.mjs';
import { S as Skeleton, u as useDisplaySizes } from './skeleton-CSd4mn2E.mjs';
import { a as getSeedFamily, s as seedToKey } from './index-CWNUk7Yv.mjs';
import { useState, useCallback } from 'react';
import { Link } from '@tanstack/react-router';
import { u as useUsersLikes } from './useUsersLikes-Bs2eUBG1.mjs';
import { c as cn } from './utils-CZo72ztR.mjs';
import { useQueryClient } from '@tanstack/react-query';
import { Bookmark } from 'lucide-react';
import { toast } from 'sonner';

function SaveButton({ algorithm }) {
  const { user } = useAuth();
  const { data: likesOfUser, isLoading } = useUsersLikes();
  const queryClient = useQueryClient();
  const isLiked = likesOfUser?.includes(algorithm.id);
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
      size: "sm",
      variant: "ghost",
      onClick: toggleLike,
      className: cn({
        "bg-foreground text-background hover:bg-foreground/90 hover:text-background": isLiked,
        "pointer-events-none": !user || isLoading
      }),
      children: [
        isLiked && /* @__PURE__ */ jsx(
          Bookmark,
          {
            className: "h-3 w-3",
            strokeLinecap: "square",
            fill: "currentColor",
            strokeLinejoin: "miter"
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "flex items-center", children: user && isLiked ? "COLLECTED" : "COLLECT" })
      ]
    }
  ) });
}
const AlgorithmInfo = ({ algorithm }) => {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col text-xs text-gray-600", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("span", { children: [
        `${algorithm.name || "Untitled"} `,
        /* @__PURE__ */ jsx(
          Link,
          {
            className: "text-muted-foreground underline",
            to: `/a/${algorithm.id}`,
            children: `/a/${algorithm.id}`
          }
        )
      ] }),
      algorithm.remix_of && /* @__PURE__ */ jsxs(Fragment, { children: [
        ` remix of `,
        /* @__PURE__ */ jsx(
          Link,
          {
            className: "text-muted-foreground underline",
            to: `/a/${algorithm.remix_of}`,
            children: `/a/${algorithm.remix_of}`
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      `by `,
      /* @__PURE__ */ jsx(
        Link,
        {
          className: "text-muted-foreground underline",
          to: `/u/${algorithm.username || "Anonymous"}`,
          children: algorithm.username || "Anonymous"
        }
      )
    ] })
  ] });
};
function AlgorithmCard({ algorithm }) {
  const { grid } = useDisplaySizes();
  const [seedFamily, setSeedFamily] = useState([
    ...getSeedFamily(algorithm.family_kind).slice(0, 3),
    ...getSeedFamily(algorithm.family_kind).slice(0, 3),
    ...getSeedFamily(algorithm.family_kind).slice(0, 3)
  ]);
  if (!algorithm.id) return null;
  return /* @__PURE__ */ jsxs("div", { className: "border-background-200 hover:border-foreground/30 group relative flex w-full flex-col border", children: [
    /* @__PURE__ */ jsx(Link, { to: `/a/${algorithm.id}`, children: /* @__PURE__ */ jsx("div", { className: "z-100 relative flex flex-col items-center justify-center gap-4 p-4 transition-colors md:flex-row", children: /* @__PURE__ */ jsx("div", { className: `flex h-full w-full items-center justify-center`, children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 items-center justify-center gap-4", children: seedFamily.slice(0, 9).map((seed) => /* @__PURE__ */ jsx(
      AlgorithmBitmap,
      {
        algorithmId: algorithm.id,
        seed,
        size: grid,
        scale: 2
      },
      seedToKey(seed)
    )) }) }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-background absolute bottom-0 w-full border-t border-black/30 px-4 py-2 opacity-0 transition-opacity group-hover:opacity-100 group-hover:[box-shadow:4px_4px_0_0_rgba(0,0,0,0.5)] hover:dark:[box-shadow:4px_4px_0_0_rgba(255,255,255,0.5)]", children: [
      /* @__PURE__ */ jsx(
        FamilyKindBadge,
        {
          familyKind: algorithm.family_kind,
          className: "absolute left-0 top-[-22px]"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col items-start justify-between gap-y-2", children: [
        /* @__PURE__ */ jsx(AlgorithmInfo, { algorithm }),
        /* @__PURE__ */ jsx(
          AlgorithmActions,
          {
            algorithm,
            setSeedFamily
          }
        )
      ] })
    ] })
  ] });
}
const AlgorithmActions = ({
  algorithm,
  setSeedFamily
}) => {
  const { user } = useAuth();
  const reroll = useCallback(() => {
    setSeedFamily([
      ...getSeedFamily(algorithm.family_kind).slice(0, 3),
      ...getSeedFamily(algorithm.family_kind).slice(0, 3),
      ...getSeedFamily(algorithm.family_kind).slice(0, 3)
    ]);
  }, [algorithm.family_kind, setSeedFamily]);
  return /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-row items-center justify-center gap-2", children: [
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "ghost",
        size: "sm",
        onClick: reroll,
        className: "select-none",
        children: "REROLL"
      }
    ),
    user && /* @__PURE__ */ jsx(Button, { asChild: true, variant: "link", size: "sm", className: "select-none", children: /* @__PURE__ */ jsx(Link, { to: `/create?remix=${algorithm.id}`, children: `REMIX` }) }),
    /* @__PURE__ */ jsx("div", { className: "hidden select-none md:block", children: /* @__PURE__ */ jsx(SaveButton, { algorithm }) })
  ] });
};
function AlgorithmCardSkeleton() {
  return /* @__PURE__ */ jsx(Skeleton, { className: "flex h-[364px] w-[364px] rounded-none" });
}
const GalleryAlgorithm = ({ algorithmId }) => {
  const { data: algorithm, isLoading } = useAlgorithm(algorithmId);
  if (isLoading) {
    return /* @__PURE__ */ jsx(AlgorithmCardSkeleton, {});
  }
  return /* @__PURE__ */ jsx(AlgorithmCard, { algorithm });
};

export { GalleryAlgorithm as G };
//# sourceMappingURL=GalleryAlgorithm-Ddez0jC4.mjs.map
