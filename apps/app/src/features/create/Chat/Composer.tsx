/**
 * Composer - Message input component for AI chat
 *
 * Features:
 * - Auto-growing textarea up to max height
 * - Send button disabled when empty
 * - Enter to send, Shift+Enter for newlines
 * - Disabled state during loading
 * - Accessible with aria-labels
 */

import { useAtom } from 'jotai'
import { useCallback, useEffect, useRef } from 'react'
import { attachmentsAtom, chatLoadingAtom } from '../Session/atoms'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ComposerProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
}

/**
 * Send icon component
 */
const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

export const Composer = ({ value, onChange, onSend }: ComposerProps) => {
  const [isLoading] = useAtom(chatLoadingAtom)
  const [attachments] = useAtom(attachmentsAtom)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-grow textarea based on content
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto'
    // Set to scrollHeight but cap at max height (120px)
    const maxHeight = 120
    const newHeight = Math.min(textarea.scrollHeight, maxHeight)
    textarea.style.height = `${newHeight}px`
  }, [])

  // Adjust height when value changes
  useEffect(() => {
    adjustHeight()
  }, [value, adjustHeight])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter, but allow Shift+Enter for newlines
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (canSend && !isLoading) {
        onSend()
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  // Can send if there's text OR attachments present
  const hasContent = value.trim().length > 0
  const hasAttachments = attachments.length > 0
  const canSend = (hasContent || hasAttachments) && !isLoading

  return (
    <div className="border-t bg-background p-4">
      <div className="flex gap-2">
        <textarea
          ref={textareaRef}
          className={cn(
            'border-input placeholder:text-muted-foreground focus-visible:ring-ring',
            'min-h-[44px] max-h-[120px] flex-1 resize-none rounded-md border',
            'bg-transparent px-3 py-2 text-sm',
            'focus-visible:outline-none focus-visible:ring-1',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
          placeholder="Type a message..."
          disabled={isLoading}
          rows={1}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          aria-label="Chat message input"
        />
        <Button
          type="button"
          size="icon"
          className="h-[44px] w-[44px]"
          disabled={!canSend}
          onClick={onSend}
          aria-label="Send message"
        >
          <SendIcon />
        </Button>
      </div>
    </div>
  )
}

export default Composer
