/**
 * ChatTab - AI assistant chat interface for the create page
 * This is the main container component for the AI chat feature
 */

import { useAtom } from 'jotai'
import { useCallback, useState } from 'react'
import { chatLoadingAtom, chatMessagesAtom } from '../Session/atoms'
import { editorCodeAtom } from '../atoms'
import { WelcomeMessage } from './WelcomeMessage'

/**
 * ThreadContainer - Displays chat messages or welcome screen
 */
interface ThreadContainerProps {
  onSuggestionClick: (text: string) => void
}

const ThreadContainer = ({ onSuggestionClick }: ThreadContainerProps) => {
  const [messages] = useAtom(chatMessagesAtom)
  const [editorCode] = useAtom(editorCodeAtom)

  // Consider code "custom" if it's non-empty and not just whitespace
  const hasCustomCode = editorCode.trim().length > 0

  if (messages.length === 0) {
    return (
      <WelcomeMessage
        hasCustomCode={hasCustomCode}
        onSuggestionClick={onSuggestionClick}
      />
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
      {/* Messages will be rendered here in a later task */}
      <div className="text-muted-foreground text-sm">
        {messages.length} message(s)
      </div>
    </div>
  )
}

/**
 * Composer - Message input area with send button
 * Sticky at the bottom of the chat panel
 */
interface ComposerProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
}

const Composer = ({ value, onChange, onSend }: ComposerProps) => {
  const [isLoading] = useAtom(chatLoadingAtom)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter, but allow Shift+Enter for newlines
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !isLoading) {
        onSend()
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const canSend = value.trim().length > 0 && !isLoading

  return (
    <div className="border-t bg-background p-4">
      <div className="flex gap-2">
        <textarea
          className="border-input placeholder:text-muted-foreground focus-visible:ring-ring min-h-[44px] max-h-[120px] flex-1 resize-none rounded-md border bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Type a message..."
          disabled={isLoading}
          rows={1}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          aria-label="Chat message input"
        />
        <button
          type="button"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-[44px] w-[44px] items-center justify-center rounded-md disabled:pointer-events-none disabled:opacity-50"
          disabled={!canSend}
          onClick={onSend}
          aria-label="Send message"
        >
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
        </button>
      </div>
    </div>
  )
}

/**
 * ChatTab - Main container component
 * Renders the full chat interface with thread and composer
 */
export const ChatTab = () => {
  const [inputValue, setInputValue] = useState('')

  const handleSuggestionClick = useCallback((text: string) => {
    setInputValue(text)
  }, [])

  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return
    // For now, just clear the input - actual sending will be implemented with useChat hook
    // TODO: Implement message sending with useChat hook
    console.log('Sending message:', inputValue)
    setInputValue('')
  }, [inputValue])

  return (
    <div className="flex h-full flex-col">
      <ThreadContainer onSuggestionClick={handleSuggestionClick} />
      <Composer
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
      />
    </div>
  )
}

export default ChatTab
