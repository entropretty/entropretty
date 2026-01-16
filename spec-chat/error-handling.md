# Error Handling

> How the AI Chat feature handles failures, edge cases, and empty states.

Related: [Features](./features/) | [Components](./design/components.md)

## Validation Errors

| Context         | Trigger                          | Message                                                | Behavior                                          |
| --------------- | -------------------------------- | ------------------------------------------------------ | ------------------------------------------------- |
| File attachment | File type not image/\*           | "Only image files are supported (PNG, JPG, GIF, WebP)" | File rejected, toast shown, composer unchanged    |
| File attachment | File size > 10MB                 | "File size must be under 10MB"                         | File rejected, toast shown                        |
| File attachment | > 5 files attached               | "Maximum 5 attachments allowed"                        | New file rejected, existing attachments preserved |
| File attachment | File read fails                  | "Failed to load file"                                  | File rejected, user can retry                     |
| Message send    | Empty message and no attachments | (Send button disabled)                                 | Cannot send, no error shown                       |
| Session storage | localStorage full                | "Unable to save history. Storage is full."             | Continue without persistence, warn user           |

## Operation Errors

| Operation        | Failure Mode                    | Message                                              | Recovery                                        |
| ---------------- | ------------------------------- | ---------------------------------------------------- | ----------------------------------------------- |
| AI request       | Network error                   | "Failed to connect. Check your internet connection." | Show retry option, preserve message in composer |
| AI request       | Server error (500)              | "Something went wrong. Please try again."            | Show retry option                               |
| AI request       | Rate limited (429)              | "Too many requests. Please wait a moment."           | Auto-retry after delay, show countdown          |
| AI request       | Timeout                         | "Request timed out. The AI might be busy."           | Show retry option                               |
| AI response      | Invalid JSON from LLM           | (Graceful degradation)                               | Display raw text, skip code application         |
| AI response      | Structured output parse failure | (Graceful degradation)                               | Display explanation text only                   |
| Code application | Syntax error in AI code         | (Code applied anyway)                                | Script error shows in existing error panel      |
| History load     | Corrupted localStorage          | "History could not be loaded. Starting fresh."       | Create new session, continue normally           |
| History save     | Write failure                   | "Changes may not be saved."                          | Silent warning, continue session                |

## Empty States

| Context        | Condition               | Message                                   | Action                                      |
| -------------- | ----------------------- | ----------------------------------------- | ------------------------------------------- |
| Chat thread    | No messages yet         | "How can I help you create an algorithm?" | Show welcome message with suggested prompts |
| Attachments    | No files attached       | (Attach button visible)                   | Click or drag to attach                     |
| History        | Only initial checkpoint | "1 / 1"                                   | Both nav buttons disabled                   |
| Search results | —                       | N/A                                       | Not applicable for MVP                      |

## Recovery Strategies

### Auto-save

- **Frequency**: On every AI code application
- **Scope**: Full editor code snapshot
- **Storage**: localStorage with session key
- **Limit**: 100 checkpoints, then FIFO pruning

### Undo support

- **Which actions**: AI code applications
- **Mechanism**: History navigation (back/forward buttons)
- **Time window**: Unlimited within session
- **Granularity**: Full code snapshots (not line-level)

### Offline handling

- **Detection**: Check navigator.onLine before requests
- **Behavior**: Show error immediately, don't attempt request
- **Queue**: No offline queue (chat is ephemeral)
- **Recovery**: User retries when back online

### Message retry

- **Failed messages**: Preserved in UI with "Retry" button
- **Attachments**: Preserved with failed message
- **Composer**: Cleared after successful send only

## Error Display Patterns

### Toast Notifications

Used for transient errors that don't block the flow:

- File validation errors
- Storage warnings
- Rate limit notices

**Behavior**: Auto-dismiss after 5 seconds, can be manually dismissed.

### Inline Errors

Used for errors within the chat flow:

- Network failures (shown as system message in thread)
- AI request failures

**Behavior**: Persist in chat until retry succeeds.

### Blocking Errors

None for MVP. All errors allow continued use of the feature.

## Specific Error Scenarios

### Scenario: AI returns code that breaks the algorithm

```
1. User asks: "Add some lines"
2. AI responds with code containing syntax error
3. Code is applied to editor (as designed)
4. Preview shows broken/empty state
5. Script error appears in error panel: "Unexpected token..."
6. User can:
   a. Navigate back in history to restore working code
   b. Ask AI: "Fix this error" (error is in context)
   c. Manually edit in Code tab
```

### Scenario: Session storage becomes corrupted

```
1. User loads create page
2. Session load from localStorage fails (JSON parse error)
3. System logs error, creates new session
4. User sees: "History could not be loaded. Starting fresh."
5. Initial code saved as first checkpoint
6. User continues normally
```

### Scenario: Attachment too large

```
1. User drags 15MB image onto composer
2. Client validates size before reading
3. Toast: "File size must be under 10MB"
4. File not attached
5. User can try with smaller file
6. Existing attachments (if any) preserved
```

### Scenario: Network failure mid-stream

```
1. User sends message
2. AI begins streaming response
3. Network disconnects
4. Partial response preserved in chat (as far as streamed)
5. Error message appended: "Response interrupted. [Retry]"
6. User clicks Retry
7. Full request resent (not continuation)
8. New complete response streams
```

## Graceful Degradation

| Feature             | Degraded Mode           | Impact                                    |
| ------------------- | ----------------------- | ----------------------------------------- |
| Structured output   | Falls back to text-only | No auto-apply, user sees explanation only |
| Image attachments   | Skip if encoding fails  | Text-only message sent                    |
| History persistence | In-memory only          | Lost on page refresh                      |
| Syntax highlighting | Plain text code block   | Readability reduced                       |

## Logging and Monitoring

### Client-side logging

- Log failed requests with error type
- Log structured output parse failures
- Log localStorage failures

### Error boundaries

- Wrap ChatTab in React error boundary
- On crash: Show "Chat encountered an error. [Reload]"
- Preserve other tabs' functionality

## Security Error Handling

| Scenario                 | Detection                 | Response                                  |
| ------------------------ | ------------------------- | ----------------------------------------- |
| XSS in AI response       | Markdown sanitization     | Strip dangerous HTML, render safe content |
| Oversized response       | Max response length check | Truncate display, warn user               |
| Malformed code injection | (Not actively blocked)    | Code runs in existing preview sandbox     |

Note: The algorithm preview already runs in a sandboxed context, so malicious code from AI is contained to the same extent as user-written code.
