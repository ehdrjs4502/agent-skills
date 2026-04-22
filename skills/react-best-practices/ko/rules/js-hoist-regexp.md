---
title: RegExp 생성 호이스팅
impact: LOW-MEDIUM
impactDescription: 재생성 방지
tags: javascript, regexp, optimization, memoization
---

## RegExp 생성 호이스팅

렌더 내부에서 RegExp를 생성하지 마세요. 모듈 범위로 호이스팅하거나 `useMemo()`로 메모이즈하세요.

**잘못된 예 (매 렌더링마다 새 RegExp):**

```tsx
function Highlighter({ text, query }: Props) {
  const regex = new RegExp(`(${query})`, 'gi')
  const parts = text.split(regex)
  return <>{parts.map((part, i) => ...)}</>
}
```

**올바른 예 (메모이즈 또는 호이스팅):**

```tsx
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Highlighter({ text, query }: Props) {
  const regex = useMemo(
    () => new RegExp(`(${escapeRegex(query)})`, 'gi'),
    [query]
  )
  const parts = text.split(regex)
  return <>{parts.map((part, i) => ...)}</>
}
```

**주의 (전역 regex는 가변 상태를 가짐):**

전역 regex(`/g`)는 가변 `lastIndex` 상태를 가집니다:

```typescript
const regex = /foo/g
regex.test('foo')  // true, lastIndex = 3
regex.test('foo')  // false, lastIndex = 0
```
