# React 컴포넌트 생성기

프롬프트를 입력하면 AI가 React 컴포넌트를 즉시 생성하고, 실시간 미리보기와 코드를 제공합니다.

## 기술 스택

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Bun (AI API 프록시 서버)
- **AI Provider**: Anthropic Claude / Google Gemini (선택 가능)
- **미리보기**: react-live (런타임 렌더링)

## 실행 방법

```bash
# 의존성 설치
bun install

# (선택) .env에 API 키 설정
cp .env.example .env
# .env 파일에 ANTHROPIC_API_KEY 또는 GOOGLE_API_KEY 입력

# API 서버 + 프론트엔드 동시 실행
bun run dev
```

브라우저에서 `http://localhost:5173` 접속 후 사용할 수 있습니다.

- `.env`에 API 키를 설정하면 UI에서 별도 입력 없이 바로 사용 가능
- `.env` 없이도 UI에서 직접 API 키를 입력하여 사용 가능

## 주요 기능

- **멀티 프로바이더**: Anthropic Claude / Google Gemini 선택
- **실시간 미리보기**: 생성된 컴포넌트를 즉시 렌더링
- **새로고침**: 애니메이션 컴포넌트를 리마운트하여 다시 보기
- **재생성**: 같은 프롬프트로 AI에 다시 요청
- **예시 프롬프트**: 시각적 임팩트가 큰 예시 제공

## 최근 업데이트 (Session: 2026-06-17)

### 주요 개선사항

#### 1. 반응형 뷰 기능 추가
- 모바일(375px) / 태블릿(768px) / 데스크탑(1024px) 뷰포트 버튼 추가
- 미리보기 헤더에서 즉시 뷰포트 전환 가능
- 선택된 뷰포트 시각적 강조(주황색)

#### 2. 컴포넌트 데이터 영속성
- localStorage를 활용한 컴포넌트 목록 저장
- 브라우저 새로고침 후에도 생성된 컴포넌트 유지
- 선택한 AI 프로바이더(Anthropic/Google) 기억
- 보안: API 키는 저장하지 않음

#### 3. 프로젝트 거버넌스 강화
- **AGENTS.md 시스템**: 루트 + 중첩 구조 (server/, src/)
  - 운영 명령어, Golden Rules, 프로젝트 컨텍스트 정의
  - Context Map으로 작업 영역별 라우팅
- **CLAUDE.md**: 아키텍처 및 파일 역할 문서화
- **TDD Rule** (.claude/rules/tdd.md): RED-GREEN-REFACTOR 사이클 규칙

#### 4. PR 생성 자동화 스킬
- **creator-pr**: 한국어/영어 템플릿 지원
- 자동 브랜치 생성, 커밋 메시지 생성
- `gh CLI` 기반 PR 자동 생성
- references/에서 템플릿 중앙 관리

#### 5. 테스트 기반 구축
- Bun test runner 기반 테스트 설정
- server/__tests__: 코드 처리 유틸리티 테스트 (10 tests)
- src/__tests__: 컴포넌트 및 설정 테스트 (4 tests)
- 전체 14개 테스트 통과 ✅

#### 6. 디자인 시스템 업데이트
- **레트로 테마** 적용
  - 색상: 모던 블루 → 따뜻한 브라운/버건디 톤
  - 폰트: Courier Prime (코드), Crimson Text (본문)
  - 스타일: border-radius 제거 (스퀘어 디자인)

### 커밋 이력
- feat: localStorage 영속성 구현
- refactor: creator-pr 템플릿 한/영 분리
- test: 테스트 기본 설정
- feat: PR 생성 스킬 추가
- feat: 반응형 뷰 기능 추가
- docs: AGENTS.md/CLAUDE.md/TDD Rule 추가
