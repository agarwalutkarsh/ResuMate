# ResuMate — Frontend

Chat interface for an AI assistant that answers recruiter questions from Utkarsh's resume.

Next.js 14 (App Router, JavaScript) + Tailwind CSS.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Environment

`.env` holds the backend URL:

```
NEXT_PUBLIC_BASE_URL=https://resumate-baseurl.com
```

Point this at `http://127.0.0.1:8000` while developing against a local FastAPI server. Any variable read in the browser must keep the `NEXT_PUBLIC_` prefix.

## Backend contract

The frontend expects one endpoint:

```
POST {NEXT_PUBLIC_BASE_URL}/chat
Content-Type: application/json

{ "question": "What are Utkarsh's strongest technical skills?" }
```

Response:

```json
{ "answer": "..." }
```

Non-2xx responses are surfaced in the chat as an error bubble; a `detail` field (FastAPI's default error key) is shown if present.

CORS must allow the frontend origin — on the FastAPI side:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend-domain"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Structure

```
app/
  layout.js        root layout + metadata
  page.js          composes Header + Chat
  globals.css      Tailwind directives, dark background, scrollbar
components/
  Chat.js          state, send flow, scroll behaviour
  ChatInput.js     auto-growing textarea, Enter to send, disabled while loading
  Header.js        sticky top bar
  Message.js       user / assistant / error bubbles
  SuggestedQuestions.js  three starter prompts (hidden once chat starts)
  TypingIndicator.js     animated dots while waiting
  Welcome.js       greeting block
lib/
  api.js           fetch wrapper for POST /chat
  config.js        owner name, base URL, suggested questions
```

## Behaviour notes

- Suggested questions render only while `messages.length === 0`, so they disappear permanently once the chat starts.
- The send button is disabled whenever the input is empty **or** a request is in flight; the textarea is disabled during a request and refocuses when the answer arrives.
- To change the name or the three starter questions, edit `lib/config.js` only.
