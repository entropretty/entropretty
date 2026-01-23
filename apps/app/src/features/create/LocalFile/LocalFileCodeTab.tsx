import { useAtom } from 'jotai'
import { AlertCircle, Check, Eye, FileCode, Unplug } from 'lucide-react'
import { localFilePathAtom, localFileSyncStatusAtom } from '../atoms'
import { useLocalFile } from './useLocalFile'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const statusConfig = {
  watching: {
    icon: Eye,
    label: 'Watching',
    variant: 'secondary' as const,
  },
  synced: {
    icon: Check,
    label: 'Synced',
    variant: 'default' as const,
  },
  error: {
    icon: AlertCircle,
    label: 'Error',
    variant: 'destructive' as const,
  },
}

export function LocalFileCodeTab() {
  const [filePath] = useAtom(localFilePathAtom)
  const [syncStatus] = useAtom(localFileSyncStatusAtom)
  const { disconnect } = useLocalFile()

  const status = statusConfig[syncStatus]
  const StatusIcon = status.icon

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-base font-medium">Connected File</h3>
          <p className="text-muted-foreground text-xs">
            Edit this file in your IDE. Changes sync automatically.
          </p>
        </div>

        <div className="bg-muted flex items-center gap-2 rounded-md p-3">
          <FileCode className="text-muted-foreground h-5 w-5 shrink-0" />
          <span className="truncate text-sm font-mono">{filePath}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Status:</span>
          <Badge variant={status.variant} className="gap-1">
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </Badge>
        </div>
      </div>

      <Button
        variant="destructive"
        onClick={disconnect}
        className="w-full justify-start"
      >
        <Unplug className="mr-2 h-4 w-4" />
        Disconnect from Local File
      </Button>
    </div>
  )
}
