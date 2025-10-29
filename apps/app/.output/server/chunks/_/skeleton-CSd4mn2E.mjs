import { useMemo } from 'react';
import { jsx } from 'react/jsx-runtime';
import { c as cn } from './utils-CZo72ztR.mjs';

const useDisplaySizes = () => {
  return useMemo(() => {
    const root = document.documentElement;
    return {
      single: parseFloat(
        getComputedStyle(root).getPropertyValue("--single-algorithm")
      ),
      grid: parseFloat(
        getComputedStyle(root).getPropertyValue("--grid-algorithm")
      ),
      infinite: parseFloat(
        getComputedStyle(root).getPropertyValue("--infinite-algorithm")
      ),
      demo: parseFloat(
        getComputedStyle(root).getPropertyValue("--demo-algorithm")
      )
    };
  }, []);
};
function Skeleton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn("animate-pulse rounded-md bg-primary/10", className),
      ...props
    }
  );
}

export { Skeleton as S, useDisplaySizes as u };
//# sourceMappingURL=skeleton-CSd4mn2E.mjs.map
