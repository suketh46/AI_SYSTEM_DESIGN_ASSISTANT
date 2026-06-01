# AI System Design Assistant

An interactive tool that generates system architecture diagrams from natural language prompts using GitHub Models LLM, D3.js visualization, and a React + Node.js stack.

---

## Architecture Overview

```
┌─────────────────┐     POST /api/ai/generate-architecture     ┌──────────────────┐
│                 │  ───────────────────────────────────────►   │                  │
│   React App     │          { prompt: "..." }                  │   Express API    │
│   (Frontend)    │  ◄───────────────────────────────────────   │   (Backend)      │
│                 │     { success: true, data: {...} }          │                  │
└─────────────────┘                                            └────────┬─────────┘
                                                                         │
                                                          POST /chat/completions
                                                         (GitHub Models API)
                                                                         │
                                                                   ┌─────▼──────┐
                                                                   │  GitHub     │
                                                                   │  Models LLM │
                                                                   │  (gpt-4o)   │
                                                                   └────────────┘
```

### Data Flow

1. **Frontend** → User types a system design prompt (e.g., "Design a social media platform").
2. **Frontend** → `POST /api/ai/generate-architecture` with `{ prompt }` to the backend.
3. **Backend** → Validates the request and sends a structured system-prompt + user-prompt to the **GitHub Models API**.
4. **GitHub Models LLM** → Returns a strict JSON response with components, databases, communication patterns, scalability strategies, and diagram nodes/edges.
5. **Backend** → Parses and sanitizes the LLM response. Falls back gracefully if JSON is malformed.
6. **Backend** → Returns `{ success: true, data: { title, overview, components, databases, communication, scalability, diagramNodes, diagramEdges }, meta: {...} }`.
7. **Frontend** → Renders the architecture as an interactive D3.js diagram with explanations.

---

## Setup Instructions

### Prerequisites

- **Node.js** v18+ (tested with v20 LTS)
- **npm** v9+
- A **GitHub account** with access to [GitHub Models](https://github.com/marketplace/models) (free tier available)

### 1. Clone & install

```bash
# Install backend dependencies
cd backend
npm install
```

### 2. Configure environment variables

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and set your **GitHub Personal Access Token**:

```
GITHUB_TOKEN=ghp_your_token_here
```

> **How to get a GitHub PAT:**
> 1. Go to https://github.com/settings/tokens
> 2. Click **Generate new token** → **Generate new token (classic)**
> 3. No special scopes are needed for GitHub Models (free tier)
> 4. Copy the token and paste it into `.env`

### 3. Choose a model (optional)

By default the project uses `gpt-4o`. You can change to any model available on GitHub Models:

```
GITHUB_MODEL=gpt-4o-mini
```

Other recommended models: `gpt-4o-mini`, `o3-mini`, `Llama-3.3-70B`, `Phi-4`, `Mistral-large`.

### 4. Start the backend

```bash
cd backend
npm run dev       # development with auto-reload
# or
npm start         # production
```

The server starts on **http://localhost:3001**.

### 5. Frontend setup (React)

```bash
cd frontend
npm install
npm start
```

The React app starts on **http://localhost:3000** (default CRA port).

---

## API Reference

### `POST /api/ai/generate-architecture`

**Request:**

```json
{
  "prompt": "Design a real-time chat application"
}
```

**Response (success):**

```json
{
  "success": true,
  "data": {
    "title": "Real-Time Chat Application Architecture",
    "overview": "...",
    "components": [
      {
        "name": "WebSocket Server",
        "type": "message-queue",
        "description": "..."
      }
    ],
    "databases": [
      {
        "name": "Messages DB",
        "type": "document",
        "description": "...",
        "technology": "MongoDB"
      }
    ],
    "communication": [
      {
        "method": "WebSocket",
        "between": ["WebSocket Server", "Client App"],
        "description": "..."
      }
    ],
    "scalability": [
      {
        "strategy": "horizontal-scaling",
        "description": "...",
        "component": "WebSocket Server"
      }
    ],
    "diagramNodes": [
      { "id": "client-app", "label": "Client App", "type": "client", "group": "frontend" }
    ],
    "diagramEdges": [
      { "source": "client-app", "target": "websocket-server", "label": "WebSocket", "style": "solid" }
    ]
  },
  "meta": {
    "model": "gpt-4o",
    "usage": {
      "prompt_tokens": 450,
      "completion_tokens": 1200,
      "total_tokens": 1650
    }
  }
}
```

**Response (error):**

```json
{
  "success": false,
  "error": "Validation failed",
  "details": ["\"prompt\" is required and must be a string"]
}
```

---

## Project Structure

```
├── backend/
│   ├── .env.example                 # Environment variable template
│   └── src/
│       ├── server.js                # Express entry point
│       ├── config/
│       │   └── index.js             # Env-based configuration
│       ├── services/
│       │   └── githubModels.js      # GitHub Models API client
│       ├── controllers/
│       │   └── aiController.js      # Route handlers
│       ├── routes/
│       │   └── aiRoutes.js          # Express routes
│       ├── middleware/
│       │   └── errorHandler.js      # Global error handler
│       ├── utils/
│       │   └── parseLLMResponse.js  # JSON sanitizer/parser
│       └── validators/
│           └── architectureValidator.js
│
├── frontend/
│   └── src/
│       └── api/
│           └── aiService.js         # React API call example
│
├── .gitignore
└── README.md
```

---

## Scripts

| Command | Description |
|---|---|
| `npm start` (backend) | Start production server |
| `npm run dev` (backend) | Start with nodemon (auto-reload) |
| `npm start` (frontend) | Start React dev server |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, D3.js, HTML/CSS/JS |
| Backend | Node.js, Express |
| LLM | GitHub Models API (gpt-4o) |
| Auth | GitHub Personal Access Token |
