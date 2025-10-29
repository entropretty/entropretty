import { jsx } from 'react/jsx-runtime';
import { a as familyKindLabel, c as cn } from './utils-CZo72ztR.mjs';
import { cva } from 'class-variance-authority';
import { a as useTheme } from './router-Dgt9epnn.mjs';

const badgeVariants = cva(
  "inline-flex items-center border px-2 text-sm font-jersey transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow",
        Procedural: `border-transparent bg-brand-blue text-primary-foreground`,
        ProceduralAccount: `border-transparent bg-brand-green text-primary-background`,
        ProceduralPersonal: `border-transparent bg-brand-yellow text-primary-background`,
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
function FamilyKindBadge({
  familyKind,
  className
}) {
  const { theme } = useTheme();
  if (!familyKind) return null;
  return /* @__PURE__ */ jsx(
    Badge,
    {
      className: cn(className, {
        "text-background": theme === "dark",
        "text-foreground": theme === "dark" && familyKind === "Procedural"
      }),
      variant: familyKind,
      children: familyKindLabel(familyKind)
    }
  );
}

export { Badge as B, FamilyKindBadge as F };
//# sourceMappingURL=FamilyKindBadge-8clZ-XnL.mjs.map
