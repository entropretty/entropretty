"use client"

import { useCountdown } from "../hooks/use-countdown"

export default function CurrentCompetition() {
  const countdown = useCountdown(new Date("2025-08-02T13:00:00.000Z"))

  return (
    <div className="my-8">
      <h2 className="mb-4 text-2xl font-bold">Summer Assembly 2025</h2>

      <div className="mb-6">
        <p className="mb-4">
          <strong>Submission Deadline:</strong> Saturday, August 2nd, 2025 at
          01:00:00 UTC.
        </p>
        {countdown && (
          <p className="mb-4">
            <strong>Time left:</strong> <i>{countdown}</i>
          </p>
        )}
        <p>
          <strong>Submission Process:</strong> Submit to Assembly&apos;s
          Partyman system (link will be provided)
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Black & White Competition */}
        <div className="border-foreground border p-4">
          <h4 className="mb-3 text-center text-xl font-semibold">
            Black & White Tattoo
          </h4>
          <p className="mb-2 text-sm">
            Only pure black and white colors are allowed. No shades of gray or
            colors permitted.
          </p>

          <div className="mb-4 flex h-full justify-center pt-10">
            <ul className="space-y-1 text-xl">
              <li>
                1st: <strong>$1,500</strong>
              </li>
              <li>
                2nd: <strong>$500</strong>
              </li>
              <li>
                3rd: <strong>$500</strong>
              </li>
              <li>
                4th: <strong>$500</strong>
              </li>
              <li>
                5th: <strong>$500</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* Wild Competition */}
        <div className="border-foreground flex-col space-y-2 border p-4">
          <h4 className="mb-3 text-center text-xl font-semibold">
            Wild Tattoo
          </h4>
          <p className="text-sm">
            All colors and grayscale allowed. No restrictions on color palette.
            No Black & White entries.
          </p>

          <div className="flex h-full justify-center pt-4">
            <ul className="space-y-1 text-xl">
              <li>
                1st: <strong>$500</strong>
              </li>
              <li>
                2nd: <strong>$500</strong>
              </li>
              <li>
                3rd: <strong>$500</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <p>
          The prize money will be paid out in DOT token equivalent to the
          amount. The amount of DOT will be determined with the conversion rate
          at the date of prize distribution.
        </p>
      </div>

      <div className="mt-6">
        <p>
          <strong>Note:</strong> All other competition rules listed below still
          apply to both competitions.
        </p>
      </div>
    </div>
  )
}
