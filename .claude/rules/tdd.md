# TDD Rule

이 규칙은 **Rigid** — 상황에 맞게 변형하지 마라. 프로젝트의 CLAUDE.md/AGENTS.md에 TDD 규칙이 있으면 그것을 우선. 이 파일은 fallback.

## 적용 기준

### 반드시 TDD 적용

- **비즈니스 로직**: 상태 변환, 계산, 검증 (예: 컴포넌트 생성 규칙, 코드 처리 로직)
- **API 엔드포인트**: request/response 매핑, 에러 처리
- **유틸리티 함수**: stripCodeFences, ensureRenderCall 같은 재사용 가능한 로직
- **버그 수정**: 수정 전 실패하는 테스트 작성, 그 후 고정

### TDD 불필요

- **타입 정의**: interface, type (컴파일 단계에서 검증)
- **설정 파일**: package.json, vite.config.ts, tsconfig.json
- **순수 UI**: JSX 렌더링만 하는 컴포넌트 (LivePreview로 수동 검증)
- **SQL/쿼리**: 이 프로젝트는 DB 없음

---

## RED-GREEN-REFACTOR 사이클

### RED: 하나의 실패하는 테스트 작성

**규칙:**
- **하나의 동작** = **하나의 테스트**
- 반드시 `bun test` 실행해서 **실패 확인**
- 실패 이유는 **"기능 미구현"이어야 함** (syntax error, 모듈 없음 ≠ 기능 미구현)
- 테스트 이름은 동작 기반: `"should strip code fences from markdown"` (o) vs `"test stripCodeFences"` (x)

**Example (server의 SYSTEM_PROMPT):**
```typescript
// test 파일
it('should reject TypeScript syntax in generated code', () => {
  const code = `const x: string = "hello";`;
  expect(() => validateCode(code)).toThrow('TypeScript syntax not allowed');
});

// 실행: bun test → FAIL (validateCode 함수 없음)
```

### GREEN: 최소 코드로 테스트 통과

**규칙:**
- **YAGNI (You Ain't Gonna Need It)**: 요청한 것만, 미래 기능 말기
- **최소**: 테스트를 통과하는 가장 간단한 구현만
- `bun test` 실행: **신규 테스트 + 기존 모든 테스트 통과** 확인
- Hardcoding OK (예: 항상 true 반환해도 이 단계에선 OK)

**Example (계속):**
```typescript
// src 파일 (최소 구현)
export function validateCode(code: string) {
  if (code.includes(': ')) throw new Error('TypeScript syntax not allowed');
}
```

### REFACTOR: 중복 제거, 이름 개선

**규칙:**
- **Green 유지**: 테스트는 계속 통과해야 함
- **새 동작 금지**: REFACTOR 단계에서 기능 추가 불가
- 하는 일: 중복 제거, 변수명 개선, 헬퍼 추출, 가독성 향상
- `bun test` 실행: 통과 확인

**Example (계속):**
```typescript
// REFACTOR: 더 정확한 TypeScript 패턴 검사
const TYPESCRIPT_PATTERNS = [/:\s*(string|number|boolean|any)/, /as\s+\w+/];

export function validateCode(code: string) {
  for (const pattern of TYPESCRIPT_PATTERNS) {
    if (pattern.test(code)) throw new Error('TypeScript syntax not allowed');
  }
}
```

### 반복: 다음 동작으로 RED 재진입

다음 동작을 RED부터 시작.

---

## 삭제 강제 규칙

**테스트 작성 전에 프로덕션 코드를 이미 작성했다면?**
- 그 코드를 **모두 삭제**
- RED부터 재시작
- **"참고용으로 남기겠다"는 변명 금지**
- 참고가 필요하면 테스트로 다시 작성

**이유**: 테스트 없이 작성한 코드는 검증이 안 됨. 그 코드를 보면 TDD 사이클을 건너뛰게 됨.

---

## 변명 차단표

| 변명 | 반론 |
|------|------|
| "너무 단순해서 테스트 불필요" | 단순할수록 빨리 쓰는 게 TDD. "단순하다"는 이유로 건너뛰면 나중에 10배 복잡해짐. |
| "나중에 테스트 추가하겠다" | 나중은 없다. 코드가 나오는 순간 기술부채로 변함. 지금 하거나, 안 하거나. |
| "시간이 없다" | TDD가 느리다고 생각하면 착각. 디버깅+수정 시간을 합치면 TDD가 더 빠름. |
| "삭제하면 코드가 낭비된다" | 테스트 없는 코드는 이미 낭비. 지금 삭제하거나, 나중에 버그로 낭비하거나. |
| "프로토타입이니까 TDD 안 해도 된다" | 프로토타입일수록 빠른 피드백이 중요. TDD가 피드백 루프를 짧게 함. |

---

## 프로젝트 우선 규칙

이 파일은 **기본값(fallback)**. 다음 우선 순서:

1. **프로젝트 AGENTS.md** (예: `./server/AGENTS.md` 또는 `./src/AGENTS.md`)
2. **프로젝트 CLAUDE.md**
3. **이 파일 (tdd.md)**

프로젝트 문서에 TDD 관련 규칙이 있으면, 그것을 따른다.
