---
title: 불변성을 위해 sort() 대신 toSorted() 사용
impact: MEDIUM-HIGH
impactDescription: React 상태의 변경 버그 방지
tags: javascript, arrays, immutability, react, state, mutation
---

## 불변성을 위해 sort() 대신 toSorted() 사용

`.sort()`는 배열을 제자리에서 변경하여 React 상태와 props에서 버그를 일으킬 수 있습니다. `.toSorted()`를 사용하여 변경 없이 새로 정렬된 배열을 생성하세요.

**잘못된 예 (원본 배열 변경):**

```typescript
function UserList({ users }: { users: User[] }) {
  // users prop 배열을 변경!
  const sorted = useMemo(
    () => users.sort((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}
```

**올바른 예 (새 배열 생성):**

```typescript
function UserList({ users }: { users: User[] }) {
  // 새로 정렬된 배열 생성, 원본 변경 없음
  const sorted = useMemo(
    () => users.toSorted((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}
```

**React에서 중요한 이유:**

1. Props/state 변경은 React의 불변성 모델을 깨뜨립니다 - React는 props와 state를 읽기 전용으로 취급하기를 기대합니다
2. 오래된 클로저 버그 발생 - 클로저(콜백, effects) 내에서 배열을 변경하면 예상치 못한 동작이 발생할 수 있습니다

**브라우저 지원 (구형 브라우저를 위한 폴백):**

`.toSorted()`는 모든 최신 브라우저에서 사용 가능합니다(Chrome 110+, Safari 16+, Firefox 115+, Node.js 20+). 구형 환경의 경우 스프레드 연산자를 사용하세요:

```typescript
// 구형 브라우저를 위한 폴백
const sorted = [...items].sort((a, b) => a.value - b.value)
```

**다른 불변 배열 메서드:**

- `.toSorted()` - 불변 정렬
- `.toReversed()` - 불변 역순
- `.toSpliced()` - 불변 splice
- `.with()` - 불변 요소 교체
