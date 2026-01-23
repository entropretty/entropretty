import { FilePlus, FolderOpen } from 'lucide-react'
import { useFileSystemSupport } from './useFileSystemSupport'
import { useLocalFile } from './useLocalFile'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

export function LocalFileControls() {
  const isSupported = useFileSystemSupport()
  const { localFileMode, createLocalFile, openLocalFile } = useLocalFile()

  if (!isSupported || localFileMode) {
    return null
  }

  return (
    <>
      <Separator />
      <div className="flex w-full flex-col gap-4">
        <div>
          <h2 className="text-base">Local File</h2>
          <p className="text-muted-foreground text-xs">
            Edit in your IDE. Changes sync automatically.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={createLocalFile} className="justify-start">
            <FilePlus className="mr-2 h-4 w-4" />
            Create Local File
          </Button>
          <Button
            variant="secondary"
            onClick={openLocalFile}
            className="justify-start"
          >
            <FolderOpen className="mr-2 h-4 w-4" />
            Open Local File
          </Button>
        </div>
      </div>
    </>
  )
}
