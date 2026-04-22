---
title: 함수에서 조기 반환
impact: LOW-MEDIUM
impactDescription: 불필요한 계산 방지
tags: javascript, functions, optimization, early-return
---

## 함수에서 조기 반환

결과가 확정되면 불필요한 처리를 건너뛰기 위해 조기에 반환하세요.

**잘못된 예 (답을 찾은 후에도 모든 항목 처리):**

```typescript
function validateUsers(users: User[]) {
  let hasError = false
  let errorMessage = ''
  
  for (const user of users) {
    if (!user.email) {
      hasError = true
      errorMessage = '이메일이 필요합니다'
    }
    if (!user.name) {
      hasError = true
      errorMessage = '이름이 필요합니다'
    }
    // 오류 발견 후에도 모든 사용자 계속 확인
  }
  
  return hasError ? { valid: false, error: errorMessage } : { valid: true }
}
```

**올바른 예 (첫 번째 오류에서 즉시 반환):**

```typescript
function validateUsers(users: User[]) {
  for (const user of users) {
    if (!user.email) {
      return { valid: false, error: '이메일이 필요합니다' }
    }
    if (!user.name) {
      return { valid: false, error: '이름이 필요합니다' }
    }
  }

  return { valid: true }
}
```
