/**
 * Session types and data model definitions for AI chat feature
 *
 * These types define the structure for:
 * - Session management and persistence
 * - Code history tracking with source attribution
 * - Chat messages with attachments
 * - AI response structure
 */

/**
 * Source of a history entry - tracks where the code change originated
 */
export type HistorySource = 'initial' | 'user' | 'ai'

/**
 * A single entry in the code history
 * Represents a checkpoint that can be navigated to
 */
export interface HistoryEntry {
  /** The code at this checkpoint */
  code: string
  /** When this checkpoint was created */
  timestamp: number
  /** Where this code change came from */
  source: HistorySource
}

/**
 * Attachment for chat messages (images only)
 */
export interface Attachment {
  /** Unique identifier for the attachment */
  id: string
  /** Original filename */
  name: string
  /** MIME type (e.g., 'image/png', 'image/jpeg') */
  type: string
  /** File size in bytes */
  size: number
  /** Base64-encoded file data */
  data: string
}

/**
 * Role of a chat message sender
 */
export type ChatMessageRole = 'user' | 'assistant'

/**
 * A single message in the chat conversation
 */
export interface ChatMessage {
  /** Unique identifier for the message */
  id: string
  /** Who sent this message */
  role: ChatMessageRole
  /** The text content of the message */
  content: string
  /** Code included in this message (for assistant messages with code) */
  code?: string
  /** Image attachments (for user messages) */
  attachments?: Array<Attachment>
  /** When this message was created */
  createdAt: number
}

/**
 * A complete session containing history and metadata
 */
export interface Session {
  /** Unique session identifier */
  id: string
  /** When the session was created */
  createdAt: number
  /** Code history with checkpoints */
  history: Array<HistoryEntry>
}

/**
 * Structured output schema for AI responses
 * Matches the Zod schema used in the server function
 */
export interface AIResponse {
  /** Explanation or response text from the AI */
  explanation: string
  /** Whether the response includes code */
  hasCode: boolean
  /** The generated/modified code (present when hasCode is true) */
  code?: string
}

/**
 * Context sent to the AI with each request
 */
export interface ChatContext {
  /** Current code in the editor */
  currentCode: string
  /** Current seed type (e.g., 'Procedural', 'ProceduralPersonal') */
  seedType: string
  /** Current script error if any */
  scriptError?: string | null
}
