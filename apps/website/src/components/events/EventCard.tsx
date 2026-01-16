import Image from "next/image"

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
    <div className="border-border bg-card hover:bg-secondary/50 group flex h-full flex-col overflow-hidden border transition-colors">
      <div className="relative h-48 sm:h-56">
        <Image
          src={imageSrc}
          alt={`${title} Background`}
          className="h-full w-full object-cover"
          width={640}
          height={480}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <Image
            src={logoSrc}
            alt={logoAlt}
            className="max-h-24 w-auto max-w-[80%] sm:max-h-28"
            width={640}
            height={192}
          />
        </div>
        {isPast && (
          <div className="border-border bg-background absolute right-2 top-2 border px-2 py-1 text-xs">
            Past Event
          </div>
        )}
        <div className="bg-primary text-primary-foreground absolute bottom-0 left-0 px-3 py-1.5 text-xs">
          {date}
        </div>
      </div>

      <div className="flex flex-grow flex-col p-4 sm:p-6">
        <div className="flex-grow">
          <h3 className="text-lg font-medium leading-tight">{title}</h3>
          <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>

          {description.map((line, index) => (
            <p
              key={index}
              className="text-muted-foreground mt-3 hidden text-sm sm:block"
            >
              {line}
            </p>
          ))}
        </div>

        <div className="border-border mt-4 border-t pt-4">
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline"
          >
            {linkText}
            <span>→</span>
          </a>
        </div>
      </div>
    </div>
  )
}
