import { jsx, jsxs } from 'react/jsx-runtime';
import { L as LikeButton } from './LikeButton-7DcHXbYC.mjs';
import { A as AlgorithmInfo } from './AlgorithmInfo-CxZKPX1g.mjs';
import { F as FamilyKindBadge } from './FamilyKindBadge-8clZ-XnL.mjs';
import { B as Button } from './button-CeG_45YZ.mjs';
import { u as useAuth } from './router-Dgt9epnn.mjs';
import { A as AlgorithmBitmap } from './AlgorithmBitmap-CIcD_7lU.mjs';
import { S as Skeleton, u as useDisplaySizes } from './skeleton-CSd4mn2E.mjs';
import { a as getSeedFamily, s as seedToKey } from './index-CWNUk7Yv.mjs';
import { useState, useCallback } from 'react';
import { Link } from '@tanstack/react-router';

function AlgorithmCard({ algorithm }) {
  const { single, grid } = useDisplaySizes();
  const [seedFamily, setSeedFamily] = useState([
    ...getSeedFamily(algorithm.family_kind, 4),
    ...getSeedFamily(algorithm.family_kind, 3),
    ...getSeedFamily(algorithm.family_kind, 3)
  ]);
  if (!algorithm.id) return null;
  return /* @__PURE__ */ jsxs("div", { className: "border-background-200 flex w-full flex-col border", children: [
    /* @__PURE__ */ jsx(Link, { to: `/a/${algorithm.id}`, children: /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col items-center justify-center gap-4 p-4 md:flex-row", children: [
      /* @__PURE__ */ jsx("div", { className: `flex aspect-square items-center justify-center`, children: /* @__PURE__ */ jsx(
        AlgorithmBitmap,
        {
          algorithmId: algorithm.id,
          seed: seedFamily[0],
          size: single,
          scale: 2
        },
        seedToKey(seedFamily[0])
      ) }),
      /* @__PURE__ */ jsx("div", { className: `flex h-full w-full items-center justify-center`, children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 items-center justify-center gap-4", children: seedFamily.slice(1, 10).map((seed) => /* @__PURE__ */ jsx(
        AlgorithmBitmap,
        {
          algorithmId: algorithm.id,
          seed,
          size: grid,
          scale: 2
        },
        seedToKey(seed)
      )) }) }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-2 right-2 flex flex-row" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "border-background-200 relative flex flex-row items-center justify-between gap-y-2 border-t p-4", children: [
      /* @__PURE__ */ jsx(
        FamilyKindBadge,
        {
          familyKind: algorithm.family_kind,
          className: "absolute left-0 top-[-22px]"
        }
      ),
      /* @__PURE__ */ jsx(AlgorithmInfo, { algorithm }),
      /* @__PURE__ */ jsx(AlgorithmActions, { algorithm, setSeedFamily })
    ] })
  ] });
}
const AlgorithmActions = ({
  algorithm,
  setSeedFamily
}) => {
  const { user } = useAuth();
  const reroll = useCallback(() => {
    setSeedFamily([...getSeedFamily(algorithm.family_kind).map((s) => [...s])]);
  }, [algorithm.family_kind, setSeedFamily]);
  return /* @__PURE__ */ jsxs("div", { className: "flex w-auto flex-row items-center justify-end gap-2 md:w-auto", children: [
    /* @__PURE__ */ jsx(Button, { variant: "ghost", onClick: reroll, children: "REROLL" }),
    user && /* @__PURE__ */ jsx(Button, { asChild: true, variant: "link", children: /* @__PURE__ */ jsx(Link, { to: `/create?remix=${algorithm.id}`, children: `REMIX` }) }),
    /* @__PURE__ */ jsx("div", { className: "hidden md:block", children: /* @__PURE__ */ jsx(LikeButton, { algorithm }) })
  ] });
};
function AlgorithmCardSkeleton() {
  return /* @__PURE__ */ jsx(Skeleton, { className: "flex h-[665px] w-screen rounded-none sm:h-[438px] sm:w-[680px]" });
}

export { AlgorithmCardSkeleton as A, AlgorithmCard as a };
//# sourceMappingURL=AlgorithmCardSkeleton-C77E4bUX.mjs.map
