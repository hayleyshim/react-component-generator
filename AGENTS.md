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
- Store AI system prompt as string constant in `server/index.ts` (SYSTEM_PROMPT).
- Validate provider selection (anthropic | google) and API key presence before fetch.
- Update SYSTEM_PROMPT if new component generation rules are needed.

**DON'T:**
- Mix TypeScript syntax into generated component code.
- Add external npm packages to generated code.
- Forget CORS headers when adding new API routes.
- Use relative imports for server code (import from absolute paths only).

## Project Context

**Goal:** Instant React component generation from natural language prompts with live preview.

**Tech Stack:** React 19, TypeScript, Vite (frontend) | Bun (backend) | react-live (sandbox rendering) | Anthropic/Google APIs

**Architecture Boundary:** Server proxies AI API calls (localhost:3002) ↔ Frontend (localhost:5173) communicates via /api/* routes.

## Standards & References

### Commit & Git

- Use conventional commits: `feat:`, `fix:`, `style:`, `chore:`, `docs:` prefixes.
- Korean messages required (per repo convention).
- Reference CLAUDE.md for recent changes and git history intent.

### Code Conventions

- **Naming:** camelCase for functions/variables; PascalCase for React components; SCREAMING_SNAKE_CASE for constants.
- **Frontend:** Functional components + React hooks only. No class components.
- **Backend:** Single Bun.serve() instance; route all logic through fetch handler.
- **Styling:** CSS modules or inline styles only. No Tailwind (use App.css for global rules, inline for components).

### Maintenance Policy

If rules conflict with working code, update this file. If CLAUDE.md and AGENTS.md diverge, prefer CLAUDE.md for architecture details.

---

Reference: @CLAUDE.md for development architecture and file structure.
