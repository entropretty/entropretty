import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { Link } from '@tanstack/react-router';

const AlgorithmInfo = ({ algorithm }) => {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col text-sm text-gray-600", children: [
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

export { AlgorithmInfo as A };
//# sourceMappingURL=AlgorithmInfo-CxZKPX1g.mjs.map
