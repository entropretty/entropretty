import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function familyKindColor(familyKind) {
  switch (familyKind) {
    case "Procedural":
      return "bg-brand-blue";
    case "ProceduralAccount":
      return "bg-brand-green";
    case "ProceduralPersonal":
      return "bg-brand-yellow";
  }
}
function familyKindLabel(familyKind) {
  switch (familyKind) {
    case "Procedural":
      return "Entropy";
    case "ProceduralAccount":
      return "Account Id";
    case "ProceduralPersonal":
      return "Personal Id";
  }
}

export { familyKindLabel as a, cn as c, familyKindColor as f };
//# sourceMappingURL=utils-CZo72ztR.mjs.map
