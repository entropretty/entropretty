# Component Specifications

> Visual and behavioral specs for AI Chat UI components.

Related: [Design Tokens](./tokens.json) | [Features](../features/)

---

## Component: ChatTab

### Purpose

Container component for the entire AI chat interface, rendered within the tab content area.

### Structure

- ChatTab (container)
  - ThreadContainer (scrollable message area)
    - WelcomeMessage (when no messages)
    - MessageList (when messages exist)
  - Composer (fixed at bottom)

### Props/Inputs

| Prop | Type | Required | Default | Description                |
| ---- | ---- | -------- | ------- | -------------------------- |
| —    | —    | —        | —       | No props; reads from atoms |

### Layout

- Flex column, full height of tab content
- ThreadContainer: flex-1, overflow-y: auto
- Composer: sticky bottom, shrink-0

### Tokens Used

| Property   | Token                               |
| ---------- | ----------------------------------- |
| Background | `color.semantic.background.primary` |
| Padding    | `spacing.0` (full bleed)            |

---

## Component: WelcomeMessage

### Purpose

Initial greeting shown when chat has no messages, with contextual suggested prompts.

### Structure

- WelcomeMessage (container)
  - Icon (assistant avatar or logo)
  - Title ("How can I help?")
  - Description (brief intro text)
  - SuggestionList
    - SuggestionButton (×3, contextual)

### Props/Inputs

| Prop              | Type     | Required | Default | Description                         |
| ----------------- | -------- | -------- | ------- | ----------------------------------- |
| hasCustomCode     | Boolean  | Yes      | —       | Whether editor has non-default code |
| onSuggestionClick | Function | Yes      | —       | Handler when suggestion clicked     |

### States

- **Default**: All three suggestions visible
- **No custom code**: "Make more tattoo-friendly" hidden

### Suggested Prompts Logic

```
Always show:
- "Create a geometric mandala pattern"
- "Help me understand the seed system"

Show only if hasCustomCode:
- "Make my design more tattoo-friendly"
```

### Tokens Used

| Property          | Token                         |
| ----------------- | ----------------------------- |
| Padding           | `chat.spacing.welcomePadding` |
| Title font        | `chat.typography.welcome`     |
| Description color | `chat.colors.welcome.text`    |

### Accessibility

- Suggestions are focusable buttons
- Screen reader: "Suggested prompts" region

---

## Component: SuggestionButton

### Purpose

Clickable prompt suggestion that sends a predefined message.

### Structure

- Button (container)
  - Text (prompt text)

### Props/Inputs

| Prop    | Type     | Required | Default | Description                         |
| ------- | -------- | -------- | ------- | ----------------------------------- |
| text    | String   | Yes      | —       | The prompt text to display and send |
| onClick | Function | Yes      | —       | Handler when clicked                |

### States

- **Default**: Outlined style
- **Hover**: Background fill, subtle
- **Focused**: Focus ring
- **Active**: Pressed state

### Tokens Used

| Property           | Token                                    |
| ------------------ | ---------------------------------------- |
| Background         | `chat.colors.suggestion.background`      |
| Background (hover) | `chat.colors.suggestion.backgroundHover` |
| Text               | `chat.colors.suggestion.text`            |
| Border             | `chat.colors.suggestion.border`          |
| Border radius      | `borderRadius.md`                        |
| Min width          | `chat.sizing.suggestionMinWidth`         |
| Padding            | `spacing.3` `spacing.4`                  |

### Accessibility

- Role: button
- Keyboard: Tab to focus, Enter/Space to activate

---

## Component: MessageBubble

### Purpose

Displays a single chat message from user or assistant.

### Structure

- MessageBubble (container)
  - Avatar (optional, for assistant)
  - Content
    - Text (markdown rendered)
    - CodeBlock (if code present)
    - Attachments (if images attached)
  - Timestamp (optional)

### Props/Inputs

| Prop        | Type                  | Required | Default | Description                     |
| ----------- | --------------------- | -------- | ------- | ------------------------------- |
| role        | Enum(user, assistant) | Yes      | —       | Who sent the message            |
| content     | String                | Yes      | —       | Message text (markdown)         |
| code        | String                | No       | —       | Extracted code (assistant only) |
| attachments | Array[Attachment]     | No       | []      | Attached images                 |
| timestamp   | DateTime              | No       | —       | When message was sent           |
| isStreaming | Boolean               | No       | false   | Whether content is streaming    |

