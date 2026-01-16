import { EventCard } from "./EventCard"

export function AssemblySummer2025EventCard() {
  return (
    <EventCard
      title="Entropretty @ ASSEMBLY SUMMER 2025"
      subtitle="5000$ Prize Money"
      description={[
        "We hosted competitions across multiple Entropretty tattoo categories as part of the Assembly Summer 2025 program.",
        "The event took place at Messukeskus, Helsinki from July 31st to August 3rd, 2025, alongside the broader demoscene festival, gaming tournaments, cosplay contests, and more.",
      ]}
      imageSrc="/assets/Assembly-Summer-25-1920x1080-bg.webp"
      logoSrc="/assets/assembly-summer-2025-logo-640w.png"
      logoAlt="Assembly Summer 2025 Logo"
      date="July 31 - August 3, 2025"
      location="Messukeskus, Helsinki"
      linkUrl="https://assembly.org/en/events/summer25"
      linkText="Event Overview"
      isPast={true}
    />
  )
}
