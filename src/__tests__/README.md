# Frontend Tests

React 컴포넌트 및 훅에 대한 테스트.

## 디렉토리 구조

```
src/__tests__/
├── unit/           (개별 함수, 상수, 유틸리티 테스트)
├── integration/    (여러 모듈 간의 상호작용 테스트)
└── README.md
```

## 테스트 작성 가이드

### 파일 네이밍

- 테스트 파일: `{name}.test.ts` 또는 `{name}.spec.ts`
- 예: `viewport.test.ts`, `use-component-generator.test.ts`

### 테스트 구조

```typescript
import { describe, it, expect } from 'bun:test';

describe('모듈/기능명', () => {
  describe('세부 기능', () => {
    it('should do something', () => {
      // Arrange
      const input = ...;
      
      // Act
      const result = functionUnderTest(input);
      
      // Assert
      expect(result).toBe(...);
    });
  });
});
```

### 현재 테스트 대상

#### unit/
- `viewport.test.ts`: VIEWPORT_SIZES 상수 및 viewport 기능

#### integration/
- 추가 예정: API 호출 + UI 렌더링 통합 테스트

## 명령어

```bash
# 모든 테스트 실행
bun test

# 파일 변경 시 자동으로 테스트 실행
bun test --watch

# 커버리지 리포트 생성
bun test --coverage
```

## React 컴포넌트 테스트

현재 설정에서는 React 컴포넌트 렌더링 테스트는 별도 라이브러리(Testing Library 등)가 필요합니다.

**대신 다음을 테스트합니다:**
- 유틸리티 함수 (순수 함수)
- 훅 로직 (상태 변환)
- 타입 정의
- 상수 및 설정값

**수동 테스트:**
- 컴포넌트 렌더링은 브라우저에서 LivePreview로 확인
- `bun run dev` 실행 후 http://localhost:5173 에서 UI 검증

## 다음 단계

1. 더 많은 유틸리티 함수 테스트 추가
2. 필요시 React Testing Library 통합
3. E2E 테스트 (Playwright, Cypress 등) 추가
4. CI/CD 파이프라인에 테스트 자동화
