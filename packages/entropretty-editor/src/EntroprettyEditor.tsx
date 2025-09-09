import { Controls } from "@/components/Controls"
import Exhibition from "@/components/Exhibition"
import { SchemaSelect } from "@/components/SchemaSelect"
import { useApp } from "@/lib/state"
import { useEffect } from "react"
import "./App.css"

interface Props {
  worker: Worker
}

export const EntroprettyEditor: React.FC<Props> = ({ worker }) => {
  const init = useApp((state) => state.init)
  const internalWorker = useApp((state) => state.worker)
  const currentSchema = useApp((state) => state.schema)

  useEffect(() => {
    init(worker)
  }, [init, worker])

  if (!internalWorker) {
    console.info("Worker not set")
    return <div>Loading...</div>
  }

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center">
      {currentSchema && <Exhibition schema={currentSchema} />}
      <Controls />
      <SchemaSelect />
    </main>
  )
}
