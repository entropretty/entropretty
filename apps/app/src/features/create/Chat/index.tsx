/**
 * ChatTab - AI assistant chat interface for the create page
 * This is the main container component for the AI chat feature
 */

import { useAtom } from 'jotai'
import { useCallback, useState } from 'react'
import { chatMessagesAtom } from '../Session/atoms'
import { editorCodeAtom } from '../atoms'
import { Composer } from './Composer'
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
