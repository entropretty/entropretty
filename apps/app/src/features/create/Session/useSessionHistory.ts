/**
 * Hook for managing session history and localStorage persistence
 *
 * This hook handles:
 * - Session ID generation and persistence
 * - Loading/saving sessions to localStorage
 * - Creating checkpoints with source attribution
 * - History pruning when entries exceed limit
 */

import { useCallback, useEffect } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { nanoid } from 'nanoid'
import { editorCodeAtom } from '../atoms'
import { historyIndexAtom, sessionIdAtom } from './atoms'
import type { HistoryEntry, HistorySource, Session } from './types'

/** Maximum number of history entries before pruning */
const MAX_HISTORY_ENTRIES = 100

/** LocalStorage key prefix for sessions */
const STORAGE_KEY_PREFIX = 'entropretty:session:'

/**
 * Get the localStorage key for a session
 */
function getStorageKey(sessionId: string): string {
  return `${STORAGE_KEY_PREFIX}${sessionId}`
}

/**
 * Load a session from localStorage
 * Returns null if session doesn't exist or is corrupted
 */
function loadSessionFromStorage(sessionId: string): Session | null {
  try {
    const stored = localStorage.getItem(getStorageKey(sessionId))
    if (!stored) return null
    return JSON.parse(stored) as Session
  } catch {
    return null
  }
}

/**
 * Save a session to localStorage
 */
function saveSessionToStorage(session: Session): void {
  localStorage.setItem(getStorageKey(session.id), JSON.stringify(session))
}

/**
 * Create a new session with an initial history entry
 */
function createNewSession(sessionId: string, initialCode: string): Session {
  return {
    id: sessionId,
    createdAt: Date.now(),
    history: [
      {
        code: initialCode,
        timestamp: Date.now(),
        source: 'initial' as HistorySource,
      },
    ],
  }
}

/**
 * Hook for managing session history with localStorage persistence
 *
 * @returns Object with session management functions:
 * - sessionId: Current session ID (null before initialization)
 * - saveCheckpoint: Save a new code checkpoint to history
 * - loadSession: Manually load a session by ID
 * - currentHistory: Array of history entries
 * - historyIndex: Current position in history
 */
export function useSessionHistory() {
  const [sessionId, setSessionId] = useAtom(sessionIdAtom)
  const [historyIndex, setHistoryIndex] = useAtom(historyIndexAtom)
  const editorCode = useAtomValue(editorCodeAtom)
  const setEditorCode = useSetAtom(editorCodeAtom)

  /**
   * Load or create a session on mount
   */
  useEffect(() => {
    // Skip if already initialized
    if (sessionId) return

    // Check for existing session ID in localStorage
    const storedSessionId = localStorage.getItem('entropretty:currentSessionId')

    if (storedSessionId) {
      // Try to load existing session
      const session = loadSessionFromStorage(storedSessionId)
      if (session && session.history.length > 0) {
        setSessionId(storedSessionId)
        setHistoryIndex(session.history.length - 1)
        // Restore the latest code from history
        const latestEntry = session.history[session.history.length - 1]
        setEditorCode(latestEntry.code)
        return
      }
    }

    // Create new session
    const newSessionId = nanoid()
    const newSession = createNewSession(newSessionId, editorCode)
    saveSessionToStorage(newSession)
    localStorage.setItem('entropretty:currentSessionId', newSessionId)
    setSessionId(newSessionId)
    setHistoryIndex(0)
  }, [sessionId, setSessionId, setHistoryIndex, editorCode, setEditorCode])

  /**
   * Save a checkpoint to the session history
   */
  const saveCheckpoint = useCallback(
    (code: string, source: HistorySource): void => {
      if (!sessionId) return

      const session = loadSessionFromStorage(sessionId)
      if (!session) return

      const newEntry: HistoryEntry = {
        code,
        timestamp: Date.now(),
        source,
      }

      // Add new entry to history
      let newHistory = [...session.history, newEntry]

      // Prune history if it exceeds the limit (FIFO)
      if (newHistory.length > MAX_HISTORY_ENTRIES) {
        newHistory = newHistory.slice(newHistory.length - MAX_HISTORY_ENTRIES)
      }

      const updatedSession: Session = {
        ...session,
        history: newHistory,
      }

      saveSessionToStorage(updatedSession)
      setHistoryIndex(newHistory.length - 1)
    },
    [sessionId, setHistoryIndex],
  )

  /**
   * Get the current session data
   */
  const getSession = useCallback((): Session | null => {
    if (!sessionId) return null
    return loadSessionFromStorage(sessionId)
  }, [sessionId])

  /**
   * Get the current history entries
   */
  const currentHistory = sessionId
    ? loadSessionFromStorage(sessionId)?.history ?? []
    : []

  return {
    sessionId,
    saveCheckpoint,
    getSession,
    currentHistory,
    historyIndex,
  }
}
