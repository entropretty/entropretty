import { useAtom } from 'jotai'
import type { FamilyKind } from '@entropretty/utils'
import { familyKindFilterAtom } from '@/atoms/family-kind-filter'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn, familyKindColor } from '@/lib/utils'

interface FamilyKindFilterProps {
  className?: string
}

export function FamilyKindFilter({ className }: FamilyKindFilterProps) {
  const [value, setValue] = useAtom(familyKindFilterAtom)

  const handleValueChange = (newValue: string) => {
    setValue(newValue as FamilyKind | 'All')
  }

  return (
    <div className={cn('w-[200px]', className)}>
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger
          className={cn(
            'hover:cursor-pointer',
            value !== 'All' && familyKindColor(value),
            value === 'Procedural'
              ? 'text-primary-foreground'
              : value !== 'All'
                ? 'text-primary-background'
                : '',
          )}
        >
          <SelectValue placeholder="Filter by Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            value="All"
            className="bg-transparent hover:cursor-pointer"
          >
            Show All
          </SelectItem>
          <SelectItem
            value="Procedural"
            className={cn(
              familyKindColor('Procedural'),
              'text-primary-foreground hover:cursor-pointer',
            )}
          >
            Entropy
          </SelectItem>
          <SelectItem
            value="ProceduralPersonal"
            className={cn(
              familyKindColor('ProceduralPersonal'),
              'text-primary-background',
              '',
              'hover:cursor-pointer',
            )}
          >
            Personal Id
          </SelectItem>
          <SelectItem
            value="ProceduralAccount"
            className={cn(
              familyKindColor('ProceduralAccount'),
              'text-primary-background',
              '',
              'hover:cursor-pointer',
            )}
          >
            Account Id
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
