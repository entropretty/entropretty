/**
 * ChatTab - AI assistant chat interface for the create page
 * This is the main container component for the AI chat feature
 */

import { useAtom } from 'jotai'
import { chatLoadingAtom, chatMessagesAtom } from '../Session/atoms'

/**
 * WelcomeMessage - Shown when chat has no messages
 * Displays greeting and suggested prompts
 */
const WelcomeMessage = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <h2 className="mb-2 text-xl font-semibold">How can I help?</h2>
      <p className="text-muted-foreground mb-6 max-w-md text-sm">
        I can help you create and modify visual algorithms. Describe what you
        want to create or ask questions about the seed system.
      </p>
      {/* Suggestion buttons will be added in a later task */}
    </div>
  )
}

/**
 * ThreadContainer - Displays chat messages or welcome screen
 */
const ThreadContainer = () => {
  const [messages] = useAtom(chatMessagesAtom)

  if (messages.length === 0) {
    return <WelcomeMessage />
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
const Composer = () => {
  const [isLoading] = useAtom(chatLoadingAtom)

  return (
    <div className="border-t bg-background p-4">
      <div className="flex gap-2">
        <textarea
          className="border-input placeholder:text-muted-foreground focus-visible:ring-ring min-h-[44px] max-h-[120px] flex-1 resize-none rounded-md border bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Type a message..."
          disabled={isLoading}
          rows={1}
          aria-label="Chat message input"
        />
        <button
          type="button"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-[44px] w-[44px] items-center justify-center rounded-md disabled:pointer-events-none disabled:opacity-50"
          disabled={isLoading}
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
  return (
    <div className="flex h-full flex-col">
      <ThreadContainer />
      <Composer />
    </div>
  )
}

export default ChatTab
