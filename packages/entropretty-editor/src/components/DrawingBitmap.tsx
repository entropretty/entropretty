import { cn } from "@/lib/utils"
import { useEffect, useMemo, useRef, useState } from "react"
import { useApp } from "../lib/state"
import { Seed } from "entropretty-utils"

interface Props {
  id?: string
  seed: Seed
  schema: string
  size: number
  scale?: number
}

export const DrawingBitmap: React.FC<Props> = ({
  seed,
  schema,
  size,
  scale = 2,
  id,
}) => {
  const [ready, setIsReady] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const worker = useApp((state) => state.worker)

  const drawingSize = useMemo(() => size * scale, [size, scale])

  useEffect(() => {
    if (canvasRef.current === null) return

    worker!.drawTransfer(schema, seed, drawingSize).then((bitmap) => {
      const context = canvasRef.current!.getContext("2d")!
      context.clearRect(0, 0, drawingSize, drawingSize)
      context.drawImage(bitmap, 0, 0, drawingSize, drawingSize)
      setIsReady(true)
    })
  }, [seed, schema, size, worker, drawingSize])

  return (
    <canvas
      id={id}
      className={cn("cursor-pointer", { hidden: !ready })}
      ref={canvasRef}
      width={drawingSize}
      height={drawingSize}
      style={{ width: size, height: size }}
    />
  )
}
