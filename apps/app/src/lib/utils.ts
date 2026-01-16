import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'
import type { FamilyKind } from '@entropretty/utils'

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export function familyKindColor(familyKind: FamilyKind) {
  switch (familyKind) {
    case 'Procedural':
      return 'bg-brand-blue'
    case 'ProceduralAccount':
      return 'bg-brand-green'
    case 'ProceduralPersonal':
      return 'bg-brand-yellow'
  }
}

export function familyKindLabel(familyKind: FamilyKind) {
  switch (familyKind) {
    case 'Procedural':
      return 'Entropy'
    case 'ProceduralAccount':
      return 'Account Id'
    case 'ProceduralPersonal':
      return 'Personal Id'
  }
}
