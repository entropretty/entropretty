import { createClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import type { Database } from '@/lib/database.types'
import { AlgorithmInfiniteGrid } from '@/components/AlgorithmInfiniteGrid'
import { AlgorithmHero } from '@/components/AlgorithmHero'
import { Skeleton } from '@/components/ui/skeleton'
import { useAlgorithm } from '@/hooks/useAlgorithm'
import { useDisplaySizes } from '@/hooks/useDisplaySizes'
import { useRef, useCallback, useEffect } from 'react'

// Server function to fetch algorithm data for meta tags
const fetchAlgorithmMeta = createServerFn().handler(
  async ({ data }: { data: { algorithmId: string; baseUrl?: string } }) => {
    const supabaseUrl =
      process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseKey =
      process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return null
    }

    const supabase = createClient<Database>(supabaseUrl, supabaseKey)

    const { data: algorithm, error } = await supabase
      .from('algorithms_with_user_profile')
      .select('id, name, username, family_kind')
      .eq('id', Number(data.algorithmId))
      .single()

    if (error || !algorithm.id) {
      return null
    }

    return { ...algorithm, baseUrl: data.baseUrl }
  },
)

export const Route = createFileRoute('/a/$algorithmId')({
  component: AlgorithmPage,

  // Load algorithm metadata for SEO
  loader: async ({ params }) => {
    try {
      const algorithm = await fetchAlgorithmMeta({
        data: { algorithmId: params.algorithmId },
      })
      return { algorithm }
    } catch {
      return { algorithm: null }
    }
  },

  // Dynamic head/meta tags for OG and Twitter cards
  head: ({ loaderData, params }) => {
    const algorithm = loaderData?.algorithm
    const algorithmId = params.algorithmId
    const title = algorithm?.name
      ? `${algorithm.name} - Entropretty`
      : `Algorithm #${algorithmId} - Entropretty`
    const description = algorithm?.username
      ? `Generative art algorithm by ${algorithm.username} on Entropretty`
      : 'Generative art algorithm on Entropretty'

    // Use absolute URL for OG images
    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.VITE_APP_URL || 'https://app.entropretty.com'
    const ogImageUrl = `https://sitgiqrjikarjzuizlbq.supabase.co/storage/v1/object/public/opengraph/${algorithmId}.png`
    const twitterImageUrl = `https://sitgiqrjikarjzuizlbq.supabase.co/storage/v1/object/public/twitter/${algorithmId}.png`
    const pageUrl = `${baseUrl}/a/${algorithmId}`

    return {
      meta: [
        { title },
        { name: 'description', content: description },

        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: pageUrl },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: ogImageUrl },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:site_name', content: 'Entropretty' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        {
          name: 'twitter:image',
          content: twitterImageUrl,
        },
        { name: 'twitter:image:height', content: '630' },
        { name: 'twitter:image:width', content: '1200' },
        { name: 'twitter:site', content: '@entropretty' },
        { name: 'twitter:image:type', content: 'image/png' },
      ],
    }
  },
})

function AlgorithmPage() {
  const { algorithmId } = Route.useParams()
  const gridRef = useRef<HTMLDivElement>(null)

  const { infinite } = useDisplaySizes()

  const { data: algorithm, isLoading } = useAlgorithm(Number(algorithmId))

  // Scroll to top when visiting this route
  useEffect(() => {
    const scrollContainer = document.getElementById('main-scroll-container')
    if (scrollContainer) {
      scrollContainer.scrollTo(0, 0)
    }
  }, [algorithmId])

  const scrollToGrid = useCallback(() => {
    gridRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  if (isLoading) {
    return (
      <div className="h-full w-full p-4">
        <div className="flex flex-col gap-4 p-0 sm:p-8">
          <div className="mx-auto flex w-full flex-wrap items-center justify-evenly gap-4 sm:gap-16">
            {Array(48)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  style={{ width: infinite, height: infinite }}
                  className={`aspect-square rounded-none`}
                />
              ))}
          </div>
        </div>
      </div>
    )
  }

  if (!algorithm) {
    return <div>Algorithm not found</div>
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section - Full screen cover */}
      <AlgorithmHero algorithm={algorithm} onScrollDown={scrollToGrid} />

      {/* Infinite Grid Section */}
      <div ref={gridRef} className="min-h-screen p-0 sm:p-8">
        <AlgorithmInfiniteGrid algorithm={algorithm} hideBottomBar />
      </div>
    </div>
  )
}
