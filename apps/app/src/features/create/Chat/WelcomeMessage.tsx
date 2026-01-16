/**
 * WelcomeMessage - Shown when chat has no messages
 * Displays greeting, intro text, and suggested prompts
 */

import { SuggestionButton } from './SuggestionButton'

/** Default suggestions always shown */
const DEFAULT_SUGGESTIONS = [
  'Create a geometric mandala pattern',
  'Help me understand the seed system',
]

/** Suggestion shown only when user has custom code */
const CUSTOM_CODE_SUGGESTION = 'Make my design more tattoo-friendly'

interface WelcomeMessageProps {
  /** Whether the user has custom code in the editor */
  hasCustomCode: boolean
  /** Callback when a suggestion is clicked */
  onSuggestionClick: (text: string) => void
}

export const WelcomeMessage = ({
  hasCustomCode,
  onSuggestionClick,
}: WelcomeMessageProps) => {
  const suggestions = hasCustomCode
    ? [...DEFAULT_SUGGESTIONS, CUSTOM_CODE_SUGGESTION]
    : DEFAULT_SUGGESTIONS

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <h2 className="mb-2 text-xl font-semibold">How can I help?</h2>
      <p className="text-muted-foreground mb-6 max-w-md text-sm">
        I can help you create and modify visual algorithms. Describe what you
        want to create or ask questions about the seed system.
      </p>
      <div className="flex max-w-md flex-col gap-2">
        {suggestions.map((suggestion) => (
          <SuggestionButton
            key={suggestion}
            text={suggestion}
            onClick={onSuggestionClick}
          />
        ))}
      </div>
    </div>
  )
}

export default WelcomeMessage
