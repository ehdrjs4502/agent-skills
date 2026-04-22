---
title: 필요할 때까지 await 지연
impact: HIGH
impactDescription: 불필요한 코드 경로 차단 방지
tags: async, await, conditional, optimization
---

## 필요할 때까지 await 지연

실제로 사용되는 분기로 `await` 작업을 이동하여 필요하지 않은 코드 경로 차단을 방지하세요.

**잘못된 예 (두 분기 모두 차단):**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  const userData = await fetchUserData(userId)
  
  if (skipProcessing) {
    // 즉시 반환하지만 여전히 userData를 기다림
    return { skipped: true }
  }
  
  // 이 분기만 userData 사용
  return processUserData(userData)
}
```

**올바른 예 (필요할 때만 차단):**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  if (skipProcessing) {
    // 기다리지 않고 즉시 반환
    return { skipped: true }
  }
  
  // 필요할 때만 패치
  const userData = await fetchUserData(userId)
  return processUserData(userData)
}
```

**다른 예시 (조기 반환 최적화):**

```typescript
// 잘못된 예: 항상 permissions를 패치
async function updateResource(resourceId: string, userId: string) {
  const permissions = await fetchPermissions(userId)
  const resource = await getResource(resourceId)
  
  if (!resource) {
    return { error: 'Not found' }
  }
  
  if (!permissions.canEdit) {
    return { error: 'Forbidden' }
  }
  
  return await updateResourceData(resource, permissions)
}

// 올바른 예: 필요할 때만 패치
async function updateResource(resourceId: string, userId: string) {
  const resource = await getResource(resourceId)
  
  if (!resource) {
    return { error: 'Not found' }
  }
  
  const permissions = await fetchPermissions(userId)
  
  if (!permissions.canEdit) {
    return { error: 'Forbidden' }
  }
  
  return await updateResourceData(resource, permissions)
}
```

건너뛴 분기가 자주 실행되거나 지연된 작업이 비용이 클 때 이 최적화가 특히 유용합니다.

저렴한 동기 조건(`flag && someCondition`)과 결합된 `await getFlag()`의 경우 [async 플래그 전에 저렴한 조건 먼저 확인](./async-cheap-condition-before-await.md)을 참조하세요.
