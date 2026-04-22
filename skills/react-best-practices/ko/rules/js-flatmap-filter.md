---
title: 한 번의 순회로 map과 filter에 flatMap 사용
impact: LOW-MEDIUM
impactDescription: 중간 배열 제거
tags: javascript, arrays, flatMap, filter, performance
---

## 한 번의 순회로 map과 filter에 flatMap 사용

**영향도: LOW-MEDIUM (중간 배열 제거)**

`.map().filter(Boolean)` 체이닝은 중간 배열을 생성하고 두 번 반복합니다. `.flatMap()`을 사용하여 한 번의 순회로 변환과 필터링을 수행하세요.

**잘못된 예 (2번의 반복, 중간 배열):**

```typescript
const userNames = users
  .map(user => user.isActive ? user.name : null)
  .filter(Boolean)
```

**올바른 예 (1번의 반복, 중간 배열 없음):**

```typescript
const userNames = users.flatMap(user =>
  user.isActive ? [user.name] : []
)
```

**더 많은 예시:**

```typescript
// 응답에서 유효한 이메일 추출
// 이전
const emails = responses
  .map(r => r.success ? r.data.email : null)
  .filter(Boolean)

// 이후
const emails = responses.flatMap(r =>
  r.success ? [r.data.email] : []
)

// 유효한 숫자만 파싱 및 필터링
// 이전
const numbers = strings
  .map(s => parseInt(s, 10))
  .filter(n => !isNaN(n))

// 이후
const numbers = strings.flatMap(s => {
  const n = parseInt(s, 10)
  return isNaN(n) ? [] : [n]
})
```

**사용 시점:**
- 일부 항목을 필터링하면서 변환할 때
- 일부 입력이 출력을 생성하지 않는 조건부 매핑
- 유효하지 않은 입력을 건너뛰는 파싱/유효성 검사
