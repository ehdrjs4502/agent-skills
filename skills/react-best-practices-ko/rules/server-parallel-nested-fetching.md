---
title: 병렬 중첩 데이터 패칭
impact: CRITICAL
impactDescription: 서버 사이드 워터폴 제거
tags: server, rsc, parallel-fetching, promise-chaining
---

## 병렬 중첩 데이터 패칭

중첩 데이터를 병렬로 패칭할 때, 느린 항목 하나가 나머지를 차단하지 않도록 각 항목의 프로미스 내에서 의존 패칭을 체이닝하세요.

**잘못된 예 (단 하나의 느린 항목이 모든 중첩 패칭을 차단):**

```tsx
const chats = await Promise.all(
  chatIds.map(id => getChat(id))
)

const chatAuthors = await Promise.all(
  chats.map(chat => getUser(chat.author))
)
```

100개 중 하나의 `getChat(id)`가 매우 느리면, 다른 99개 채팅의 작성자는 데이터가 준비됐음에도 로딩을 시작할 수 없습니다.

**올바른 예 (각 항목이 자체 중첩 패칭을 체이닝):**

```tsx
const chatAuthors = await Promise.all(
  chatIds.map(id => getChat(id).then(chat => getUser(chat.author)))
)
```

각 항목이 독립적으로 `getChat` → `getUser`를 체이닝하므로, 느린 채팅 하나가 다른 채팅들의 작성자 패칭을 차단하지 않습니다.
