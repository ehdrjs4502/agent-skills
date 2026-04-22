---
title: useAnimatedReaction 대신 useDerivedValue 선호
impact: MEDIUM
impactDescription: 더 깔끔한 코드, 자동 의존성 추적
tags: animation, reanimated, derived-value
---

## useAnimatedReaction 대신 useDerivedValue 사용

다른 shared value에서 값을 도출할 때는 `useAnimatedReaction` 대신 `useDerivedValue`를 사용하세요.
Derived value는 선언적이고, 의존성을 자동으로 추적하며, 직접 사용할 수 있는 값을 반환합니다.
Animated reaction은 값을 도출하는 것이 아닌 사이드 이펙트를 위한 것입니다.

**잘못된 예시 (도출에 useAnimatedReaction 사용):**

```tsx
import { useSharedValue, useAnimatedReaction } from 'react-native-reanimated'

function MyComponent() {
  const progress = useSharedValue(0)
  const opacity = useSharedValue(1)

  useAnimatedReaction(
    () => progress.value,
    (current) => {
      opacity.value = 1 - current
    }
  )

  // ...
}
```

**올바른 예시 (useDerivedValue):**

```tsx
import { useSharedValue, useDerivedValue } from 'react-native-reanimated'

function MyComponent() {
  const progress = useSharedValue(0)

  const opacity = useDerivedValue(() => 1 - progress.get())

  // ...
}
```

`useAnimatedReaction`은 값을 생성하지 않는 사이드 이펙트에만 사용하세요
(예: 햅틱 피드백, 로깅, `runOnJS` 호출).

참고: [Reanimated useDerivedValue](https://docs.swmansion.com/react-native-reanimated/docs/core/useDerivedValue)
