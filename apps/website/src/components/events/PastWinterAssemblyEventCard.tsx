import { EventCard } from "./EventCard";

export function PastWinterAssemblyEventCard() {
  return (
    <EventCard
      title="ASSEMBLY WINTER 2025"
      subtitle="3000$ Prize Money"
      description={[
        "We hosted a competition at Assembly Winter 2025. The event took place at Messukeskus, Helsinki from February 20th to February 23rd, 2025.",
      ]}
      imageSrc="/assets/Assembly-Winter-25-640w.webp"
      logoSrc="/assets/assembly-winter-2025-logo-640w.png"
      logoAlt="Assembly Winter 2025 Logo"
      date="February 20-23, 2025"
      location="Messukeskus, Helsinki"
      linkUrl="https://www.pouet.net/party_results.php?which=1898&when=2025"
      linkText="View Competition Results"
      isPast={true}
    />
  );
}
