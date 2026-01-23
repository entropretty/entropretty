import { useAtom } from 'jotai'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { localFileModeAtom } from '../atoms'
import { AlgorithmNameInput } from '../AlgorithmNameInput'
import { PostButton } from '../PostButton'
import { Benchmarking } from '../Benchmarking'
import { SeedTools } from '../SeedTools'
import { LocalFileCodeTab } from './LocalFileCodeTab'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export function LocalFileDrawer() {
  const [localFileMode] = useAtom(localFileModeAtom)
  const [isOpen, setIsOpen] = useState(false)

  if (!localFileMode) {
    return null
  }

  return (
    <div
      className={cn(
        'fixed right-0 top-0 z-40 flex h-full transition-transform duration-300',
        isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-40px)]',
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-background hover:bg-muted flex h-full w-10 items-center justify-center border-l"
        aria-label={isOpen ? 'Collapse drawer' : 'Expand drawer'}
      >
        {isOpen ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </button>

      <div className="bg-background flex h-full w-[400px] flex-col border-l">
        <Tabs defaultValue="code" className="flex h-full flex-col">
          <div className="flex flex-col gap-2 border-b p-2">
            <div className="flex w-full flex-row items-center gap-2">
              <AlgorithmNameInput />
              <PostButton />
            </div>
            <TabsList className="w-full">
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger className="border-foreground border" value="check">
                Check
              </TabsTrigger>
              <TabsTrigger value="seed">Settings</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="code" className="flex-1 overflow-y-auto p-4">
            <LocalFileCodeTab />
          </TabsContent>

          <TabsContent value="seed" className="flex-1 overflow-y-auto">
            <SeedTools />
          </TabsContent>

          <TabsContent value="check" className="flex-1 overflow-y-auto p-4">
            <Benchmarking />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
