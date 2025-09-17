import Link from "next/link";
import { PastWinterAssemblyEventCard } from "./PastWinterAssemblyEventCard";
import { PastRevision2025EventCard } from "./PastRevision2025EventCard";
import { AssemblySummer2025EventCard } from "./AssemblySummer2025EventCard";

export function EventsSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Competitions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Catch up on our latest competitions, explore the highlights, and
            discover where Entropretty has been active recently.
          </p>
          <div className="mt-8 flex items-center justify-center">
            <Link
              href="/rules"
              className="text-lg text-blue-600 hover:text-blue-800 underline"
            >
              Read Competition Rules →
            </Link>
          </div>
        </div>

        <div className="space-y-16">
          {/* Past events section */}
          <div className="flex flex-col h-full">
            <h3 className="text-2xl font-semibold mb-6 text-foreground">
              Past Events
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AssemblySummer2025EventCard />
              <PastRevision2025EventCard />
              <PastWinterAssemblyEventCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
