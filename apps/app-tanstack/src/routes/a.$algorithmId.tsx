import { AlgorithmInfiniteGrid } from '@/components/AlgorithmInfiniteGrid'
import { Skeleton } from '@/components/ui/skeleton'
import { useAlgorithm } from '@/hooks/useAlgorithm'
import { useDisplaySizes } from '@/hooks/useDisplaySizes'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

// Server function to fetch algorithm data for meta tags
const fetchAlgorithmMeta = createServerFn()
  .handler(async ({ data }: { data: { algorithmId: string } }) => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return null
    }

    const supabase = createClient<Database>(supabaseUrl, supabaseKey)

    const { data: algorithm, error } = await supabase
      .from('algorithms_with_user_profile')
      .select('id, name, username, family_kind')
      .eq('id', Number(data.algorithmId))
      .single()

    if (error || !algorithm) {
      return null
    }

    return algorithm
  })

export const Route = createFileRoute('/a/$algorithmId')({
  component: AlgorithmPage,

  // Load algorithm metadata for SEO
  loader: async ({ params }) => {
    try {
      const algorithm = await fetchAlgorithmMeta({ data: { algorithmId: params.algorithmId } })
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
    // On server: use VITE_APP_URL or Netlify's URL env var
    // On client: use window.location.origin
    const baseUrl = typeof window !== 'undefined'
      ? window.location.origin
      : process.env.VITE_APP_URL || process.env.URL || 'https://entropretty.app'
    const ogImageUrl = `${baseUrl}/api/og/${algorithmId}`
    const twitterImageUrl = `${baseUrl}/api/og/${algorithmId}?type=twitter`
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
        { name: 'twitter:image', content: twitterImageUrl },
      ],
    }
  },
})

function AlgorithmPage() {
  const { algorithmId } = Route.useParams()

  const { infinite } = useDisplaySizes()

  const { data: algorithm, isLoading } = useAlgorithm(Number(algorithmId))

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
    <div className="flex flex-col gap-4 p-0 sm:p-8">
      <AlgorithmInfiniteGrid algorithm={algorithm} />
    </div>
  )
}
