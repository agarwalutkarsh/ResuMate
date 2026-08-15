# ResuMate

An AI assistant that answers questions about a candidate straight from their resume.

Point it at a resume PDF and it becomes a conversational stand-in for the candidate — a recruiter can open the chat and ask "What's their experience with React?" or "Where did they study?" and get an answer grounded strictly in the document. If the resume doesn't say it, the assistant says so rather than inventing an answer.

<p align="left">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-000000?logo=next.js&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-0.141-009688?logo=fastapi&logoColor=white" />
  <img alt="Python" src="https://img.shields.io/badge/Python-3.15-3776AB?logo=python&logoColor=white" />
  <img alt="Groq" src="https://img.shields.io/badge/Openai-Gpt%20ss%20120b-F55036" />
</p>

---

## Table of contents

- [How it works](#how-it-works)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [API reference](#api-reference)
- [Deployment](#deployment)
- [Known limitations](#known-limitations)
- [Roadmap](#roadmap)

---

## How it works

The resume is parsed once at server startup and injected into the system prompt. Every question the recruiter asks travels with that resume text as context, so the model answers as the candidate — truthfully, and only from what's on the page.

```
┌─────────────────┐        POST /chat         ┌──────────────────┐
│                 │  { "message": "..." }     │                  │
│   Next.js UI    │ ────────────────────────► │   FastAPI app    │
│  (chat client)  │                           │                  │
│                 │ ◄──────────────────────── │  • conversation  │
└─────────────────┘   { "reply": "..." }      │    history       │
                                              │  • system prompt │
                                              └────────┬─────────┘
                                                       │
                        ┌──────────────────────────────┼───────────────────┐
                        │                                                  │
                        ▼                                                  ▼
             ┌────────────────────┐                          ┌──────────────────────┐
             │  pdf_parser.py     │  resume text at startup  │   llm_service.py     │
             │  pypdf → plain     │ ───────────────────────► │   Groq · OpenAI      │
             │  text              │                          │   GPT-OSS 120B       │
             └────────────────────┘                          └──────────────────────┘
```

**Request lifecycle**

1. Recruiter types a question (or clicks one of three suggested prompts).
2. Frontend `POST`s `{ "message": "..." }` to `/chat`; the send button and input lock until the reply lands.
3. FastAPI appends the message to the conversation history, which already begins with a system prompt containing the full resume text.
4. Groq runs the history through OpenAI GPT OSS 120B.
5. The reply is appended to history and returned as `{ "reply": "..." }`.

The system prompt does the guardrail work: answer as the candidate, never fabricate, decline anything off-topic, and say "that information isn't in the resume" when the document is silent.

---

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Frontend | Next.js 14 (App Router, JavaScript) | Fast to build a ChatGPT-style interface with server/client component separation |
| Styling | Tailwind CSS 3.4 | Utility-first, no separate stylesheet to maintain |
| Backend | FastAPI + Uvicorn | Typed request/response models via Pydantic, minimal boilerplate |
| PDF parsing | pypdf | Straightforward text extraction from the resume |
| Inference | Groq API — `OpenAI GPT OSS 120B` | Very low latency, generous free tier, strong instruction following |
| Package management | uv (backend), npm (frontend) | `uv.lock` pins the Python tree reproducibly |

---

## Project structure

```
ResuMate/
├── Backend/
│   ├── main.py              FastAPI app, system prompt, /chat and /reset routes
│   ├── llm_service.py       Groq client wrapper
│   ├── pdf_parser.py        PDF → text extraction
│   ├── resume/              the resume PDF loaded at startup
│   ├── pyproject.toml       dependency declarations
│   ├── requirements.txt     compiled lockfile (uv pip compile)
│   └── .env                 GROQ_API_KEY (not committed)
│
└── Frontend/
    ├── app/
    │   ├── layout.js        root layout and metadata
    │   ├── page.js          composes Header + Chat
    │   └── globals.css      Tailwind directives, dark background
    ├── components/
    │   ├── Chat.js          state, send flow, autoscroll
    │   ├── ChatInput.js     auto-growing textarea, Enter to send
    │   ├── Header.js        sticky bar with "New chat"
    │   ├── Message.js       user / assistant / error bubbles
    │   ├── SuggestedQuestions.js   three starter prompts
    │   ├── TypingIndicator.js
    │   └── Welcome.js       greeting block
    ├── lib/
    │   ├── api.js           fetch wrappers for /chat and /reset
    │   └── config.js        owner name, base URL, suggested questions
    └── .env                 NEXT_PUBLIC_BASE_URL (not committed)
```

---

## Getting started

**Prerequisites** — Node.js 18.17+, Python 3.15 (see `Backend/.python-version`), and a [Groq API key](https://console.groq.com).

### Backend

```bash
cd Backend

# with uv (recommended)
uv sync

# or with pip
python -m venv .venv
.venv\Scripts\activate        # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
```

Create `Backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Drop the resume PDF into `Backend/resume/` and make sure the filename matches `file_path` in `main.py`. The app raises `FileNotFoundError` on startup if it can't find it.

Run it:

```bash
uvicorn main:app --reload
```

API at `http://127.0.0.1:8000`, interactive docs at `http://127.0.0.1:8000/docs`.

### Frontend

```bash
cd Frontend
npm install
```

Create `Frontend/.env`:

```env
NEXT_PUBLIC_BASE_URL=http://127.0.0.1:8000
```

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## Environment variables

**Backend** (`Backend/.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `GROQ_API_KEY` | Yes | Groq API key. The app raises `ValueError` at import time if missing. |

**Frontend** (`Frontend/.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_BASE_URL` | Yes | Base URL of the FastAPI backend, no trailing slash. |

The `NEXT_PUBLIC_` prefix is what makes the value readable in the browser — rename it and the client gets `undefined`.

---

## API reference

### `POST /chat`

Send a recruiter question, get the assistant's answer.

**Request**

```json
{ "message": "What are the candidate's strongest technical skills?" }
```

**Response** `200`

```json
{ "reply": "Based on the resume, the strongest areas are..." }
```

**Errors** — `422` for a malformed body (FastAPI validation), `500` if the Groq call fails. The frontend surfaces either as an inline error bubble in the conversation.

### `POST /reset`

Clears the conversation back to just the system prompt. No body required.

**Response** `200`

```json
{ "status": "chat reset" }
```

Triggered by the **New chat** button in the header, which reloads the page afterwards.

**Try it with curl**

```bash
curl -X POST http://127.0.0.1:8000/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"Tell me about your work experience\"}"
```

---

## Deployment

**Backend — Render**

- Build: `pip install -r requirements.txt`
- Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Set `GROQ_API_KEY` as an environment variable in the dashboard, never in the repo.
- Commit the resume PDF so it exists in the deployed filesystem, since it's read at startup.

**Frontend — Vercel or Netlify**

- Set `NEXT_PUBLIC_BASE_URL` to the deployed backend URL.
- Rebuild after changing it — `NEXT_PUBLIC_*` values are inlined at build time, not read at runtime.

CORS is currently `allow_origins=["*"]`. Before going public, narrow it to the deployed frontend origin.

---

## Known limitations

Worth knowing before this goes in front of real recruiters:

- **Conversation history is global.** It lives in `app.state.chat_messages`, one list shared by every visitor. Two recruiters chatting at once see each other's context, and `/reset` wipes it for everyone. Needs per-session state (a session ID plus a store) before multi-user traffic.
- **History is unbounded.** Every turn is appended and resent, so a long conversation eventually hits the model's context limit and costs grow linearly. Needs a sliding window or summarisation.
- **History is lost on restart.** In-memory only — a redeploy or a cold start on Render's free tier drops everything.
- **Whole-resume context.** The full document goes into every request rather than retrieving relevant chunks. Fine for one resume; won't scale to a larger corpus.
- **Answers render as plain text.** The model tends to reply in markdown, so bullets and `**bold**` appear as literal characters until a markdown renderer is added.

---

## Roadmap

**Phase 1 — Resume only** ✅

- [x] PDF parsing and system-prompt injection
- [x] Groq + OpenAI GPT OSS 120B chat endpoint
- [x] Recruiter-facing chat UI with suggested questions
- [x] Conversation reset

**Phase 2 — Beyond the resume**

- [ ] Per-session conversation state
- [ ] Markdown rendering in the chat
- [ ] Streaming responses (SSE) so answers type out live
- [ ] Additional sources: LinkedIn, GitHub, project write-ups
- [ ] Vector store + retrieval instead of full-document context
- [ ] Resume upload from the UI rather than a fixed file path
- [ ] Rate limiting and abuse protection

---

## License

MIT
