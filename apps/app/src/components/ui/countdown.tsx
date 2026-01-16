import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface CountdownProps {
  targetDate: Date
  className?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function Countdown({ targetDate, className }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const target = targetDate.getTime()
      const difference = target - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        )
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60),
        )
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
        setIsExpired(false)
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        setIsExpired(true)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  if (isExpired) {
    return (
      <div className={cn('text-center', className)}>
        <p className="text-destructive text-xl font-medium uppercase">
          Entries are closed
        </p>
      </div>
    )
  }

  return (
    <div className={cn('text-center', className)}>
      <p className="text-muted-foreground mb-2 text-xs uppercase tracking-wide">
        Submission Deadline
      </p>
      <p className="text-foreground mb-3 text-sm font-medium">
        {targetDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
        ,{' '}
        {targetDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          timeZoneName: 'short',
          timeZone: 'UTC',
        })}
      </p>
      <div className="flex justify-center gap-4">
        <div className="text-center">
          <div className="text-foreground text-xl font-bold">
            {timeLeft.days}
          </div>
          <div className="text-muted-foreground text-xs uppercase">Days</div>
        </div>
        <div className="text-center">
          <div className="text-foreground text-xl font-bold">
            {timeLeft.hours}
          </div>
          <div className="text-muted-foreground text-xs uppercase">Hours</div>
        </div>
        <div className="text-center">
          <div className="text-foreground text-xl font-bold">
            {timeLeft.minutes}
          </div>
          <div className="text-muted-foreground text-xs uppercase">Min</div>
        </div>
        <div className="text-center">
          <div className="text-foreground text-xl font-bold">
            {timeLeft.seconds}
          </div>
          <div className="text-muted-foreground text-xs uppercase">Sec</div>
        </div>
      </div>
    </div>
  )
}
