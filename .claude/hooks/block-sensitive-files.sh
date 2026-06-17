#!/bin/bash
# 민감 파일 접근 차단 훅
# PreToolUse에서 Read/Write 시도를 검사하고 차단

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name')
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path' | tr -d '\r')

# Read/Write가 아니면 통과
if [[ ! "$TOOL_NAME" =~ ^(Read|Write)$ ]]; then
  exit 0
fi

# 파일 경로가 없으면 통과
if [[ -z "$FILE" ]]; then
  exit 0
fi

# 민감 파일 패턴 검사
SENSITIVE_PATTERNS=(
  "^\.env"                    # .env, .env.local, .env.production 등
  "^credentials"              # credentials 파일
  "\.pem$"                     # PEM 인증서/키
  "\.key$"                     # 개인키
  "\.p12$"                     # PKCS#12 인증서
  "\.pfx$"                     # PFX 인증서
  "^\.aws/"                    # AWS 설정
  "^\.kube/"                   # Kubernetes 설정
  "^secrets/"                  # secrets 디렉토리
  "^\.ssh/"                    # SSH 키
  "^\.docker/config\.json$"    # Docker 설정
)

IS_SENSITIVE=false

for pattern in "${SENSITIVE_PATTERNS[@]}"; do
  if [[ "$FILE" =~ $pattern ]]; then
    IS_SENSITIVE=true
    break
  fi
done

# 민감 파일이면 차단
if [[ "$IS_SENSITIVE" == true ]]; then
  cat <<EOF
{
  "continue": false,
  "stopReason": "🔒 민감 파일 접근 거부\n\n파일: \`$FILE\`\n\n이 파일은 API 키, 비밀번호, 개인키 등 민감 정보를 포함하고 있어 접근이 차단되었습니다.\n\n필요한 경우 다음을 참고하세요:\n- 정책: .claude/SECURITY.md\n- 접근 해제: 프로젝트 관리자에게 문의",
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "민감 파일 보호 정책 - 환경변수, 인증서, 개인키 등 접근 차단"
  }
}
EOF
fi

exit 0
