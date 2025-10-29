import { jsx, jsxs } from 'react/jsx-runtime';
import { atomWithStorage } from 'jotai/utils';
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from './select-BK0MCkcO.mjs';
import { c as cn, f as familyKindColor } from './utils-CZo72ztR.mjs';
import { useAtom } from 'jotai';

const familyKindFilterAtom = atomWithStorage(
  "familyKindFilter",
  "All"
);
function FamilyKindFilter({ className }) {
  const [value, setValue] = useAtom(familyKindFilterAtom);
  const handleValueChange = (newValue) => {
    setValue(newValue);
  };
  return /* @__PURE__ */ jsx("div", { className: cn("w-[200px]", className), children: /* @__PURE__ */ jsxs(Select, { value, onValueChange: handleValueChange, children: [
    /* @__PURE__ */ jsx(
      SelectTrigger,
      {
        className: cn(
          "font-jersey text-lg hover:cursor-pointer",
          value !== "All" && familyKindColor(value),
          value === "Procedural" ? "text-primary-foreground" : value !== "All" ? "text-primary-background" : ""
        ),
        children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Filter by Category" })
      }
    ),
    /* @__PURE__ */ jsxs(SelectContent, { children: [
      /* @__PURE__ */ jsx(
        SelectItem,
        {
          value: "All",
          className: "font-jersey bg-transparent text-lg hover:cursor-pointer",
          children: "Show All"
        }
      ),
      /* @__PURE__ */ jsx(
        SelectItem,
        {
          value: "Procedural",
          className: cn(
            familyKindColor("Procedural"),
            "text-primary-foreground font-jersey text-lg hover:cursor-pointer"
          ),
          children: "Entropy"
        }
      ),
      /* @__PURE__ */ jsx(
        SelectItem,
        {
          value: "ProceduralPersonal",
          className: cn(
            familyKindColor("ProceduralPersonal"),
            "text-primary-background",
            "font-jersey text-lg",
            "hover:cursor-pointer"
          ),
          children: "Personal Id"
        }
      ),
      /* @__PURE__ */ jsx(
        SelectItem,
        {
          value: "ProceduralAccount",
          className: cn(
            familyKindColor("ProceduralAccount"),
            "text-primary-background",
            "font-jersey text-lg",
            "hover:cursor-pointer"
          ),
          children: "Account Id"
        }
      )
    ] })
  ] }) });
}

export { FamilyKindFilter as F, familyKindFilterAtom as f };
//# sourceMappingURL=FamilyKindFilter-BO9I_PQH.mjs.map
