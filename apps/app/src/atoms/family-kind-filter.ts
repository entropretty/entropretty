import { atomWithStorage } from 'jotai/utils'
import type { FamilyKind } from '@entropretty/utils'

export const familyKindFilterAtom = atomWithStorage<FamilyKind | 'All'>(
  'familyKindFilter',
  'All',
)
