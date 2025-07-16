import { EventCard } from "./EventCard";

export function AssemblySummer2025EventCard() {
  return (
    <EventCard
      title="Entropretty @ ASSEMBLY SUMMER 2025"
      subtitle="GLOBAL DEMO COMPETITION"
      description={[
        "We will be hosting multiple Entropretty Tattoo Competititons. With a total prize pool of 5000$",
        "Features demoscene competitions, gaming tournaments, cosplay contests, and much more.",
      ]}
      imageSrc="/assets/Assembly-Summer-25-1920x1080-bg.webp"
      logoSrc="/assets/assembly-summer-2025-logo-640w.png"
      logoAlt="Assembly Summer 2025 Logo"
      date="July 31 - August 3, 2025"
      location="Messukeskus, Helsinki"
      linkUrl="https://assembly.org/en/events/summer25"
      linkText="More Info"
      isPast={false}
    />
  );
}
