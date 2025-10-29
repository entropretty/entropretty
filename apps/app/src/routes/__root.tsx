import "@/globals.css"

import {
  HeadContent,
  Scripts,
  createRootRoute,
  Outlet,
} from "@tanstack/react-router"
import { HelmetProvider } from "react-helmet-async"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/contexts/theme-context"
import { ServiceProvider } from "@/contexts/service-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/sonner"
import ScrollToTop from "@/components/ScrollToTop"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
})

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0",
      },
      {
        title: "Entropretty",
      },
      {
        name: "description",
        content: "Create tattoo designs for your future human individuality.",
      },
      {
        property: "og:url",
        content: "https://app.entropretty.com",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:title",
        content: "Entropretty",
      },
      {
        property: "og:description",
        content: "Create tattoo designs for your future individuality.",
      },
      {
        property: "og:image",
        content: "/open-graph.png",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        property: "twitter:domain",
        content: "app.entropretty.com",
      },
      {
        property: "twitter:url",
        content: "https://app.entropretty.com",
      },
      {
        name: "twitter:title",
        content: "Entropretty",
      },
      {
        name: "twitter:description",
        content: "Create tattoo designs for your future individuality.",
      },
      {
        name: "twitter:image",
        content: "/open-graph.png",
      },
    ],
    links: [
      {
        id: "favicon",
        rel: "icon",
        type: "image/png",
        href: "/favicon/1.png",
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <ServiceProvider>
                <AuthProvider>
                  <Toaster />
                  <ScrollToTop />
                  {children}
                </AuthProvider>
              </ServiceProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </HelmetProvider>
        <Scripts />
      </body>
    </html>
  )
}
