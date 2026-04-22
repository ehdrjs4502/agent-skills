---
title: 함수형 setState 업데이트 사용
impact: MEDIUM
impactDescription: 오래된 클로저 방지 및 불필요한 콜백 재생성 방지
tags: react, hooks, useState, useCallback, callbacks, closures
---

## 함수형 setState 업데이트 사용

현재 상태 값을 기반으로 상태를 업데이트할 때 상태 변수를 직접 참조하는 대신 setState의 함수형 업데이트 형태를 사용하세요. 이를 통해 오래된 클로저를 방지하고, 불필요한 의존성을 제거하며, 안정적인 콜백 참조를 만들 수 있습니다.

**잘못된 예 (상태를 의존성으로 필요):**

```tsx
function TodoList() {
  const [items, setItems] = useState(initialItems)
  
  // 콜백이 items에 의존해야 하며, 매 items 변경마다 재생성
  const addItems = useCallback((newItems: Item[]) => {
    setItems([...items, ...newItems])
  }, [items])  // ❌ items 의존성으로 재생성 발생
  
  // 의존성 누락 시 오래된 클로저 위험
  const removeItem = useCallback((id: string) => {
    setItems(items.filter(item => item.id !== id))
  }, [])  // ❌ items 의존성 누락 - 오래된 items 사용!
  
  return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />
}
```

**올바른 예 (안정적인 콜백, 오래된 클로저 없음):**

```tsx
function TodoList() {
  const [items, setItems] = useState(initialItems)
  
  // 안정적인 콜백, 재생성 안 됨
  const addItems = useCallback((newItems: Item[]) => {
    setItems(curr => [...curr, ...newItems])
  }, [])  // ✅ 의존성 불필요
  
  // 항상 최신 상태 사용, 오래된 클로저 위험 없음
  const removeItem = useCallback((id: string) => {
    setItems(curr => curr.filter(item => item.id !== id))
  }, [])  // ✅ 안전하고 안정적
  
  return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />
}
```

**장점:**

1. **안정적인 콜백 참조** - 상태 변경 시 콜백 재생성 불필요
2. **오래된 클로저 없음** - 항상 최신 상태 값으로 동작
3. **더 적은 의존성** - 의존성 배열 단순화 및 메모리 누수 감소
4. **버그 방지** - 가장 일반적인 React 클로저 버그 제거

**함수형 업데이트를 사용해야 할 때:**
- 현재 상태 값에 의존하는 모든 setState
- 상태가 필요한 useCallback/useMemo 내부
- 상태를 참조하는 이벤트 핸들러
- 상태를 업데이트하는 비동기 작업
