# AI System Design Assistant

An interactive tool that uses **GitHub Models (GPT-4o)** to generate system architecture designs, complete with code snippets, documentation, and infrastructure references. Built with **Node.js + Express** backend and **React + Vite + D3.js** frontend.

---

## How to Run

### Prerequisites

- **Node.js** v18 or later
- A **GitHub token** with access to GitHub Models (free via [GitHub Models](https://github.com/marketplace/models))

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` and set:

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | **Yes** | Your GitHub PAT with models access |
| `GITHUB_MODEL` | No | Defaults to `gpt-4o` |
| `PORT` | No | Defaults to `3001` |
| `JWT_SECRET` | No | Dev default: `dev-secret-change-in-production` |
| `CORS_ORIGIN` | No | Defaults to `http://localhost:3000` |

### 3. Start Servers

```bash
# Terminal 1 — Backend (port 3001)
cd backend
npm start          # or: npm run dev (auto-restart with nodemon)

# Terminal 2 — Frontend (port 3000)
cd frontend
npm run dev
```

### 4. Open in Browser

Go to **http://localhost:3000**

- Use the app without signing up (public endpoints work), or
- Sign up / Log in to save architecture history and track learning progress

---

## Project Architecture

```
┌─────────────────────────────────────────────┐
│              Browser (localhost:3000)         │
│  React + Vite + D3.js                        │
│                                              │
│  ┌─────────┐  ┌──────────┐  ┌────────────┐  │
│  │PromptForm│→ │NewDesign │→ │Architecture │  │
│  └─────────┘  │(generate)│  │Result +     │  │
│               └──────────┘  │D3 Diagram   │  │
│                             └────────────┘  │
│  ┌──────────┐  ┌────────────┐               │
│  │  Login /  │  │ History /  │               │
│  │  Signup   │  │ Detail     │               │
│  └──────────┘  └────────────┘               │
│  ┌──────────┐  ┌──────────┐  ┌────────────┐ │
│  │ Learning │→ │ Lesson   │→ │   Quiz      │ │
│  │   Hub    │  │   View   │  │             │ │
│  └──────────┘  └──────────┘  └────────────┘ │
│  ┌──────────┐  ┌────────────┐               │
│  │Templates │  │ Playground │               │
│  └──────────┘  └────────────┘               │
└──────────────────┬──────────────────────────┘
                   │ Vite Proxy (/api → :3001)
                   ▼
┌─────────────────────────────────────────────┐
│          Express Server (port 3001)          │
│                                              │
│  ┌────────────┐  ┌──────────────────────┐   │
│  │  Auth MW   │  │  Controllers          │   │
│  │  (JWT)     │  │  ┌────────────────┐   │   │
│  └────────────┘  │  │  aiController  │   │   │
│                  │  │  authController│   │   │
│  ┌────────────┐  │  │historyController│   │   │
│  │ Error MW   │  │  │learningCtrl    │   │   │
│  └────────────┘  │  └────────────────┘   │   │
│                  └──────────────────────┘   │
│  ┌────────────┐  ┌──────────────────────┐   │
│  │ Services   │  │ In-Memory Store      │   │
│  │ (GitHub    │  │ (users, history,     │   │
│  │  Models)   │  │  progress)           │   │
│  └────────────┘  └──────────────────────┘   │
└──────────────────┬──────────────────────────┘
                   │ HTTPS / Bearer Token
                   ▼
┌─────────────────────────────────────────────┐
│    GitHub Models API (Azure AI Inference)   │
│  https://models.inference.ai.azure.com      │
│  Model: gpt-4o (response_format: json)     │
└─────────────────────────────────────────────┘
```

### Data Flow (Architecture Generation)

```
User Prompt ("Design a social media platform")
       │
       ▼
  [Frontend] POST /api/ai/generate-architecture { prompt }
       │  (Vite proxies /api → localhost:3001)
       ▼
  [Backend] aiController.generateArchitecture()
       │
       ├─ 1. Validate prompt (non-empty, <10K chars)
       │
       ├─ 2. Build system prompt with strict JSON schema
       │     → Messages sent to GitHub Models API
       │
       ├─ 3. Parse LLM response → architecture JSON
       │     (components, databases, diagram nodes, etc.)
       │
       ├─ 4. Auto-generate code/docs (second LLM call)
       │     → Docker Compose, Terraform, API docs,
       │       GitHub repos, best practices, references
       │
       └─ 5. Return { data: architecture, codeDocs: {...} }
       │
       ▼
  [Frontend] ArchitectureResult renders:
       ├─ Title & overview
       ├─ D3.js force-directed graph (interactive)
       ├─ Component / Database / Communication / Scalability sections
       └─ Code & Documentation section
       │
       └─ (if logged in) Auto-save to history →
          POST /api/history { prompt, title, data, codeDocs }
```

---

## API Reference

### Authentication

| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| `POST` | `/api/auth/signup` | No | `{ name, email, password }` | `{ user, token }` |
| `POST` | `/api/auth/login` | No | `{ email, password }` | `{ user, token }` |
| `GET` | `/api/auth/me` | Yes | — | `{ user }` |

### Architecture AI

| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| `GET` | `/api/ai/models` | No | — | `{ models[] }` |
| `POST` | `/api/ai/generate-architecture` | No | `{ prompt }` | `{ data, codeDocs, meta }` |
| `POST` | `/api/ai/generate-code` | Yes | `{ architecture }` | `{ data }` |

### History

| Method | Endpoint | Auth | Response |
|--------|----------|------|----------|
| `GET` | `/api/history` | Yes | `{ data[] }` |
| `GET` | `/api/history/:id` | Yes | `{ data }` |
| `POST` | `/api/history` | Yes | `{ data }` |
| `DELETE` | `/api/history/:id` | Yes | `{ data: null }` |

### Learning

| Method | Endpoint | Auth | Response |
|--------|----------|------|----------|
| `GET` | `/api/learning/modules` | Yes | `{ data[] }` |
| `GET` | `/api/learning/modules/:id` | Yes | `{ data }` |
| `GET` | `/api/learning/modules/:mid/lessons/:lid` | Yes | `{ data }` |
| `POST` | `/api/learning/complete` | Yes | `{ data }` |
| `GET` | `/api/learning/progress` | Yes | `{ data }` |
| `GET` | `/api/learning/templates` | Yes | `{ data[] }` |
| `GET` | `/api/learning/templates/:id` | Yes | `{ data }` |
| `GET` | `/api/learning/playground` | Yes | `{ data[] }` |

### Health

| Method | Endpoint | Auth | Response |
|--------|----------|------|----------|
| `GET` | `/api/health` | No | `{ status: 'ok', timestamp }` |

---

## Pages (Frontend Routes)

| Route | Page | Description |
|-------|------|-------------|
| `/login` | Login | Email/password login |
| `/signup` | Signup | Registration form |
| `/dashboard` | Dashboard | Welcome, stats, recent designs |
| `/dashboard/new` | New Design | Prompt input + architecture generation |
| `/dashboard/history` | History | Saved architecture designs |
| `/dashboard/architecture/:id` | Detail | Full view of a saved design |
| `/dashboard/learn` | Learning Hub | Course modules with progress |
| `/dashboard/learn/:moduleId/:lessonId` | Lesson | Lesson content + quiz |
| `/dashboard/templates` | Templates | Architecture templates gallery |
| `/dashboard/playground` | Playground | Coding exercises |

---

## Key Technical Details

### Backend (Node.js + Express)

- **`src/server.js`** — Entry point; mounts routes, middleware, CORS, logging
- **`src/controllers/aiController.js`** — Architecture + code generation via GitHub Models
- **`src/services/githubModels.js`** — Singleton wrapping Azure AI Inference API
- **`src/services/inMemoryStore.js`** — In-memory data store (replace with DB for production)
- **`src/services/lessonContent.js`** — Static lesson data: 4 modules, 14 lessons, 5 templates, 5 exercises
- **`src/middleware/auth.js`** — JWT verification middleware
- **`src/utils/parseLLMResponse.js`** — Strips markdown fences, parses JSON, fills defaults

### Frontend (React + Vite + D3.js)

- **`vite.config.js`** — Dev server on port 3000; proxies `/api` → `localhost:3001`
- **`src/context/AuthContext.jsx`** — Auth state via React Context; persists token in `localStorage`
- **`src/api/aiService.js`** — API abstraction layer (`apiGet`, `apiPost`, `apiDel`)
- **`src/components/ArchitectureDiagram.jsx`** — D3.js force-directed graph with draggable nodes, colored by type (gateway, service, database, cache, queue, client, external)
- **`src/components/ArchitectureResult.jsx`** — Main result display with all code/docs sections
- **`src/pages/LessonView.jsx`** — Renders rich lesson content with embedded quiz

### LLM Prompt Engineering

- Architecture prompts use a strict JSON schema enforced via `response_format: { type: 'json_object' }`
- The schema defines: `title`, `overview`, `components[]`, `databases[]`, `communication[]`, `scalability[]`, `diagramNodes[]`, `diagramEdges[]`
- Code generation uses a separate prompt with a second LLM call for Docker, Terraform, API docs, GitHub repos, tools, best practices, and references

### Security Notes

- Passwords hashed with **bcryptjs**
- JWT tokens expire in **7 days**
- CORS restricted to configured origin (default: `http://localhost:3000`)
- Error handler exposes details only for 4xx errors; 5xx errors log but hide details
- Prompt validation limits input to **10,000 characters**
- **In-memory store resets on restart** — not suitable for production

---

## Project Structure

```
ai-system-design-assistant/
├── backend/
│   ├── .env                    # Environment variables
│   ├── .env.example            # Template for .env
│   ├── package.json
│   └── src/
│       ├── server.js           # Express app entry point
│       ├── config/index.js     # Config loader (dotenv)
│       ├── controllers/
│       │   ├── aiController.js      # Architecture + code generation
│       │   ├── authController.js    # Signup, login, me
│       │   ├── historyController.js # CRUD for saved designs
│       │   └── learningController.js# Modules, lessons, templates, playground
│       ├── middleware/
│       │   ├── auth.js              # JWT verification
│       │   └── errorHandler.js      # Central error handling
│       ├── routes/
│       │   ├── aiRoutes.js
│       │   ├── authRoutes.js
│       │   ├── historyRoutes.js
│       │   └── learningRoutes.js
│       ├── services/
│       │   ├── githubModels.js      # GitHub Models API client
│       │   ├── inMemoryStore.js     # In-memory DB (users, history, progress)
│       │   └── lessonContent.js     # Static lesson/template/exercise content
│       ├── utils/
│       │   └── parseLLMResponse.js  # JSON sanitizer + default filler
│       └── validators/
│           └── architectureValidator.js  # Prompt validation
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js          # Vite config with API proxy
│   └── src/
│       ├── main.jsx            # React entry point
│       ├── App.jsx             # Router configuration
│       ├── App.css             # Complete dark-theme stylesheet
│       ├── api/
│       │   └── aiService.js    # API helper functions
│       ├── context/
│       │   └── AuthContext.jsx # Auth state management
│       ├── components/
│       │   ├── ArchitectureDiagram.jsx      # D3.js graph (main)
│       │   ├── ArchitectureResult.jsx       # Full result display
│       │   ├── ArchitectureTemplateDiagram.jsx # D3.js graph (preview)
│       │   ├── CodeReferences.jsx           # Standalone code generator
│       │   ├── Header.jsx                  # Top bar
│       │   ├── Layout.jsx                  # App shell with sidebar
│       │   ├── LoadingSpinner.jsx          # Animated spinner
│       │   ├── ProgressBar.jsx             # Progress indicator
│       │   ├── PromptForm.jsx              # Input form with examples
│       │   ├── ProtectedRoute.jsx          # Auth guard
│       │   ├── Quiz.jsx                    # Multiple-choice quiz
│       │   └── Sidebar.jsx                 # Navigation sidebar
│       └── pages/
│           ├── ArchitectureDetail.jsx
│           ├── CodingPlayground.jsx
│           ├── Dashboard.jsx
│           ├── History.jsx
│           ├── Learning.jsx
│           ├── LessonView.jsx
│           ├── Login.jsx
│           ├── NewDesign.jsx
│           ├── Signup.jsx
│           └── Templates.jsx

└── PROJECT_GUIDE.md            # This file
```
