import { EventCard } from "./EventCard";

export function PastRevision2025EventCard() {
  return (
    <EventCard
      title="REVISION 2025"
      subtitle="GLOBAL COMPETITION"
      description={[
        "We hosted a competition at Revision 2025. The event took place at E Werk, Saarbrücken, Germany from April 16th to April 19th, 2025.",
      ]}
      imageSrc="/assets/revision-2025-bg.jpg"
      logoSrc="/assets/revision-2025-logo.png"
      logoAlt="Revision 2025 Logo"
      date="April 18-21, 2025"
      location="E Werk, Saarbrücken, Germany"
      linkUrl="https://www.pouet.net/party_results.php?which=1550&when=2025&font=1"
      linkText="View Competition Results"
      isPast={true}
    />
  );
}
