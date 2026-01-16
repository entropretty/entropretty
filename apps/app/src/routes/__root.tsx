import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useLocation,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Toaster } from 'sonner'

import { AuthProvider } from '../contexts/auth-context'
import { ServiceProvider } from '../contexts/service-context'
import { ThemeProvider } from '../contexts/theme-context'
import HeaderLayout from '../layouts/HeaderLayout'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => {
    const randomFaviconNumber = Math.floor(Math.random() * 13) + 1
    return {
      meta: [
        {
          charSet: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          title: 'Entropretty',
        },
        {
          name: 'description',
          content: 'Create tattoo designs for your future human individuality.',
        },
        // Facebook Meta Tags
        {
          property: 'og:url',
          content: 'https://app.entropretty.com',
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:title',
          content: 'Entropretty',
        },
        {
          property: 'og:description',
          content: 'Create tattoo designs for your future individuality.',
        },
        {
          property: 'og:image',
          content: '/open-graph.png',
        },
        // Twitter Meta Tags
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          property: 'twitter:domain',
          content: 'app.entropretty.com',
        },
        {
          property: 'twitter:url',
          content: 'https://app.entropretty.com',
        },
        {
          name: 'twitter:title',
          content: 'Entropretty',
        },
        {
          name: 'twitter:description',
          content: 'Create tattoo designs for your future individuality.',
        },
        {
          name: 'twitter:image',
          content: '/open-graph.png',
        },
      ],
      links: [
        // Preconnect to Google Fonts for faster font loading
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossOrigin: 'anonymous',
        },
        {
          rel: 'stylesheet',
          href: appCss,
        },
        {
          id: 'favicon',
          rel: 'icon',
          type: 'image/png',
          href: `/favicon/${randomFaviconNumber}.png`,
        },
      ],
    }
  },

  shellComponent: RootDocument,
  component: RootComponent,
})

// Routes that should render without the HeaderLayout
const HEADERLESS_ROUTES = ['/demo/', '/login', '/signup']

function shouldShowHeader(pathname: string): boolean {
  return !HEADERLESS_ROUTES.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(route.endsWith('/') ? route : `${route}/`),
  )
}

function RootComponent() {
  const location = useLocation()

  if (!shouldShowHeader(location.pathname)) {
    return (
      <main className="relative flex h-full w-full flex-col items-center">
        <Outlet />
      </main>
    )
  }

  return <HeaderLayout />
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <ServiceProvider>
              {children}
              <Toaster />
              <TanStackDevtools
                config={{
                  position: 'bottom-right',
                }}
                plugins={[
                  {
                    name: 'Tanstack Router',
                    render: <TanStackRouterDevtoolsPanel />,
                  },
                  TanStackQueryDevtools,
                ]}
              />
            </ServiceProvider>
          </AuthProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
