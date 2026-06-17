#!/bin/bash
# TDD 리마인더 훅: 파일 수정 후 테스트 파일 필요 여부 확인
# stdin에서 JSON을 받아서 처리

FILE=$(cat | jq -r '.tool_input.file_path // .tool_response.filePath' | tr -d '\r')

# TypeScript 파일이 아니면 종료
if [[ ! "$FILE" =~ \.(ts|tsx)$ ]]; then
  exit 0
fi

# 이미 테스트 파일이면 종료
if [[ "$FILE" =~ \.(test|spec)\.tsx?$ ]]; then
  exit 0
fi

# src/ 또는 server/ 내의 파일인지 확인
if [[ ! "$FILE" =~ ^(src|server)/ ]]; then
  exit 0
fi

# 테스트 불필요한 파일 패턴 제외
# - types/ 디렉토리의 타입 정의
# - *.d.ts 선언 파일
# - config 관련 파일
if [[ "$FILE" =~ (types|\.d\.ts|config|settings|index) ]]; then
  exit 0
fi

# 테스트 파일 경로 생성
TEST_FILE="${FILE%.*}.test.ts"

# 테스트 파일이 없으면 권고 메시지 출력
if [ ! -f "$TEST_FILE" ]; then
  cat <<EOF
{
  "systemMessage": "💡 **TDD 리마인더**\n\n파일을 수정했습니다: \\\`$FILE\\\`\n\n이 파일에 대한 테스트 코드가 필요한가요?\n\n**권장 테스트 파일**: \\\`$TEST_FILE\\\`\n\n**TDD 규칙**: .claude/rules/tdd.md 참고\n\n비즈니스 로직, API 엔드포인트, 유틸리티 함수는 TDD 대상입니다."
}
EOF
fi

exit 0
