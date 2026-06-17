# 🔒 보안 정책 (Security Policy)

## 개요

이 프로젝트는 민감한 정보(API 키, 인증서, 개인키 등)을 보호하기 위해 Claude Code 권한 시스템에서 접근 제어를 설정했습니다.

## 보호 대상 파일

### 환경변수 파일
```
.env                  # 공유 환경변수 (git에 커밋하지 않음)
.env.local           # 로컬 개발 환경변수
.env.production      # 프로덕션 환경변수
.env.*.local         # 환경별 로컬 설정
```

### 인증서 및 개인키
```
*.pem                # PEM 형식 인증서/개인키
*.key                # 개인키 파일
*.p12                # PKCS#12 형식
*.pfx                # Windows 인증서
credentials*         # 크레덴셜 파일
```

### 클라우드 및 컨테이너 설정
```
.aws/**              # AWS 자격증명 및 설정
.kube/**             # Kubernetes 설정
.docker/config.json  # Docker 인증서
```

### 기타 민감 정보
```
secrets/**           # 시크릿 정보
.ssh/**              # SSH 키 및 설정
```

## 접근 제어 정책

| 작업 | 권한 | 사유 |
|------|------|------|
| 읽기 | ❌ 차단 | API 키 유출 방지 |
| 쓰기 | ❌ 차단 | 의도하지 않은 정보 기록 방지 |

## 환경변수 설정 방법

### 1. 로컬 개발 (`.env.local`)
```bash
# .env.local 생성
cp .env.example .env.local

# 파일 편집 (터미널에서)
nano .env.local
```

### 2. 환경변수 확인 (차단되지 않는 방법)
```bash
# 방법 1: Bash tool로 직접 확인
# (이미 .gitignore에 있으면 안전함)
cat .env.local

# 방법 2: 설정된 환경변수 확인
echo $ANTHROPIC_API_KEY
```

### 3. 비상 상황 (임시 예외)
권한 차단을 임시로 해제해야 하는 경우:
1. 프로젝트 관리자에게 문의
2. 이유와 기간 명시
3. 감사(audit) 기록 남기기

## .gitignore 설정

프로젝트의 `.gitignore`에 다음이 포함되어 있는지 확인:

```bash
# 환경변수
.env
.env.local
.env.*.local

# 인증서/키
*.pem
*.key
*.p12
*.pfx
credentials*

# 클라우드
.aws/
.kube/
.docker/config.json

# 기타
secrets/
.ssh/
```

## CI/CD 환경변수 관리

### GitHub Actions
```yaml
# .github/workflows/*.yml
env:
  ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  GOOGLE_API_KEY: ${{ secrets.GOOGLE_API_KEY }}
```

**설정 위치**: GitHub 저장소 → Settings → Secrets and variables → Actions

## 보안 체크리스트

배포 전 확인사항:

- [ ] `.env` 파일이 `.gitignore`에 포함됨
- [ ] Git history에 `.env` 커밋 없음
- [ ] 소스 코드에 하드코딩된 API 키 없음
- [ ] 커밋 메시지에 민감 정보 없음
- [ ] 로그 파일에 민감 정보 출력 안 함
- [ ] 프로덕션 빌드에서 .env 파일 제외됨

## 긴급: 민감정보 유출 대응

### 1단계: 즉시 조치
```bash
# 1. 커밋하지 않았으면 리셋
git reset --soft HEAD~1
git restore --staged .env

# 2. 이미 push했으면 기록 삭제
git filter-branch --tree-filter 'rm -f .env' HEAD
git push origin --force-with-lease
```

### 2단계: 보안 재설정
- API 키 재발급
- 인증서 갱신
- 액세스 토큰 리셋

### 3단계: 사건 보고
- 언제 유출되었는지 기록
- 어떤 정보가 유출되었는지 정리
- 팀에 알림

## 권한 차단 기술 상세

### Claude Code Permission System

프로젝트 레벨: `.claude/settings.json`
```json
{
  "permissions": {
    "blocklist": {
      "files": ["패턴"],
      "operations": ["read", "write"],
      "message": "차단 메시지"
    }
  }
}
```

글로벌 레벨: `~/.claude/settings.json`
- 모든 프로젝트에 적용
- 프로젝트 레벨이 글로벌 레벨 오버라이드

## 정책 업데이트

새로운 민감 파일 패턴 추가:

1. `.claude/settings.json` 수정
2. 이 문서 업데이트
3. 변경사항 커밋 및 공지

```bash
git add .claude/settings.json SECURITY.md
git commit -m "chore: 보안 정책 업데이트 - 새로운 파일 패턴 추가"
```

## FAQ

**Q: .env 파일을 Claude Code에서 봐야 하면?**
A: Bash tool을 사용해서 `cat .env` 명령어로 확인할 수 있습니다.

**Q: 왜 쓰기도 차단하나?**
A: 의도하지 않은 민감정보 기록을 방지합니다. 환경변수 설정은 .env.local 파일을 직접 편집하세요.

**Q: 차단을 해제하려면?**
A: 프로젝트 관리자에게 문의하고, `.claude/settings.json`의 blocklist를 수정합니다.

## 문의

보안 정책 관련 질문이나 이슈는:
1. 이 문서를 먼저 읽기
2. 프로젝트 관리자에게 문의
3. 필요시 SECURITY.md 파일 업데이트

---

**정책 버전**: 1.0
**마지막 업데이트**: 2026-06-17
**적용 범위**: react-component-generator 프로젝트
