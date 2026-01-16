# Data Model

> Defines all entities, their attributes, relationships, and validation rules for the AI Chat feature.

Related: [Features](./features/) | [Architecture](./architecture.md)

## Entities

### Session

Represents a single create session with its editor history. Stored in localStorage.

| Field     | Type                | Required | Constraints                                 | Description               |
| --------- | ------------------- | -------- | ------------------------------------------- | ------------------------- |
| id        | String              | Yes      | Primary key, format: `session_{nanoid(10)}` | Unique session identifier |
| createdAt | DateTime            | Yes      | ISO 8601, immutable                         | When session started      |
| history   | Array[HistoryEntry] | Yes      | Max 100 entries                             | Code checkpoints          |

### HistoryEntry

A single checkpoint in the editor history.

| Field     | Type    | Required | Constraints       | Description                    |
| --------- | ------- | -------- | ----------------- | ------------------------------ |
| code      | String  | Yes      | Non-empty         | Editor code at this checkpoint |
| timestamp | Integer | Yes      | Unix ms           | When checkpoint was created    |
| source    | Enum    | Yes      | See HistorySource | What triggered this checkpoint |

### ChatMessage

A single message in the chat conversation. Ephemeral (not persisted).

| Field       | Type              | Required | Constraints        | Description                     |
| ----------- | ----------------- | -------- | ------------------ | ------------------------------- |
| id          | String            | Yes      | UUID               | Unique message identifier       |
| role        | Enum              | Yes      | See MessageRole    | Who sent the message            |
| content     | String            | Yes      | Non-empty for user | Text content of message         |
| code        | String            | No       | Valid JS           | Extracted code from AI response |
| attachments | Array[Attachment] | No       | Max 5              | User-attached files             |
| createdAt   | DateTime          | Yes      | ISO 8601           | When message was sent           |

### Attachment

A file attached to a user message. In-memory only, not persisted.

| Field | Type    | Required | Constraints    | Description                  |
| ----- | ------- | -------- | -------------- | ---------------------------- |
| id    | String  | Yes      | UUID           | Unique attachment identifier |
| name  | String  | Yes      | Max 255 chars  | Original filename            |
| type  | String  | Yes      | MIME type      | File content type            |
| size  | Integer | Yes      | Max 10MB       | File size in bytes           |
| data  | Binary  | Yes      | Base64 encoded | File contents                |

### AIResponse (Structured Output Schema)

The schema for AI responses using Vercel AI SDK's structured output.

| Field       | Type    | Required | Constraints           | Description                               |
| ----------- | ------- | -------- | --------------------- | ----------------------------------------- |
| explanation | String  | Yes      | Non-empty             | Natural language explanation              |
| code        | String  | No       | Valid JS when present | Complete algorithm code to apply          |
| hasCode     | Boolean | Yes      | -                     | Whether response includes applicable code |

### ChatContext

Context sent to the AI with each request.

| Field       | Type              | Required | Constraints      | Description                 |
| ----------- | ----------------- | -------- | ---------------- | --------------------------- |
| code        | String            | Yes      | -                | Current editor code         |
| seedType    | String            | Yes      | Valid FamilyKind | Current seed type           |
| error       | String            | No       | -                | Current script error if any |
| attachments | Array[Attachment] | No       | Max 5            | Files to send with message  |

## Relationships

- **Session** has many **HistoryEntry** (one-to-many, ordered by timestamp)
- **ChatMessage** has many **Attachment** (one-to-many, ephemeral)
- **ChatContext** references current **editorCodeAtom** state (read-only)

## Validation Rules

- Session.id: Must match pattern `session_[a-zA-Z0-9]{10}`
- Session.history: Automatically pruned to last 100 entries when exceeded
- HistoryEntry.code: Must be non-empty string
- Attachment.size: Must not exceed 10MB (10,485,760 bytes)
- Attachment.type: Must be image/\* for MVP
- AIResponse.code: When present, must be syntactically valid JavaScript

## Enumerations

### HistorySource

| Value   | Description                   |
| ------- | ----------------------------- |
| initial | Code when session started     |
| user    | Manual edit by user in editor |
| ai      | Code applied from AI response |

### MessageRole

| Value     | Description                    |
| --------- | ------------------------------ |
| user      | Message from the user          |
| assistant | Response from the AI           |
| system    | System message (not displayed) |

### FamilyKind (existing)

| Value              | Description                  |
| ------------------ | ---------------------------- |
| Procedural         | Random 32-byte seed          |
| ProceduralPersonal | Derived from user identity   |
| ProceduralAccount  | Derived from account address |

## localStorage Schema

```
Key: "entropretty:session:{sessionId}"
Value: JSON<Session>

Example:
{
  "id": "session_a1b2c3d4e5",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "history": [
    {
      "code": "// Initial code\nctx.fillRect(0, 0, 100, 100);",
      "timestamp": 1705315800000,
      "source": "initial"
    },
    {
      "code": "// AI-generated mandala\nctx.translate(50, 50);\n...",
      "timestamp": 1705315850000,
      "source": "ai"
    }
  ]
}
```

## Jotai Atoms (New)

| Atom             | Type               | Persistence                 | Description                          |
| ---------------- | ------------------ | --------------------------- | ------------------------------------ |
| sessionIdAtom    | String             | Memory (generated on mount) | Current session identifier           |
| historyIndexAtom | Integer            | Memory                      | Current position in history          |
| chatMessagesAtom | Array[ChatMessage] | Memory                      | Current chat messages                |
| chatLoadingAtom  | Boolean            | Memory                      | Whether AI is responding             |
| attachmentsAtom  | Array[Attachment]  | Memory                      | Pending attachments for next message |
