/**
 * MessageBubble - Component for displaying individual chat messages
 *
 * Features:
 * - User messages aligned right with primary styling
 * - Assistant messages aligned left with secondary styling
 * - Markdown content rendering
 * - Streaming cursor indicator
 * - Max-width constraint for readability
 * - Accessible with role="article"
 */

import type { Attachment, ChatMessageRole } from '../Session/types'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
  /** Role of the message sender */
  role: ChatMessageRole
  /** Text content of the message */
  content: string
  /** Code included in the message (for assistant messages) */
  code?: string
  /** Image attachments (for user messages) */
  attachments?: Array<Attachment>
  /** Whether this message is currently streaming */
  isStreaming?: boolean
}

/**
 * Streaming cursor that appears at the end of streaming messages
 */
const StreamingCursor = () => (
  <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-current" />
)

/**
 * Renders message content with basic text formatting
 * For now, renders as plain text - markdown support can be added later
 */
const MessageContent = ({
  content,
  isStreaming,
}: {
  content: string
  isStreaming?: boolean
}) => (
  <div className="whitespace-pre-wrap break-words">
    {content}
    {isStreaming && <StreamingCursor />}
  </div>
)

/**
 * Renders attachment thumbnails for user messages
 */
const AttachmentList = ({
  attachments,
}: {
  attachments: Array<Attachment>
}) => {
  if (attachments.length === 0) return null

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="relative overflow-hidden rounded-md border"
        >
          <img
            src={`data:${attachment.type};base64,${attachment.data}`}
            alt={attachment.name}
            className="h-24 w-24 object-cover"
          />
        </div>
      ))}
    </div>
  )
}

export const MessageBubble = ({
  role,
  content,
  code,
  attachments,
  isStreaming = false,
}: MessageBubbleProps) => {
  const isUser = role === 'user'

  return (
    <div
      role="article"
      className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cn(
          'max-w-[85%] rounded-lg px-4 py-2',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground',
        )}
      >
        <MessageContent content={content} isStreaming={isStreaming && !code} />

        {/* Show attachments for user messages */}
        {attachments && attachments.length > 0 && (
          <AttachmentList attachments={attachments} />
        )}

        {/* Code block will be rendered in a separate CodeBlock component (next task) */}
        {code && (
          <div className="mt-2 rounded-md bg-background/20 p-2 font-mono text-xs">
            <div className="text-muted-foreground mb-1 text-xs">javascript</div>
            <pre className="overflow-x-auto whitespace-pre-wrap">{code}</pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageBubble
