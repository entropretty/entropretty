import { useAtom, useSetAtom } from 'jotai'
import { useCallback, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import {
  editorCodeAtom,
  localFileHandleAtom,
  localFileModeAtom,
  localFilePathAtom,
  localFileSyncStatusAtom,
} from '../atoms'

declare global {
  interface Window {
    showSaveFilePicker: (
      options?: SaveFilePickerOptions,
    ) => Promise<FileSystemFileHandle>
    showOpenFilePicker: (
      options?: OpenFilePickerOptions,
    ) => Promise<Array<FileSystemFileHandle>>
    FileSystemObserver: new (
      callback: FileSystemObserverCallback,
    ) => FileSystemObserver
  }
}

interface SaveFilePickerOptions {
  suggestedName?: string
  types?: Array<{
    description: string
    accept: Record<string, Array<string>>
  }>
}

interface OpenFilePickerOptions {
  types?: Array<{
    description: string
    accept: Record<string, Array<string>>
  }>
  multiple?: boolean
}

interface FileSystemObserver {
  observe: (handle: FileSystemFileHandle) => void
  disconnect: () => void
}

type FileSystemObserverCallback = (
  records: Array<{ root: FileSystemHandle; type: string }>,
) => void

const FILE_TYPES = [
  {
    description: 'JavaScript Files',
    accept: { 'text/javascript': ['.js'] },
  },
]

export function useLocalFile() {
  const [localFileMode, setLocalFileMode] = useAtom(localFileModeAtom)
  const setFileHandle = useSetAtom(localFileHandleAtom)
  const [filePath, setFilePath] = useAtom(localFilePathAtom)
  const setSyncStatus = useSetAtom(localFileSyncStatusAtom)
  const [editorCode, setEditorCode] = useAtom(editorCodeAtom)

  const observerRef = useRef<FileSystemObserver | null>(null)

  const readFileContent = useCallback(async (handle: FileSystemFileHandle) => {
    try {
      const file = await handle.getFile()
      return await file.text()
    } catch {
      return null
    }
  }, [])

  const writeFileContent = useCallback(
    async (handle: FileSystemFileHandle, content: string) => {
      try {
        const writable = await handle.createWritable()
        await writable.write(content)
        await writable.close()
        return true
      } catch {
        return false
      }
    },
    [],
  )

  const startWatching = useCallback(
    (handle: FileSystemFileHandle) => {
      if (!('FileSystemObserver' in window)) return

      observerRef.current = new window.FileSystemObserver(async (records) => {
        for (const record of records) {
          if (record.type === 'modified') {
            const content = await readFileContent(handle)
            if (content !== null) {
              setEditorCode(content)
              setSyncStatus('synced')
            }
          } else if (record.type === 'deleted' || record.type === 'errored') {
            toast.error('Connection lost: file was deleted or moved')
            disconnect()
          }
        }
      })

      observerRef.current.observe(handle)
      setSyncStatus('watching')
    },
    [readFileContent, setEditorCode, setSyncStatus],
  )

  const stopWatching = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
  }, [])

  const createLocalFile = useCallback(async () => {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: 'algorithm.js',
        types: FILE_TYPES,
      })

      const success = await writeFileContent(handle, editorCode)
      if (!success) {
        toast.error('Could not save file')
        return false
      }

      setFileHandle(handle)
      setFilePath(handle.name)
      setLocalFileMode(true)
      startWatching(handle)

      return true
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        toast.error('Could not create file')
      }
      return false
    }
  }, [
    editorCode,
    writeFileContent,
    setFileHandle,
    setFilePath,
    setLocalFileMode,
    startWatching,
  ])

  const openLocalFile = useCallback(async () => {
    try {
      const [handle] = await window.showOpenFilePicker({
        types: FILE_TYPES,
        multiple: false,
      })

      const content = await readFileContent(handle)
      if (content === null) {
        toast.error('Could not read file')
        return false
      }

      setEditorCode(content)
      setFileHandle(handle)
      setFilePath(handle.name)
      setLocalFileMode(true)
      startWatching(handle)

      return true
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        toast.error('Could not open file')
      }
      return false
    }
  }, [
    readFileContent,
    setEditorCode,
    setFileHandle,
    setFilePath,
    setLocalFileMode,
    startWatching,
  ])

  const disconnect = useCallback(() => {
    stopWatching()
    setLocalFileMode(false)
    setFileHandle(null)
    setFilePath(null)
    setSyncStatus('watching')
  }, [
    stopWatching,
    setLocalFileMode,
    setFileHandle,
    setFilePath,
    setSyncStatus,
  ])

  useEffect(() => {
    return () => {
      stopWatching()
    }
  }, [stopWatching])

  return {
    localFileMode,
    filePath,
    createLocalFile,
    openLocalFile,
    disconnect,
  }
}
