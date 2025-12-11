import { createFileRoute } from '@tanstack/react-router'
import { generateOGImage } from '@/lib/og-image-generator'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

export const Route = createFileRoute('/api/og/$algorithmId')({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const { algorithmId } = params
        const url = new URL(request.url)
        const type = url.searchParams.get('type') === 'twitter' ? 'twitter' : 'og'

        const id = Number(algorithmId)
        if (isNaN(id)) {
          return new Response('Invalid algorithm ID', { status: 400 })
        }

        // Get algorithm from database
        const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
        const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
          return new Response('Server configuration error', { status: 500 })
        }

        const supabase = createClient<Database>(supabaseUrl, supabaseKey)

        const { data: algorithm, error } = await supabase
          .from('algorithms_with_user_profile')
          .select('*')
          .eq('id', id)
          .single()

        if (error || !algorithm) {
          return new Response('Algorithm not found', { status: 404 })
        }

        try {
          const imageBuffer = await generateOGImage(
            id,
            algorithm.content!,
            algorithm.family_kind!,
            algorithm.name || `Algorithm #${id}`,
            algorithm.username || 'Anonymous',
            type
          )

          return new Response(imageBuffer, {
            headers: {
              'Content-Type': 'image/png',
              'Cache-Control': 'public, max-age=3600, s-maxage=86400',
            },
          })
        } catch (err) {
          console.error('Error generating OG image:', err)
          return new Response('Error generating image', { status: 500 })
        }
      },
    },
  },
})

