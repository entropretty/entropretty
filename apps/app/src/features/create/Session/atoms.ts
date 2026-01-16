/**
 * Session management Jotai atoms for AI chat feature
 *
 * These atoms manage:
 * - Session identification and data
 * - History navigation state
 * - Chat messages and loading state
 * - File attachments for multimodal chat
 */

import { atom } from 'jotai'
import type { Attachment, ChatMessage, Session } from './types'

/**
 * Current session ID
 * null when no session is active (initial state before generation)
 */
export const sessionIdAtom = atom<string | null>(null)

/**
 * Derived atom that reads session data from localStorage based on sessionIdAtom
 * Returns null if no session exists or if reading fails
 */
export const sessionDataAtom = atom<Session | null>((get) => {
  const sessionId = get(sessionIdAtom)
  if (!sessionId) return null

  try {
    const stored = localStorage.getItem(`entropretty:session:${sessionId}`)
    if (!stored) return null
    return JSON.parse(stored) as Session
  } catch {
    // Handle corrupted data or JSON parse errors
    return null
  }
})

/**
 * Current position in the history array
 * Used for back/forward navigation through code checkpoints
 */
export const historyIndexAtom = atom<number>(0)

/**
 * Chat messages for the current session
 * Includes both user and assistant messages
 */
export const chatMessagesAtom = atom<Array<ChatMessage>>([])

/**
 * Loading state for AI chat requests
 * true when waiting for AI response
 */
export const chatLoadingAtom = atom<boolean>(false)

/**
 * Pending attachments to be sent with the next message
 * Cleared after successful send
 */
export const attachmentsAtom = atom<Array<Attachment>>([])
