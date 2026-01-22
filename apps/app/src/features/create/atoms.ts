import { getSeed, getSeedFamily } from '@entropretty/utils'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { FamilyKind } from '@entropretty/utils'
import type { AlgorithmView } from '@/lib/helper.types'

export type SeedType = FamilyKind
export type LocalFileSyncStatus = 'watching' | 'synced' | 'error'

export const editorCodeAtom = atom<string>('')
export const editorCodeVersionAtom = atom<number>(0)
export const editorSeedTypeAtom = atom<SeedType>('Procedural')
export const remixAtom = atom<AlgorithmView | null>(null)
export const scriptErrorAtom = atom<string | null>(null)

export const algorithmNameAtom = atom<string>('')
export const formatOnSaveAtom = atomWithStorage<boolean>(
  'entropretty-format-on-save',
  true,
)

const initialSeeds = [...getSeedFamily('Procedural').map((s) => [...s])]
export const editorSeedFamilyAtom = atom<Array<Array<number>>>(initialSeeds)
export const generateNewSeedAtom = atom(null, (get, set) => {
  set(editorSeedFamilyAtom, [
    ...getSeedFamily(get(editorSeedTypeAtom), 128).map((s) => [...s]),
  ])
})

// Generate a new seed family
export const editorSeedAtom = atom<Array<number>>([...getSeed('Procedural')])

// Local file mode atoms
export const localFileModeAtom = atom<boolean>(false)
export const localFileHandleAtom = atom<FileSystemFileHandle | null>(null)
export const localFilePathAtom = atom<string | null>(null)
export const localFileSyncStatusAtom = atom<LocalFileSyncStatus>('watching')
