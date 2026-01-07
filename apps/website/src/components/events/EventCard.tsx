import Image from "next/image"
import { Button } from "../ui/button"

export interface EventCardProps {
  title: string
  subtitle: string
  description: string[]
  imageSrc: string
  logoSrc: string
  logoAlt: string
  date: string
  location: string
  linkUrl: string
  linkText: string
  isPast?: boolean
}

export function EventCard({
  title,
  subtitle,
  description,
  imageSrc,
  logoSrc,
  logoAlt,
  date,
  linkUrl,
  linkText,
  isPast = false,
}: EventCardProps) {
  return (
    <div className="text-md flex flex-col overflow-hidden bg-black font-sans text-white transition-all hover:scale-[1.02] hover:shadow-lg">
      <div className="relative h-64">
        <Image
          src={imageSrc}
          alt={`${title} Background`}
          className="h-full w-full object-cover"
          width={640}
          height={480}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={logoSrc}
            alt={logoAlt}
            className="max-h-32 w-auto max-w-[90%]"
            width={640}
            height={192}
          />
        </div>
        {isPast && (
          <div className="absolute right-2 top-2 rounded bg-gray-800 px-2 py-1 text-sm text-white">
            Past Event
          </div>
        )}
        <div className="absolute bottom-0 left-0 bg-black px-4 py-2 text-sm text-white">
          {date}
        </div>
      </div>

      <div className="flex flex-grow flex-col space-y-4 p-4">
        <div className="flex flex-grow flex-col gap-1">
          <h1 className="text-2xl font-bold">{title}</h1>
          <h2 className="text-xl text-white">{subtitle}</h2>

          {description.map((line, index) => (
            <p key={index} className="hidden py-2 text-gray-300 sm:block">
              {line}
            </p>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <Button
            variant="link"
            className="text-white hover:text-gray-300"
            asChild
          >
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">
              {linkText}
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
