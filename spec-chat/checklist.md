# Implementation Checklist

> Phased implementation plan. Check off as you complete each item.

Related: [All spec files](./README.md)

## Phase 1: Foundation

### Dependencies & Setup

- [ ] Install `@assistant-ui/react` and `@assistant-ui/react-ai-sdk`
- [ ] Install `ai` (Vercel AI SDK) and `@ai-sdk/google`
- [ ] Install `nanoid` for session ID generation
- [ ] Verify `zod` is available (should be existing)
- [ ] Verify environment variable `GOOGLE_GENERATIVE_AI_API_KEY` exists

### Session Management

- [ ] Create `Session/types.ts` with Session, HistoryEntry types
- [ ] Create `Session/atoms.ts` with sessionIdAtom, historyIndexAtom
- [ ] Implement `useSessionHistory` hook
  - [ ] Generate session ID on mount
  - [ ] Load existing session from localStorage
  - [ ] Save checkpoint function
  - [ ] History pruning (max 100 entries)
- [ ] Create initial checkpoint on editor mount
- [ ] Unit tests for session management

### Server Function

- [ ] Create `app/functions/chat.ts`
- [ ] Define Zod schema for AIResponse (explanation, hasCode, code)
- [ ] Implement `streamChat` server function
- [ ] Build system prompt with context injection
- [ ] Handle attachments as images in messages
- [ ] Test server function with mock requests

## Phase 2: Core Chat UI

### Tab Integration

- [ ] Add "AI" tab to `features/create/index.tsx`
- [ ] Create `features/create/Chat/index.tsx` (ChatTab)
- [ ] Ensure tab switching works correctly
- [ ] Lazy load chat components for performance

### Chat Atoms

- [ ] Add `chatMessagesAtom` to store messages
- [ ] Add `chatLoadingAtom` for loading state
- [ ] Add `attachmentsAtom` for pending attachments
- [ ] Wire up atoms to ChatTab component

### Basic Chat Flow

- [ ] Implement `useChat` hook
  - [ ] Send message with context
  - [ ] Handle streaming response
  - [ ] Update messages atom
- [ ] Display message list
- [ ] User message bubble component
- [ ] Assistant message bubble component
- [ ] Loading indicator during AI response

### Auto-Apply Code

- [ ] Parse structured output for hasCode/code
- [ ] Update `editorCodeAtom` when code received
- [ ] Create history checkpoint on code apply
- [ ] Increment `editorCodeVersionAtom` to trigger preview
- [ ] Show "Applied" badge on code block

## Phase 3: Welcome & Suggestions

### Welcome Message

- [ ] Create WelcomeMessage component
- [ ] Display when chat has no messages
- [ ] Add assistant avatar/icon

### Suggested Prompts

- [ ] Create SuggestionButton component
- [ ] Implement conditional "tattoo-friendly" suggestion
  - [ ] Check if editor has custom code (not initial)
- [ ] Handle suggestion click → send message
- [ ] Style suggestion buttons per design tokens

## Phase 4: History Navigation

### Navigation UI

- [ ] Create HistoryNavigation component
- [ ] Add back/forward buttons with icons
- [ ] Display position indicator (e.g., "3 / 5")
- [ ] Place in header above tabs

### Navigation Logic

- [ ] Implement `useHistoryNav` hook
- [ ] Handle back button click
  - [ ] Update historyIndexAtom
  - [ ] Load code from history[index]
  - [ ] Update editorCodeAtom
- [ ] Handle forward button click
- [ ] Disable buttons at boundaries
- [ ] Ensure navigation doesn't create new checkpoints

### Integration

- [ ] Connect navigation to existing atoms
- [ ] Test with AI-generated checkpoints
- [ ] Test navigation then AI request flow

## Phase 5: File Attachments

### Attachment UI

- [ ] Add attach button to Composer
- [ ] Create AttachmentThumbnail component
- [ ] Display attachment preview in composer
- [ ] Implement remove attachment functionality
- [ ] Support drag-and-drop onto composer

### Attachment Validation

- [ ] Validate file type (image/\* only)
- [ ] Validate file size (max 10MB)
- [ ] Validate attachment count (max 5)
- [ ] Show error toasts for validation failures

### Attachment Flow

- [ ] Read file as base64
- [ ] Store in attachmentsAtom
- [ ] Include attachments in chat request
- [ ] Convert to AI SDK image format server-side
- [ ] Clear attachments after successful send
- [ ] Display attachments in sent messages

## Phase 6: Polish & Error Handling

### Error States

- [ ] Handle network errors gracefully
- [ ] Display error messages in chat
- [ ] Add retry functionality for failed requests
- [ ] Handle rate limiting (429)
- [ ] Handle structured output parse failures

### Loading States

- [ ] Animated loading indicator (three dots)
- [ ] Disable composer during AI response
- [ ] Show streaming text as it arrives

### Empty States

- [ ] Welcome message when no chat history
- [ ] Proper disabled state for history buttons

### Accessibility

- [ ] Keyboard navigation for chat
- [ ] ARIA labels on all interactive elements
- [ ] Focus management after send
- [ ] Screen reader announcements for new messages

### Responsive Design

- [ ] Test at various panel widths
- [ ] Ensure composer doesn't overflow
- [ ] Handle long code blocks gracefully

## Phase 7: Validation

### Feature Tests

- [ ] Run all Gherkin scenarios from chat.feature
- [ ] Run all Gherkin scenarios from history.feature
- [ ] Run all Gherkin scenarios from attachments.feature

### Edge Cases

- [ ] Test with very long AI responses
- [ ] Test with rapid successive messages
- [ ] Test history at 100 checkpoints (pruning)
- [ ] Test with large attachments near limit
- [ ] Test localStorage near capacity

### Cross-Browser

- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge

### Performance

- [ ] Profile chat with many messages
- [ ] Ensure preview doesn't re-render excessively
- [ ] Verify lazy loading of chat components
- [ ] Check localStorage read/write performance

---

## File Structure (Final)

```
features/create/
├── Chat/
│   ├── index.tsx              # ChatTab container
│   ├── atoms.ts               # Chat-specific atoms
│   ├── useChat.ts             # Hook for AI communication
│   ├── systemPrompt.ts        # System prompt builder
│   ├── WelcomeMessage.tsx     # Initial welcome UI
│   ├── SuggestionButton.tsx   # Clickable prompt
│   ├── MessageBubble.tsx      # User/assistant message
│   ├── CodeBlock.tsx          # Code display with badge
│   ├── Composer.tsx           # Input area
│   ├── AttachmentThumbnail.tsx
│   └── LoadingIndicator.tsx
├── Session/
│   ├── types.ts               # Session, HistoryEntry types
│   ├── atoms.ts               # Session atoms
│   ├── useSessionHistory.ts   # History management hook
│   └── useHistoryNav.ts       # Navigation hook
├── HistoryNavigation.tsx      # Back/forward buttons
├── atoms.ts                   # (existing, extended)
└── index.tsx                  # (existing, add AI tab)

app/functions/
└── chat.ts                    # TanStack server function
```

---

## Definition of Done

A phase is complete when:

- [ ] All checklist items checked
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] Manual testing passed
- [ ] Code reviewed (if applicable)
