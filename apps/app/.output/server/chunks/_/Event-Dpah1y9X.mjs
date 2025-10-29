import { jsxs, jsx } from 'react/jsx-runtime';
import { E as EntroprettyLogo } from './EntroprettyLogo-D9fUuJoe.mjs';
import { G as GalleryAlgorithm } from './GalleryAlgorithm-Ddez0jC4.mjs';
import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { useParams, Link } from '@tanstack/react-router';
import { s as supabase } from './router-Dgt9epnn.mjs';
import { useQuery } from '@tanstack/react-query';

function useDateRangeAlgorithmIds(startDate, endDate) {
  return useQuery({
    queryKey: ["algorithms", "ids", "date-range", startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase.from("algorithms_with_user_profile").select("id, created_at").gte("created_at", startDate).lte("created_at", endDate).order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => row.id).filter((id) => id !== null);
    },
    staleTime: 60 * 1e3
    // 1 minute
  });
}
function EventGallery({
  title,
  queryStartDate,
  queryEndDate,
  eventStartDate,
  eventEndDate,
  headerImage,
  website
}) {
  const [algorithmIds, setAlgorithmIds] = useState([]);
  const [displayedIds, setDisplayedIds] = useState([]);
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "400px"
    // Start loading more content before reaching the bottom
  });
  const { data: availableAlgorithmIds, isLoading } = useDateRangeAlgorithmIds(
    queryStartDate,
    queryEndDate
  );
  useEffect(() => {
    if (!availableAlgorithmIds) return;
    setAlgorithmIds(availableAlgorithmIds);
    const initialBatch = availableAlgorithmIds.slice(0, 64);
    setDisplayedIds(initialBatch);
  }, [availableAlgorithmIds]);
  const loadMore = useCallback(() => {
    if (!algorithmIds.length) return;
    const currentLength = displayedIds.length;
    const nextBatch = algorithmIds.slice(currentLength, currentLength + 32);
    if (nextBatch.length > 0) {
      setDisplayedIds((prev) => [...prev, ...nextBatch]);
    }
  }, [algorithmIds, displayedIds.length]);
  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "relative flex flex-col", children: /* @__PURE__ */ jsxs("div", { className: "p-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "mb-8 text-center text-3xl font-bold", children: title }),
      /* @__PURE__ */ jsx("div", { className: "text-center text-gray-600", children: "Loading algorithms..." })
    ] }) });
  }
  if (!availableAlgorithmIds || availableAlgorithmIds.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "relative flex flex-col", children: /* @__PURE__ */ jsxs("div", { className: "p-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "mb-8 text-center text-3xl font-bold", children: title }),
      /* @__PURE__ */ jsx("div", { className: "text-center text-gray-600", children: "No algorithms found for the specified date range." })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-8", children: [
      headerImage && /* @__PURE__ */ jsx("div", { className: "mb-6 flex justify-center", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: headerImage,
          alt: `${title} Logo`,
          className: "h-24 w-auto object-contain"
        }
      ) }),
      /* @__PURE__ */ jsxs("p", { className: "mb-4 text-center text-gray-600", children: [
        new Date(eventStartDate).toLocaleDateString(),
        " to",
        " ",
        new Date(eventEndDate).toLocaleDateString()
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mb-8 text-center text-sm text-gray-500", children: [
        "Showing ",
        availableAlgorithmIds.length,
        " algorithms from the extended submission period"
      ] }),
      website && /* @__PURE__ */ jsx("div", { className: "mb-6 text-center", children: /* @__PURE__ */ jsxs(
        "a",
        {
          href: website,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300",
          children: [
            "Event Website",
            /* @__PURE__ */ jsx(
              "svg",
              {
                className: "h-4 w-4",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  }
                )
              }
            )
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: `relative flex w-full flex-col`, children: [
      /* @__PURE__ */ jsx("div", { className: "h-full w-full p-4", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex w-full flex-wrap items-center justify-evenly gap-2", children: [
        displayedIds.map((id, index) => /* @__PURE__ */ jsx(GalleryAlgorithm, { algorithmId: id }, `${id}-${index}`)),
        displayedIds.length < algorithmIds.length && /* @__PURE__ */ jsx("div", { ref, className: "h-4 w-full" })
      ] }) }),
      /* @__PURE__ */ jsx(Link, { to: "/hot", children: /* @__PURE__ */ jsx("div", { className: "bg-background border-background-200 fixed bottom-0 right-0 flex w-auto items-center justify-center gap-8 gap-y-2 border px-8 py-4 sm:pb-4", children: /* @__PURE__ */ jsx(EntroprettyLogo, {}) }) })
    ] })
  ] });
}
const eventConfig = {
  "summer-assembly-2025": {
    title: "Summer Assembly 2025",
    // Query dates for algorithm filtering (extended period)
    queryStartDate: "2025-06-01T00:00:00Z",
    queryEndDate: "2025-08-03T23:59:59Z",
    // Actual event dates for display
    eventStartDate: "2025-07-31T00:00:00Z",
    eventEndDate: "2025-08-03T23:59:59Z",
    headerImage: "/assets/assembly-summer-2025-logo-640w-black-clean.png",
    description: "The premier summer demoparty experience",
    website: "https://assembly.org/en/events/summer25"
  },
  "winter-assembly-2025": {
    title: "Winter Assembly 2025",
    // Query dates for algorithm filtering (extended period)
    queryStartDate: "2025-01-01T00:00:00Z",
    queryEndDate: "2025-02-23T23:59:59Z",
    // Actual event dates for display
    eventStartDate: "2025-02-20T00:00:00Z",
    eventEndDate: "2025-02-23T23:59:59Z",
    headerImage: "/assets/assembly-winter-2025-logo-640w-black-clean.png",
    description: "Kicking off the new year with creative coding",
    website: "https://assembly.org/en/events/winter25"
  },
  "revision-2025": {
    title: "Revision 2025",
    // Query dates for algorithm filtering (extended period)
    queryStartDate: "2025-02-24T00:00:00Z",
    queryEndDate: "2025-04-21T23:59:59Z",
    // Actual event dates for display
    eventStartDate: "2025-04-18T00:00:00Z",
    eventEndDate: "2025-04-21T23:59:59Z",
    headerImage: "/assets/revision-2025-logo.png",
    description: "The legendary Easter demoparty",
    website: "https://2025.revision-party.net/"
  }
};
function EventPage() {
  const params = useParams({ from: "/_layout/event/$eventId" });
  const eventId = params.eventId;
  const config = eventConfig[eventId];
  if (!config) {
    return /* @__PURE__ */ jsxs("div", { className: "flex h-screen w-full flex-col items-center justify-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "mb-4 text-2xl font-bold", children: "Event Not Found" }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-600", children: [
        'The event "',
        eventId,
        '" was not found.'
      ] })
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: "flex h-screen w-full flex-col", children: /* @__PURE__ */ jsx(
    EventGallery,
    {
      title: config.title,
      queryStartDate: config.queryStartDate,
      queryEndDate: config.queryEndDate,
      eventStartDate: config.eventStartDate,
      eventEndDate: config.eventEndDate,
      headerImage: config.headerImage,
      website: config.website
    }
  ) });
}

export { EventPage as E, eventConfig as e };
//# sourceMappingURL=Event-Dpah1y9X.mjs.map