### States

- **Default**: Full content displayed
- **Streaming**: Content builds progressively, cursor indicator

### Layout

- User messages: Aligned right, colored background
- Assistant messages: Aligned left, neutral background
- Max width: 85% of container

### Tokens Used

| Property      | Token (User)                        | Token (Assistant)                        |
| ------------- | ----------------------------------- | ---------------------------------------- |
| Background    | `chat.colors.userBubble.background` | `chat.colors.assistantBubble.background` |
| Text          | `chat.colors.userBubble.text`       | `chat.colors.assistantBubble.text`       |
| Border radius | `borderRadius.lg`                   | `borderRadius.lg`                        |
| Padding       | `chat.spacing.bubblePadding`        | `chat.spacing.bubblePadding`             |
| Font          | `chat.typography.message`           | `chat.typography.message`                |

### Accessibility

- Role: article
- aria-label: "[Role] message"

---

## Component: CodeBlock

### Purpose

Displays code from AI response with syntax highlighting. Shows "Applied" badge when code has been applied to editor.

### Structure

- CodeBlock (container)
  - Header
    - Language label ("javascript")
    - AppliedBadge (if applied)
  - CodeContent (syntax highlighted)

### Props/Inputs

| Prop      | Type    | Required | Default      | Description                        |
| --------- | ------- | -------- | ------------ | ---------------------------------- |
| code      | String  | Yes      | —            | The code to display                |
| language  | String  | No       | "javascript" | Syntax highlighting language       |
| isApplied | Boolean | No       | true         | Whether code was applied to editor |

### States

- **Applied**: Shows green "Applied" badge
- **Not applied**: No badge (edge case, code should auto-apply)

### Tokens Used

| Property      | Token                              |
| ------------- | ---------------------------------- |
| Background    | `chat.colors.codeBlock.background` |
| Text          | `chat.colors.codeBlock.text`       |
| Border        | `chat.colors.codeBlock.border`     |
| Font          | `chat.typography.code`             |
| Border radius | `borderRadius.md`                  |
| Padding       | `spacing.3`                        |

### Accessibility

- Role: code
- Syntax highlighting preserves semantics

---

## Component: Composer

### Purpose

Input area for typing and sending messages, with attachment support.

### Structure

- Composer (container)
  - AttachmentPreview (if attachments pending)
    - AttachmentThumbnail (×n)
  - InputRow
    - AttachButton (paperclip icon)
    - TextArea (auto-growing)
    - SendButton

### Props/Inputs

| Prop        | Type     | Required | Default             | Description                |
| ----------- | -------- | -------- | ------------------- | -------------------------- |
| onSend      | Function | Yes      | —                   | Handler when message sent  |
| disabled    | Boolean  | No       | false               | Disable during AI response |
| placeholder | String   | No       | "Type a message..." | Input placeholder          |

### States

- **Empty**: Send button disabled
- **Has text**: Send button enabled
- **Has attachments**: Thumbnails shown above input
- **Disabled**: During AI streaming response
- **Focused**: Input has focus ring

### Behavior

- TextArea auto-grows up to max height, then scrolls
- Enter sends message (Shift+Enter for newline)
- Drag-drop files onto composer to attach

### Tokens Used

| Property       | Token                                |
| -------------- | ------------------------------------ |
| Background     | `color.semantic.background.elevated` |
| Border         | `color.semantic.border.default`      |
| Border (focus) | `color.semantic.border.focus`        |
| Padding        | `chat.spacing.composerPadding`       |
| Min height     | `chat.sizing.composerMinHeight`      |
| Max height     | `chat.sizing.composerMaxHeight`      |

### Accessibility

- Role: textbox (textarea)
- aria-label: "Message input"
- Send button: aria-label: "Send message"
- Attach button: aria-label: "Attach file"

---

## Component: AttachmentThumbnail

### Purpose

Shows preview of an attached file with remove option.

### Structure

- AttachmentThumbnail (container)
  - Image (thumbnail preview)
  - RemoveButton (X icon, top-right)
  - Filename (truncated, below image)

### Props/Inputs

