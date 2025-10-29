import { jsx } from 'react/jsx-runtime';
import * as React from 'react';
import { c as cn } from './utils-CZo72ztR.mjs';

const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";

export { Input as I };
//# sourceMappingURL=input-DTVPqQIJ.mjs.map
