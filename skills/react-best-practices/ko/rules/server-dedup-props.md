---
title: RSC Props의 중복 직렬화 방지
impact: LOW
impactDescription: 중복 직렬화를 방지하여 네트워크 페이로드 감소
tags: server, rsc, serialization, props, client-components
---

## RSC Props의 중복 직렬화 방지

**영향도: LOW (중복 직렬화를 방지하여 네트워크 페이로드 감소)**

RSC→클라이언트 직렬화는 값이 아닌 객체 참조로 중복을 제거합니다. 동일한 참조 = 한 번 직렬화; 새 참조 = 다시 직렬화. `.toSorted()`, `.filter()`, `.map()` 등의 변환은 서버가 아닌 클라이언트에서 수행하세요.

**잘못된 예 (배열 중복):**

```tsx
// RSC: 6개의 문자열 전송 (2개 배열 × 3개 항목)
<ClientList usernames={usernames} usernamesOrdered={usernames.toSorted()} />
```

**올바른 예 (3개의 문자열 전송):**

```tsx
// RSC: 한 번 전송
<ClientList usernames={usernames} />

// 클라이언트: 변환 수행
'use client'
const sorted = useMemo(() => [...usernames].sort(), [usernames])
```

**중첩 중복 제거 동작:**

중복 제거는 재귀적으로 동작합니다. 영향은 데이터 타입에 따라 다릅니다:

- `string[]`, `number[]`, `boolean[]`: **영향 큼** - 배열 + 모든 원시형이 완전히 중복됨
- `object[]`: **영향 작음** - 배열은 중복되지만 중첩 객체는 참조로 중복 제거됨

```tsx
// string[] - 모든 것 중복
usernames={['a','b']} sorted={usernames.toSorted()} // 4개 문자열 전송

// object[] - 배열 구조만 중복
users={[{id:1},{id:2}]} sorted={users.toSorted()} // 2개 배열 + 2개 고유 객체 (4개 아님)
```

**중복 제거를 깨뜨리는 연산 (새 참조 생성):**

- 배열: `.toSorted()`, `.filter()`, `.map()`, `.slice()`, `[...arr]`
- 객체: `{...obj}`, `Object.assign()`, `structuredClone()`, `JSON.parse(JSON.stringify())`

**더 많은 예시:**

```tsx
// ❌ 나쁜 예
<C users={users} active={users.filter(u => u.active)} />
<C product={product} productName={product.name} />

// ✅ 좋은 예
<C users={users} />
<C product={product} />
// 클라이언트에서 필터링/구조 분해 수행
```

**예외:** 변환이 비용이 크거나 클라이언트가 원본 데이터가 필요 없을 때 파생 데이터를 전달하세요.
