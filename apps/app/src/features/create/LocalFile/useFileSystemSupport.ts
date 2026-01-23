import { useMemo } from 'react'

export function useFileSystemSupport() {
  return useMemo(() => {
    if (typeof window === 'undefined') return false

    return (
      'showOpenFilePicker' in window &&
      'showSaveFilePicker' in window &&
      'FileSystemObserver' in window
    )
  }, [])
}
