# OpenRouter Chat Starter (Next.js + AI SDK + shadcn/ui)

A minimal, clean chat template for building LLM apps on top of OpenRouter. It uses the Vercel AI SDK for streaming, shadcn/ui for components, and Tabler icons. Out of the box you get a responsive chat UI with markdown rendering (tables, code, math via Streamdown), a sticky prompt input with auto-resize, and an OpenRouter-backed API route.

## Features

- Next.js App Router (TypeScript)
- Streaming responses via AI SDK `streamText`
- OpenRouter provider (OpenAI-compatible) with selectable model
- Clean chat UI with:
  - Right-aligned user bubbles, assistant markdown (GFM tables, code, math)
  - Sticky, auto-resizing prompt input with keyboard submit (Enter to send)
  - Scroll-to-bottom helper and smart spacing
- shadcn/ui + Tailwind v4 styling, Tabler icons

## Quickstart

1. Install dependencies

```bash
npm install
```

1. Configure environment

Create `.env.local` in the project root:

```bash
OPENROUTER_API_KEY=your_key_here
# Optional: default model (can be overridden per request)
OPENROUTER_MODEL=openai/gpt-4o-mini
```

1. Run the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## How it works

- API route `app/api/chat/route.ts`
  - Uses `createOpenAI({ baseURL: "https://openrouter.ai/api/v1", apiKey })`
  - Converts UI messages to model messages with `convertToModelMessages`
  - Streams text with `streamText(...).toTextStreamResponse()`
- Client `app/page.tsx`
  - Manages chat state with `useChat` (TextStreamChatTransport)
  - Renders conversation using lightweight AI Elements components:
    - `Conversation`, `Response` (Streamdown markdown)
    - Custom prompt input (`components/ai-elements/prompt-input.tsx`)

## Notable files

- `app/page.tsx` — chat UI, scrolling transcript, fixed prompt input
- `app/api/chat/route.ts` — OpenRouter streaming endpoint
- `components/ai-elements/response.tsx` — markdown renderer (Streamdown)
- `components/ai-elements/conversation.tsx` — scroll container + scroll button
- `components/ai-elements/prompt-input.tsx` — auto-resize textarea + send button
- `components/ui/*` — shadcn primitives (button, card, input)

## Customization

- Change default model: set `OPENROUTER_MODEL` or pass `{ body: { model: "provider/model" } }` in client requests
- Styling: edit Tailwind tokens in `app/globals.css` or component classNames
- Icons: using `@tabler/icons-react` (e.g., up arrow send icon)

## Deploy

- Set `OPENROUTER_API_KEY` in your hosting provider’s environment
- Build and start:

```bash
npm run build && npm start
```

## License

MIT
