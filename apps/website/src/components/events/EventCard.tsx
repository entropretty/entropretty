import Image from "next/image";

export interface EventCardProps {
  title: string;
  subtitle: string;
  description: string[];
  imageSrc: string;
  logoSrc: string;
  logoAlt: string;
  date: string;
  location: string;
  linkUrl: string;
  linkText: string;
  isPast?: boolean;
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
    <div className="group flex h-full flex-col overflow-hidden border border-border bg-card transition-colors hover:bg-secondary/50">
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
          <div className="absolute right-2 top-2 border border-border bg-background px-2 py-1 text-xs">
            Past Event
          </div>
        )}
        <div className="absolute bottom-0 left-0 bg-primary px-3 py-1.5 text-xs text-primary-foreground">
          {date}
        </div>
      </div>

      <div className="flex flex-grow flex-col p-4 sm:p-6">
        <div className="flex-grow">
          <h3 className="text-lg font-medium leading-tight">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>

          {description.map((line, index) => (
            <p
              key={index}
              className="mt-3 hidden text-sm text-muted-foreground sm:block"
            >
              {line}
            </p>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-foreground underline-offset-4 hover:underline"
          >
            {linkText}
            <span>→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
