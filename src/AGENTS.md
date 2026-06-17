# src/AGENTS.md

React frontend governance. Component-driven UI with live code rendering via react-live.

## Module Context

`src/App.tsx` manages overall state and layout. `components/` contains reusable UI components. `hooks/useComponentGenerator` handles API communication and component lifecycle. `types/` defines TypeScript interfaces. `App.css` and `index.css` provide global styling (retro theme: warm tones, square borders).

## Tech Stack & Constraints

- **Framework:** React 19 (functional components + hooks only)
- **Bundler:** Vite (fast dev server, ESM target)
- **Styling:** CSS only (no Tailwind, no CSS-in-JS)
- **Code Execution:** react-live (cannot load external modules; only React + inline styles allowed)

## Implementation Patterns

**Component Structure:**
- One component per file in `components/`
- Export as default function
- Accept props object (one level deep)
- Use React hooks for local state: useState, useCallback, useEffect

**State Management:**
- useComponentGenerator hook: manages component list, loading, error states
- App.tsx: provider selection, API key input, layout
- No context or Redux (unnecessary for current scale)

**API Communication:**
- useComponentGenerator calls `/api/generate` via fetch
- Always include Content-Type: application/json
- Handle 400 (missing prompt/key), 503 (API overload), 429 (rate limit) explicitly
- Pass apiKey conditionally: only if user entered it (env key takes precedence if no user input)

**LivePreview Integration:**
- Pass code string directly to react-live
- Component must end with render() call (server ensures this)
- Catch rendering errors; display in .preview-error

**Global Styles:**
- App.css: theme variables (colors, shadows) + all UI components
- index.css: body defaults, font imports, background pattern
- Retro theme constraints: no border-radius (0 everywhere), warm color palette

## Local Golden Rules

**DO:**
- Use React hooks for component state (useState, useCallback, useEffect)
- Name components PascalCase (match file names)
- Pass component props as flat object (no nested)
- Validate API responses before rendering
- Catch LivePreview errors and show .preview-error

**DON'T:**
- Use class components
- Import/require external libraries in components (react-live cannot resolve them)
- Use CSS-in-JS or inline <style> tags in components (only inline style props)
- Hardcode provider name or API key validation logic (delegate to server)
- Forget Content-Type header in fetch calls

**Testing:**
- No unit tests currently; validate in browser at localhost:5173
- Test with both providers: Anthropic, Google
- Test error states: missing key, network failures, rate limits

---

Reference: @AGENTS.md, CLAUDE.md
