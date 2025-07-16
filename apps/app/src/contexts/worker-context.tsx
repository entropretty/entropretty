import React, { createContext, useContext, useMemo, useRef } from "react"
import { Remote, wrap } from "comlink"
import Worker from "../workers/artist?worker" // Import the Web Worker
import { ArtistWorker } from "../workers/artist.ts"

interface WorkerContextType {
  artist: Remote<ArtistWorker>
}

const Context = createContext<WorkerContextType | null>(null)

export const WorkerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const workerRef = useRef<Remote<ArtistWorker> | null>(null)

  if (!workerRef.current) {
    const workerInstance = new Worker()
    workerRef.current = wrap<Remote<ArtistWorker>>(workerInstance)
  }
  const value = useMemo(() => {
    return { artist: workerRef.current }
  }, [workerRef])

  return (
    <Context.Provider value={value! as WorkerContextType}>
      {children}
    </Context.Provider>
  )
}

export const useWorker = () => {
  const context = useContext(Context)
  if (!context)
    throw new Error("useWorker must be used within a WorkerProvider")
  return context
}
