import { useAtom } from 'jotai'
import { ByteManipulator } from '@/components/ByteManipulator'
import { editorSeedFamilyAtom } from '@/features/create/atoms'

export const SeedManipulator = () => {
  const [seedFamily, setSeedFamily] = useAtom(editorSeedFamilyAtom)

  const handleSeedChange = (newSeed: Array<number>) => {
    setSeedFamily((prev) => {
      const newFamily = [...prev]
      newFamily[0] = newSeed
      return newFamily
    })
  }

  return (
    <div className="flex w-full flex-row items-center justify-center">
      <ByteManipulator value={seedFamily[0]} onChange={handleSeedChange} />
    </div>
  )
}
