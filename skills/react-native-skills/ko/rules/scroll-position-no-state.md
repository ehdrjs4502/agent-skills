---
title: 스크롤 위치를 useState에 저장 금지
impact: HIGH
impactDescription: 스크롤 중 렌더 스래싱 방지
tags: scroll, performance, reanimated, useRef
---

## 스크롤 위치를 useState에 저장 금지

스크롤 위치를 `useState`에 저장하지 마세요.
스크롤 이벤트는 빠르게 발생합니다. 상태 업데이트는 렌더 스래싱과 프레임 드롭을 유발합니다.
애니메이션에는 Reanimated shared value를, 비반응형 추적에는 ref를 사용하세요.

**잘못된 예시 (useState가 끊김 유발):**

```tsx
import { useState } from 'react'
import {
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native'

function Feed() {
  const [scrollY, setScrollY] = useState(0)

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollY(e.nativeEvent.contentOffset.y) // 매 프레임마다 리렌더
  }

  return <ScrollView onScroll={onScroll} scrollEventThrottle={16} />
}
```

**올바른 예시 (애니메이션에 Reanimated):**

```tsx
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated'

function Feed() {
  const scrollY = useSharedValue(0)

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y // UI 스레드에서 실행, 리렌더 없음
    },
  })

  return (
    <Animated.ScrollView
      onScroll={onScroll}
      scrollEventThrottle={16}
    />
  )
}
```

**올바른 예시 (비반응형 추적에 ref):**

```tsx
import { useRef } from 'react'
import {
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native'

function Feed() {
  const scrollY = useRef(0)

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.current = e.nativeEvent.contentOffset.y // 리렌더 없음
  }

  return <ScrollView onScroll={onScroll} scrollEventThrottle={16} />
}
```
