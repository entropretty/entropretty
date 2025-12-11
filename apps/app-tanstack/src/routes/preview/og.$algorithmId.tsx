import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/preview/og/$algorithmId')({
  component: OGPreviewPage,
})

function OGPreviewPage() {
  const { algorithmId } = Route.useParams()

  const ogUrl = `/api/og/${algorithmId}`
  const twitterUrl = `/api/og/${algorithmId}?type=twitter`

  return (
    <div className="flex flex-col gap-8 p-8">
      <h1 className="text-2xl font-bold">OG Image Preview - Algorithm #{algorithmId}</h1>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Open Graph Image (1200x630)</h2>
        <p className="text-sm text-gray-500">Used by Facebook, LinkedIn, Discord, etc.</p>
        <div className="border border-gray-200 inline-block">
          <img
            src={ogUrl}
            alt="OG Preview"
            className="max-w-full"
            style={{ width: 1200, height: 630 }}
          />
        </div>
        <div className="flex gap-2">
          <a
            href={ogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline text-sm"
          >
            Open in new tab
          </a>
          <span className="text-gray-400">|</span>
          <code className="text-xs bg-gray-100 px-2 py-1 rounded">{ogUrl}</code>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Twitter Card Image (1200x600)</h2>
        <p className="text-sm text-gray-500">Used by Twitter/X</p>
        <div className="border border-gray-200 inline-block">
          <img
            src={twitterUrl}
            alt="Twitter Preview"
            className="max-w-full"
            style={{ width: 1200, height: 600 }}
          />
        </div>
        <div className="flex gap-2">
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline text-sm"
          >
            Open in new tab
          </a>
          <span className="text-gray-400">|</span>
          <code className="text-xs bg-gray-100 px-2 py-1 rounded">{twitterUrl}</code>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-8 p-4 bg-gray-50 rounded">
        <h2 className="text-lg font-semibold">How to test</h2>
        <ul className="list-disc list-inside text-sm space-y-2">
          <li>
            <strong>Facebook:</strong>{' '}
            <a
              href="https://developers.facebook.com/tools/debug/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Facebook Sharing Debugger
            </a>
          </li>
          <li>
            <strong>Twitter:</strong>{' '}
            <a
              href="https://cards-dev.twitter.com/validator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Twitter Card Validator
            </a>
          </li>
          <li>
            <strong>LinkedIn:</strong>{' '}
            <a
              href="https://www.linkedin.com/post-inspector/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              LinkedIn Post Inspector
            </a>
          </li>
          <li>
            <strong>General:</strong>{' '}
            <a
              href="https://www.opengraph.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              OpenGraph.xyz
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

