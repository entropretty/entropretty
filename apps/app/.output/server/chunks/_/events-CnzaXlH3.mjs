import { jsx, jsxs } from 'react/jsx-runtime';
import { Link } from '@tanstack/react-router';
import { e as eventConfig } from './Event-Dpah1y9X.mjs';
import './EntroprettyLogo-D9fUuJoe.mjs';
import './utils-CZo72ztR.mjs';
import 'clsx';
import 'tailwind-merge';
import './GalleryAlgorithm-Ddez0jC4.mjs';
import './useAlgorithm-CZ_W-qjG.mjs';
import './router-Dgt9epnn.mjs';
import 'react-helmet-async';
import '@tanstack/react-query';
import 'react';
import 'comlink';
import 'p-queue';
import '@supabase/supabase-js';
import 'next-themes';
import 'sonner';
import './FamilyKindBadge-8clZ-XnL.mjs';
import 'class-variance-authority';
import './button-CeG_45YZ.mjs';
import '@radix-ui/react-slot';
import './AlgorithmBitmap-CIcD_7lU.mjs';
import './index-CWNUk7Yv.mjs';
import './skeleton-CSd4mn2E.mjs';
import './useUsersLikes-Bs2eUBG1.mjs';
import 'lucide-react';
import 'react-intersection-observer';

function EventsPage() {
  const events = Object.entries(eventConfig).map(([id, config]) => ({
    id,
    ...config
  }));
  const sortedEvents = events.sort(
    (a, b) => new Date(a.eventStartDate).getTime() - new Date(b.eventStartDate).getTime()
  );
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen w-full", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl p-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-12 text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "mb-4 text-4xl font-bold", children: "Events" }),
      /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-600", children: "Explore algorithmic art from demoparties and competitions" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: sortedEvents.map((event) => /* @__PURE__ */ jsxs(
      Link,
      {
        to: `/event/${event.id}`,
        className: "dark:hover:bg-gray-750 group block border border-gray-200 bg-white p-6 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800",
        children: [
          event.headerImage && /* @__PURE__ */ jsx("div", { className: "mb-4 flex justify-center", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: event.headerImage,
              alt: `${event.title} Logo`,
              className: "h-16 w-auto object-contain"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "mb-3 text-center text-sm text-gray-500 dark:text-gray-400", children: [
            new Date(event.eventStartDate).toLocaleDateString(),
            " -",
            " ",
            new Date(event.eventEndDate).toLocaleDateString()
          ] }),
          event.website && /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxs(
            "a",
            {
              href: event.website,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300",
              onClick: (e) => e.stopPropagation(),
              children: [
                "Event Website",
                /* @__PURE__ */ jsx(
                  "svg",
                  {
                    className: "h-3 w-3",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      }
                    )
                  }
                )
              ]
            }
          ) })
        ]
      },
      event.id
    )) }),
    /* @__PURE__ */ jsx("div", { className: "mt-12 text-center text-sm text-gray-500", children: /* @__PURE__ */ jsxs("p", { children: [
      "Each event showcases algorithms created during the specified time period.",
      /* @__PURE__ */ jsx("br", {}),
      "Click on any event to explore the submissions and see the creative evolution."
    ] }) })
  ] }) });
}
const SplitComponent = EventsPage;

export { SplitComponent as component };
//# sourceMappingURL=events-CnzaXlH3.mjs.map
