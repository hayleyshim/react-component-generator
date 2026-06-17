# AGENTS.md

Agent governance and operational rules for react-component-generator.

## Operational Commands (CRITICAL)

```bash
# Frontend + API server (concurrent)
bun run dev

# Server only (file watch enabled)
bun run server

# Build + typecheck
bun run build

# Lint JavaScript/TypeScript
bun run lint

# Preview production build
bun run preview
```

**Package Manager:** Bun only (no npm/yarn/pnpm). Use `bun add` for dependencies.

## Golden Rules

### Immutable Constraints

- **API Key Security:** Never hardcode API keys. Enforce .env.local → .gitignore.
- **Component Generation:** Generated code must be plain JavaScript (no TypeScript syntax). Server validates via SYSTEM_PROMPT.
- **No External Imports:** react-live sandbox cannot load external modules. Generated components use only React global + inline styles.
- **CORS Handling:** All API routes must include CORS headers; server/index.ts is the single auth gateway.

### Do's & Don'ts

**DO:**
- Use Bun's built-in TypeScript support (`bun run` auto-transpiles .ts files).
- Modify SYSTEM_PROMPT when component generation rules change.
- Validate provider (anthropic | google) and API key before API calls.
- Update nested AGENTS.md files when adding new modules.

**DON'T:**
- Mix TypeScript syntax into generated component code.
- Add external npm packages to generated code.
- Forget CORS headers when adding new API routes.
- Hardcode provider selection or API keys.

## Project Context

**Goal:** Instant React component generation from natural language prompts with live preview.

**Tech Stack:** React 19, TypeScript, Vite (frontend) | Bun (backend) | react-live (sandbox) | Anthropic/Google APIs

## Standards & References

### Commit & Git

- Conventional commits: `feat:`, `fix:`, `style:`, `chore:`, `docs:`, `refactor:`
- Korean messages (repo convention)
- See CLAUDE.md for recent changes and architecture

### Code Conventions

- **Naming:** camelCase (functions/vars), PascalCase (components), SCREAMING_SNAKE_CASE (constants)
- **Frontend:** Functional components + React hooks only
- **Backend:** Single Bun.serve() instance; all logic in fetch handler
- **Styling:** CSS modules or inline styles only

### Maintenance Policy

If rules conflict with working code, update this file. CLAUDE.md is authoritative for architecture.

## Context Map (Task Routing)

- **[API Server & AI Integration (./server/AGENTS.md)](./server/AGENTS.md)** — Modify API endpoints, SYSTEM_PROMPT, or AI provider logic.
- **[Frontend Components & Hooks (./src/AGENTS.md)](./src/AGENTS.md)** — Build React components, manage state, or adjust react-live integration.

---

Reference: @CLAUDE.md
