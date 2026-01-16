/**
 * Session module - manages AI chat sessions and code history
 */

export type {
  HistorySource,
  HistoryEntry,
  Attachment,
  ChatMessageRole,
  ChatMessage,
  Session,
  AIResponse,
  ChatContext,
} from './types'

export {
  sessionIdAtom,
  sessionDataAtom,
  historyIndexAtom,
  chatMessagesAtom,
  chatLoadingAtom,
  attachmentsAtom,
} from './atoms'

export { useSessionHistory } from './useSessionHistory'
