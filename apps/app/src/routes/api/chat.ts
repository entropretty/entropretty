import { createFileRoute } from '@tanstack/react-router'
import { google } from '@ai-sdk/google'
import { streamObject } from 'ai'
import { z } from 'zod'
import type { Attachment } from '@/features/create/Session/types'

/**
 * Message type for AI SDK - simplified to match what streamObject expects
 */
type ChatMessageContent =
  | string
  | Array<{ type: 'text'; text: string } | { type: 'image'; image: string }>

interface AIMessage {
  role: 'user' | 'assistant'
  content: ChatMessageContent
}

/**
 * Structured output schema for AI responses
 * This ensures consistent and parseable responses from the LLM
 */
export const aiResponseSchema = z.object({
  explanation: z
    .string()
    .describe('Natural language explanation of what you did or are suggesting'),
  hasCode: z
    .boolean()
    .describe(
      'Whether this response includes complete algorithm code to apply',
    ),
  code: z
    .string()
    .optional()
    .describe(
      'Complete, working algorithm code. Only include if hasCode is true. Must be the FULL algorithm, not a fragment.',
    ),
})

export type AIResponseSchema = z.infer<typeof aiResponseSchema>

/**
 * Build the system prompt that provides context about Entropretty's
 * canvas drawing environment and the user's current state
 */
function buildSystemPrompt(context: {
  code: string
  seedType: string
  error?: string | null
}): string {
  const basePrompt = `You are an expert generative art assistant for Entropretty, a platform for creating deterministic visual identity algorithms.

## Your Environment

You write JavaScript code that draws on a 100x100 unit canvas. The code has access to:
- \`ctx\`: A CanvasRenderingContext2D for drawing
- \`seed\`: A Uint8Array of random bytes that should drive all variation in the design

## Seed Types and Their Purposes

The seed type determines the byte length and intended use:
- **Procedural** (32 bytes): General random art, each seed produces unique output
- **ProceduralPersonal** (1 byte): Personal identity marks, only 256 possible variations
- **ProceduralAccount** (20 bytes): Account-based identicons, tied to blockchain addresses

## Code Requirements

1. **Determinism**: The same seed must ALWAYS produce the exact same visual output
2. **No randomness**: Never use Math.random(). All variation comes from seed bytes
3. **Self-contained**: No imports, no external dependencies, no function wrapper
4. **Canvas-only**: Use ctx methods like fillRect, arc, lineTo, bezierCurveTo, etc.
5. **Scale-aware**: Design for 100x100 units, it will be scaled to fit any display size

## Current User State

Seed Type: ${context.seedType}
${context.error ? `\nCurrent Error: ${context.error}` : ''}
${context.code ? `\nCurrent Code:\n\`\`\`javascript\n${context.code}\n\`\`\`` : '\nNo code yet - this is a fresh canvas.'}

## Response Guidelines

- If the user asks a question or wants explanation, set hasCode to false
- If you're providing or modifying code, set hasCode to true
- When hasCode is true, provide the COMPLETE algorithm - not just changes
- Write clean, readable code with comments explaining key decisions
- Use seed bytes efficiently - extract numbers, use modulo for ranges
- Create visually interesting patterns: consider symmetry, repetition, color harmony
- For tattoo-friendly designs: use clean lines, high contrast, avoid tiny details

## Common Patterns

Extract values from seed:
\`\`\`javascript
const hue = seed[0] / 255 * 360;
const count = 3 + (seed[1] % 10);
const radius = 20 + seed[2] / 255 * 30;
\`\`\`

Draw at center:
\`\`\`javascript
ctx.translate(50, 50);
// ... draw around origin
ctx.translate(-50, -50);
\`\`\`

Rotational symmetry:
\`\`\`javascript
const segments = 6;
for (let i = 0; i < segments; i++) {
  ctx.save();
  ctx.translate(50, 50);
  ctx.rotate(i * Math.PI * 2 / segments);
  // ... draw one segment
  ctx.restore();
}
\`\`\``

  return basePrompt
}

/**
 * Convert chat messages and attachments to the format expected by the AI SDK
 */
function convertMessages(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  attachments?: Array<Attachment>,
): Array<AIMessage> {
  return messages.map((msg, index) => {
    // Only the last user message can have attachments
    const isLastUserMessage =
      msg.role === 'user' &&
      index === messages.length - 1 &&
      attachments &&
      attachments.length > 0

    if (isLastUserMessage) {
      // Multimodal message with images
      const content: Array<
        { type: 'text'; text: string } | { type: 'image'; image: string }
      > = [
        {
          type: 'text',
          text:
            msg.content ||
            'Please analyze this image and create code based on it.',
        },
      ]

      // Add images
      for (const attachment of attachments) {
        content.push({
          type: 'image',
          image: attachment.data, // base64 data
        })
      }

      return { role: msg.role, content }
    }

    // Regular text message
    return { role: msg.role, content: msg.content }
  })
}

/**
 * Request body schema for validation
 */
interface ChatRequestBody {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  context: {
    code: string
    seedType: string
    error?: string | null
  }
  attachments?: Array<Attachment>
}

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as ChatRequestBody

          // Validate required fields (runtime check for untrusted input)
          if (body.messages.length === 0) {
            return new Response(
              JSON.stringify({ error: 'Messages are required' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } },
            )
          }

          // Check for Google API key
          const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

          if (!googleApiKey) {
            console.error('GOOGLE_GENERATIVE_AI_API_KEY not configured')
            return new Response(
              JSON.stringify({ error: 'AI service not configured' }),
              { status: 500, headers: { 'Content-Type': 'application/json' } },
            )
          }

          // Build system prompt with context
          const systemPrompt = buildSystemPrompt(body.context)

          // Convert messages to AI SDK format
          const aiMessages = convertMessages(body.messages, body.attachments)

          // Stream structured response from Gemini
          const result = streamObject({
            model: google('gemini-2.5-flash'),
            schema: aiResponseSchema,
            system: systemPrompt,
            // Cast to any for AI SDK internal type compatibility
            messages: aiMessages as Parameters<
              typeof streamObject
            >[0]['messages'],
          })

          // Return streaming response
          return result.toTextStreamResponse()
        } catch (error) {
          console.error('Chat API error:', error)

          // Handle specific error types
          if (error instanceof SyntaxError) {
            return new Response(
              JSON.stringify({ error: 'Invalid request body' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } },
            )
          }

          return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } },
          )
        }
      },
    },
  },
})
