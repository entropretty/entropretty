import { createFileRoute } from '@tanstack/react-router'
import { handleOGImageRequest } from '@/lib/og-handler'

const isDev = process.env.NODE_ENV === 'development'

export const Route = createFileRoute('/api/twitter/$algorithmId')({
  server: {
    handlers: {
      GET: ({ params }) =>
        handleOGImageRequest({
          algorithmId: params.algorithmId,
          imageType: 'twitter',
          bucket: 'twitter',
          forceGenerate: isDev,
        }),
    },
  },
})
