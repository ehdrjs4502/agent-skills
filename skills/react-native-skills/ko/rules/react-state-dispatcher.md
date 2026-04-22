---
title: 현재 값에 의존하는 상태에 Dispatch Updater 사용
impact: MEDIUM
impactDescription: stale closure 방지, 불필요한 리렌더 방지
tags: state, hooks, useState, callbacks
---

## 현재 값에 의존하는 상태에 Dispatch Updater 사용

다음 상태가 현재 상태에 의존할 때, 콜백에서 상태 변수를 직접 읽는 대신
dispatch updater(`setState(prev => ...)`)를 사용하세요.
이렇게 하면 stale closure를 방지하고 최신 값과 비교할 수 있습니다.

**잘못된 예시 (상태를 직접 읽음):**

```tsx
const [size, setSize] = useState<Size | undefined>(undefined)

const onLayout = (e: LayoutChangeEvent) => {
  const { width, height } = e.nativeEvent.layout
  // 이 closure에서 size가 stale할 수 있음
  if (size?.width !== width || size?.height !== height) {
    setSize({ width, height })
  }
}
```

**올바른 예시 (dispatch updater):**

```tsx
const [size, setSize] = useState<Size | undefined>(undefined)

const onLayout = (e: LayoutChangeEvent) => {
  const { width, height } = e.nativeEvent.layout
  setSize((prev) => {
    if (prev?.width === width && prev?.height === height) return prev
    return { width, height }
  })
}
```

updater에서 이전 값을 반환하면 리렌더를 건너뜁니다.

기본형 상태의 경우, 리렌더를 발생시키기 전에 값을 비교할 필요가 없습니다.

**올바른 예시 (기본형 상태는 직접 설정):**

```tsx
const [size, setSize] = useState<Size | undefined>(undefined)

const onLayout = (e: LayoutChangeEvent) => {
  const { width, height } = e.nativeEvent.layout
  setSize(width)
}
```

그러나 다음 상태가 현재 상태에 의존하는 경우에는 dispatch updater를 사용해야 합니다.

**잘못된 예시 (콜백에서 직접 상태 읽기):**

```tsx
const [count, setCount] = useState(0)

const onTap = () => {
  setCount(count + 1)
}
```

**올바른 예시 (dispatch updater):**

```tsx
const [count, setCount] = useState(0)

const onTap = () => {
  setCount((prev) => prev + 1)
}
```
