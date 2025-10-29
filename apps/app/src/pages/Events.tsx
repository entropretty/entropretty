/**
 * Events - Index page listing all available events
 */

import { Link } from "@tanstack/react-router"
import { eventConfig } from "./Event"

export default function EventsPage() {
  const events = Object.entries(eventConfig).map(([id, config]) => ({
    id,
    ...config,
  }))

  // Sort events by event start date
  const sortedEvents = events.sort(
    (a, b) =>
      new Date(a.eventStartDate).getTime() -
      new Date(b.eventStartDate).getTime(),
  )

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto max-w-6xl p-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Events</h1>
          <p className="text-xl text-gray-600">
            Explore algorithmic art from demoparties and competitions
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedEvents.map((event) => (
            <Link
              key={event.id}
              to={`/event/${event.id}`}
              className="dark:hover:bg-gray-750 group block border border-gray-200 bg-white p-6 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Event Logo */}
              {event.headerImage && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={event.headerImage}
                    alt={`${event.title} Logo`}
                    className="h-16 w-auto object-contain"
                  />
                </div>
              )}

              {/* Event Dates */}
              <div className="mb-3 text-center text-sm text-gray-500 dark:text-gray-400">
                {new Date(event.eventStartDate).toLocaleDateString()} -{" "}
                {new Date(event.eventEndDate).toLocaleDateString()}
              </div>

              {/* Website Link */}
              {event.website && (
                <div className="flex justify-center">
                  <a
                    href={event.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Event Website
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            Each event showcases algorithms created during the specified time
            period.
            <br />
            Click on any event to explore the submissions and see the creative
            evolution.
          </p>
        </div>
      </div>
    </div>
  )
}