| Prop       | Type       | Required | Default | Description                  |
| ---------- | ---------- | -------- | ------- | ---------------------------- |
| attachment | Attachment | Yes      | —       | The attachment data          |
| onRemove   | Function   | Yes      | —       | Handler to remove attachment |

### States

- **Default**: Thumbnail with remove button
- **Hover**: Remove button more prominent

### Tokens Used

| Property      | Token                                   |
| ------------- | --------------------------------------- |
| Size          | `chat.sizing.attachmentThumbnail`       |
| Border radius | `chat.sizing.attachmentThumbnailRadius` |
| Background    | `chat.colors.attachment.background`     |
| Border        | `chat.colors.attachment.border`         |
| Remove button | `chat.colors.attachment.removeButton`   |

### Accessibility

- Remove button: aria-label: "Remove [filename]"
- Image: alt text from filename

---

## Component: LoadingIndicator

### Purpose

Shows that AI is generating a response.

### Structure

- LoadingIndicator (container)
  - Dot (×3, animated)

### Animation

Three dots with staggered pulse animation (bounce or fade).

### Tokens Used

| Property   | Token                           |
| ---------- | ------------------------------- |
| Dot color  | `chat.colors.loading.dot`       |
| Dot active | `chat.colors.loading.dotActive` |
| Animation  | `chat.animation.loadingPulse`   |

---

## Component: HistoryNavigation

### Purpose

Back/forward buttons to navigate through editor history checkpoints.

### Structure

- HistoryNavigation (container)
  - BackButton (← arrow)
  - PositionIndicator ("3 / 5")
  - ForwardButton (→ arrow)

### Props/Inputs

| Prop         | Type     | Required | Default | Description                  |
| ------------ | -------- | -------- | ------- | ---------------------------- |
| currentIndex | Integer  | Yes      | —       | Current position (0-indexed) |
| totalCount   | Integer  | Yes      | —       | Total checkpoints            |
| onBack       | Function | Yes      | —       | Navigate back handler        |
| onForward    | Function | Yes      | —       | Navigate forward handler     |

### States

- **At start**: Back disabled, forward enabled (if history exists)
- **At end**: Forward disabled, back enabled (if history exists)
- **Single item**: Both disabled
- **Mid-history**: Both enabled

### Tokens Used

| Property       | Token                            |
| -------------- | -------------------------------- |
| Button size    | `history.sizing.buttonSize`      |
| Icon size      | `history.sizing.iconSize`        |
| Default color  | `history.colors.button.default`  |
| Hover color    | `history.colors.button.hover`    |
| Disabled color | `history.colors.button.disabled` |
| Indicator text | `history.colors.indicator.text`  |

### Placement

Located in the header area above the tabs, next to the algorithm name input.

### Accessibility

- Back button: aria-label: "Go to previous version"
- Forward button: aria-label: "Go to next version"
- Position indicator: aria-live: "polite" (announces changes)

---

## Component Integration Map

```
┌─────────────────────────────────────────────────────────────┐
│ Header                                                       │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│ │HistoryNavigation│ │AlgorithmNameInput│ │   PostButton   ││
│ └─────────────────┘ └─────────────────┘ └─────────────────┘│
├─────────────────────────────────────────────────────────────┤
│ TabsList: [Code] [AI] [Check] [Settings]                    │
├─────────────────────────────────────────────────────────────┤
│ TabsContent (value="ai")                                    │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ChatTab                                                  ││
│ │ ┌─────────────────────────────────────────────────────┐││
│ │ │ ThreadContainer (scrollable)                        │││
│ │ │ ┌─────────────────────────────────────────────────┐│││
│ │ │ │ WelcomeMessage OR MessageList                   ││││
│ │ │ │   MessageBubble                                 ││││
│ │ │ │     CodeBlock                                   ││││
│ │ │ │   MessageBubble                                 ││││
│ │ │ │   LoadingIndicator                              ││││
│ │ │ └─────────────────────────────────────────────────┘│││
│ │ └─────────────────────────────────────────────────────┘││
│ │ ┌─────────────────────────────────────────────────────┐││
│ │ │ Composer                                            │││
│ │ │   AttachmentThumbnail AttachmentThumbnail          │││
│ │ │   [📎] [Type a message...                    ] [→] │││
│ │ └─────────────────────────────────────────────────────┘││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```
