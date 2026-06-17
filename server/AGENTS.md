# server/AGENTS.md

Bun API server governance. Single-file backend handling AI proxy and code processing.

## Module Context

`server/index.ts` is the entire backend: routes API requests, calls AI APIs (Anthropic/Google), processes generated code for react-live execution. No sub-modules.

## Operational Commands

```bash
bun run server        # Start with file watch
```

## Tech Stack & Constraints

- **Runtime:** Bun (native TypeScript support, no transpilation overhead)
- **Framework:** Bun.serve() (minimal server, no Express/Fastify)
- **APIs:** Anthropic Claude + Google Gemini (dual provider support)
- **CORS:** Custom headers only (no cors middleware)

## Implementation Patterns

**AI API Calls:**
- Use fetch() only, no SDK (minimizes dependencies)
- Store API keys in ENV_KEYS object keyed by provider
- Resolve: client key > env key (client key overrides)

**Code Processing:**
- stripCodeFences(): Remove markdown ```blocks```
- ensureRenderCall(): Append render() if missing
- Order: fetch from AI → strip → ensure render → return

**Routing:**
- GET /api/config: Return which providers have env keys set
- POST /api/generate: Accept {prompt, apiKey?, provider} → return {code} or {error}
- All responses include CORS_HEADERS

**SYSTEM_PROMPT:**
- Located at top of file as string constant
- Enforces: inline styles only, no imports, plain JS (no TS), render() call required
- Update here when generation rules change
- Never trust user-provided code; always validate via SYSTEM_PROMPT

## Local Golden Rules

**DO:**
- Keep SYSTEM_PROMPT as single source of truth for code generation rules
- Return clear error messages: "API key is required", "Prompt is required"
- Always include CORS headers in responses (required for local dev)
- Validate resolveApiKey() before calling AI API

**DON'T:**
- Use fetch() SDKs (adds dependency bloat)
- Accept external code without SYSTEM_PROMPT validation
- Hardcode API endpoints (version them: /v1/messages)
- Forget CORS headers (frontend cannot communicate without them)

---

Reference: @AGENTS.md, CLAUDE.md
