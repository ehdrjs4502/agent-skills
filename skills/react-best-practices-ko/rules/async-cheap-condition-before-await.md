---
title: async 플래그 전에 저렴한 조건 먼저 확인
impact: HIGH
impactDescription: 동기 조건이 이미 실패했을 때 불필요한 비동기 작업 방지
tags: async, await, feature-flags, short-circuit, conditional
---

## async 플래그 전에 저렴한 조건 먼저 확인

분기에서 플래그나 원격 값을 `await`하면서 **저렴한 동기** 조건(로컬 props, 요청 메타데이터, 이미 로드된 상태)도 필요한 경우, 저렴한 조건을 **먼저** 평가하세요. 그렇지 않으면 복합 조건이 절대로 참이 될 수 없을 때도 비동기 호출 비용을 지불하게 됩니다.

이 규칙은 `flag && cheapCondition` 스타일 체크에 대한 [필요할 때까지 await 지연](./async-defer-await.md)의 특수화입니다.

**잘못된 예:**

```typescript
const someFlag = await getFlag()

if (someFlag && someCondition) {
  // ...
}
```

**올바른 예:**

```typescript
if (someCondition) {
  const someFlag = await getFlag()
  if (someFlag) {
    // ...
  }
}
```

`getFlag`가 네트워크, 피처 플래그 서비스, `React.cache` / DB 작업을 사용하는 경우에 중요합니다: `someCondition`이 거짓일 때 건너뛰면 콜드 패스에서 해당 비용이 제거됩니다.

`someCondition`이 비용이 크거나, 플래그에 의존하거나, 고정된 순서로 사이드 이펙트를 실행해야 하는 경우 원래 순서를 유지하세요.
