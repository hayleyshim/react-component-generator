# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**React 컴포넌트 생성기** — 프롬프트 기반 AI 컴포넌트 생성 및 실시간 렌더링 도구

- **기술 스택**: React 19 + TypeScript + Vite (프론트엔드), Bun (백엔드)
- **AI 제공자**: Anthropic Claude, Google Gemini
- **렌더링**: react-live (동적 JSX 실행)

## 아키텍처

### 프론트엔드 (React + Vite)

**데이터 플로우:**
1. 사용자 프롬프트 입력 → PromptInput 컴포넌트
2. `useComponentGenerator` 훅에서 API 요청 (`/api/generate`)
3. 생성된 코드 → 상태 저장 → ComponentCard로 렌더링
4. ComponentCard 내부:
   - `LivePreview`: react-live로 코드 동적 실행
   - `CodeView`: 소스 코드 표시 및 복사

**핵심 구조:**
- `App.tsx`: 레이아웃 및 상태 관리 (프로바이더 선택, API 키 입력)
- `useComponentGenerator` 훅: 생성 로직 및 컴포넌트 목록 관리
- `components/`: 독립적인 UI 컴포넌트들

### 백엔드 (Bun 서버)

**역할:**
- AI API 호출 프록시 (CORS 처리)
- 환경 변수로 설정된 API 키 사용 또는 클라이언트 키 전달 지원
- 코드 후처리 (마크다운 펜스 제거, render() 호출 추가)

**엔드포인트:**
- `GET /api/config`: 환경 변수에 설정된 프로바이더 확인
- `POST /api/generate`: 프롬프트 → AI API 호출 → 코드 반환

**AI 프롬프트 규칙** (`SYSTEM_PROMPT` in server/index.ts):
- 인라인 스타일만 사용 (CSS imports 금지)
- import 문 금지 (React는 전역 스코프)
- 반드시 render() 호출 포함
- 순수 JavaScript (TypeScript 문법 금지)

## 개발 명령어

```bash
# 전체 개발 서버 실행 (API + 프론트엔드)
bun run dev

# 서버만 실행 (터미널 감시)
bun run server

# 타입 체크 + 프로덕션 빌드
bun run build

# ESLint 실행
bun run lint

# 빌드 결과 미리보기
bun run preview
```

## 주요 파일 및 역할

| 파일 | 역할 |
|------|------|
| `server/index.ts` | Bun API 서버, AI 호출 프록시 |
| `src/App.tsx` | 메인 앱 레이아웃, 상태 관리 |
| `src/hooks/useComponentGenerator.ts` | 컴포넌트 생성 상태 로직 |
| `src/types/index.ts` | TypeScript 타입 정의 |
| `src/components/` | UI 컴포넌트 (PromptInput, ComponentCard, LivePreview, CodeView) |
| `src/App.css` | 전체 스타일 (레트로 테마: 따뜻한 톤, 스퀘어 스타일) |

## 설정 및 환경변수

**.env 파일:**
```env
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...
```

- 두 키 모두 설정 가능 (UI에서 프로바이더 선택)
- 클라이언트에서 입력한 키가 환경 키보다 우선

## 주의사항

**AI 코드 생성 (server/index.ts의 SYSTEM_PROMPT):**
- 생성되는 컴포넌트는 **순수 JavaScript만 사용해야 함** (TypeScript 문법 금지)
- import 문 불가 — React는 전역에서 접근 가능
- render() 호출은 자동으로 추가되지 않으면 ensureRenderCall()에서 처리
- 코드는 stripCodeFences()로 마크다운 펜스 제거 후 react-live로 실행

**프론트엔드 상태:**
- useComponentGenerator는 로컬 상태만 사용 (서버 저장 없음)
- 새로고침 시 생성 목록 초기화

## 최근 변경사항

- **레트로 테마 적용**: 색상 팔레트 변경 (따뜻한 브라운/버건디 톤), Courier Prime/Crimson Text 폰트
- **border-radius 제거**: 스퀨어 스타일 적용 (모든 UI 요소)
