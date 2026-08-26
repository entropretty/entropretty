import { Link } from '@tanstack/react-router'
import type { AlgorithmView } from '@/lib/helper.types'

export const AlgorithmInfo = ({ algorithm }: { algorithm: AlgorithmView }) => {
  return (
    <div className="flex flex-col text-sm text-gray-600">
      <div>
        <span>
          {`${algorithm.name || 'Untitled'} `}
          <Link
            className="text-muted-foreground underline"
            to="/a/$algorithmId"
            params={{ algorithmId: String(algorithm.id) }}
          >{`/a/${algorithm.id}`}</Link>
        </span>

        {algorithm.remix_of && (
          <>
            {` remix of `}
            <Link
              className="text-muted-foreground underline"
              to="/a/$algorithmId"
              params={{ algorithmId: String(algorithm.remix_of) }}
            >{`/a/${algorithm.remix_of}`}</Link>
          </>
        )}
      </div>
      <div>
        {`by `}
        <Link
          className="text-muted-foreground underline"
          to="/u/$username"
          params={{ username: algorithm.username || 'Anonymous' }}
        >
          {algorithm.username || 'Anonymous'}
        </Link>
      </div>
    </div>
  )
}
