---
title: 뷰 크기 측정
impact: MEDIUM
impactDescription: 동기 측정, 불필요한 리렌더 방지
tags: layout, measurement, onLayout, useLayoutEffect
---

## 뷰 크기 측정

`useLayoutEffect`(동기)와 `onLayout`(업데이트용)을 모두 사용하세요.
동기 측정은 초기 크기를 즉시 제공하고, `onLayout`은 뷰가 변경될 때 최신 상태를 유지합니다.
기본형이 아닌 상태는 값을 비교하고 불필요한 리렌더를 방지하기 위해 dispatch updater를 사용하세요.

**높이만 측정:**

```tsx
import { useLayoutEffect, useRef, useState } from 'react'
import { View, LayoutChangeEvent } from 'react-native'

function MeasuredBox({ children }: { children: React.ReactNode }) {
  const ref = useRef<View>(null)
  const [height, setHeight] = useState<number | undefined>(undefined)

  useLayoutEffect(() => {
    // 마운트 시 동기 측정 (RN 0.82+)
    const rect = ref.current?.getBoundingClientRect()
    if (rect) setHeight(rect.height)
    // 0.82 이전: ref.current?.measure((x, y, w, h) => setHeight(h))
  }, [])

  const onLayout = (e: LayoutChangeEvent) => {
    setHeight(e.nativeEvent.layout.height)
  }

  return (
    <View ref={ref} onLayout={onLayout}>
      {children}
    </View>
  )
}
```

**두 치수 모두 측정:**

```tsx
import { useLayoutEffect, useRef, useState } from 'react'
import { View, LayoutChangeEvent } from 'react-native'

type Size = { width: number; height: number }

function MeasuredBox({ children }: { children: React.ReactNode }) {
  const ref = useRef<View>(null)
  const [size, setSize] = useState<Size | undefined>(undefined)

  useLayoutEffect(() => {
    const rect = ref.current?.getBoundingClientRect()
    if (rect) setSize({ width: rect.width, height: rect.height })
  }, [])

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout
    setSize((prev) => {
      // 기본형이 아닌 상태는 리렌더 전에 값 비교
      if (prev?.width === width && prev?.height === height) return prev
      return { width, height }
    })
  }

  return (
    <View ref={ref} onLayout={onLayout}>
      {children}
    </View>
  )
}
```

콜백에서 상태를 직접 읽지 말고 함수형 setState를 사용해 비교하세요.
