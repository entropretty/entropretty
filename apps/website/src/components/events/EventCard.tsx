import Image from "next/image";
import { Button } from "../ui/button";

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
    <div className="overflow-hidden bg-black font-sans text-md text-white hover:shadow-lg transition-all hover:scale-[1.02] flex flex-col">
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
          <div className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 rounded text-sm">
            Past Event
          </div>
        )}
        <div className="absolute bottom-0 left-0 bg-black text-white px-4 py-2 text-sm">
          {date}
        </div>
      </div>

      <div className="space-y-4 p-4 flex-grow flex flex-col">
        <div className="flex flex-col gap-1 flex-grow">
          <h1 className="text-2xl font-bold">{title}</h1>
          <h2 className="text-xl text-white">{subtitle}</h2>

          {description.map((line, index) => (
            <p key={index} className="text-gray-300 py-2">
              {line}
            </p>
          ))}
        </div>

        <div className="flex items-center justify-between mt-auto">
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
  );
}
