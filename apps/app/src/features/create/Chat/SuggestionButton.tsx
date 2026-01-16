/**
 * SuggestionButton - A clickable prompt suggestion for the welcome screen
 * Renders as an outlined button that triggers a chat message when clicked
 */

import { Button } from '@/components/ui/button'

interface SuggestionButtonProps {
  /** The text content to display and send when clicked */
  text: string
  /** Callback when the suggestion is clicked */
  onClick: (text: string) => void
}

export const SuggestionButton = ({ text, onClick }: SuggestionButtonProps) => {
  return (
    <Button
      variant="outline"
      className="h-auto whitespace-normal px-4 py-3 text-left text-sm"
      onClick={() => onClick(text)}
    >
      {text}
    </Button>
  )
}

export default SuggestionButton
