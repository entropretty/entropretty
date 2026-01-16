import { createClient } from '@supabase/supabase-js'
import { generateOGImage } from '@entropretty/opengraph'
import type { Database } from '@/lib/database.types'

type ImageType = 'og' | 'twitter'

interface OGImageRequestOptions {
  algorithmId: string
  imageType: ImageType
  bucket: string
  forceGenerate?: boolean
}

export async function handleOGImageRequest(
  options: OGImageRequestOptions,
): Promise<Response> {
  const { algorithmId, imageType, bucket, forceGenerate = false } = options

  const id = Number(algorithmId)
  if (isNaN(id)) {
    return new Response('Invalid algorithm ID', { status: 400 })
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SECRET_KEY

  if (!supabaseUrl || !supabaseKey) {
    return new Response('Server configuration error', { status: 500 })
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey)

  if (!forceGenerate) {
    const { data: exists } = await supabase.storage
      .from(bucket)
      .exists(`${id}.png`)

    if (exists) {
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(`${id}.png`)
      return Response.redirect(publicUrl, 302)
    }
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
      imageType,
    )

    if (!forceGenerate) {
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(`${id}.png`, imageBuffer, { contentType: 'image/png' })

      if (uploadError) {
        console.error(`Error uploading ${imageType} image:`, uploadError)
        return new Response('Error uploading image', { status: 500 })
      }
    }

    return new Response(new Uint8Array(imageBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    })
  } catch (err) {
    console.error(`Error generating ${imageType} image:`, err)
    return new Response('Error generating image', { status: 500 })
  }
}
