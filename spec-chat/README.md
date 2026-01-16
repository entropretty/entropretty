# Entropretty AI Chat Feature

> An LLM-powered assistant tab in the algorithm editor that helps users create, modify, and understand procedural generative art algorithms.

## Purpose

Enable users to interact with an AI assistant that understands the Entropretty algorithm context, can generate complete working code, and automatically applies changes to the editor. The assistant helps both beginners learn the system and experienced users iterate faster on their designs.

## Platform & Technology

| Aspect           | Decision                               |
| ---------------- | -------------------------------------- |
| Platform         | Web (existing Next.js/TanStack app)    |
| UI Components    | assistant-ui (shadcn registry)         |
| AI Integration   | Vercel AI SDK with structured output   |
| LLM Provider     | Google Gemini Flash (gemini-2.5-flash) |
| API Layer        | TanStack Server Functions              |
| State Management | Jotai (existing pattern)               |
| Persistence      | localStorage for session history       |

## Core Functionality

- **AI Chat Tab**: New tab in the editor alongside Code, Check, and Settings
- **Context-Aware Responses**: AI receives current editor code, seed type, and errors
- **Auto-Apply Code**: AI responses with code are automatically applied to the editor
- **Structured Output**: Uses Vercel AI SDK's structured output for reliable code extraction
- **File Attachments**: Users can attach images for the AI to analyze (in-memory only, not stored)
- **Editor History**: Checkpoint system with forward/backward navigation
- **Session Management**: Unique session ID per create session, stored in localStorage
- **Smart Suggestions**: Context-aware welcome prompts based on editor state

## Non-Goals (Out of Scope for MVP)

- Persistent chat history across sessions
- Multi-turn conversation memory beyond current session
- Server-side storage of uploaded files
- Collaborative/shared chat sessions
- Voice input/output
- Code diff view (just replace entire code)
- Undo/redo for individual lines (whole-file checkpoints only)

## Success Criteria

1. User can open AI tab and send a message
2. AI responds with working algorithm code
3. Code is automatically applied to editor and preview updates
4. User can navigate back/forward through code history
5. User can attach an image and AI can reference it in response
6. Suggested prompts adapt based on whether editor has custom code
7. Session history persists in localStorage across page refreshes (within same session)

## Spec Files

- [Data Model](./data-model.md) — Entities, relationships, validation
- [Architecture](./architecture.md) — System structure and patterns
- [Features](./features/) — Behavioral specifications (Gherkin)
- [Design](./design/) — Visual design tokens and components
- [Error Handling](./error-handling.md) — Failure modes and recovery
- [Implementation Checklist](./checklist.md) — Phased build plan
