import { cn } from "@/lib/utils"
import { AlgorithmId } from "@/workers/artist"
import { seedToKey } from "entropretty-utils"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useAlgorithmService } from "@/contexts/service-context"

interface Props {
  algorithmId: AlgorithmId
  seed: number[]
  size: number
  scale?: number
  onClick?: () => void
  version?: number
  className?: string
  style?: React.CSSProperties
}

export const AlgorithmBitmap: React.FC<Props> = ({
  algorithmId,
  seed,
  size,
  scale = 1,
  onClick,
  version = 0,
  className,
  style,
}) => {
  const [ready, setIsReady] = useState(false)
  const service = useAlgorithmService()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawingSize = useMemo(() => size * scale, [size, scale])

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (e.altKey && canvasRef.current) {
        const link = document.createElement("a")
        link.download = `${algorithmId}_${seed.join("-")}.png`
        link.href = canvasRef.current.toDataURL("image/png")
        link.click()
        setTimeout(() => {
          link.remove()
        }, 0)
      } else if (onClick) {
        onClick()
      }
    },
    [algorithmId, seed, onClick],
  )

  useEffect(() => {
    if (canvasRef.current === null) return

    setIsReady(false)
    service.cancelRender(algorithmId, drawingSize, [...seed])
    service.render(algorithmId, drawingSize, [...seed]).then((bitmap) => {
      const context = canvasRef.current!.getContext("2d")!
      context.clearRect(0, 0, drawingSize, drawingSize)
      context.drawImage(bitmap, 0, 0, drawingSize, drawingSize)
      setIsReady(true)
    })
  }, [seed, algorithmId, size, drawingSize, service, version])

  return (
    <canvas
      className={cn(
        "transition-opacity",
        {
          "opacity-0": !ready,
          "cursor-pointer": !!onClick,
        },
        className,
      )}
      onClick={handleCanvasClick}
      ref={canvasRef}
      width={drawingSize}
      height={drawingSize}
      title={`${seedToKey(seed)} (Alt+Click to download)`}
      style={style ?? { width: size, height: size }}
    />
  )
}
