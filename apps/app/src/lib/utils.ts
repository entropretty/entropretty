import { clsx, type ClassValue } from "clsx"
import { FamilyKind } from "entropretty-utils"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function familyKindColor(familyKind: FamilyKind) {
  switch (familyKind) {
    case "Procedural":
      return "bg-brand-blue"
    case "ProceduralAccount":
      return "bg-brand-green"
    case "ProceduralPersonal":
      return "bg-brand-yellow"
  }
}

export function familyKindLabel(familyKind: FamilyKind) {
  switch (familyKind) {
    case "Procedural":
      return "Entropy"
    case "ProceduralAccount":
      return "Account Id"
    case "ProceduralPersonal":
      return "Personal Id"
  }
}
