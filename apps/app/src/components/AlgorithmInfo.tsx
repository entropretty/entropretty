import { AlgorithmView } from "@/lib/helper.types"
import { Link } from "react-router"

export const AlgorithmInfo = ({ algorithm }: { algorithm: AlgorithmView }) => {
  return (
    <div className="flex flex-col text-sm text-gray-600">
      <div>
        <span>
          {`${algorithm.name || "Untitled"} `}
          <Link
            className="text-muted-foreground underline"
            to={`/a/${algorithm.id}`}
          >{`/a/${algorithm.id}`}</Link>
        </span>

        {algorithm.remix_of && (
          <>
            {` remix of `}
            <Link
              className="text-muted-foreground underline"
              to={`/a/${algorithm.remix_of}`}
            >{`/a/${algorithm.remix_of}`}</Link>
          </>
        )}
      </div>
      <div>
        {`by `}
        <Link
          className="text-muted-foreground underline"
          to={`/u/${algorithm.username || "Anonymous"}`}
        >
          {algorithm.username || "Anonymous"}
        </Link>
      </div>
    </div>
  )
}
