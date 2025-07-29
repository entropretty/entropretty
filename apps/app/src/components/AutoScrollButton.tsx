import { Button } from "@/components/ui/button"
import { useCallback, useEffect, useRef, useState } from "react"

interface AutoScrollButtonProps {
  className?: string
  scrollAmount?: number // pixels per scroll step
  scrollInterval?: number // milliseconds between scrolls
}

export function AutoScrollButton({
  className = "",
  scrollAmount = 2,
  scrollInterval = 16, // ~60fps
}: AutoScrollButtonProps) {
  const [isScrolling, setIsScrolling] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startScrolling = useCallback(() => {
    if (intervalRef.current) return // Already scrolling

    intervalRef.current = setInterval(() => {
      window.scrollBy(0, scrollAmount)
    }, scrollInterval)
  }, [scrollAmount, scrollInterval])

  const stopScrolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const toggleScrolling = useCallback(() => {
    if (isScrolling) {
      stopScrolling()
      setIsScrolling(false)
    } else {
      startScrolling()
      setIsScrolling(true)
    }
  }, [isScrolling, startScrolling, stopScrolling])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScrolling()
    }
  }, [stopScrolling])

  return (
    <Button
      variant={isScrolling ? undefined : "ghost"}
      onClick={toggleScrolling}
      className={className}
    >
      {isScrolling ? "STOP" : "SCROLL"}
    </Button>
  )
}
