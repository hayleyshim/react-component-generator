# Server Tests

API 서버의 유틸리티 함수, 엔드포인트, 로직에 대한 테스트.

## 디렉토리 구조

```
server/__tests__/
├── code-processing.test.ts  (stripCodeFences, ensureRenderCall 등)
├── api.test.ts              (추가 예정: API 엔드포인트 테스트)
└── README.md
```

## 테스트 작성 가이드

### 파일 네이밍

- 테스트 파일: `{name}.test.ts`
- 예: `code-processing.test.ts`, `api.test.ts`

### 테스트 대상 함수들

#### code-processing.test.ts
- `stripCodeFences(text)`: 마크다운 코드 펜스 제거
- `ensureRenderCall(code)`: render() 호출 자동 추가

**주요 시나리오:**
- 다양한 언어의 코드 펜스 처리 (jsx, tsx, js, ts)
- 다중 코드 블록 처리
- 이미 render() 있는 경우 처리 안 함
- 컴포넌트명 자동 추출

## 명령어

```bash
# 모든 테스트 실행
bun test

# 서버 테스트만 실행 (선택적)
bun test server/__tests__

# 파일 변경 시 자동으로 테스트 실행
bun test --watch

# 커버리지 리포트
bun test --coverage
```

## API 엔드포인트 테스트 (향후)

추가할 예정:
- GET /api/config: 환경 변수 설정 확인
- POST /api/generate: 컴포넌트 생성 요청

테스트 구조:
```typescript
describe('POST /api/generate', () => {
  it('should generate component from prompt', async () => {
    const response = await fetch('http://localhost:3002/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Create a button component',
        provider: 'anthropic',
        apiKey: process.env.ANTHROPIC_API_KEY,
      }),
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.code).toContain('render(');
  });
});
```

## 다음 단계

1. ✅ 기본 테스트 설정 완료
2. ➡️ API 엔드포인트 테스트 추가
3. ➡️ SYSTEM_PROMPT 검증 테스트
4. ➡️ CI/CD에 자동 테스트 연동
