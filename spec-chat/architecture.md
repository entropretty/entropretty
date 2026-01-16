# Architecture

> High-level system structure and technical decisions for the AI Chat feature.

Related: [Data Model](./data-model.md) | [Error Handling](./error-handling.md)

## Application Type

Feature module within existing TanStack Start web application.

## Architectural Pattern

**Client-Server Streaming with Structured Output**

The chat uses a streaming architecture where:

1. Client sends message + context to TanStack server function
2. Server streams response from LLM using Vercel AI SDK
3. Structured output schema ensures reliable code extraction
4. Client auto-applies extracted code to editor atom

This pattern was chosen because:

- Streaming provides responsive UX during generation
- Structured output eliminates parsing fragility
- Server functions keep API keys secure
- Jotai atoms integrate with existing state management

## System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ ChatTab     │  │ Thread      │  │ HistoryNavigation   │ │
│  │ (container) │  │ (messages)  │  │ (back/forward)      │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Application Logic                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ useChat     │  │ useSession  │  │ useHistoryNav       │ │
│  │ (AI comms)  │  │ (session)   │  │ (checkpoints)       │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    State Layer (Jotai)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ chatAtoms   │  │ sessionAtom │  │ editorCodeAtom      │ │
│  │ (messages)  │  │ (history)   │  │ (existing)          │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Server Layer                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ TanStack Server Function: streamChat                    ││
│  │ - Receives: messages, context, attachments              ││
│  │ - Calls: Vercel AI SDK with structured output           ││
│  │ - Returns: Streaming response with code extraction      ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                    External Services                         │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ LLM Provider (Google Gemini Flash via Vercel AI SDK)    ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Sending a Message

```
1. User types message in Composer
   │
2. User clicks send (or presses Enter)
   │
3. useChat hook:
   ├── Reads current editorCodeAtom
   ├── Reads current editorSeedTypeAtom
   ├── Reads current scriptErrorAtom
   ├── Collects any attachmentsAtom
   └── Calls streamChat server function
   │
4. Server function:
   ├── Builds system prompt with context
   ├── Converts attachments to AI SDK format
   ├── Calls streamObject() with response schema
   └── Streams response back to client
   │
5. Client receives streamed response:
   ├── Updates chatMessagesAtom progressively
   ├── When complete and hasCode=true:
   │   ├── Updates editorCodeAtom with code
   │   ├── Saves checkpoint to session history
   │   └── Increments historyIndexAtom
   └── Clears attachmentsAtom
   │
6. Editor atom change triggers:
   └── AlgorithmPreview re-renders with new code
```

### History Navigation

```
1. User clicks back/forward button
   │
2. useHistoryNav hook:
   ├── Reads session from localStorage
   ├── Calculates new historyIndexAtom
   └── Updates editorCodeAtom from history[index]
   │
3. Editor updates, preview re-renders
   │
4. Note: Does NOT create new checkpoint
   (navigating history is non-destructive)
```

### File Attachment Flow

```
1. User clicks attach button or drops file
   │
2. File validated (size, type)
   │
3. File read as base64, added to attachmentsAtom
   │
4. Thumbnail shown in composer
   │
5. On send: attachment included in request
   │
6. Server converts to AI SDK image format
   │
7. After send: attachmentsAtom cleared
   │
8. Note: File never touches disk/database
```

## Technical Constraints

- **Max file size**: 10MB per attachment
- **Max attachments**: 5 per message
- **Supported file types**: image/\* (PNG, JPG, GIF, WebP)
- **History limit**: 100 checkpoints per session (auto-pruned)
- **Session storage**: localStorage (5MB browser limit shared)
- **Streaming**: Required for responsive UX

## External Dependencies

| Dependency                 | Purpose                  | Version  |
| -------------------------- | ------------------------ | -------- |
| @assistant-ui/react        | Chat UI components       | latest   |
| @assistant-ui/react-ai-sdk | AI SDK integration       | latest   |
| ai                         | Vercel AI SDK core       | ^3.0     |
| @ai-sdk/google             | Google Gemini provider   | latest   |
| nanoid                     | Session ID generation    | ^5.0     |
| zod                        | Structured output schema | existing |

## Security Considerations

### API Key Protection

- LLM API keys stored server-side only
- Server functions handle all LLM communication
- Client never sees API credentials

### File Handling

- Files processed in-memory only
- No server-side file storage
- Base64 encoding for transport
- Size limits enforced client and server side

### Input Validation

- User messages sanitized before display
- Code from AI validated as syntactically correct JS
- Attachment types strictly validated

### Rate Limiting

- Consider implementing per-session rate limits
- Protect against abuse of LLM API

## Structured Output Schema

Using Zod with Vercel AI SDK's `streamObject`:

```typescript
import { z } from "zod"

export const aiResponseSchema = z.object({
  explanation: z
    .string()
    .describe("Natural language explanation of what you did or are suggesting"),
  hasCode: z
    .boolean()
    .describe(
      "Whether this response includes complete algorithm code to apply",
    ),
  code: z
    .string()
    .optional()
    .describe(
      "Complete, working algorithm code. Only include if hasCode is true. Must be the FULL algorithm, not a fragment.",
    ),
})

export type AIResponse = z.infer<typeof aiResponseSchema>
```

## Server Function Signature

```typescript
// app/functions/chat.ts
import { createServerFn } from "@tanstack/start"
import { streamObject } from "ai"
import { google } from "@ai-sdk/google"

export const streamChat = createServerFn({ method: "POST" })
  .validator(
    (data: {
      messages: Array<{ role: "user" | "assistant"; content: string }>
      context: {
        code: string
        seedType: string
        error?: string | null
      }
      attachments?: Array<{
        type: string
        data: string // base64
      }>
    }) => data,
  )
  .handler(async ({ data }) => {
    const result = await streamObject({
      model: google("gemini-2.5-flash"),
      schema: aiResponseSchema,
      system: buildSystemPrompt(data.context),
      messages: convertMessages(data.messages, data.attachments),
    })

    return result.toTextStreamResponse()
  })
```

## Component Integration

### Tab Addition

```tsx
// In features/create/index.tsx
<Tabs defaultValue="code">
  <TabsList>
    <TabsTrigger value="code">Code</TabsTrigger>
    <TabsTrigger value="ai">AI</TabsTrigger>
    <TabsTrigger value="check">Check</TabsTrigger>
    <TabsTrigger value="seed">Settings</TabsTrigger>
  </TabsList>

  <TabsContent value="ai">
    <ChatTab />
  </TabsContent>
  {/* ... existing tabs ... */}
</Tabs>
```

### History Navigation Placement

The back/forward buttons should be placed in the editor header area, visible when on the Code tab:

```
┌────────────────────────────────────────┐
│ [◀] [▶]  │  [Algorithm Name]  [Post]  │
├────────────────────────────────────────┤
│ [Code] [AI] [Check] [Settings]         │
```
