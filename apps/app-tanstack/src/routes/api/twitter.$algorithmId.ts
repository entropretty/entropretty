import { generateOGImage } from '@entropretty/opengraph'
import { createClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'
import type { Database } from '@/lib/database.types'

export const Route = createFileRoute('/api/twitter/$algorithmId')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { algorithmId } = params

        const id = Number(algorithmId)
        if (isNaN(id)) {
          return new Response('Invalid algorithm ID', { status: 400 })
        }

        // Get algorithm from database
        const supabaseUrl =
          process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
        const supabaseKey = process.env.SUPABASE_SECRET_KEY

        if (!supabaseUrl || !supabaseKey) {
          return new Response('Server configuration error', { status: 500 })
        }

        const supabase = createClient<Database>(supabaseUrl, supabaseKey)
        const { data: exists } = await supabase.storage
          .from('twitter')
          .exists(`${id}.png`)

        if (exists) {
          const {
            data: { publicUrl },
          } = await supabase.storage.from('twitter').getPublicUrl(`${id}.png`)
          return Response.redirect(publicUrl, 302)
        }

        const { data: algorithm, error } = await supabase
          .from('algorithms_with_user_profile')
          .select('*')
          .eq('id', id)
          .single()

        if (error || !algorithm.content) {
          return new Response('Algorithm not found', { status: 404 })
        }

        try {
          const imageBuffer = await generateOGImage(
            id,
            algorithm.content,
            algorithm.family_kind!,
            algorithm.name || `Algorithm #${id}`,
            algorithm.username || 'Anonymous',
            'twitter',
          )
          const { error: uploadError } = await supabase.storage
            .from('twitter')
            .upload(`${id}.png`, imageBuffer, {
              contentType: 'image/png',
            })
          if (uploadError) {
            console.error('Error uploading Twitter card image:', uploadError)
            return new Response('Error uploading image', { status: 500 })
          }

          return new Response(new Uint8Array(imageBuffer), {
            headers: {
              'Content-Type': 'image/png',
              'Cache-Control': 'public, max-age=3600, s-maxage=86400',
            },
          })
        } catch (err) {
          console.error('Error generating Twitter card image:', err)
          return new Response('Error generating image', { status: 500 })
        }
      },
    },
  },
})
