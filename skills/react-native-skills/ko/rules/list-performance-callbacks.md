---
title: 목록 루트에서 콜백 호이스팅
impact: MEDIUM
impactDescription: 리렌더 감소, 빠른 목록
tags: lists, performance, callbacks
---

## 목록 성능 콜백

목록 아이템에 콜백 함수를 전달할 때는 목록 루트에 콜백의 단일 인스턴스를 만드세요.
아이템은 고유 식별자로 콜백을 호출합니다.

**잘못된 예시 (매 렌더마다 새 콜백 생성):**

```typescript
return (
  <LegendList
    renderItem={({ item }) => {
      // 잘못됨: 매 렌더마다 새 콜백 생성
      const onPress = () => handlePress(item.id)
      return <Item key={item.id} item={item} onPress={onPress} />
    }}
  />
)
```

**올바른 예시 (각 아이템에 전달되는 단일 함수 인스턴스):**

```typescript
const onPress = useCallback(() => handlePress(item.id), [handlePress, item.id])

return (
  <LegendList
    renderItem={({ item }) => (
      <Item key={item.id} item={item} onPress={onPress} />
    )}
  />
)
```
